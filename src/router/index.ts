import * as PIXI from 'pixi.js'
window.PIXI = PIXI
import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/hangul',
    // path: '/',
    name: 'main',
    component: () => import('@/pages/main.vue')
  },
  {
    path: '/hangul/opening',
    name: 'opening',
    component: () => import('@/pages/opening.vue')
  },
  // 하루한글 컨텐츠
  {
    path: '/hangul/oneday/step01',
    name: 'onedayStep01',
    component: () => import('@/pages/oneday/step01.vue')
  },
  {
    path: '/hangul/oneday/step02',
    name: 'onedayStep02',
    component: () => import('@/pages/oneday/step02.vue')
  },
  {
    path: '/hangul/oneday/step03',
    name: 'onedayStep03',
    component: () => import('@/pages/oneday/step03.vue')
  },
  {
    path: '/hangul/oneday/step04',
    name: 'onedayStep04',
    component: () => import('@/pages/oneday/step04.vue')
  },
  {
    path: '/hangul/oneday/step05',
    name: 'onedayStep05',
    component: () => import('@/pages/oneday/step05.vue')
  },
  {
    path: '/hangul/oneday/step06',
    name: 'onedayStep06',
    component: () => import('@/pages/oneday/step06.vue')
  },
  {
    path: '/hangul/activity',
    name: 'activity',
    props: true,
    component: () => import('@/activity/activityPlayer.vue')
  },
  {
    path: '/hangul/parent/',
    name: 'parent',
    component: () => import('@/pages/parent.vue'),
    children: [
      {
        path: 'play',
        name: 'parentPlay',
        component: () => import('@/pages/parent/play.vue')
      },
      {
        path: 'section',
        name: 'parentSection',
        component: () => import('@/pages/parent/section.vue')
      },
      {
        path: 'study',
        name: 'parentStudy',
        component: () => import('@/pages/parent/study.vue')
      },
      {
        path: 'setting',
        name: 'parentSetting',
        component: () => import('@/pages/parent/setting.vue')
      },
      {
        path: 'exit',
        name: 'parentExit',
        component: () => import('@/pages/parent/exit.vue')
      }
    ]
  }
  // {
  //   path: '/hangul/parent/play',
  //   name: 'parentPlay',
  //   component: () => import('@/pages/parent/play.vue')
  // },
  // {
  //   path: '/hangul/parent/section',
  //   name: 'parentSection',
  //   component: () => import('@/pages/parent/section.vue')
  // },
  // {
  //   path: '/hangul/parent/study',
  //   name: 'parentStudy',
  //   component: () => import('@/pages/parent/study.vue')
  // },
  // {
  //   path: '/hangul/parent/setting',
  //   name: 'parentSetting',
  //   component: () => import('@/pages/parent/setting.vue')
  // },
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  mode: 'history',
  routes
})

// router.beforeEach((to, from, next)=> {
//   // console.log('to', to);
//   // console.log('from', from);
//   // console.log('next', next);
//   next();
// })

export default router
