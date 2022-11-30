import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'mainLayout',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'animator', component: () => import('src/pages/AnimatorPage.vue') },
      { path: '/home', name: 'home', component: () => import('src/pages/HomePage.vue') },
      { path: '/code', name: 'code', component: () => import('src/pages/CodePage.vue') },
    ],
  },
]

export default routes
