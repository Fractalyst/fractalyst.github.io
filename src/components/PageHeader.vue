<script setup lang="ts">
import HeaderLink from './HeaderLink.vue';
</script>

<template>
  <div class="app-header">
    <nav>
      <HeaderLink to="/" text="Home" icon="ic:outline-home" />
      <HeaderLink to="/projects" text="Projects" icon="mdi:book-outline" />
      <HeaderLink to="/speedysnake" text="SpeedySnake Game" icon="game-icons:sand-snake" />
      <!-- <HeaderLink to="/testing" text="testing" icon="qlementine-icons:test-16" /> -->
    </nav>
    <nav class="header-right">
      <HeaderLink href="mailto:fractarevia@gmail.com" icon="ic:twotone-email" rightSide />
      <HeaderLink href="https://discordapp.com/users/1407403114994077798" icon="ic:baseline-discord" rightSide />
      <HeaderLink href="https://github.com/CoroNaut?tab=repositories" text="CoroNaut" icon="mdi:github" rightSide />
      <HeaderLink href="https://github.com/Fractalyst?tab=repositories" text="Fractalyst" icon="mdi:github" rightSide />
    </nav>
  </div>
</template>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  background-color: var(--vt-c-white-soft);
  padding: 0 16px;
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
  min-width: 0;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}
</style>
