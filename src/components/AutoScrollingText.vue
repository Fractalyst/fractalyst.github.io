<script setup lang="ts">
import { sleep } from "@/scripts/utilities";
import { ref, onMounted, onUnmounted, computed } from "vue";

import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
import csharp from "highlight.js/lib/languages/csharp";
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("csharp", csharp);

//const urls = [
//    'https://github.com/CoroNaut/space_engineers/blob/main/IngameScripts/local/Java_AutoAscent/script.cs',
//    'https://github.com/CoroNaut/space_engineers/blob/main/IngameScripts/local/Java_Power_Display/script.cs'
//];

const tempText = `﻿/*
        Created by JavaSkeptre
        To use a group of thrusters to ascend past the gravity well.
        Your arguments should have the following format:
        Ex) "A1H2I3" for atmospheric first, hydrogen second, and ion third
        Ex) "A2H3I1" for ion first, atmospheric second, hydrogen third
        Ex) "A0H0I3" for not using atmospheric or hydrogen, and only using ions
        Ex) "Stop" to halt the current ascent
        Furthermore, chance the below "updateTime" variable to 1,10,or 100,
            any other number will result in updateTime=10
        */

private const int updateTime = 1;

// DO NOT EDIT BELOW THIS LINE

private static long calls = 0;
private static readonly int version = 8;
private static IMyShipController control;
private bool init = false, stopped = true;
private static string initialArgs;

private static readonly int[] largeThrustVals = { 5400000, 420000, 6000000, 900000, 3600000, 288000 };
private static readonly int[] smallThrustVals = { 408000, 80000, 400000, 82000, 144000, 12000 };
private static readonly double[] largePowerReqVals = { 16.360000, 2.360000, 0.0, 0.0, 33.600000, 3.360000 };
private static readonly double[] smallPowerReqVals = { 2.400000, 0.701000, 0.0, 0.0, 2.400000, 0.201000 };
private static readonly string[] descriptors = { "Large Atmospheric", "Atmospheric", "Large Hydrogen", "Hydrogen", "Large Ion", "Ion" };

private int blockNum;
private readonly int hydroCapacity;
private readonly int hydroGeneration;
private readonly bool gridSize;
private readonly int[] setThrustVals;
private readonly double[] setPowerReqVals;
private static List<int> ahiPriorities = new List<int>();
private static List<IMyThrust>[] tList = new List<IMyThrust>[6];
private static List<IMyReactor> reactors = new List<IMyReactor>();
private static IMyGyro gyro;

//private static readonly string regexForCorrectAgument = "(?:A([1-3]{1}))(?:H(()[1-3]{1}))(?:I()[1-3]{1})";
public Program() {
    Runtime.UpdateFrequency=UpdateFrequency.None;
    gridSize=Me.CubeGrid.GridSizeEnum.ToString()=="Large" ? true : false;
    hydroCapacity=gridSize ? 2500000 : 80000;
    hydroGeneration=gridSize ? 1670 : 830;
    setThrustVals=gridSize ? largeThrustVals : smallThrustVals;
    setPowerReqVals=gridSize ? largePowerReqVals : smallPowerReqVals;
    Init();
}
private void Init() {
    List<IMyShipController> controllers = new List<IMyShipController>();
    GridTerminalSystem.GetBlocksOfType<IMyShipController>(controllers);
    List<IMyGyro> gyroscopes = new List<IMyGyro>();
    GridTerminalSystem.GetBlocksOfType<IMyGyro>(gyroscopes);
    try {
        control=controllers[0];
        gyro=gyroscopes[0];
    } catch(NullReferenceException) {
        Echo($"No ship controller has not been found");
        return;
    }
    List<IMyThrust> thrusters = new List<IMyThrust>();
    GridTerminalSystem.GetBlocksOfType<IMyThrust>(thrusters);
    if(thrusters.Count==0) {
        Echo($"There are no down thrusters\nAdd thrusters to the group\nStopping script before running");
        return;
    }
    for(int x = 0; x<thrusters.Count; x++) {
        if(thrusters[x].Orientation.ToString().IndexOf("Down")!=9) {
            thrusters.Remove(thrusters[x--]);
        }
    }
    for(int x = 0; x<tList.Length; x++) {
        tList[x]=new List<IMyThrust>();
    }
    foreach(IMyThrust thruster in thrusters) {
        for(int x = 0; x<tList.Length; x++) {
            if(thruster.DetailedInfo.IndexOf(descriptors[x]+" Thruster"+(x%2==0 ? "" : "s"))!=-1) {
                tList[x].Add(thruster);
                break;
            }
        }
    }
    GridTerminalSystem.GetBlocksOfType<IMyReactor>(reactors);
    List<IMyFunctionalBlock> blocks = new List<IMyFunctionalBlock>();
    GridTerminalSystem.GetBlocksOfType<IMyFunctionalBlock>(blocks);
    blockNum=blocks.Count;
    init=true;
}
private void TerminateAscent() {
    for(int x = 0; x<tList.Length; x++) {
        foreach(IMyThrust t in tList[x]) {
            t.ThrustOverridePercentage=0f;
        }
    }
    initialArgs=null;
    stopped=true;
    control.DampenersOverride=true;
    Runtime.UpdateFrequency=UpdateFrequency.Once;
}
private bool Run_VerifyStart(string argument) {
    if((stopped&&argument.Equals(""))||argument.Equals("Stop")) {
        Echo("Auto Ascent is stopped");
        if(!stopped) {
            TerminateAscent();
        }
        return false;
    }
    if(initialArgs==null||(!argument.Equals("")&&!initialArgs.Equals(argument))) {
        char[] args = argument.ToCharArray();
        if(args.Length==6&&args[0]=='A'&&args[2]=='H'&&args[4]=='I') {
            try {
                ahiPriorities.Clear();
                ahiPriorities.Add(int.Parse(args[1].ToString()));
                ahiPriorities.Add(int.Parse(args[3].ToString()));
                ahiPriorities.Add(int.Parse(args[5].ToString()));
            } catch {
                Echo("Program arguments' priorities aren't numbers.\nStopping script before running");
                return false;
            }
            if(ahiPriorities[0]==ahiPriorities[1]||ahiPriorities[0]==ahiPriorities[2]||ahiPriorities[1]==ahiPriorities[2]) {
                Echo("Program arguments cannot have similar priorities.\nStopping script before running");
                return false;
            }
            for(int i = 0; i<=2; i++) {
                if(ahiPriorities[i]>3||ahiPriorities[i]<0) {
                    Echo("Program arguments' priorities aren't within [0,1,2,3].\nStopping script before running");
                    return false;
                }
            }
        } else {
            Echo("Program arguments aren't correct.\nStopping script before running");
            return false;
        }
        initialArgs=argument;
    }
    if(control.GetNaturalGravity().Equals(new Vector3(0, 0, 0))) {
        Echo("No gravity to escape\nResetting overrides\nStopping script before running");
        TerminateAscent();
        return false;
    }
    return true;
}
public void Main(string argument, UpdateType updateSource) {
    DateTime dt = DateTime.Now;
    Echo($"Calls since compile: {calls++}\nVersion: {version} Update:{updateSource.ToString()}{(initialArgs!=null ? ($"\nRunning: {initialArgs}") : "")}\n");
    List<IMyFunctionalBlock> blocks = new List<IMyFunctionalBlock>();
    GridTerminalSystem.GetBlocksOfType<IMyFunctionalBlock>(blocks);
    if(!init||control==null||tList==null||reactors==null||gyro==null||blocks.Count!=blockNum) {
        Init();
    }
    Run(argument);
    Echo($"\nRuntime: {(DateTime.Now-dt).TotalMilliseconds.ToString("0.000000")} ms");
    Echo($"Current Load: {(Runtime.CurrentInstructionCount/Runtime.MaxInstructionCount*100.0f).ToString("0.00")} %");
    Echo($"Instructions: {Runtime.CurrentInstructionCount.ToString()}");
    Echo("Successful Completion");
}
private void Run(string argument) {
    if(!Run_VerifyStart(argument)) {
        return;
    }
    stopped=false;
    Runtime.UpdateFrequency=updateTime==1 ? UpdateFrequency.Update1 : updateTime==100 ? UpdateFrequency.Update100 : UpdateFrequency.Update10;
    control.DampenersOverride=false;
    double currentAltitude = 0;
    control.TryGetPlanetElevation(Sandbox.ModAPI.Ingame.MyPlanetElevation.Sealevel, out currentAltitude);
    double atmosAltMultiplier = Math.Max(0d, 1-(currentAltitude/10000));
    double ionAltMultiplier = Math.Min(1d, Math.Max(.3d, currentAltitude/20000d*.7d));
    double[] tAmt = new double[6];
    tAmt[0]=setThrustVals[0]*atmosAltMultiplier;
    tAmt[1]=setThrustVals[1]*atmosAltMultiplier;
    tAmt[2]=setThrustVals[2];
    tAmt[3]=setThrustVals[3];
    tAmt[4]=setThrustVals[4]*ionAltMultiplier;
    tAmt[5]=setThrustVals[5]*ionAltMultiplier;
    double maxThrust = 0;
    for(int x = 0; x<=5; x++) {
        maxThrust+=tAmt[x]*tList[x].Count;
    }
    double grav = control.GetNaturalGravity().Length();
    double totalMass = control.CalculateShipMass().TotalMass;
    double maxAccel = (maxThrust/totalMass)-grav;
    double minimumThrust = (grav*totalMass)+0.01d;
    if(maxAccel<=0.01d) {
        Echo($"{maxThrust.ToString("0.00")}/{minimumThrust.ToString("0.00")} thrust required\n");
        Echo("Ship does not have enough thrust to lift off\nStopping script before running");
        return;
    } else if(maxAccel<.2d) {
        Echo("Excercise caution!\nShip has a small max acceleration!");
    }
    double currentSpeed = control.GetShipSpeed();
    Echo($"Speed: {currentSpeed.ToString("0.00")}");
    Echo($"Altitude: {currentAltitude.ToString("0.00")}\n");
    double wantedThrust = minimumThrust*Math.Pow(.9997d+((100d-currentSpeed)/200d), 3);
    double reactorCurrent = 0;//MW
    double reactorMax = 0;//MW
    if(reactors.Count>0) {
        foreach(IMyReactor reactor in reactors) {
            if(reactor.IsFunctional==true) {
                reactorCurrent+=reactor.CurrentOutput;
                reactorMax+=reactor.MaxOutput;
            }
        }
    }
    for(int x = 0; x<tList.Length; x++) {
        if(tList[x].Count>0) {
            reactorCurrent-=setPowerReqVals[x]*tList[x].Count*tList[x][0].ThrustOverridePercentage;
        }
    }
    double powerUseAllowed = (reactorMax-reactorCurrent)-0.100d;//leave 100kW extra
    for(int x = 0; x<=2; x++) {
        if(ahiPriorities[x]!=0) {
            for(int c = 0; c<=1; c++) {
                int offset = (ahiPriorities.IndexOf(x+1)*2)+c;
                if(tList[offset].Count>0) {
                    if(tAmt[offset]*tList[offset].Count>0) {
                        if(powerUseAllowed==0.0d&&setPowerReqVals[offset]>0.0d) {
                            break;
                        }
                        double overrideRatio = Math.Min(wantedThrust/(tAmt[offset]*tList[offset].Count), 1);
                        double powerUse = overrideRatio*tList[offset].Count*setPowerReqVals[offset];
                        if(powerUse>powerUseAllowed&&powerUse!=0.0) {
                            double rat = powerUseAllowed/powerUse;
                            overrideRatio*=rat;
                            powerUseAllowed=0.0d;
                            Echo("Causing Low power problem:");
                        } else {
                            powerUseAllowed-=powerUse;
                        }
                        Echo(descriptors[offset]+$": {(overrideRatio*100).ToString("0.00")}%");
                        wantedThrust-=tList[offset].Count*overrideRatio*tAmt[offset];
                        foreach(IMyThrust t in tList[offset]) {
                            t.ThrustOverridePercentage=(float)overrideRatio;
                        }
                    } else {
                        double cur = tList[offset][0].ThrustOverride;
                        if(cur>0) {
                            foreach(IMyThrust t in tList[offset]) {
                                t.ThrustOverridePercentage=0.0f;
                            }
                        }
                    }
                }
            }
        }
    }
}`;

