<template>
    <div class="head">
      <div class="head-top-left">
        <button class="icon-button" id="home-button" @click="goHome">
            <img src="@/icons/home.png" width="24px" height="24px" />
            <div class="button-text">首页</div>
        </button>
        <ul class="nav-left">
          <router-link to="/survey" class="nav-item">生态产品调查</router-link>
          <router-link to="/value" class="nav-item">生态产品价值</router-link>
        </ul>
      </div>
  
      <div class="title"></div>
  
      <div class="head-top-right">
        <ul class="nav-right">
          <router-link to="/accounting" class="nav-item">价值自动核算</router-link>
          <router-link to="/voucher" class="nav-item">生态券核算</router-link>
        </ul>
        <button id="login-button">登录</button>
      </div>
    </div>
  </template>
  
<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goHome() {
  router.push('/');
}
</script>
  
<style scoped>
  .head-top-left, .head-top-right {
    height: 64px;
    width: 663px;
    background-size: 100%;
    background-repeat: no-repeat;
}
div {
    display: block;
    unicode-bidi: isolate;
}
.head-top-left {
    float: left;
    background-image: url(src/assets/head-left.png);
}
.title {
    position: absolute;
    background-image: url(src/assets/title.png);
    background-size: 100%;
    width: 738px;
    height: 80px;
    left: 590px;
    z-index: 99;
}
.head-top-right{
  position: absolute;
  right: 0; /* 贴住右侧 */
  top: 0;
  background-image: url(@/assets/head-right.png);
  height: 64px;
  width: 663px;
  background-size: 100%;
  background-repeat: no-repeat;
  z-index: 98;
}
top-right {
    height: 64px;
    width: 663px;
    background-size: 100%;
    background-repeat: no-repeat;
}
.head {
  position: relative; /* 为绝对定位子元素建立基准 */
  display: flex;
  justify-content: space-between;
  width: 1920px; /* 根据实际场景调整 */
}
.icon-button {
    width: 56px;
    height: 56px;

    padding: 2px 8px 0 8px;
    background-color: transparent;
    border-width: 0;
    cursor: pointer;
}
#home-button {
    position: absolute;
    left: 80px;
    top: 2px;}
img {
    overflow-clip-margin: content-box;
    overflow: clip;
    width: 24px;
    aspect-ratio: auto 24 / 24;
    height: 24px;
    aspect-ratio: auto 24 / 24;
}
.button-text {
    color: #fff;
    display: flex;
    flex-direction: row;
    justify-content: center;
}
.nav-item, .nav-item:visited {
    height: 52px;
    font-family: YouSheBiaoTiHei;
    text-decoration: none;
    font-weight: 400;
    font-size: 28px;
    line-height: 52px;
    vertical-align: middle;
    align-items: center;
    letter-spacing: .03em;
    color: hsla(0, 0%, 100%, .8);
    font-style: italic;     /* 设置为斜体 */
    font-weight: bold;  
}
.nav-left, .nav-right{
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 0;
    gap: 28px;
    vertical-align: middle;
}
.nav-left {
    margin: 0;
    position: absolute;
    width: 392px;
    height: 52px;
    left: 140px;
    top: 8px;
}
ul {
    display: block;
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
    unicode-bidi: isolate;
}
/* 右侧div */
#login-button {
    position: absolute;
    width: 80px;
    height: 35px;
    right: 80px;
    top: 15px;
    background-color: #387fd8;
    color: #fff;
    border-width: 0;
    border-radius: 4px;
}
.nav-right {
    margin: 8px 0 0 100px;
}
.nav-left, .nav-right {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 0;
    gap: 28px;
    vertical-align: middle;
}

</style>
  