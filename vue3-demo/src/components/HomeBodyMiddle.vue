<!-- HomeBodyMiddle.vue -->
<template>
    <div class="middle-column">
        <div class="chart-card">
            <div class="chart-area">
                <div  class="chart-header">
                    <div class="swiper swiper-left" @click="changeYear(-1)">&lt;</div>
                    <div class="chart-title">{{ year }}全市调节服务类价值量分布</div>
                    <div class="swiper swiper-right" @click="changeYear(1)">&gt;</div>
                </div>
                <div id="chart2" _echarts_instance_="ec_1743599319454" style="user-select: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); position: relative;">
                    <div style="position: relative; width: 950px; height: 475px; padding: 0px; margin: 0px; border-width: 0px; cursor: default;">
                        <canvas data-zr-dom-id="zr_0" width="950" height="475" style="position: absolute; left: 0px; top: 0px; width: 950px; height: 475px; user-select: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); padding: 0px; margin: 0px; border-width: 0px;">

                        </canvas>
                    </div>
                </div>
            </div>
            <div class="swiper swiper-right" style="display: none;">></div>
        </div>
        <div class="card">
            <div  class="head">
                <span  class="head-icon">
                    <img  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD3SURBVHgB7ZZBDoIwEEWnRO8BR/AGcASP4A10r5HE4BpPBDeh3gDXmo5t3Bmh81viqm/DggnzGH6mECUSiUj4fj1TBIoiYd2wvfTEz50qak0gma+Ah0tJfkpS646HOicQr4B7uFAi/0iIaiEBUCLrkFxIBRAJ+924lkogAriEbry5QAUwCUE4QwRQidlwhgoESPwOZ4wAjjEPWlCgV8WpF9aOxKZSxbH9vrGiMJDm2q7pampNh0wAaM7ujNjMnRHoBOTN2dxs7d5XhkwAaM4HSXOHdALS5i5sWyAfIgFp89mwTbHQD4kL28u+eT3Sv7HbsKVEIhHBG9eigWviToOVAAAAAElFTkSuQmCC" width="16" height="16">
                </span>
                <span  class="title"> 行政区调节服务类价值量与功能量 </span>
                <div  class="head-bottom">
                    <div  class="head-bottom-left"></div>
                    <div  class="head-bottom-right"></div>
                </div>
            </div>
            <div id="chartMb" _echarts_instance_="ec_1742883265186" style="width: 100%; height: 350px; user-select: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); position: relative;">
                <div style="position: relative; width: 950px; height: 350px; padding: 0px; margin: 0px; border-width: 0px; cursor: default;">
                    <canvas data-zr-dom-id="zr_0" width="950" height="350" style="position: absolute; left: 0px; top: 0px; width: 950px; height: 350px; user-select: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); padding: 0px; margin: 0px; border-width: 0px;"></canvas>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, watch, ref } from 'vue'
import * as echarts from 'echarts'
import { useAttrs, onBeforeUnmount } from 'vue'

const props = defineProps({
  year: Number
})
const emit = defineEmits(['toggle-year'])
function toggleYear() {
  currentYear.value = currentYear.value === 2021 ? 2022 : 2021
  emit('toggle-year', currentYear.value)
}

let chartMap = null
let chartBar = null

