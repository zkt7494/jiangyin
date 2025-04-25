import { createRouter, createWebHistory } from 'vue-router';
import HomeBody from '@/components/HomeBody.vue';
import SurveyPage from '@/components/SurveyPage.vue';
import ValuePage from '@/components/ValuePage.vue';
import VoucherPage from '@/components/VoucherPage.vue';
import AccountingPage from '@/components/AccountingPage.vue';
const routes = [
    { path: '/', component: HomeBody },
    { path: '/survey', component: SurveyPage },
    { path: '/value', component: ValuePage },
    { path: '/accounting', component: AccountingPage },
    { path: '/voucher', component: VoucherPage },
  ];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
