<!-- SurveyLeftMenu.vue -->
<template>
    <div class="left">
      <el-menu
        class="el-menu-vertical-demo"
        :default-active="activeIndex"
        background-color="transparent"
        text-color="#fff"
        active-text-color="#409eff"
        unique-opened
        @select="handleSelect"
      >
        <!-- 一级菜单：物质供给类 -->
        <el-sub-menu index="0">
          <template #title>
            <div class="title">
              <img src="@/icons/material.svg" class="svg-img" />
              <span class="menu-title-text">物质供给类</span>
            </div>
          </template>
          <el-menu-item index="0-0">水产品</el-menu-item>
          <el-menu-item index="0-1">果品</el-menu-item>
          <el-menu-item index="0-2">粮食</el-menu-item>
          <el-menu-item index="0-3">两品一标</el-menu-item>
        </el-sub-menu>
  
        <!-- 一级菜单：文化服务类 -->
        <el-menu-item index="1" class="single">
          <img src="@/icons/culture.svg" class="svg-img" />
          <span class="menu-title-text">文化服务类</span>
        </el-menu-item>
  
        <!-- 一级菜单：调节服务类 -->
        <el-sub-menu index="2">
          <template #title>
            <div class="title">
              <img src="@/icons/ecology.svg" class="svg-img" />
              <span class="menu-title-text">调节服务类</span>
            </div>
          </template>
          <el-menu-item index="2-0">断面水质</el-menu-item>
          <el-menu-item index="2-1">生态用地</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>
</template>

<script setup>
  import { ref, watch } from 'vue'
  const props = defineProps({
    activeIndex: String
  })
  const emit = defineEmits(['menu-select'])
  
  const activeIndex = ref(props.activeIndex)
  
  watch(() => props.activeIndex, (newVal) => {
    activeIndex.value = newVal
  })
  
  const handleSelect = (index) => {
    emit('menu-select', index)
  }
</script>
  
<style scoped>
  .left {
    width: 200px;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.1);
    overflow-y: auto;
    box-sizing: border-box;
  }
  
  .title {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .svg-img {
    width: 20px;
    height: 20px;
    filter: brightness(0) invert(1);
    flex-shrink: 0;
  }
  
  .menu-title-text {
    font-size: 18px;
    font-weight: 500;
    color: white;
  }
  
  .el-menu-item,
  .el-submenu__title,
  .el-menu-item span,
  .el-submenu__title span {
    font-family: 'PingFang SC', sans-serif;
    line-height: 56px;
  }
  
  .el-submenu__title {
    padding-left: 20px !important;
  }
  
  .el-menu-item {
    padding-left: 40px !important;
    font-size: 16px !important;
  }
  .el-menu {
  border-right: none !important;
}

  /* 单独菜单项样式 */
  .el-menu-item.single {
    padding-left: 20px !important;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  /* 鼠标悬停变灰 */
  .el-menu-item:hover,
  .el-submenu__title:hover {
    background-color: rgba(255, 255, 255, 0.2) !important;
  }
  
  /* 激活状态下文字变蓝 */
  .el-menu-item.is-active span,
  .el-submenu__title.is-active span {
    color: #409eff !important;
    font-weight: bold;
  }
</style>
  