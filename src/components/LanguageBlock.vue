<script setup lang="ts">
</script>

<template>
    <div class="overview-item">
        <div class="icons">
            <slot name="icon"></slot>
        </div>
        <slot></slot>
    </div>
</template>


<style scoped>
.icons {
    width: min-content;
    font-size: 50px;

    a {
        background-color: var(--vt-c-black-soft);
    }
}

.overview-item {
    display: flex;
    border-width: 2px;
    border-color: var(--vt-c-black-soft);
    border-radius: 16px;
    border-style: solid;
    padding: 16px;
    margin: 16px;
}

@media (prefers-color-scheme: dark) {
    .icons a {
        background-color: var(--vt-c-white-soft);
    }

    .overview-item {
        border-color: var(--vt-c-white-soft);
    }
}
</style>