const tempText2 = `/*
 *   R e a d m e
 *   -----------
 * 
 *   In this file you can include any instructions or other comments you want to have injected onto the 
 *   top of your final script. You can safely delete this file if you do not want any such comments.
 * 
 */

/*
        Created by JavaSkeptre
        To monitor all solar panels, batteries and reactors power and power usage.
        Edit Variables inside next brackets
        */

//Start to change variables

private string displayNameForLCD = "LCD Java_Power";

//Stop Changing variables

private static long calls = 0;
private static int version = 11;
private IMyShipController control;
private bool init = false;
private static string initialArgs;

private int blockNum;
private IMyTextPanel display;
private List<IMyTerminalBlock>[] blockData;
private readonly bool gridSize;

public Program() {
    Runtime.UpdateFrequency=UpdateFrequency.Update100;
    gridSize=Me.CubeGrid.GridSizeEnum.ToString()=="Large";
    Init();
}
private void Init() {
    initialArgs="Checking";
    List<IMyShipController> controllers = new List<IMyShipController> { };
    GridTerminalSystem.GetBlocksOfType<IMyShipController>(controllers);
    try {
        control=controllers[0];
    } catch {
        Echo($"No ship controller has not been found");
        return;
    }
    try {
        display=(IMyTextPanel)GridTerminalSystem.GetBlockWithName(displayNameForLCD);
    } catch {
        Echo($"LCD Panel with name: {displayNameForLCD}\nhas not been found");
        return;
    }
    if(display.Enabled==false) {
        Echo($"LCD Panel with name: {displayNameForLCD}\nis turned off");
        return;
    }
    blockData=new List<IMyTerminalBlock>[5];
    for(int x = 0; x<blockData.Length; x++) {
        blockData[x]=new List<IMyTerminalBlock>();
    }
    GridTerminalSystem.GetBlocksOfType<IMySolarPanel>(blockData[0]);//Solar panels
    GridTerminalSystem.GetBlocksOfType<IMyBatteryBlock>(blockData[1]);//Batteries
    GridTerminalSystem.GetBlocksOfType<IMyReactor>(blockData[2]);//Reactors
    GridTerminalSystem.GetBlocksOfType<IMyGasTank>(blockData[3]);//Tanks
    GridTerminalSystem.GetBlocksOfType<IMyJumpDrive>(blockData[4]);//JumpDrives
    List<IMyFunctionalBlock> blocks = new List<IMyFunctionalBlock>();
    GridTerminalSystem.GetBlocksOfType<IMyFunctionalBlock>(blocks);
    blockNum=blocks.Count;
    this.init=true;
    initialArgs="Running";
}
private void Main(string argument, UpdateType updateSource) {
    DateTime dt = DateTime.Now;
    Echo($"Calls since compile: {calls++}\nVersion: {version} Update:{updateSource.ToString()}{(initialArgs!=null ? ($"\nRunning: {initialArgs}") : "")}\n");
    List<IMyFunctionalBlock> blocks = new List<IMyFunctionalBlock>();
    GridTerminalSystem.GetBlocksOfType<IMyFunctionalBlock>(blocks);
    if(!init||display==null||control==null||blockData==null||blocks.Count!=blockNum) {
        Init();
    }
    Run(argument);
    Echo($"\nRuntime: {(DateTime.Now-dt).TotalMilliseconds.ToString("0.000000")} ms");
    Echo($"Current Load: {(Runtime.CurrentInstructionCount/Runtime.MaxInstructionCount*100.0f).ToString("0.00")} %");
    Echo($"Instructions: {Runtime.CurrentInstructionCount.ToString()}");
    Echo("Successful Completion");
}
private string Run_Solar() {
    if(blockData[0].Count==0) {
        return "";
    }
    int solarFunctional = 0;
    double solarCurrent = 0;//MW
    double solarMax = 0;//MW
    double solarTotal = gridSize ? blockData[0].Count*120/1000d : blockData[0].Count*30/1000;
    foreach(IMySolarPanel solar in blockData[0]) {
        if(solar.IsFunctional==true) {
            solarCurrent+=solar.CurrentOutput;
            solarMax+=solar.MaxOutput;
            solarFunctional++;
        }
    }
    //string ret = ThreeBar(solarCurrent, solarMax, solarTotal);
    string ret2 = ThreeBar(new Vector3D(solarCurrent, solarMax, solarTotal));
    return (blockData[0].Count==solarFunctional ? $"({solarFunctional}" : $"({solarFunctional}/{blockData[0].Count}")+$") Solar: {FormatNum(solarCurrent)}/ {FormatNum(solarMax)}/ {FormatNum(solarTotal)}\n{ret2}\n\n";
}
private string Run_Battery() {
    if(blockData[1].Count==0) {
        return "";
    }
    int batteryFunctional = 0;
    double batteryStoredMax = 0;//MWH
    double batteryStoredCur = 0;//MWH
    double batteryOutput = 0;//MW
    double batteryInput = 0;//MW
    foreach(IMyBatteryBlock battery in blockData[1]) {
        if(battery.IsFunctional==true) {
            batteryStoredMax+=battery.MaxStoredPower;
            batteryStoredCur+=battery.CurrentStoredPower;
            batteryOutput+=battery.CurrentOutput;
            batteryInput+=battery.CurrentInput;
            batteryFunctional++;
        }
    }
    return (blockData[1].Count==batteryFunctional ? $"({batteryFunctional}" : $"({batteryFunctional}/{blockData[1].Count}")+$") Battery: {FormatNum(batteryStoredCur)}h / {FormatNum(batteryStoredMax)}h\nIN: {FormatNum(batteryInput)} OUT: {FormatNum(batteryOutput)}\n{BarBuilder(batteryStoredCur/batteryStoredMax)}\n\n";
}
private string Run_Reactor() {
    if(blockData[2].Count==0) {
        return "";
    }
    int reactorFunctional = 0;
    double reactorCurrent = 0;//MW
    double reactorMax = 0;//MW
    double uraniumTotal = 0;
    foreach(IMyReactor reactor in blockData[2]) {
        if(reactor.IsFunctional==true) {
            var reactorItem = reactor.GetInventory(0).GetItemAt(0);
            if(reactorItem!=null){
                reactorCurrent+=reactor.CurrentOutput;
                reactorMax+=reactor.MaxOutput;
                uraniumTotal+=(double)(((MyInventoryItem)reactorItem).Amount.ToIntSafe());
                reactorFunctional++;
            }
        }
    }
    TimeSpan powerTime = new TimeSpan(0, 0, (int)((reactorCurrent==0d ? 0d : 1d/reactorCurrent)*3600d*uraniumTotal));
    return (blockData[2].Count==reactorFunctional ? "("+reactorFunctional : "("+reactorFunctional+"/"+blockData[2].Count)+$") Reactor Uranium: {uraniumTotal.ToString("0.00000")}\nOutput: {FormatNum(reactorCurrent)}/{FormatNum(reactorMax)}\n{BarBuilder(reactorCurrent/reactorMax)}\nPower Time: {(powerTime.Equals(new TimeSpan(0, 0, 0)) ? "---" : powerTime.ToString())}\n\n";
}
private string Run_GasFillLevel() {
    if(blockData[3].Count==0) {
        return "";
    }
    double hydrogenCurrent = 0;
    int hydroContainers = 0;
    double oxygenCurrent = 0;
    int oxygenContainers = 0;
    if(blockData[3].Count>0) {
        foreach(IMyGasTank tank in blockData[3]) {
            string[] info = tank.DetailedInfo.Split(':');
            if(tank.DetailedInfo.IndexOf("Oxygen")==-1) {
                hydrogenCurrent+=double.Parse(info[3].Substring(0, info[3].IndexOf("%")));
                hydroContainers++;
            } else {
                oxygenCurrent+=double.Parse(info[3].Substring(0, info[3].IndexOf("%")));
                oxygenContainers++;
            }
        }
    }
    return (oxygenContainers==0 ? "" : $"({oxygenContainers}) Oxygen: {(oxygenCurrent/oxygenContainers).ToString("0.00")}%\n")+(hydroContainers==0 ? "" : $"({hydroContainers}) Hydrogen: {(hydrogenCurrent/hydroContainers).ToString("0.00")}%\n");
}
private string Run_JumpCalc() {
    if(blockData[4].Count==0) {
        return "";
    }
    double maxJumpCharge = 0;
    if(blockData[4].Count>0) {
        foreach(IMyJumpDrive drive in blockData[4]) {
            if(drive.CurrentStoredPower>maxJumpCharge) {
                maxJumpCharge+=drive.CurrentStoredPower;
            }
        }
        maxJumpCharge=maxJumpCharge/3*100;
    }
    return $"({blockData[4].Count}) Jump: {maxJumpCharge.ToString("0.00")}%, ";
}
private string Run_Gravity() {
    Vector3 gravity = control.GetNaturalGravity();
    return gravity.Equals(new Vector3(0, 0, 0)) ? "\n" : $"Gravity: {gravity.Length().ToString("0.00")}m/s\n";
}
private string Run_MassCalc() {
    double totalMass = control.CalculateShipMass().TotalMass;
    double baseMass = control.CalculateShipMass().BaseMass;
    double cargoMass = totalMass-baseMass;
    return baseMass!=0 ? $"Ship Mass: {baseMass} kg\nCargo Mass: {cargoMass} kg\nTotal Mass: {totalMass}kg\n" : "Ship is station\n";
}
private void Run(string argument) {
    string retVal = "";
    retVal+=Run_JumpCalc();
    retVal+=Run_Gravity();
    retVal+=Run_Solar();
    retVal+=Run_Battery();
    retVal+=Run_Reactor();
    retVal+=Run_GasFillLevel();
    retVal+=Run_MassCalc();

    Me.CustomData=retVal;
    display.WriteText(retVal);
}
public string ThreeBar(double one, double two, double three) {
    StringBuilder threeBarString = new StringBuilder();
    threeBarString.Append("[");
    int i;
    for(i=0; i<(one/two*(two/three)*100/2); i++) {
        threeBarString.Append("|");
    }
    if(one!=two) {
        threeBarString.Append("|");
    }
    int j;
    for(j=i; j<(two/three*100/2); j++) {
        threeBarString.Append("");
    }
    threeBarString.Append("|");
    for(int k = j; k<50; k++) {
        threeBarString.Append("");
    }
    threeBarString.Append("]");
    if(one==0||two==0) {
        threeBarString.Append(" 0 %");
    } else {
        threeBarString.Append($" {(one/two).ToString("0.00"+" %")}");
    }
    string output = threeBarString.ToString();
    threeBarString.Clear();
    return output;
}
public static string ThreeBar(Vector3D vec) {
    vec.Normalize();
    StringBuilder threeBarString = new StringBuilder();
    threeBarString.Append("[");
    int i;
    double v = vec.X/vec.Y;
    double v1 = vec.Y/vec.Z;
    for(i=0; i<v*v1*49; i++) {
        threeBarString.Append("|");
    }
    int j;
    for(j=i; j<v1*49; j++) {
        threeBarString.Append("");
    }
    //if(vec.X!=vec.Y&&vec.X!=0.0) {
    //    threeBarString.Append("|");
    //} else {
    //    threeBarString.Append(".");
    //}
    int k;
    for(k=j; k<49; k++) {
        threeBarString.Append("");
    }
    threeBarString.Append("]");
    threeBarString.AppendFormat(" {0,8:P2}", ((vec.X)/(vec.Y==0 ? 1 : vec.Y)));
    return threeBarString.ToString();
}
public string BarBuilder(double num) {
    StringBuilder barString = new StringBuilder();
    barString.Append("[");
    int i;
    double p = num*100;
    for(i=0; i<(p/2); i++) {
        barString.Append("|");
    }
    int l = 50-i;
    while(l>0) {
        barString.Append("");
        l--;
    }
    barString.Append($"] {(p/100).ToString("0.00"+" %")}");
    string barOutput = barString.ToString();
    barString.Clear();
    return barOutput;
}
public string FormatNum(double number) {
    string ordinals = " kMGTPEZY";
    double compressed = number*1000000d;
    int start = ordinals.IndexOf(' ');
    int ordinal = (start<0 ? 0 : start);
    while(compressed>=1000&&ordinal+1<ordinals.Length) {
        compressed/=1000;
        ordinal++;
    }
    string res = Math.Round(compressed, 1, MidpointRounding.AwayFromZero).ToString();
    if(ordinal>0) {
        return $"{res} {ordinals[ordinal]}W";
    }
    return $"{res}W";
}`;

