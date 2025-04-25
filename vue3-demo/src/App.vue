<!-- App.vue -->
<template>
  <div class="container">
    <HomeHeaderSection />
    <router-view class="main"></router-view>
  </div>
</template>

<script setup>
import HomeHeaderSection from '@/components/HomeHeaderSection.vue'
</script>

<style scoped>
.container {
    height: 100vh;
    width: 100%;
    background-color: aqua;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: url(@/assets/bg.png), radial-gradient(50% 158.02% at 50% 50%, #3a638b 0, #2e466d 98.75%);
}
.container .main {
    flex: 1;
    overflow: hidden;
    display: flex;
    width: 100%;
}
@font-face {
  font-family: 'YouSheBiaoTiHei';
  src: url('/fonts/YouSheBiaoTiHei.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
}
</style>
