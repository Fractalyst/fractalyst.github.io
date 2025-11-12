<script setup lang="ts">
import { RouterView } from "vue-router";
import PageHeader from "./components/PageHeader.vue";
</script>

<template>
  <header>
    <PageHeader />
  </header>
  <div class="center-content">
    <RouterView />
  </div>
</template>

<style scoped>
.center-content {
  display: flex;
  padding: 64px 0 0;
  width: 100%;
}

header {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
}
</style>
