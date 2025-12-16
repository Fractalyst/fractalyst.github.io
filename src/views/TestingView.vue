<script setup lang="ts">
import { onMounted } from 'vue';

const layers: HTMLCanvasElement[] = []

function test() {
  for (const layer of layers) {
    layer.width = 500
    layer.height = 500
  }
  const bottomContext = layers[0]?.getContext('2d')
  if (!bottomContext) return
  bottomContext.fillStyle = "red"
  bottomContext.fillRect(100, 100, 100, 100)

  const topContext = layers[1]?.getContext('2d')
  if (!topContext) return
  topContext.fillStyle = "blue"
  topContext.fillRect(125, 125, 50, 50)

}

onMounted(() => {
  layers.push(document.getElementById('layer1') as HTMLCanvasElement)
  layers.push(document.getElementById('layer2') as HTMLCanvasElement)
  test()
})
</script>

<template>
  <div class="testing-view">
    <div class="center-box">
      <canvas id="layer1"></canvas>
      <canvas id="layer2"></canvas>
    </div>
  </div>
</template>

<style scoped>
.center-box {
  place-items: center;
  align-items: center;
}

div>canvas {
  position: absolute
}
</style>
