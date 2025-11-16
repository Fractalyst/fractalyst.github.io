<script setup lang="ts">
import IconSpeedySnake from "@/components/icons/IconSpeedySnake.vue";
import { onMounted, onUnmounted, ref, watch, type Ref } from "vue";
import { usePreferredColorScheme } from "@vueuse/core";
import { getAllCookies, setCookie } from "@/scripts/utilities";

const preferredColor = usePreferredColorScheme();

const gameSizePixels = 500;

const gameCanvases = {
  'gameView': document.createElement('canvas'),
  'grid': document.createElement('canvas'),
  'apple': document.createElement('canvas'),
  'snake': document.createElement('canvas')
}

for (const canvas of Object.values(gameCanvases)) {
  canvas.width = gameSizePixels;
  canvas.height = gameSizePixels;
}

const gridSize = ref(6);

function createEmptyGrid(size: number): boolean[][] {
  return Array.from({ length: size }, () => new Array(size).fill(false))
}

let gridCellsOccupied: boolean[][] = createEmptyGrid(gridSize.value)

const timerStartTime = ref(0.0);
const timerString = ref("")
let timerIntervalId = 0;

const directions: Coordinates[] = [
  { x: 0, y: -1 }, // up
  { x: 1, y: 0 },  // right
  { x: 0, y: 1 },  // down
  { x: -1, y: 0 }  // left
];

function formatMiliseconds(zeroString: boolean = false) {
  if (zeroString) {
    return "00:00:00:000"
  }
  let totalMilliseconds = Date.now() - timerStartTime.value;

  const hours = Math.floor(totalMilliseconds / 3600000);
  totalMilliseconds %= 3600000;

  const minutes = Math.floor(totalMilliseconds / 60000);
  totalMilliseconds %= 60000;

  const seconds = Math.floor(totalMilliseconds / 1000);
  const milliseconds = totalMilliseconds % 1000;

  return [hours, minutes, seconds].map(n => String(n).padStart(2, "0")).join(":") + ":" + String(milliseconds).padStart(3, "0");
}

timerString.value = formatMiliseconds(true)

function startTimer() {
  timerStartTime.value = Date.now();
  timerIntervalId = setInterval(() => {
    timerString.value = formatMiliseconds()
  }, 10);
}
function stopTimer() {
  clearInterval(timerIntervalId);
  timerStartTime.value = 0.0
  timerString.value = formatMiliseconds(true)
}

type Coordinates = { x: number, y: number }
let appleCoordinates: Coordinates
const snakeSegments: Coordinates[] = [];

type snakeDirection = "Up" | "Right" | "Down" | "Left";

// Drawing the grid canvas when we change the grid size from the slider
watch(gridSize, () => {
  handleReset()
});

function randomizeApplePosition() {
  const allOpenCells = gridCellsOccupied.flatMap((col, x) =>
    col.map((occupied, y) =>
      (!occupied ? { x, y } : null)
    ).filter((cell) => cell !== null)
  ) as { x: number; y: number }[];
  if (allOpenCells.length == 0) {
    return false
  }

  const randomIndex = Math.floor(Math.random() * allOpenCells.length);
  const randomCell = allOpenCells[randomIndex]!;
  appleCoordinates = { x: randomCell.x, y: randomCell.y }
  return true
}

function clearGameCanvas() {
  const gameViewLayer = gameCanvases.gameView
  const gameViewLayerCTX = gameViewLayer.getContext("2d")!;
  gameViewLayerCTX.clearRect(0, 0, gameSizePixels, gameSizePixels);
}

