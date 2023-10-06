import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeIndex from "../views/Layout/LayoutIndex.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeIndex,
    children: [
      // loading加载
      {
        path: "/loading",
        name: "loading",
        component: () => import("../views/BodyLoading/LoadingIndex.vue")
      },
      // 主页搜索
      {
        path: "",
        alias: "/home",
        name: "home",
        component: () => import("../views/BodyHome/HomeIndex.vue")
      },
      // 浏览所有
      {
        path: '/show_all',
        name: 'show_all',
        component: () => import("../views/BodyShowAll/ShowAllIndex.vue")
      },
      // 搜索结果
      {
        path: '/search_res',
        name: 'search_res',
        component: () => import("../views/BodySearchRes/SearchResIndex.vue")
      },
      // 浏览单组
      {
        path: '/show_one',
        name: 'show_one',
        component: () => import("../views/BodyShowOne/ShowOneIndex.vue")
      }
    ]
  }
]

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  // hash路由，解决show页刷新404
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
