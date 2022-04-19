import { createRouter, createWebHistory } from 'vue-router';
import Cookies from 'js-cookie';
import store from '@/store';
import { eventBus } from '@/modules/utils';

import dishesPage from '@/pages/dishes/dishesPage.vue';
import menusPage from '@/pages/menus/menusPage.vue';
import productsPage from '@/pages/products/productsPage.vue';
import productEditPage from '@/pages/products/productEditPage.vue';
import menuEditPage from '@/pages/menus/menuEditPage.vue';
import dishesEditPage from '@/pages/dishes/dishesEditPage.vue';
import registrationStepOne from '@/pages/login/registrationStepOne.vue';
import registrationStepTwo from '@/pages/login/registrationStepTwo.vue';
import login from '@/pages/login/login.vue';

const routes = [
  { path: '/', component: productsPage, meta: { requiresAuth: true } },
  { path: '/dishes', component: dishesPage, meta: { requiresAuth: true } },
  { path: '/menu', component: menusPage, meta: { requiresAuth: true } },
  { path: '/menu/:id', component: menuEditPage, meta: { requiresAuth: true } },
  { path: '/dishes/:id', component: dishesEditPage, meta: { requiresAuth: true } },
  { path: '/products/:id', component: productEditPage, meta: { requiresAuth: true } },
  { path: '/registration1', component: registrationStepOne },
  { path: '/registration2/:token', component: registrationStepTwo },
  { path: '/restore1', component: registrationStepOne },
  { path: '/restore2/:token', component: registrationStepTwo },
  { path: '/login', component: login },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// eslint-disable-next-line consistent-return
router.beforeEach((to) => {
  const token = Cookies.get('nutrition_jws');
  if (!token && to.meta.requiresAuth && !store.getters['auth/hasUser']) {
    eventBus.emit('showToast', {
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Вам необходимо войти в приложение',
      life: 3000,
    });
    return '/login';
  }
});

export default router;
