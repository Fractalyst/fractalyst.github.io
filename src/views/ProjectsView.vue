<script setup lang="ts">
import LanguageBlock from "@/components/LanguageBlock.vue";
import IconCSS from "@/components/icons/IconCSS.vue";
import IconCSharp from "@/components/icons/IconCSharp.vue";
import IconHTML from "@/components/icons/IconHTML.vue";
import IconJavaScript from "@/components/icons/IconJavaScript.vue";
import IconMATLAB from "@/components/icons/IconMATLAB.vue";
import IconPython from "@/components/icons/IconPython.vue";
import IconTypeScript from "@/components/icons/IconTypeScript.vue";
import IconVue from "@/components/icons/IconVue.vue";
</script>

<template>
  <div class="projects-view">
    <LanguageBlock>
      <template #icon>
        <a href="https://whatwg.org/" target="_blank">
          <IconHTML />
        </a>
        <a href="https://www.w3.org/" target="_blank">
          <IconCSS />
        </a>
        <a href="https://vuejs.org/" target="_blank">
          <IconVue />
        </a>
      </template>
      <ul>
        <li>
          This website uses VueJS<br />
          <a class="link" href="https://github.com/Fractalyst/Fractalyst.github.io" target="_blank">
            View on Github
          </a>
        </li>
        <br />
        <li>
          Visual Algebra<br />
          Project intended to teach algebra to students visually rather than through just
          mathematical notation.<br />
          <a class="link" href="https://github.com/visualAlgebra/cmpsc488" target="_blank">
            View on Github
          </a>
        </li>
      </ul>
    </LanguageBlock>
    <LanguageBlock>
      <template #icon>
        <a href="https://www.python.org/" target="_blank">
          <IconPython />
        </a>
      </template>
      <ul>
        <li>
          Python projects<br />
          Map editing utility for CDDA (Cataclysm Dark Days Ahead)<br />
          Copy and paste sections of map from one save file to another<br />
          <a class="link" href="https://github.com/CoroNaut/CDDA-Chunk-mover" target="_blank">
            View on Github
          </a>
        </li>
      </ul>
    </LanguageBlock>
    <LanguageBlock>
      <template #icon>
        <a href="https://www.javascript.com/" target="_blank">
          <IconJavaScript />
        </a>
        <a href="https://www.typescriptlang.org/" target="_blank">
          <IconTypeScript />
        </a>
      </template>
      <ul>
        <li>
          Screeps game<br />
          Gameplay revolves around using JavaScript to sustain and grow a civilization in a world
          with other players.<br />
          My solutions using JavaScript on Github.<br />
          <a class="link" href="https://github.com/CoroNaut/screeps" target="_blank">
            View on Github
          </a>
        </li>
        <li>
          Refined PrUn<br />
          A TypeScript extension for the game Prosperous Universe.<br />
          I've made several contributions under CoroNaut.<br />
          <a class="link" href="https://github.com/refined-prun/refined-prun" target="_blank">
            View on Github
          </a>
        </li>
      </ul>
    </LanguageBlock>
    <LanguageBlock>
      <template #icon>
        <a
          href="https://www.mathworks.com/products/matlab.html?s_tid=hp_products_matlab"
          target="_blank"
        >
          <IconMATLAB />
        </a>
      </template>
      <ul>
        <li>
          MATLAB computing platform<br />
          Created several small projects revolving around images<br />
          <a class="link" href="https://github.com/CoroNaut/octave" target="_blank">
            View on Github
          </a>
        </li>
      </ul>
    </LanguageBlock>

    <LanguageBlock>
      <template #icon>
        <a href="https://dotnet.microsoft.com/en-us/languages/csharp" target="_blank">
          <IconCSharp />
        </a>
      </template>
      <ul>
        <li>
          Space engineers<br />
          Using C# to automate liftoff to exit a planet's atmosphere or create a display to track
          power generation and usage.<br />
          <a class="link" href="https://github.com/CoroNaut/space_engineers" target="_blank">
            View on Github
          </a>
        </li>
      </ul>
    </LanguageBlock>
  </div>
</template>

<style scoped>
.projects-view {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 64px 2rem 0;
}

@media (max-width: 768px) {
  .projects-view {
    grid-template-columns: 1fr;
  }
}
</style>
