<script setup lang="ts">
import { Icon } from '@iconify/vue';

defineProps<{
  to?: string;
  href?: string;
  text?: string;
  icon: string;
  rightSide?: boolean,
}>();
</script>

<template>
  <RouterLink v-if="to" :to="to" class="link">
    <Icon class="router-icon link-icon" :icon="icon" />
    <div v-if="text" class="link-text">{{ text }}</div>
  </RouterLink>
  <a v-else class="link" :href="href" target="_blank">
    <Icon :icon="icon" class="link-icon" />
    <div v-if="text" class="link-text">{{ text }}</div>
  </a>
</template>

<style scoped>
.link-icon {
  min-width: 25px;
  min-height: 25px;
  max-width: 25px;
  max-height: 25px;
  color: var(--vt-c-black-soft);
}

@media (prefers-color-scheme: dark) {
  .link-icon {
    color: var(--vt-c-white-soft);
  }
}

.link {
  display: flex;
  align-items: center;
  padding: 5px 16px;
  gap: 8px;
  min-width: 0;
}

.router-icon {
  display: none;
}

.link-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1 1 0;
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
</style>
