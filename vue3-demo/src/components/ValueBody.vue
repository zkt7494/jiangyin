<!-- ValueBody.vue -->
<template>
    <div class="middle">
      <div class="chart-card">
        <div class="chart-area">
          <div class="chart-header">
            <div class="swiper swiper-left" @click="toggleYear">&lt;</div>
            <div class="chart-title">{{ chartTitle }}</div>
            <div class="swiper swiper-right" @click="toggleYear">&gt;</div>
          </div>
          <div id="chart2">
            <!-- echart-->
          </div>
          <div class="band-area">
            <div class="band">
              <span class="sumtwo">{{ sumValue }}</span>
              <span class="sumthree">亿元</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
<script setup>
import * as echarts from 'echarts'
import { onMounted,ref, computed, watch, defineProps } from 'vue'

const props = defineProps({
  activeIndex: String
})
onMounted(() => {
  loadCharts()
})
// 年份控制
const year = ref(2021)

// 切换年份
const toggleYear = () => {
  if (['0', '1'].includes(props.activeIndex)) {
    year.value = year.value === 2021 ? 2022 : 2021
  }
}

// 计算 chartTitle 和 sumValue
const chartTitle = computed(() => {
  if (props.activeIndex === '0') {
    return `${year.value}全市各类生态产品价值总量`
  } else if (props.activeIndex === '1') {
    return `${year.value}全市物质供给类价值总量`
  } else if (props.activeIndex === '2') {
    return `全市文化服务类价值总量`
  }
  return ''
})

const sumValue = computed(() => {
  if (props.activeIndex === '0') {
    return year.value === 2021 ? '619.4' : '489'
  } else if (props.activeIndex === '1') {
    return year.value === 2021 ? '62.5' : '60.4'
  } else if (props.activeIndex === '2') {
    return '66.4'
  }
  return ''
})

// 每次点击菜单时重置为 2021
watch(() => props.activeIndex, () => {
  year.value = 2021
})

const loadCharts = async () => {
  const mapDom = document.getElementById('chart2')
  if (!mapDom) return

  if (echarts.getInstanceByDom(mapDom)) {
    echarts.getInstanceByDom(mapDom).dispose()
  }

  const chartMap = echarts.init(mapDom)

  const geoJson = await fetch('/geo/map.geojson').then(res => res.json())
  echarts.registerMap('jiangyin', geoJson)

  chartMap.setOption({
    tooltip: { show: false }, 
    visualMap: { show: false }, // 隐藏图例
    series: [
      {
        type: 'map',
        map: 'jiangyin',
        roam: false,
        data: [],
        label: {
          show: true,
          color: '#fff',
          fontSize: 12
        },
        itemStyle: {
          borderColor: '#5e9cd0',
          areaColor: '#31688e' // 统一填色
        },
        emphasis: {
          label: {
            show: true,
            color: '#fff',
            fontWeight: 'bold'
          },
          itemStyle: {
            areaColor: '#2ea9e0' // 鼠标 hover 颜色
          }
        }
      }
    ]
  })
}

</script>
<style scoped>
.middle{
    order: 2;
    flex: 1;
    display: flex;
    flex-direction: column;
}
.chart-card{
    order: 0;
    flex: 1;
    display: flex;
    flex-direction: row;
}
.chart-area{
    order: 1;
    flex: 1;
    display: flex;
    flex-direction: column;
}
.chart-header{
    margin-left: auto;
    margin-right: auto;
    order: 0;
    margin-top: 3em;
    color: #fff;
    font-size: 20px;
    display: flex;
    flex-direction: row;
    z-index: 1000;
}
.swiper-left{
    order: 0;
    margin-right: 10px;
}

.swiper{
    cursor: pointer;
    font-size: xx-large;
    display: flex;
    color: #fff;
    justify-content: center;
    align-items: center;
}
.chart-title{
    order: 2;
    flex: 1;
    font-family: YouSheBiaoTiHei;
    font-size: 1.5em;
}
.swiper-right{
    order: 2;
    margin-left: 10px;
}
.swiper{
    cursor: pointer;
    font-size: xx-large;
    display: flex;
    color: #fff;
    justify-content: center;
    align-items: center;
}
#chart2{
    order: 1;
    flex: 1;
    margin-top: -25px;
}
.band-area .band{
    display: flex;
    justify-content: center;
    align-items: center;
}

.band-area {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;                /* ✅ 添加 */
  justify-content: center;     /* ✅ 水平居中 */
  align-items: center;         /* ✅ 垂直居中 */
  z-index: 99;
  pointer-events: none;        /* 如果你只是展示数字不想拦截事件 */
}

.band {
  height: 300px;
  width: 100%;
  font-size: xx-large;
  color: #fff;
  background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.4) 50%, transparent);
  display: flex;                /* ✅ 保证内部文字水平居中 */
  justify-content: center;
  align-items: center;
}
.band-area .band{
    display: flex;
    justify-content: center;
    align-items: center;
}
.sumtwo {
  font-family: 'YouSheBiaoTiHei';
  font-size: 180px;
  background-image: linear-gradient(to bottom, #fff, #c89000);
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
}
.sumthree {
    color: #fff;
    font-size: 105px;
    font-family: YouSheBiaoTiHei;
}
</style>