<template>
    <div class="layout-container">
        <div class="center">
            <div class="material-content">
                <div class="top-title">水产品状况简介</div>
                <div class="top-intro"> 江阴市地处太湖水网平原北侧，境内河流密布水网密集，素有“鱼米之乡”之美誉。江阴全市水产养殖面积53700亩，常规鱼类养殖面积占62.63%，特种水产养殖面积占37.37%。 </div>
                <div class="chart-header">
                    <div class="swiper swiper-left"> &lt; </div>
                    <div class="chart-title">2021全市水产品产量分布</div>
                    <div class="swiper swiper-right"> &gt; </div>
                </div>
                <div class="map-tool">
                    <div role="radiogroup" class="el-radio-group">
                        <label role="radio" aria-checked="true" tabindex="0" class="el-radio-button el-radio-button--small is-active">
                            <input type="radio" tabindex="-1" autocomplete="off" class="el-radio-button__orig-radio" value="Product">
                            <span class="el-radio-button__inner" style="background-color: rgb(102, 177, 255); border-color: rgb(102, 177, 255); box-shadow: rgb(102, 177, 255) -1px 0px 0px 0px;">产量<!----></span>
                        </label>
                        <label role="radio" tabindex="-1" class="el-radio-button el-radio-button--small">
                            <input type="radio" tabindex="-1" autocomplete="off" class="el-radio-button__orig-radio" value="Area">
                            <span class="el-radio-button__inner">面积<!----></span>
                        </label>
                    </div>
                </div>
                <div class="map-content">
                    <div id="chart" _echarts_instance_="ec_1743572962639" style="user-select: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); position: relative;">
                        <div style="position: relative; width: 1237px; height: 645px; padding: 0px; margin: 0px; border-width: 0px; cursor: default;">
                            <canvas data-zr-dom-id="zr_0" width="1237" height="645" style="position: absolute; left: 0px; top: 0px; width: 1237px; height: 645px; user-select: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); padding: 0px; margin: 0px; border-width: 0px;"></canvas>
                        </div>        
                        
                    </div>
                </div>
            </div>
        
        </div>
        <div class="left">
            <ul  role="menubar" class="el-menu-vertical-demo el-menu" style="background-color: transparent;">
                <div>
                    <li  role="menuitem" aria-haspopup="true" aria-expanded="true" class="el-submenu is-active is-opened">
                        <div class="el-submenu__title" style="padding-left: 20px; color: rgb(255, 255, 255); background-color: transparent;">
                            <div  class="title">
                                <svg aria-hidden="true" class="svg-icon" class-name="menu-icon mr10">
                                    <use xlink:href="#icon-material"></use>
                                </svg>
                                <span >物质供给类</span>
                            </div>
                            <i class="el-submenu__icon-arrow el-icon-arrow-down"></i>
                            <i class="el-submenu__icon-arrow el-icon-arrow-down"></i>
                        </div>
                        <ul role="menu" class="el-menu el-menu--inline" style="background-color: transparent;" data-old-padding-top data-old-padding-bottom data-old-overflow>
                            <li class="el-menu-item-group">
                                <div class="el-menu-item-group__title" style="padding-left: 40px;"></div>
                                <ul>
                                    <li  role="menuitem" tabindex="-1" class="el-menu-item" style="padding-left: 40px; color: rgb(255, 255, 255); background-color: transparent;"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <span >水产品</span>
                                    </li>
                                </ul>

                            </li>
                        </ul>
                    </li>
                </div>
                <div></div>
                <div></div>
            </ul>
        </div>
        <div class="right"></div>
    </div>
</template>
<script setup>

</script>
  
