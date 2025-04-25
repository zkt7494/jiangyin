<!-- ValuePage.vue -->
<template>
  <div class="content router-view main">
    <!-- ValueLeft 始终显示 -->
    <ValueLeft :active-index="activeIndex" @menu-select="handleSelect" />
    
    <!-- 根据条件显示 ValueRightChart 或 ValueBody -->
    <ValueRightChart v-if="isEcologyService" :active-index="activeIndex" />
    <ValueBody v-else :active-index="activeIndex" />
  </div>
</template>
  
<script setup>
  import { ref, computed } from 'vue' 
  import ValueBody from './ValueBody.vue'
  import ValueLeft from './ValueLeft.vue'
  import ValueRightChart from './ValueRightChart.vue'
  const activeIndex = ref('0')
  
  const handleSelect = (index) => {
    activeIndex.value = index
  }
  const isEcologyService = computed(() => {
    return activeIndex.value.startsWith('3') // 如果 activeIndex 以 '3' 开头，则表示点击了调节服务类
  })
</script>
  
  <style scoped>
  .container .main{
      flex: 1;
      overflow: hidden;
      display: flex;
      width: 100%;
  }
  .content{
      display: flex;
      height: calc(100% - 64px);
      width: 100%;
  }
  </style>