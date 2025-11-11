<script setup lang="ts">
import { sleep } from '@/scripts/utilities';
import { ref, onMounted, onUnmounted, computed } from 'vue';

import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
hljs.registerLanguage('typescript', typescript);

//const urls = [
//    'https://github.com/CoroNaut/space_engineers/blob/main/IngameScripts/local/Java_AutoAscent/script.cs',
//    'https://github.com/CoroNaut/space_engineers/blob/main/IngameScripts/local/Java_Power_Display/script.cs'
//];


const tempText = `
async function fetchNewCodeBlock() {
    try {
        repeatAutoScrollingLoop()
        scrollText.value = 'no'
        if (containerRef.value) {
            containerRef.value.scrollTop = 0;
        }
        scrollText.value = tempText2

    } catch (error) {
        console.error('Error fetching code:', error);
    }
}
`;
const tempText2 = `const scrollInterval = ref<number>();
const fetchInterval = ref<number>(window.setInterval(fetchNewCodeBlock, 20000))
const scrollSpeed = 4;//pixels

async function repeatAutoScrollingLoop() {
    clearInterval(scrollInterval.value)
    await sleep(5000)
    if (!containerRef.value || (containerRef.value.scrollTop >= (containerRef.value.scrollHeight - containerRef.value.clientHeight))) {
        return;
    }
    scrollInterval.value = window.setInterval(async () => {
        if (!containerRef.value) return
        if (containerRef.value.scrollTop >= (containerRef.value.scrollHeight - containerRef.value.clientHeight)) {
            repeatAutoScrollingLoop()
        } else {
            containerRef.value.scrollTop += scrollSpeed;
        }
        console.log(containerRef.value.scrollTop)
    }, 100);
}`

const scrollText = ref<string>(tempText)
const scrollTextHighlighted = computed(() => {
    return hljs.highlight(scrollText.value, { language: 'typescript' }).value
})
const containerRef = ref<HTMLDivElement | null>(null);

async function fetchNewCodeBlock() {
    try {
        repeatAutoScrollingLoop()
        scrollText.value = ''
        if (containerRef.value) {
            containerRef.value.scrollTop = 0;
        }
        scrollText.value = tempText2
        //const response = await fetch(urls[0]!);
        //const blob = await response.blob();
        //const text = await blob.text();
        //scrollText.value = text;

    } catch (error) {
        console.error('Error fetching code:', error);
    }
}

// Setup auto-scrolling
const scrollInterval = ref<number>();
const fetchInterval = ref<number>(window.setInterval(fetchNewCodeBlock, 20000))
const scrollSpeed = 4;//pixels

async function repeatAutoScrollingLoop() {
    clearInterval(scrollInterval.value)
    await sleep(5000)
    if (!containerRef.value || (containerRef.value.scrollTop >= (containerRef.value.scrollHeight - containerRef.value.clientHeight))) {
        return;
    }
    scrollInterval.value = window.setInterval(async () => {
        if (!containerRef.value) return
        if (containerRef.value.scrollTop >= (containerRef.value.scrollHeight - containerRef.value.clientHeight)) {
            repeatAutoScrollingLoop()
        } else {
            containerRef.value.scrollTop += scrollSpeed;
        }
    }, 100);
}

onMounted(() => {
    repeatAutoScrollingLoop()
});

onUnmounted(() => {
    if (scrollInterval.value) {
        clearInterval(scrollInterval.value);
        clearInterval(fetchInterval.value)
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
    font-family: monospace;
    user-select: none;
    overflow: hidden;
    scroll-behavior: smooth;
}

.scrolling-text-box {
    font-family: monospace;
    user-select: none;
    scroll-behavior: smooth;
    overflow: hidden;
    padding: 6px;
    margin: 16px;
    min-width: 100px;
    height: 250px;
    border-style: solid;
    border-color: var(--vt-c-black-soft);
    border-width: 2px;
    border-radius: 16px;
}

@media (prefers-color-scheme: dark) {
    .scrolling-text-box {
        border-color: var(--vt-c-white-soft);
    }
}
</style>