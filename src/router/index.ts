import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ProjectsView from "../views/ProjectsView.vue";
import SpeedySnakeView from "../views/SpeedySnakeView.vue";
// import TestingView from "@/views/TestingView.vue";
import EyeProblemView from "@/views/EyeProblemView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/projects",
      name: "projects",
      component: ProjectsView,
    },
    {
      path: "/speedysnake",
      name: "speedysnake",
      component: SpeedySnakeView,
    },
    {
      path: "/testing",
      name: "testing",
      component: EyeProblemView,
    },
  ],
});

export default router;
