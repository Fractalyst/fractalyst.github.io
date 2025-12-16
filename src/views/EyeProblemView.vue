<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, reactive } from "vue"

const canvasRef = ref<HTMLCanvasElement | null>(null)
const wrapperStyle = reactive<{ marginLeft: string; marginRight: string }>({
  marginLeft: "0px",
  marginRight: "0px"
})

const bgColors = ['skyblue', 'gray']
const backgroundColor = ref<string>(bgColors[0]!)
const DOT_COUNT = 50
const DOT_SIZE = ref(1.4)
const DOT_SPEED = 450

type Dot = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
}

let ctx: CanvasRenderingContext2D | null = null
const dots: Dot[] = []
let animationId = 0

function createDot(): Dot {
  if (!canvasRef.value) return {
    x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 0.05, color: "#ffffff"
  }

  return {
    x: Math.random() * canvasRef.value.width,
    y: Math.random() * canvasRef.value.height,
    vx: (Math.random() - 0.5) * DOT_SPEED,
    vy: (Math.random() - 0.5) * DOT_SPEED,
    life: 0,
    maxLife: 0.02 + Math.random() * 0.08,
    color: Math.random() < 0.5 ? "#000000" : "#ffffff"
  }
}

function resetDot(dot: Dot) {
  Object.assign(dot, createDot())
}

function setBackground(color: string) {
  backgroundColor.value = color
}

let lastTime = performance.now()

function loop(time: number) {
  const dt = (time - lastTime) / 1000
  lastTime = time

  if (!ctx || !canvasRef.value) return

  // Clear entire canvas to background color
  ctx.fillStyle = backgroundColor.value
  ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height)

  // Update and draw dots
  for (const dot of dots) {
    dot.life += dt
    if (dot.life > dot.maxLife) {
      resetDot(dot)
    }

    dot.x += dot.vx * dt
    dot.y += dot.vy * dt

    ctx.fillStyle = dot.color
    ctx.fillRect(Math.floor(dot.x), Math.floor(dot.y), DOT_SIZE.value, DOT_SIZE.value)
  }

  animationId = requestAnimationFrame(loop)
}

onMounted(() => {
  // Cancel #app margins
  const appEl = document.getElementById("app")
  if (appEl) {
    const style = window.getComputedStyle(appEl)
    wrapperStyle.marginLeft = `-${style.marginLeft}`
    wrapperStyle.marginRight = `-${style.marginRight}`
  }

  if (canvasRef.value) {
    ctx = canvasRef.value.getContext("2d")
    canvasRef.value.width = canvasRef.value.clientWidth
    canvasRef.value.height = canvasRef.value.clientHeight
  }

  // Create initial dots
  for (let i = 0; i < DOT_COUNT; i++) {
    dots.push(createDot())
  }

  animationId = requestAnimationFrame(loop)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
})

</script>

<template>
  <div :style="wrapperStyle" class="canvas-container">
    <div class="top-controls">
      <button v-for="color in bgColors" :key="color" type="button" @click="setBackground(color)">
        {{ color }}
      </button>
      <label>
        Dot size:
      </label>
      <input type="range" v-model="DOT_SIZE" min="1" max="3" step="0.1" />
      <label>
        {{ DOT_SIZE }}
      </label>
    </div>

    <div class="canvas-wrapper">
      <canvas ref="canvasRef" class="pixel-canvas" :style="{ background: backgroundColor }"></canvas>
    </div>
  </div>
</template>

<style scoped>
.canvas-wrapper {
  width: 100vw;
  height: 100%;
  overflow: hidden;
}

.pixel-canvas {
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
  display: block;
}

.top-controls {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  display: flex;
  gap: 8px;
}

.top-controls button {
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: white;
  cursor: pointer;
}
</style>
