<script setup lang="ts">
import { RouterLink } from 'vue-router'
import IconGithub from './icons/IconGithub.vue';
</script>

<template>
  <div class="app-header">
    <nav>
      <RouterLink class="link" to="/">Home</RouterLink>
      <RouterLink class="link" to="/projects">Projects</RouterLink>
    </nav>
    <div class="center-icon">
      <img style="height:auto;" alt="" src="https://avatars.githubusercontent.com/u/46770859?v=4" width="56" height="56"
        class="avatar avatar-user width-full border color-bg-default">
    </div>
    <nav class="header-right">
      <a class="link" href="https://github.com/CoroNaut?tab=repositories">
        <IconGithub />
        CoroNaut
      </a>
      <a class="link" href="https://github.com/Fractalyst?tab=repositories">
        <IconGithub />
        Fractalyst
      </a>
    </nav>
  </div>
</template>

<style scoped>
.header-right {
  justify-content: right;
  align-content: center;
}

.center-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
}

.app-header {
  position: sticky;
  top: 0;
  width: 100%;
  background-color: var(--vt-c-white-soft);
  padding: 0 16px;
  font-size: 20px;
  display: flex;
}

@media (prefers-color-scheme: dark) {
  .app-header {
    background-color: var(--vt-c-black-soft);
  }
}

nav {
  height: min-content;
  display: flex;
  width: 100%;
  text-align: center;
  padding: 11px 8px
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: flex;
  align-items: center;
  padding: 5px 16px;
}
</style>