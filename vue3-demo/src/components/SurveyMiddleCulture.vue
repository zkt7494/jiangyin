<!-- SurveyMiddleCulture.vue -->
<template>
    <div class="center">
        <div class="material-content">     
            <div class="top-title">文化概况</div>
            <div class="top-intro">
                景区：江阴市旅游资源丰富，拥有国家A级景区7个，全国乡村旅游重点村1个，无锡市美丽乡村休闲旅游示范村4个。2020年，全年共接待国内游客857.75万人次，旅游总收入142.73亿元，占GDP比重达3.46%。<br>
                文物：江阴市历史悠久，是吴文化发祥地之一。获批不可移动文物107处，其中，国家级20处，省级8处，市、县级81处。分类型看，有祁头山、高城墩等古墓葬和古遗址19处；有兴国寺塔、徐霞客故居、古炮台等古代和近现代建筑共79处；有王羲之换鹅碑心经碑等古碑刻8处。
            </div>
            <div class="map-content">
                <div id="chart" _echarts_instance_="ec_1743572962639" style="user-select: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); position: relative;">
                    <div style="position: relative; width: 1140px; height: 695px; padding: 0px; margin: 0px; border-width: 0px; cursor: default;">
                        <canvas data-zr-dom-id="zr_0" width="1140" height="695" style="position: absolute; left: 0px; top: 0px; width: 1140px; height: 695px; user-select: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); padding: 0px; margin: 0px; border-width: 0px;">
                        </canvas>
                    </div>
                </div>
            </div>  
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const cultureData = ref({
  villages: [],
  spots: [],
  nationalRelicses: [],
  provincialRelicses: [],
  places: []
})

const chart = ref(null)

const typeMap = {
  villages: { icon: '/culture/1.png', label: '示范村' },
  spots: { icon: '/culture/2.png', label: 'A级景区' },
  relics: { icon: '/culture/3.png', label: '文物' },
  places: { icon: '/culture/4.png', label: '场馆' }
}

// 获取接口数据
const fetchData = async () => {
  const res = await fetch('/culture.json')
  const json = await res.json()

  cultureData.value.villages = json.villages || []
  cultureData.value.spots = json.spots || []
  cultureData.value.nationalRelicses = json.nationalRelicses || []
  cultureData.value.provincialRelicses = json.provincialRelicses || []
  cultureData.value.places = json.places || []

  renderMap()
}

const renderMap = async () => {
  const mapContainer = document.getElementById('chart')
  if (!mapContainer) return

  const geoJson = await fetch('/geo/map.geojson').then(res => res.json())
  echarts.registerMap('jiangyin', geoJson)

  if (!chart.value) {
    chart.value = echarts.init(mapContainer)
  } else {
    chart.value.clear()
  }

  const relics = [...cultureData.value.nationalRelicses, ...cultureData.value.provincialRelicses]

  const allData = [
    { list: cultureData.value.villages, icon: typeMap.villages.icon },
    { list: cultureData.value.spots, icon: typeMap.spots.icon },
    { list: relics, icon: typeMap.relics.icon },
    { list: cultureData.value.places, icon: typeMap.places.icon }
  ]

  const series = allData.map(({ list, icon }) => ({
    type: 'scatter',
    coordinateSystem: 'geo',
    symbolSize: 24,
    symbol: `image://${icon}`,
    data: list
      .filter(item => item.x && item.y)
      .map(item => ({
        name: item.name,
        value: [parseFloat(item.x), parseFloat(item.y)],
        description: item.description,
        pictures: item.picture || '',
        address: item.address || ''
      }))
  }))

  chart.value.setOption({
    geo: {
      map: 'jiangyin',
      roam: true,
      label: {
        show: true,
        color: '#fff',
        fontSize: 12
      },
      itemStyle: {
        areaColor: '#1f81c7',
        borderColor: '#0af'
      },
      emphasis: {
        itemStyle: {
          areaColor: '#74add1'
        }
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const [lng, lat] = params.value || []
        return `${params.name}<br/>经度: ${lng?.toFixed(4)}<br/>纬度: ${lat?.toFixed(4)}`
      }
    },
    series,
    legend: {
      orient: 'vertical',
      left: 'right',
      top: 'middle',
      data: allData.filter(item => item.label).map(item => item.label),
      textStyle: {
        color: '#fff',
        fontSize: 14
      },
      itemWidth: 20,
      itemHeight: 20,
      z: 10
    }
  })

  // 点击事件
  chart.value.on('click', (params) => {
    const pictures = params.data?.pictures?.split('|')?.map(p =>
      `http://gohhu.com:8000/static/culture/pictures/${p.trim()}`) || []

    // Dispatch a custom event with the spot data
    window.dispatchEvent(new CustomEvent('culture-spot-clicked', {
      detail: {
        title: params.name,
        description: params.data?.description || '',
        pictures
      }
    }))
  })
}

onMounted(fetchData)
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

</style>
     