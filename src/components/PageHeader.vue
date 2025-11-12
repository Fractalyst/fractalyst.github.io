<script setup lang="ts">
import { RouterLink } from "vue-router";
import IconGithub from "./icons/IconGithub.vue";
import IconDiscord from "./icons/IconDiscord.vue";
import IconEmail from "./icons/IconEmail.vue";
</script>

<template>
  <div class="app-header">
    <nav>
      <RouterLink class="link" to="/">Home</RouterLink>
      <RouterLink class="link" to="/projects">Projects</RouterLink>
    </nav>
    <div class="center"></div>
    <nav class="header-right">
      <a class="link" href="mailto:fractarevia@gmail.com" target="_blank">
        <IconEmail />
        Email
      </a>
      <a class="link" href="https://discordapp.com/users/1407403114994077798" target="_blank">
        <IconDiscord />
        Discord
      </a>
      <a class="link" href="https://github.com/CoroNaut?tab=repositories" target="_blank">
        <IconGithub />
        CoroNaut
      </a>
      <a class="link" href="https://github.com/Fractalyst?tab=repositories" target="_blank">
        <IconGithub />
        Fractalyst
      </a>
    </nav>
  </div>
</template>

<style scoped>
.header-right {
  align-content: center;
  justify-content: right;
}

.center {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 4px;
}

.app-header {
  display: flex;
  position: sticky;
  top: 0;
  background-color: var(--vt-c-white-soft);
  padding: 0 16px;
  width: 100%;
  font-size: 20px;
}

@media (prefers-color-scheme: dark) {
  .app-header {
    background-color: var(--vt-c-black-soft);
  }
}

nav {
  display: flex;
  padding: 11px 8px;
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
}
</style>