<style scoped>
.center {
    order: 2;
    flex: 1;
}
.material-content {
    display: flex;
    flex-direction: column;
    height: 100vh;
}
.top-title  {
    order: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    margin: 20px 5px 5px 5px;
    padding-left: 15px;
    height: 40px;
    font-size: 20px;
    background: hsla(0, 0%, 100%, .1);
    color: #fff;
    text-shadow: 0 2px 4px #4dd4ff;
}
.top-intro  {
    order: 2;
    color: hsla(0, 0%, 100%, .8);
    height: 8%;
    overflow: auto;
    overflow-x: hidden;
    font-size: 18px;
}
.chart-header  {
    margin-left: auto;
    margin-right: auto;
    order: 3;
    margin-top: 0;
    color: hsla(0, 0%, 100%, .8);
    font-size: 18px;
    font-size: 20px;
    display: flex;
    flex-direction: row;
    z-index: 1000;
}
.swiper-left  {
    order: 0;
    margin-right: 10px;
    margin-top: -4px;
}
.chart-title  {
    order: 1;
    height: 20px;
}
.swiper-right  {
    order: 2;
    margin-left: 10px;
    margin-top: -4px;
}
.swiper  {
    cursor: pointer;
    font-size: xx-large;
    display: flex;
    color: #fff;
    justify-content: center;
    align-items: center;
}
.map-tool  {
    order: 4;
}
.el-radio-group {
    font-size: 0;
}
.el-radio-button__inner, .el-radio-group {
    display: inline-block;
    line-height: 1;
    vertical-align: middle;
}
.el-radio-button {
    position: relative;
    display: inline-block;
    outline: 0;
}
.el-radio-button__orig-radio {
    opacity: 0;
    outline: 0;
    position: absolute;
    z-index: -1;
}
.el-radio-button:first-child .el-radio-button__inner {
    border-left: 1px solid #dcdfe6;
    border-radius: 4px 0 0 4px;
    box-shadow: none !important;
}
.el-radio-button--small .el-radio-button__inner {
    padding: 9px 15px;
    font-size: 12px;
    border-radius: 0;
}
.el-radio-button__inner {
    background: #fff;
    border: 1px solid #dcdfe6;
    font-weight: 500;
    border-left: 0;
    color: #606266;
    appearance: none;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    cursor: pointer;
    transition: all .3s cubic-bezier(.645,.045,.355,1);
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 0;
}
.map-content  {
    order: 5;
    flex: 1;
}
#chart  {
    height: calc(100vh - 300px);
}

.layout-container {
  display: flex;
  flex-direction: row;
  height: 100vh;
}
.left  {
    order: 1;
    width: 200px;
    height: calc(100% - 64px);
    margin: 0 auto;
}
.left  .el-menu {
    border: none;
    background: none;
}
.el-submenu {
    list-style: none;
    margin: 0;
    padding-left: 0;
}
.left  .el-submenu__title {
    outline: 0;
    background-color: rgba(0, 0, 0, .2) !important;
}
.el-submenu.is-active .el-submenu__title {
    border-bottom-color: #409eff;
}
  .el-submenu__title {
    outline: 0;
    font-family: PingFang SC;
    font-size: 16px;
    background-color: rgba(0, 0, 0, .2) !important;
}
.el-submenu__title {
    font-size: 14px;
    color: #303133;
    padding: 0 20px;
    cursor: pointer;
    transition: border-color .3s, background-color .3s, color .3s;
    box-sizing: border-box;
}
.el-radio-button__inner, .el-submenu__title {
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    position: relative;
    white-space: nowrap;
}
.el-menu-item, .el-submenu__title {
    height: 56px;
    line-height: 56px;
    list-style: none;
}
.el-submenu__title * {
    vertical-align: middle;
}
.svg-icon {
    width: 1.5em;
    height: 1.5em;
}
.el-submenu.is-opened>.el-submenu__title .el-submenu__icon-arrow {
    transform: rotate(180deg);
}
.el-submenu__title i {
    color: #909399;
}
.el-submenu__icon-arrow {
    position: absolute;
    top: 50%;
    right: 20px;
    margin-top: -7px;
    transition: transform .3s;
    font-size: 12px;
}
[class*=" el-icon-"], [class^=el-icon-] {
    font-family: element-icons !important;
    font-style: normal;
    font-weight: 400;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    vertical-align: baseline;
    display: inline-block;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
.el-menu-item-group__title {
    padding: 7px 0 7px 20px;
    line-height: normal;
    font-size: 12px;
    color: #909399;
}
.el-menu-item {
    font-family: PingFang SC;
    font-size: 16px;
}
.el-submenu .el-menu-item {
    height: 50px;
    line-height: 50px;
    padding: 0 45px;
    min-width: 200px;
}
.el-menu-item {
    color: #303133;
    transition: border-color .3s, background-color .3s, color .3s;
    box-sizing: border-box;
    white-space: nowrap;
}
</style>