function drawGrid() {
  const gridLayer = gameCanvases.grid
  const gridLayerCTX = gridLayer.getContext("2d")!;
  gridLayerCTX.clearRect(0, 0, gameSizePixels, gameSizePixels);

  const cellSize = gameSizePixels / gridSize.value;
  const isDark = preferredColor.value == "dark";
  const color1 = isDark ? "#1a1a1a" : "#f5f5f5";
  const color2 = isDark ? "#2a2a2a" : "#e8e8e8";

  for (let x = 0; x < gridSize.value; x++) {
    for (let y = 0; y < gridSize.value; y++) {
      gridLayerCTX.fillStyle = (x + y) % 2 === 0 ? color1 : color2;
      gridLayerCTX.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }

  gameCanvases.gameView.getContext('2d')!.drawImage(gameCanvases.grid, 0, 0)
}

function drawApple() {
  const appleLayer = gameCanvases.apple
  const appleLayerCTX = appleLayer.getContext('2d')!
  appleLayerCTX.clearRect(0, 0, gameSizePixels, gameSizePixels);

  const cellSize = gameSizePixels / gridSize.value;

  appleLayerCTX.fillStyle = "red";
  appleLayerCTX.fillRect(
    appleCoordinates.x * cellSize,
    appleCoordinates.y * cellSize,
    cellSize,
    cellSize,
  );
  gameCanvases.gameView.getContext('2d')!.drawImage(gameCanvases.apple, 0, 0)
}

function drawSnake() {
  const snakeLayer = gameCanvases.snake
  const snakeLayerCTX = snakeLayer.getContext('2d')!
  snakeLayerCTX.clearRect(0, 0, gameSizePixels, gameSizePixels);

  const cellSize = gameSizePixels / gridSize.value;

  // Draw the snake and make the head green
  for (const [index, segment] of snakeSegments.entries()) {
    if (index == 1) {
      snakeLayerCTX.fillStyle = preferredColor.value == "dark" ? "white" : "black";
    }
    if (index == 0) {
      snakeLayerCTX.fillStyle = 'green'
    }
    snakeLayerCTX.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
  }

  gameCanvases.gameView.getContext('2d')!.drawImage(gameCanvases.snake, 0, 0)
}

function updateSnake(snakeDirection: snakeDirection) {
  if (snakeDirection == "Up") {
    // Check out of bounds
    if (snakeSegments[0]!.y - 1 < 0) return false
    // Check collision with body of snake
    if (gridCellsOccupied[snakeSegments[0]!.x]![snakeSegments[0]!.y - 1]) return false
    // Update head of snake
    snakeSegments.unshift({ x: snakeSegments[0]!.x, y: snakeSegments[0]!.y - 1 });
  } else if (snakeDirection == "Right") {
    if (snakeSegments[0]!.x + 1 >= gridSize.value) return false
    if (gridCellsOccupied[snakeSegments[0]!.x + 1]![snakeSegments[0]!.y]) return false
    snakeSegments.unshift({ x: snakeSegments[0]!.x + 1, y: snakeSegments[0]!.y });
  } else if (snakeDirection == "Down") {
    if (snakeSegments[0]!.y + 1 >= gridSize.value) return false
    if (gridCellsOccupied[snakeSegments[0]!.x]![snakeSegments[0]!.y + 1]) return false
    snakeSegments.unshift({ x: snakeSegments[0]!.x, y: snakeSegments[0]!.y + 1 });
  } else if (snakeDirection == "Left") {
    if (snakeSegments[0]!.x - 1 < 0) return false
    if (gridCellsOccupied[snakeSegments[0]!.x - 1]![snakeSegments[0]!.y]) return false
    snakeSegments.unshift({ x: snakeSegments[0]!.x - 1, y: snakeSegments[0]!.y });
  }

  gridCellsOccupied[snakeSegments[0]!.x]![snakeSegments[0]!.y] = true

  // If there is an apple where we moved, keep the last segment of the snake, otherwise pop it.
  if (snakeSegments[0]!.x == appleCoordinates.x && snakeSegments[0]!.y == appleCoordinates.y) {
    if (!randomizeApplePosition()) {
      scenarioWinner();
      return true
    }
  } else {
    const lastSegment = snakeSegments.pop()!;
    gridCellsOccupied[lastSegment.x]![lastSegment.y] = false
  }


  //Check if the snake has atleast 1 open location to go, otherwise stop timer
  const currentHead = snakeSegments[0]!
  for (const dir of directions) {
    const nextX = currentHead.x + dir.x
    const nextY = currentHead.y + dir.y
    // Check if position is within bounds and not occupied
    if (nextX >= 0 && nextX < gridSize.value && nextY >= 0 && nextY < gridSize.value && !gridCellsOccupied[nextX]![nextY]) {
      return true
    }
  }

  stopTimer()

  // We have no directions to go, we lost
  scenarioLoser();
  return false
}

const shownHighScores: Ref<{ uuid: string, time: string }[]> = ref([])

function scenarioWinner() {
  const uuid = crypto.randomUUID()
  setCookie(uuid.toString(), timerString.value)
  const cookies = getAllCookies()
  cookies.forEach((cookie => {
    const split = cookie.split('=')
    if (shownHighScores.value.find((highscore) => {
      return highscore.uuid == split[0]
    })) return
    shownHighScores.value.push({ uuid: split[0]!, time: split[1]! })
  }))
  shownHighScores.value.sort((a, b) => {
    const aSplit = a.time.split(':')
    const bSplit = b.time.split(':')
    for (let x = 0; x <= 3; x++) {
      if (parseInt(aSplit[x]!) > parseInt(bSplit[x]!)) {
        return 1
      } else {
        return -1
      }
    }
    return 0
  })
}

function scenarioLoser() {

}

function initializeSnake() {
  snakeSegments.length = 0

  // Generate random head position
  const headX = Math.floor((Math.random() * (gridSize.value - 2)) + 1);
  const headY = Math.floor((Math.random() * (gridSize.value - 2)) + 1);
  snakeSegments.push({ x: headX, y: headY });
  gridCellsOccupied[headX]![headY] = true

  const randomDir = directions[Math.floor(Math.random() * directions.length)]!;
  const tailX = headX + randomDir.x;
  const tailY = headY + randomDir.y;

  snakeSegments.push({ x: tailX, y: tailY });
  gridCellsOccupied[tailX!]![tailY!] = true
}

function gameLoop(snakeDirection: snakeDirection) {
  if (updateSnake(snakeDirection) && timerStartTime.value == 0.0) {
    startTimer()
  }
  clearGameCanvas();
  gameCanvases.gameView.getContext('2d')!.drawImage(gameCanvases.grid, 0, 0)
  drawApple();
  drawSnake();
}

function handleArrowKeys(event: KeyboardEvent) {
  switch (event.key) {
    case "ArrowUp":
      gameLoop("Up");
      return;
    case "ArrowRight":
      gameLoop("Right");
      return;
    case "ArrowDown":
      gameLoop("Down");
      return;
    case "ArrowLeft":
      gameLoop("Left");
      return;
  }
}

function handleReset() {
  gridCellsOccupied = createEmptyGrid(gridSize.value)
  stopTimer()
  clearGameCanvas()
  drawGrid();
  initializeSnake()
  randomizeApplePosition();
  drawApple();
  drawSnake();
}


function InitGameState() {
  const container = document.getElementById('speedysnake-game-container')
  container?.append(gameCanvases.gameView)
  handleReset();
}

onMounted(() => {
  InitGameState()
})
onUnmounted(() => {
  stopTimer();
})
</script>

<template>
  <div class="speedysnake-view">
    <div class="center-box">
      <div class="options-box">
        <h1>
          <IconSpeedySnake />
          Speedy Speedrun Snake!
        </h1>
        <div class="grid-size-option">
          <label> Choose your grid:</label>
          <label> 5 </label>
          <input type="range" v-model="gridSize" min="5" max="20" step="1" />
          <label> 20 </label>
        </div>
        <div class="personal-highscores">
          <ul>
            <li v-for="highscore of shownHighScores" :key="highscore.uuid">{{ highscore.time }}</li>
          </ul>
        </div>
      </div>
      <div @keydown="handleArrowKeys" class="speedysnake-game-box" tabindex="0">
        <div class="speedysname-game-container" id="speedysnake-game-container"></div>
        <div class="game-footer">
          <label>{{ timerString }}</label>
          <button @click="handleReset">Reset</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.speedysnake-view {
  place-items: center;
  align-items: center;
  width: 100%;
  height: 100%;
  display: flex;
}

.center-box {
  display: grid;
  grid-template-columns: 1fr 2fr;
  width: 100%;
  align-items: center;
}

.game-footer {
  display: inline-flex;
  align-items: center;
  font-size: 32px;
  line-height: 1.6;

  * {
    margin: 0 10px
  }
}

.grid-size-option {
  display: flex;
  align-items: center;

  label {
    margin: 0 10px;
  }
}

.options-box {
  width: 100%;
  place-items: center;
  display: grid;
  columns: 1;
}

.speedysnake-game-box {
  place-items: center;
  display: grid;
  columns: 1;
  border-color: lightcoral;
  border-radius: 16px;
  border-style: solid;
  border-width: 0;
  padding: 12px;
}

.speedysname-game-container {
  border-style: solid;
  border-width: 2px;
  border-color: var(--vt-c-black-soft);
}

@media (prefers-color-scheme: dark) {
  .speedysname-game-container {
    border-color: var(--vt-c-white-soft);
  }
}

.speedysnake-game-box:focus-within {
  border-width: 4px;
}
</style>
