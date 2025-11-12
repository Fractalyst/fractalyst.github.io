<script setup lang="ts"></script>

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
  margin: 16px;
  border-width: 2px;
  border-style: solid;
  border-color: var(--vt-c-black-soft);
  border-radius: 16px;
  padding: 16px;
  overflow: hidden;
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