const loadCharts = async (year) => {
  const [mapDom, barDom] = [
    document.getElementById('chart2'),
    document.getElementById('chartMb')
  ]
  if (echarts.getInstanceByDom(mapDom)) {
    echarts.getInstanceByDom(mapDom).dispose()
  }
  if (echarts.getInstanceByDom(barDom)) {
    echarts.getInstanceByDom(barDom).dispose()
  }
  chartMap = echarts.init(mapDom)
  chartBar = echarts.init(barDom)

  const geoJson = await fetch('/geo/map.geojson').then(res => res.json())
  echarts.registerMap('jiangyin', geoJson)

  const rawData = await fetch(`/api/districtFunctionValue/${year}`).then(res => res.json())

  const mapData = rawData.map(item => ({
    name: item.districtName,
    value: item.value ? parseFloat(item.value.toFixed(1)) : 0
  }))
  const districtNames = rawData.map(item => item.districtName)
  const valueList = rawData.map(item => item.value ? parseFloat(item.value.toFixed(1)) : 0)
  const functionList = rawData.map(item => item.function ? parseFloat(item.function.toFixed(1)) : 0)

  chartMap.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c} 亿元' },
    visualMap: {
      type: 'piecewise',
      pieces: [
        { min: 40, label: '40以上（亿元）', color: '#9c5571' },
        { min: 30, max: 40, label: '30 - 40', color: '#999999' },
        { min: 20, max: 30, label: '20 - 30', color: '#66c2a5' },
        { min: 10, max: 20, label: '10 - 20', color: '#5e9cd0' },
        { min: 1, max: 10, label: '1 - 10', color: '#31688e' }
      ],
      left: 20,
      bottom: 20,
      textStyle: { color: '#fff' }
    },
    series: [{
      name: '街道价值',
      type: 'map',
      map: 'jiangyin',
      roam: false,
      label: { show: true, color: '#fff', fontSize: 12 },
      itemStyle: { borderColor: '#333' },
      emphasis: { label: { show: true, color: '#fff', fontWeight: 'bold' } },
      data: mapData
    }]
  })

  chartBar.setOption({
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['价值量（亿元）', '功能量'],
      textStyle: { color: '#fff' }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: districtNames,
      axisLabel: { rotate: 40, color: '#fff' }
    },
    yAxis: [
  {
    type: 'value',
    name: '价值量（亿元）',
    position: 'left',
    axisLabel: { color: '#fff' },
    nameTextStyle: { color: '#fff' } // 轴标题颜色
  },
  {
    type: 'value',
    name: '功能量',
    position: 'right',
    axisLabel: { color: '#fff' },
    nameTextStyle: { color: '#fff' } // 轴标题颜色
  }
],
    series: [
      {
        name: '价值量（亿元）',
        type: 'bar',
        data: valueList,
        yAxisIndex: 0,
        itemStyle: { color: '#00c0ff' }
      },
      {
        name: '功能量',
        type: 'line',
        data: functionList,
        yAxisIndex: 1,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: { color: '#ffde00' },
        lineStyle: { color: '#ffde00' }
      }
    ]
  })
}

const changeYear = (delta) => {
  const newYear = props.year + delta
  if (newYear === 2021 || newYear === 2022) {
    emit('toggle-year', newYear)
  }
}

watch(() => props.year, (newVal) => {
  setTimeout(() => loadCharts(newVal), 0)
})

onMounted(() => {
  loadCharts(props.year)
})

onBeforeUnmount(() => {
  chartMap?.dispose()
  chartBar?.dispose()
})
</script>

