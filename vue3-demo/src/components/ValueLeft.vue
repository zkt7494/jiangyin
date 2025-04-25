<!-- ValueLeft.vue -->
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
        <!-- 总价值量 -->
        <el-menu-item index="0">
          <img src="@/icons/total.svg" class="icon-img" />
          <span class="menu-title-text">总价值量</span>
        </el-menu-item>
  
        <!-- 物质服务类 -->
        <el-menu-item index="1" class="single">
          <img src="@/icons/material.svg" class="icon-img" />
          <span class="menu-title-text">物质服务类</span>
        </el-menu-item>
  
        <!-- 文化服务类 -->
        <el-menu-item index="2" class="single">
          <img src="@/icons/culture.svg" class="icon-img" />
          <span class="menu-title-text">文化服务类</span>
        </el-menu-item>
  
        <!-- 调节服务类 -->
        <el-sub-menu index="3">
          <template #title>
            <div class="title">
              <img src="@/icons/ecology.svg" class="icon-img" />
              <span class="menu-title-text">调节服务类</span>
            </div>
          </template>
          <el-menu-item index="3-0">水源涵养</el-menu-item>
          <el-menu-item index="3-1">土壤保持</el-menu-item>
          <el-menu-item index="3-2">防风固沙</el-menu-item>
          <el-menu-item index="3-3">洪水调蓄</el-menu-item>
          <el-menu-item index="3-4">空气净化</el-menu-item>
          <el-menu-item index="3-5">水质净化</el-menu-item>
          <el-menu-item index="3-6">碳固定</el-menu-item>
          <el-menu-item index="3-7">氧气提供</el-menu-item>
          <el-menu-item index="3-8">气候调节</el-menu-item>
          <el-menu-item index="3-9">噪声消减</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>
  </template>
  
<script setup>
  import { ref, watch, defineProps, defineEmits } from 'vue'
  const props = defineProps({ activeIndex: String })
  const emit = defineEmits(['menu-select'])
  
  const activeIndex = ref(props.activeIndex)
  
  watch(activeIndex, (val) => {
    emit('menu-select', val)
  })
  
  const handleSelect = (index) => {
    activeIndex.value = index
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
  
  .el-menu {
    border-right: none !important;
    background: transparent;
  }
  
  /* 图标样式 */
  .icon-img {
    width: 20px;
    height: 20px;
    filter: brightness(0) invert(1); 
    flex-shrink: 0;
    margin-right: 8px;
  }
  
  .title {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .menu-title-text {
    font-size: 18px;
    font-weight: 500;
    color: white;
  }
  
  /* 一级菜单和二级菜单样式 */
  .el-menu-item,
  .el-submenu__title {
    font-family: 'PingFang SC', sans-serif;
    font-size: 16px !important;
    line-height: 56px;
    height: 56px;
    padding-left: 20px !important;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  /* 子菜单项缩进更大 */
  .el-sub-menu .el-menu-item {
    padding-left: 40px !important;
  }
  
  /* 鼠标悬停背景 */
  .el-menu-item:hover,
  .el-submenu__title:hover {
    background-color: rgba(255, 255, 255, 0.2) !important;
  }
  
  /* 激活状态样式 */
  .el-menu-item.is-active span,
  .el-submenu__title.is-active span {
    color: #409eff !important;
  }
</style>
  