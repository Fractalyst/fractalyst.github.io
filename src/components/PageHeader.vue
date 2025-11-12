<script setup lang="ts">
import { RouterLink } from "vue-router";
import IconGithub from "./icons/IconGithub.vue";
import IconDiscord from "./icons/IconDiscord.vue";
import IconEmail from "./icons/IconEmail.vue";
import IconHome from "./icons/IconHome.vue";
import IconProjects from "./icons/IconProjects.vue";
</script>

<template>
  <div class="app-header">
    <nav>
      <RouterLink class="link" to="/">
        <div class="router-icon"><IconHome /></div>
        <div class="router-text">Home</div>
      </RouterLink>
      <RouterLink class="link" to="/projects">
        <div class="router-icon"><IconProjects /></div>
        <div class="router-text">Projects</div>
      </RouterLink>
    </nav>
    <nav class="header-right">
      <a class="link" href="mailto:fractarevia@gmail.com" target="_blank">
        <div class="link-icon"><IconEmail /></div>
        <div class="link-text">Email</div>
      </a>
      <a class="link" href="https://discordapp.com/users/1407403114994077798" target="_blank">
        <div class="link-icon"><IconDiscord /></div>
        <div class="link-text">Discord</div>
      </a>
      <a class="link" href="https://github.com/CoroNaut?tab=repositories" target="_blank">
        <div class="link-icon"><IconGithub /></div>
        <div class="link-text">CoroNaut</div>
      </a>
      <a class="link" href="https://github.com/Fractalyst?tab=repositories" target="_blank">
        <div class="link-icon"><IconGithub /></div>
        <div class="link-text">Fractalyst</div>
      </a>
    </nav>
  </div>
</template>

<style scoped>
.header-right {
  display: flex;
  align-content: center;
  justify-content: flex-end;
}

.app-header {
  display: flex;
  justify-content: space-between;
  background-color: var(--vt-c-white-soft);
  padding: 0 16px;
  width: 100%;
  font-size: 20px;
}

.header-right .link-text {
  flex-shrink: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (prefers-color-scheme: dark) {
  .app-header {
    background-color: var(--vt-c-black-soft);
  }
}

.link-icon,
.link-text,
.router-text {
  display: flex;
}

.router-icon {
  display: none;
}

@media (max-width: 768px) {
  .link-text {
    display: none;
  }
  .router-icon {
    display: flex;
  }
  .router-text {
    display: none;
  }
}

nav {
  display: flex;
  flex-grow: 1;
  flex-shrink: 0;
  padding: 11px 8px;
  min-width: 100px;
  height: min-content;
  text-align: center;
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
  min-height: 42px;
}
</style>