<style scoped>
.middle-column  {
    order: 2;
    flex: 1;
    display: flex;
    flex-direction: column;
}
.chart-card  {
    order: 0;
    flex: 1;
    display: flex;
    flex-direction: row;
}
.card  {
    width: 100%;
    order: 2;
}
.swiper  {
    cursor: pointer;
    font-size: xx-large;
    display: flex;
    color: #fff;
    justify-content: center;
    align-items: center;
}
.swiper-left  {
    order: 0;
    margin-right: 10px;
    margin-top: -4px;
}
.chart-area  {
    order: 1;
    flex: 1;
    display: flex;
    flex-direction: column;
}
.swiper-right  {
    order: 2;
    margin-left: 10px;
    margin-top: -4px;
}
.chart-header  {
    margin-left: auto;
    margin-right: auto;
    order: 0;
    margin-top: 15px;
    color: #fff;
    font-size: 20px;
    display: flex;
    flex-direction: row;
    z-index: 1000;
}
.chart-title  {
    order: 2;
    flex: 1;
}
.head  {
    height: 40px;
    width: 100%;
    padding: 0;
    margin: 0;
    background: linear-gradient(180deg, transparent, rgba(0, 0, 0, .24));
}
.head-icon  {
    display: inline-block;
    height: 24px;
    width: 24px;
    padding: 12px 0 0 8px;
    margin: 0;
    vertical-align: middle;
}
img {
    overflow-clip-margin: content-box;
    overflow: clip;
}
.title  {
    font-family: YouSheBiaoTiHei;
    font-style: italic;     /* 设置为斜体 */
    font-weight: bold;  
    font-size: 24px;
    line-height: 20px;
    vertical-align: middle;
    align-items: center;
    letter-spacing: .03em;
    color: #fff;
    text-shadow: 0 0 4px #3aadff;
}
.head-bottom  {
    height: 4px;
}
.head-bottom-left  {
    height: 4px;
    width: 38px;
    padding: 0;
    margin: 0;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEwAAAAICAYAAABTXhlRAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMGSURBVHgBbVVLchQxDJXc3RNIKLYch9yGY4R7cAQuwI6bsIdFqqgik8y02+LJkm11J850bMv62M9PMlNoH77JfRL6qWPBj4kYf4I/7kptbn2B3orFjJUN3yqCMVN2WfvqWphn2JkO9BEoI24ubL58bau+sUal2qtcfWxVJmZfIJsSbRisCfJSIJ/xSbWr87qfRHnDeFFbHW8my97f4Ft9vOo+rpTv3tH2slCe/iHGR9oeV7rOETAEeehjNtR2YLUmO+gikISA6odl59jW6nf0Bn0cTLqmhrYLIWo92wW6vRQ2b9ijAGgGspJSvRae7Cp7/GlShC32TK/bssDltpfdrDjGTHzW7T3B9ET8eIGHH7iUpqTsQvc5gFJDs29WTNKgMhl33R1IhToAdlBynPiIk6+xA0MdNnEjCVEpmR6n4vNCXGTEglNR8Eqh3X1RA2QaovmA3jWMLwvJsw7A47s7k31asN3vvHXAlF18vH8FQdoZ7OYap7puY4CCq/olmlNnqPR/A80U48k+Ljl7AqOsNbBkZ8tuw1MApeOUXFcFDlTOvrhanp+qosVRhjFAuwXL6MnUfv+ii+/Z2AWP98SHm6EAFjlbhk4lWKOVeLqEQ3h+0UhrptGxazkA5QCdgl+cYSlG1VGyvuyLgyggW0Brso5Qu2QCG6sgu05j2FJ/dK3V0XalDNP+jJxUvOYzrL5y7oDBz4Nv9XW9GqewR6AExnR+DapoDUvDZgdyz2ChcVRXTvGqhgN2MN98gJShqSWz2ygmKTk4yjg9sNax5CR3GTnDsqfvaRnhlWGC7/ZWJySPN/TcYyq7cID7rs1er2JrG3ZAQpMOZGilm4XUpeD0wOSQos1szJsuJqXY3FPVwHQgqkxrmKqUbiOHeq7MrWuths0AV8l1PdS992QMm14A7ZeqYi7ry7hPJe63GWQNREfTHgNLO61zLSFHDQsPwhEcrmfyVogab0onZUTMOviVFEx622x/rfgreyTULH01Rca8la5ew8hSEkH4dKJ9A8P+/mlVzNp/3wSb9qiJrWEAAAAASUVORK5CYII=);
    background-size: contain;
    float: left;
}
.head-bottom-right  {
    height: 4px;
    padding: 0;
    margin: 0;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABnwAAAAGCAYAAADpEjBaAAAACXBIWXMAAAsTAAALEwEAmpwYAAADHklEQVR4nO3dQW4cRRjF8f+rdsQq4G3Y4CVHQUg5AYsECcgeibV9CyssEBuuwFm4gWGBlMjT4/GMux6L6pnuaTuKESSr95Osnq6urqpPXj5VtWwTERERERERERERERHxIUk6/H762i8kfgWwqRJroMf0FivBCujFeG96xMqmt+klVohVNX2htXeV/qSjX5vrz+Dt1Sutl2uw/RXwI7ABbhfXzXvaN8AWuBmf7a/zfr2k7XLep5d+SccvAgEVWr1uda4k1pjecC1YC1aGvpprQS+1+o/qFaubwqoT6/Udb8p/+/dEREREREREREREREQ83umlzwQX+/sxB9JDfSsYoLqlJACU1kaBrgMqomtt2ydYN9SrKzbLsWw/A74d53pwvgfavXhWZ+1l1t/js91ywNNLn6lwrqmvBPL0ssZRXUA2rgYLl1mK44oQHsb7HfBph1QZuGKTwCciIiIiIiIiIiIiIj6aWriw+GLR3PIPYWYhSxnDEJVD8ONSUQV8h4aBFgANaDeGPv2OFReq3Pcd8IzjEIfF/X7+Qzgzu+7b93911h9gI+nesWq1cIE4m8/R8pzpRQvvAyGNMVJpqxFlFnYZdRWdnMCTAd3eQv+m1ZvAJyIiIiIiIiIiIiIiPorTn/0S8ULHO2mkKVCBFvwIjUFHAbvlIEXtvcIUAlGmsQa45if1y3ltPwee/4ulPuZ7OPMwaCPpdtlhX+87B/AY8ghZx3MeJVbjsw6g4Du3+2GY6j357fc/8hGfiIiIiIiIiIiIiIj4X33z9ZdHx6OdXvqsmvNxf4zxFNTst8kUIRlVtx0wuG2HmcdDddwdAy0AcW3hh2C32vL3ch3jUW7fz5q0+P2u492Ohpn1W+YqO+B6+cK83nFHz/159iFPBUo7ug6DNO0AKhUNQip4MLjD5Q7ddWz7MtWbHT4REREREREREREREfHB1Y7zw9FmfjhkcR0Dnf3zWUrifVs59NUwe1ef8CevdO8bOsAPwOfzad6z1McEQHNvpaOlALOj3Mbj2jzfwTStZKqpfRXIKi3zOfQpGE9r7gbECcj8Na/3H1WzU9oJbeCSAAAAAElFTkSuQmCC);
    background-position: 100%;
    background-repeat: no-repeat;
    background-size: contain;
}
#chart2 {
    order: 1;
    flex: 1;
    margin-top: -25px;
}
</style>