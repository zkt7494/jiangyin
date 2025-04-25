<!-- HomeBody.vue -->
<template>
    <div class="content router-view main">
      <HomeBodyLeft :year="year" />
      <HomeBodyMiddle :year="year" @toggle-year="year = $event" />
      <HomeBodyRight :year="year" />
    </div>
</template>
  
<script setup>
  import { ref } from 'vue'
  import HomeBodyLeft from './HomeBodyLeft.vue'
  import HomeBodyMiddle from './HomeBodyMiddle.vue'
  import HomeBodyRight from './HomeBodyRight.vue'
  
  const year = ref(2021)
  
  const toggleYear = () => {
    year.value = year.value === 2021 ? 2022 : 2021
  }
</script>
  
<style scoped>
  .container .main {
    flex: 1;
    overflow: hidden;
    display: flex;
    width: 100%;
  }
  .content {
    display: flex;
    height: calc(100% - 64px);
    width: 100%;
  }
</style>