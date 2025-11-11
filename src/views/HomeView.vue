<script setup lang="ts">
import AutoScrollingText from '@/components/AutoScrollingText.vue';
import LanguageBlock from '@/components/LanguageBlock.vue';


</script>

<template>
  <div>
    <div class="scroll-text">
      <AutoScrollingText />
    </div>
    <LanguageBlock>
      <main>
        My objective is to continuously adapt and work to ensure customer requirements are completely fulfilled. Working
        with
        people and learning their specific needs is most important to making a plan tailored for their use. My
        commitment
        to
        applying this understanding allows me to offer a greater range of solutions both technical and practical.
      </main>
    </LanguageBlock>
  </div>
</template>

<style scoped>
.scroll-text {
  max-width: 300px;
  max-height: 300px;
}
</style>
