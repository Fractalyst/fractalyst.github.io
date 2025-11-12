<script setup lang="ts">
import AutoScrollingText from "@/components/AutoScrollingText.vue";
import IconNewWindow from "@/components/icons/IconNewWindow.vue";
import LanguageBlock from "@/components/LanguageBlock.vue";
</script>

<template>
  <div class="home-view">
    <div class="scrolling-container">
      <AutoScrollingText />
    </div>
    <LanguageBlock class="objective-container">
      <div class="objective-items">
        <h1>Transforming Ideas And Vision Into Realized Applications.</h1>
        <h3>
          As a dedicated team collaborator, I focus on understanding individual and project needs to
          deliver tailored, effective solutions. I thrive on continuous learning, sharing knowledge,
          and transforming ideas into practical and technical results that fully meet project goals.
        </h3>
        <a class="contact-link" href="mailto:fractarevia@gmail.com" target="_blank">
          <div class="contact-text">Contact</div>
          <IconNewWindow />
        </a>
      </div>
    </LanguageBlock>
  </div>
</template>

<style scoped>
.home-view {
  display: flex;
  place-content: center;
  align-items: center;
  margin: auto;
  width: 100%;
  height: 100%;
}

.scrolling-container {
  display: flex;
  z-index: 99;
  width: 40%;
  height: 70%;
  max-height: 768px;
}

.objective-container {
  z-index: 100;
  margin-left: -10%;
  background-color: var(--vt-c-white-soft);
  width: 50%;
  min-height: 300px;
}

.objective-items * {
  margin: 4px 0;
}

.contact-link {
  display: inline-flex;
  place-items: center;
  border-color: transparent;
  border-radius: 8px;
  background-color: var(--vt-c-black-soft);
  padding: 6px 14px;
  width: min-content;
  color: var(--vt-c-white-soft);
  font-size: 20px;
  text-decoration: none;
}
.contact-link:hover {
  background-color: var(--vt-c-black);
}

.contact-text {
  margin-right: 8px;
}

@media (prefers-color-scheme: dark) {
  .objective-container {
    background-color: var(--vt-c-black-soft);
  }
  .contact-link {
    background-color: var(--vt-c-white);
    color: var(--vt-c-black-soft);
  }
  .contact-link:hover {
    background-color: var(--vt-c-white-mute);
  }
  .contact-link {
    color: var(--vt-c-black-soft);
  }
}

@media (max-width: 768px) {
  .objective-container {
    display: block;
    position: absolute;
    margin: auto 0%;
    width: 75%;
  }
  .scrolling-container {
    width: 100%;
    height: 80%;
  }
}
</style>