let curText = 0;

const scrollText = ref<string>(tempText);
const scrollTextHighlighted = computed(() => {
  return hljs.highlight(scrollText.value, { language: "csharp" }).value;
});
const containerRef = ref<HTMLDivElement | null>(null);

async function fetchNewCodeBlock() {
  try {
    repeatAutoScrollingLoop();
    scrollText.value = "";
    if (containerRef.value) {
      containerRef.value.scrollTop = 0;
    }
    if (curText == 0) {
      scrollText.value = tempText;
      curText++;
    } else {
      scrollText.value = tempText2;
      curText = 0;
    }

    //const response = await fetch(urls[0]!);
    //const blob = await response.blob();
    //const text = await blob.text();
    //console.log(text)
    //scrollText.value = text;
  } catch (error) {
    console.error("Error fetching code:", error);
  }
}

// Setup auto-scrolling
const scrollInterval = ref<number>();
//const fetchInterval = ref<number>(window.setInterval(fetchNewCodeBlock, 120000))
const scrollSpeed = 8; //pixels

async function repeatAutoScrollingLoop() {
  clearInterval(scrollInterval.value);
  await sleep(1000);
  if (
    !containerRef.value ||
    containerRef.value.scrollTop >=
      containerRef.value.scrollHeight - containerRef.value.clientHeight
  ) {
    return;
  }
  scrollInterval.value = window.setInterval(async () => {
    if (!containerRef.value) return;
    if (
      containerRef.value.scrollTop >=
      containerRef.value.scrollHeight - containerRef.value.clientHeight
    ) {
      fetchNewCodeBlock();
    } else {
      containerRef.value.scrollTop += scrollSpeed;
    }
  }, 64);
}

onMounted(() => {
  fetchNewCodeBlock();
});

onUnmounted(() => {
  if (scrollInterval.value) {
    clearInterval(scrollInterval.value);
    //clearInterval(fetchInterval.value)
  }
});
</script>

<template>
  <div class="scroll-text" ref="containerRef">
    <pre v-html="scrollTextHighlighted"></pre>
  </div>
</template>

<style scoped>
.scroll-text {
  flex: 1;
  border-top: 2px solid green;
  border-bottom: 2px solid green;
  border-radius: 16px;
  padding: 0 16px;
  overflow: hidden;
  scroll-behavior: smooth;
  font-family: monospace;
  user-select: none;
}

@media (prefers-color-scheme: dark) {
  .scrolling-text-box {
    border-color: var(--vt-c-white-soft);
  }
}
</style>
