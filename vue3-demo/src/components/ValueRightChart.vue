<!-- ValueRightCharts.vue -->
<template>
    <div class="middle">
      <div class="map-container">
        <div id="map">
          <div class="map-tool" v-if="activeIndex !== '0-3'">
            <div role="radiogroup" class="el-radio-group">
              <label @click="handleFieldChange('V')"
                :class="['el-radio-button', activeField === 'V' && 'is-active']">
                <input type="radio" class="el-radio-button__orig-radio" />
                <span class="el-radio-button__inner">价值量</span>
              </label>

              <label @click="handleFieldChange('F')"
                :class="['el-radio-button', activeField === 'F' && 'is-active']">
                <input type="radio" class="el-radio-button__orig-radio" />
                <span class="el-radio-button__inner">功能量</span>
              </label>
            </div>
          </div>
          <div id="legend" class="map-legend"></div>
          <!-- 选择图层菜单浮动在地图左上角 -->
          <div class="map-layer-menu">
            <el-menu
              class="el-menu-vertical-demo"
              :default-active="activeIndex"
              background-color="transparent"
              text-color="#fff"
              active-text-color="#409eff"
              :default-openeds="['0']"
              unique-opened
              @select="handleSelect"
            >
              <el-sub-menu index="0">
                <template #title>
                  <div class="title">
                    <img src="/icons/layers.svg" alt="图层" class="menu-icon" />
                    <span class="menu-title-text">&nbsp选择图层</span>
                  </div>
                </template>
                <el-menu-item index="0-0">
                  <el-checkbox v-model="checkboxValues['基础图层']['标注']">标注</el-checkbox>
                </el-menu-item>
                <el-menu-item index="0-1">
                  <el-checkbox v-model="checkboxValues['基础图层']['三区三线']">三区三线</el-checkbox>
                </el-menu-item>
                <el-menu-item index="0-2">
                  <el-checkbox v-model="checkboxValues['基础图层']['遥感影像']">遥感影像</el-checkbox>
                </el-menu-item>
                <el-menu-item index="0-3">
                  <el-checkbox v-model="checkboxValues['基础图层']['价值量/功能量']">价值量/功能量</el-checkbox>
                </el-menu-item>
              </el-sub-menu>
            </el-menu>
          </div>
        </div>
      </div>
    </div>
    <div  class="right">
        <div   class="card">
            <div   class="head">
                <span class="head-icon">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD3SURBVHgB7ZZBDoIwEEWnRO8BR/AGcASP4A10r5HE4BpPBDeh3gDXmo5t3Bmh81viqm/DggnzGH6mECUSiUj4fj1TBIoiYd2wvfTEz50qak0gma+Ah0tJfkpS646HOicQr4B7uFAi/0iIaiEBUCLrkFxIBRAJ+924lkogAriEbry5QAUwCUE4QwRQidlwhgoESPwOZ4wAjjEPWlCgV8WpF9aOxKZSxbH9vrGiMJDm2q7pampNh0wAaM7ujNjMnRHoBOTN2dxs7d5XhkwAaM4HSXOHdALS5i5sWyAfIgFp89mwTbHQD4kL28u+eT3Sv7HbsKVEIhHBG9eigWviToOVAAAAAElFTkSuQmCC" width="16" height="16">
                </span>
                <span   class="righttitle"> 各行政区价值量和功能量统计 </span>
                <div class="head-bottom">
                    <div class="head-bottom-left"></div>
                    <div class="head-bottom-right"></div>
                </div>
            </div>
            <div   id="chartMb" _echarts_instance_="ec_1743572962681" style="width: 100%; height: 100%; user-select: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); position: relative;">
                <div style="position: relative; width: 472px; height: 881px; padding: 0px; margin: 0px; border-width: 0px; cursor: default;">
                    <canvas data-zr-dom-id="zr_0" width="472" height="881" style="position: absolute; left: 0px; top: 0px; width: 472px; height: 881px; user-select: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); padding: 0px; margin: 0px; border-width: 0px;">

                    </canvas>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, watch, defineProps } from 'vue'
import * as echarts from 'echarts'
import 'ol/ol.css'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import TileArcGISRest from 'ol/source/TileArcGISRest'
import { fromLonLat } from 'ol/proj'

const props = defineProps({
  activeIndex: String
})

let map
let chart = null

const checkboxValues = ref({
  '基础图层': {
    '标注': false,
    '三区三线': false,
    '遥感影像': false,
    '价值量/功能量': false
  }
})

const baseLayers = {}
const activeField = ref('V')

const baseLayerMap = {
  '标注': 'http://gohhu.com:6080/arcgis/rest/services/注记/MapServer',
  '三区三线': 'http://gohhu.com:6080/arcgis/rest/services/三区三线/MapServer',
  '遥感影像': 'http://gohhu.com:6080/arcgis/rest/services/遥感影像/MapServer',
  '价值量/功能量': () => layerUrlMap[props.activeIndex]?.[activeField.value]
}

const layerUrlMap = {
  '3-0': { V: 'http://gohhu.com:6080/arcgis/rest/services/水源涵养价值量/MapServer', F: 'http://gohhu.com:6080/arcgis/rest/services/水源涵养功能量/MapServer' },
  '3-1': { V: 'http://gohhu.com:6080/arcgis/rest/services/土壤保持价值量/MapServer', F: 'http://gohhu.com:6080/arcgis/rest/services/土壤保持功能量/MapServer' },
  '3-2': { V: 'http://gohhu.com:6080/arcgis/rest/services/防风固沙价值量/MapServer', F: 'http://gohhu.com:6080/arcgis/rest/services/防风固沙功能量/MapServer' },
  '3-3': { V: 'http://gohhu.com:6080/arcgis/rest/services/洪水调蓄价值量/MapServer', F: 'http://gohhu.com:6080/arcgis/rest/services/洪水调蓄功能量/MapServer' },
  '3-4': { V: 'http://gohhu.com:6080/arcgis/rest/services/空气净化价值量/MapServer', F: 'http://gohhu.com:6080/arcgis/rest/services/空气净化功能量/MapServer' },
  '3-5': { V: 'http://gohhu.com:6080/arcgis/rest/services/水质净化价值量/MapServer', F: 'http://gohhu.com:6080/arcgis/rest/services/水质净化功能量/MapServer' },
  '3-6': { V: 'http://gohhu.com:6080/arcgis/rest/services/碳固定价值量/MapServer', F: 'http://gohhu.com:6080/arcgis/rest/services/碳固定功能量/MapServer' },
  '3-7': { V: 'http://gohhu.com:6080/arcgis/rest/services/氧气提供价值量/MapServer', F: 'http://gohhu.com:6080/arcgis/rest/services/氧气提供功能量/MapServer' },
  '3-8': { V: 'http://gohhu.com:6080/arcgis/rest/services/气候调节价值量/MapServer', F: 'http://gohhu.com:6080/arcgis/rest/services/气候调节功能量/MapServer' },
  '3-9': { V: 'http://gohhu.com:6080/arcgis/rest/services/噪声消减价值量/MapServer', F: '' }
}

const clearLegend = () => {
  const legendDiv = document.getElementById('legend')
  if (legendDiv) legendDiv.innerHTML = ''
}

const loadLegend = async (serviceUrl) => {
  const legendDiv = document.getElementById('legend')
  if (!legendDiv || !serviceUrl) return
  try {
    const res = await fetch(`${serviceUrl}/legend?f=json`)
    const json = await res.json()
    json.layers.forEach(layer => {
      const title = document.createElement('div')
      title.style.fontWeight = 'bold'
      title.style.margin = '6px 0'
      title.textContent = layer.layerName
      legendDiv.appendChild(title)
      layer.legend.forEach(item => {
        const row = document.createElement('div')
        row.style.display = 'flex'
        row.style.alignItems = 'center'
        row.style.marginBottom = '4px'
        const img = document.createElement('img')
        img.src = `data:${item.contentType};base64,${item.imageData}`
        img.style.width = '20px'
        img.style.height = '20px'
        img.style.marginRight = '6px'
        const label = document.createElement('span')
        label.textContent = item.label || ''
        row.appendChild(img)
        row.appendChild(label)
        legendDiv.appendChild(row)
      })
    })
  } catch (err) {
    console.error('图例加载失败:', err)
  }
}

const handleFieldChange = (field) => {
  // 如果字段未变，就不做任何处理，避免重复加载
  if (field === activeField.value) return;

  activeField.value = field
  if (checkboxValues.value['基础图层']['价值量/功能量']) {
    const url = baseLayerMap['价值量/功能量']()
    if (baseLayers['价值量/功能量']) {
      map.removeLayer(baseLayers['价值量/功能量'])
    }
    const layer = new TileLayer({ source: new TileArcGISRest({ url }) })
    map.addLayer(layer)
    baseLayers['价值量/功能量'] = layer

    clearLegend()
    loadLegend(url)
  }
}


const switchLayer = (index, type) => {
  const url = layerUrlMap[index]?.[type]
  if (!url) return
  if (baseLayers['价值量/功能量']) {
    map.removeLayer(baseLayers['价值量/功能量'])
  }
  const newLayer = new TileLayer({ source: new TileArcGISRest({ url }) })
  map.addLayer(newLayer)
  baseLayers['价值量/功能量'] = newLayer
  clearLegend()
  loadLegend(url)
}

const funcUnitMap = {
  '3-0': 'm³/a', '3-1': 't/a', '3-2': 't/a', '3-3': 'm³/a', '3-4': 'kg/a',
  '3-5': 'kg/a', '3-6': 'tCO₂/a', '3-7': 'tO₂/a', '3-8': 'MJ/a', '3-9': '-'
}

const chartFieldMap = {
  '3-0': { api: '/api/Water', value: 'waterV', function: 'waterF' },
  '3-1': { api: '/api/Soil', value: 'soilV', function: 'soilF' },
  '3-2': { api: '/api/WindSand', value: 'windSandV', function: 'windSandF' },
  '3-3': { api: '/api/Flood', value: 'floodV', function: 'floodF' },
  '3-4': { api: '/api/Air', value: 'airV', function: 'airF' },
  '3-5': { api: '/api/WaterQuality', value: 'waterQV', function: 'waterQF' },
  '3-6': { api: '/api/Co2', value: 'co2V', function: 'co2F' },
  '3-7': { api: '/api/O2', value: 'o2V', function: 'o2F' },
  '3-8': { api: '/api/Climate', value: 'cliV', function: 'cliF' },
  '3-9': { api: '/api/Noise', value: 'noiseV', function: 'noiseF' }
}

const loadChart = async (url, valueField, functionField) => {
  const dom = document.getElementById('chartMb')
  if (!dom || !url || !valueField || !functionField) return
  if (!chart) {
    chart = echarts.init(dom)
  } else {
    chart.clear()
  }
  try {
    const res = await fetch(url)
    const data = await res.json()
    if (!Array.isArray(data)) return
    const transformed = data.map(i => ({
      name: i.districtName || i.name || '未知',
      value: Number((+(i[valueField] || 0)).toFixed(2)),
      func: Number((+(i[functionField] || 0)).toFixed(2))
    }))
    const sorted = transformed.sort((a, b) => b.value - a.value)
    const names = sorted.map(i => i.name)
    const values = sorted.map(i => i.value)
    const funcs = sorted.map(i => i.func)
    const funcUnit = funcUnitMap[props.activeIndex] || '-'
    chart.setOption({
      backgroundColor: 'rgba(2, 16, 50, 0.4)',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: params => {
          const name = params[0].name
          const lines = params.map(p => {
            const isFunc = p.seriesName.includes('功能')
            const unit = isFunc ? funcUnit : '万元'
            return `${p.marker} ${p.seriesName}: ${p.value} ${unit}`
          })
          return `${name}<br/>${lines.join('<br/>')}`
        },
        backgroundColor: 'rgba(9,40,84,0.8)',
        borderColor: 'rgba(9,40,84,0.8)',
        textStyle: { fontSize: 14, color: '#fff' }
      },
      legend: {
        data: ['价值量', '功能量'],
        textStyle: { color: '#fff' },
        top: 5
      },
      grid: {
        left: '3%', right: '12%', top: 0, bottom: '5%', containLabel: true
      },
      xAxis: [{ type: 'value', show: false }, { type: 'value', show: false }],
      yAxis: {
        type: 'category', data: names, inverse: true,
        axisLabel: { color: '#fff', fontSize: 14, margin: 1 },
        axisLine: { show: true, lineStyle: { color: 'rgba(180, 228, 255, 0.3)', width: 1 } },
        axisTick: { show: false }, splitLine: { show: false }
      },
      series: [
        {
          name: '价值量', type: 'bar', xAxisIndex: 0, data: values,
          barWidth: 8, showBackground: true,
          backgroundStyle: { color: 'rgba(180, 180, 180, 0.3)' },
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: 'rgba(24, 144, 255, 0.35)' },
              { offset: 1, color: '#1890FF' }
            ])
          }, z: 3
        },
        {
          name: '功能量', type: 'bar', xAxisIndex: 1, data: funcs,
          barWidth: 8, showBackground: true,
          backgroundStyle: { color: 'rgba(180, 180, 180, 0.3)' },
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: 'rgba(251, 176, 59, 0.35)' },
              { offset: 1, color: '#fbb03b' }
            ])
          }, z: 2
        },
        {
          name: 'label', type: 'bar', barWidth: 1,
          data: values.map((_, i) => ({
            value: Math.max(values[i], funcs[i]),
            valueLabel: values[i], funcLabel: funcs[i]
          })),
          itemStyle: { color: 'transparent' },
          label: {
            show: true, position: 'right', color: '#fff', fontSize: 12, lineHeight: 16,
            formatter: p => `${p.data.valueLabel.toFixed(2)} 万元\n${funcUnit !== '-' ? `${p.data.funcLabel.toFixed(2)} ${funcUnit}` : ''}`
          }, tooltip: { show: false }, z: 10
        }
      ]
    })
  } catch (err) {
    console.error('图表加载失败:', err)
  }
}
let legendLoadedOnce = false
onMounted(() => {
  map = new Map({
    target: 'map',
    layers: [],
    view: new View({ center: fromLonLat([120.285246, 31.866448]), zoom: 11, projection: 'EPSG:3857' })
  })

  const loadLayer = () => {
    const url = 'http://gohhu.com:6080/arcgis/rest/services/行政边界/MapServer'
    const layer = new TileLayer({ source: new TileArcGISRest({ url }) })
    map.addLayer(layer)
  }
  loadLayer()

  if (props.activeIndex && layerUrlMap[props.activeIndex]) {
    activeField.value = 'V'
    switchLayer(props.activeIndex, 'V')
    
    legendLoadedOnce = true //  首次标记
    checkboxValues.value['基础图层']['价值量/功能量'] = true

    const { api, value, function: func } = chartFieldMap[props.activeIndex] || {}
    if (api) loadChart(api, value, func)
  }

  watch(() => checkboxValues.value['基础图层'], async (newVal) => {
    clearLegend()

    for (const [name, checked] of Object.entries(newVal)) {
      const url = typeof baseLayerMap[name] === 'function' ? baseLayerMap[name]() : baseLayerMap[name]
      if (checked) {
        if (!baseLayers[name]) {
          const layer = new TileLayer({ source: new TileArcGISRest({ url }) })
          map.addLayer(layer)
          baseLayers[name] = layer
        }

        // ✅ 避免首次重复加载
        if (url && !(legendLoadedOnce && name === '价值量/功能量')) {
          await loadLegend(url)
        }
      } else {
        if (baseLayers[name]) {
          map.removeLayer(baseLayers[name])
          delete baseLayers[name]
        }
      }
    }

    //  一旦第一次执行过，重置标志位
    legendLoadedOnce = false
  }, { deep: true, immediate: true })
})

watch(() => props.activeIndex, async (newIndex) => {
  if (newIndex && layerUrlMap[newIndex]) {
    activeField.value = 'V'
    if (checkboxValues.value['基础图层']['价值量/功能量']) {
      switchLayer(newIndex, 'V')
    }
    const { api, value, function: func } = chartFieldMap[newIndex] || {}
    if (api) await loadChart(api, value, func)
  }
}, { immediate: true })
</script>
<style scoped>
.middle {
    order: 2;
    flex: 1;
    display: flex;
    flex-direction: column;
}
.map-container {
    order: 1;
    flex: 1;
}
#map {
    width: 100%;
    height: 100%;
    background-color: #fff;
    position: relative; 
}
.right {
    order: 3;
    width: 483px;
    height: 100%;
}
.card {
    width: 472px;
    height: 100%;
}
.head {
    height: 40px;
    width: 100%;
    padding: 0;
    margin: 0;
    background: linear-gradient(180deg, transparent, rgba(0, 0, 0, .24));
}
.head-icon {
    display: inline-block;
    height: 24px;
    width: 24px;
    padding: 12px 0 0 8px;
    margin: 0;
    vertical-align: middle;
}
.righttitle{
    font-family: YouSheBiaoTiHei;
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 20px;
    vertical-align: middle;
    align-items: center;
    letter-spacing: .03em;
    color: #fff;
    text-shadow: 0 0 4px #3aadff;
}
.head-bottom {
    height: 4px;
}
.head-bottom-left {
    height: 4px;
    width: 38px;
    padding: 0;
    margin: 0;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEwAAAAICAYAAABTXhlRAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMGSURBVHgBbVVLchQxDJXc3RNIKLYch9yGY4R7cAQuwI6bsIdFqqgik8y02+LJkm11J850bMv62M9PMlNoH77JfRL6qWPBj4kYf4I/7kptbn2B3orFjJUN3yqCMVN2WfvqWphn2JkO9BEoI24ubL58bau+sUal2qtcfWxVJmZfIJsSbRisCfJSIJ/xSbWr87qfRHnDeFFbHW8my97f4Ft9vOo+rpTv3tH2slCe/iHGR9oeV7rOETAEeehjNtR2YLUmO+gikISA6odl59jW6nf0Bn0cTLqmhrYLIWo92wW6vRQ2b9ijAGgGspJSvRae7Cp7/GlShC32TK/bssDltpfdrDjGTHzW7T3B9ET8eIGHH7iUpqTsQvc5gFJDs29WTNKgMhl33R1IhToAdlBynPiIk6+xA0MdNnEjCVEpmR6n4vNCXGTEglNR8Eqh3X1RA2QaovmA3jWMLwvJsw7A47s7k31asN3vvHXAlF18vH8FQdoZ7OYap7puY4CCq/olmlNnqPR/A80U48k+Ljl7AqOsNbBkZ8tuw1MApeOUXFcFDlTOvrhanp+qosVRhjFAuwXL6MnUfv+ii+/Z2AWP98SHm6EAFjlbhk4lWKOVeLqEQ3h+0UhrptGxazkA5QCdgl+cYSlG1VGyvuyLgyggW0Brso5Qu2QCG6sgu05j2FJ/dK3V0XalDNP+jJxUvOYzrL5y7oDBz4Nv9XW9GqewR6AExnR+DapoDUvDZgdyz2ChcVRXTvGqhgN2MN98gJShqSWz2ygmKTk4yjg9sNax5CR3GTnDsqfvaRnhlWGC7/ZWJySPN/TcYyq7cID7rs1er2JrG3ZAQpMOZGilm4XUpeD0wOSQos1szJsuJqXY3FPVwHQgqkxrmKqUbiOHeq7MrWuths0AV8l1PdS992QMm14A7ZeqYi7ry7hPJe63GWQNREfTHgNLO61zLSFHDQsPwhEcrmfyVogab0onZUTMOviVFEx622x/rfgreyTULH01Rca8la5ew8hSEkH4dKJ9A8P+/mlVzNp/3wSb9qiJrWEAAAAASUVORK5CYII=);
    background-size: contain;
    float: left;
}
.head-bottom-right {
    height: 4px;
    padding: 0;
    margin: 0;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABnwAAAAGCAYAAADpEjBaAAAACXBIWXMAAAsTAAALEwEAmpwYAAADHklEQVR4nO3dQW4cRRjF8f+rdsQq4G3Y4CVHQUg5AYsECcgeibV9CyssEBuuwFm4gWGBlMjT4/GMux6L6pnuaTuKESSr95Osnq6urqpPXj5VtWwTERERERERERERERHxIUk6/H762i8kfgWwqRJroMf0FivBCujFeG96xMqmt+klVohVNX2htXeV/qSjX5vrz+Dt1Sutl2uw/RXwI7ABbhfXzXvaN8AWuBmf7a/zfr2k7XLep5d+SccvAgEVWr1uda4k1pjecC1YC1aGvpprQS+1+o/qFaubwqoT6/Udb8p/+/dEREREREREREREREQ83umlzwQX+/sxB9JDfSsYoLqlJACU1kaBrgMqomtt2ydYN9SrKzbLsWw/A74d53pwvgfavXhWZ+1l1t/js91ywNNLn6lwrqmvBPL0ssZRXUA2rgYLl1mK44oQHsb7HfBph1QZuGKTwCciIiIiIiIiIiIiIj6aWriw+GLR3PIPYWYhSxnDEJVD8ONSUQV8h4aBFgANaDeGPv2OFReq3Pcd8IzjEIfF/X7+Qzgzu+7b93911h9gI+nesWq1cIE4m8/R8pzpRQvvAyGNMVJpqxFlFnYZdRWdnMCTAd3eQv+m1ZvAJyIiIiIiIiIiIiIiPorTn/0S8ULHO2mkKVCBFvwIjUFHAbvlIEXtvcIUAlGmsQa45if1y3ltPwee/4ulPuZ7OPMwaCPpdtlhX+87B/AY8ghZx3MeJVbjsw6g4Du3+2GY6j357fc/8hGfiIiIiIiIiIiIiIj4X33z9ZdHx6OdXvqsmvNxf4zxFNTst8kUIRlVtx0wuG2HmcdDddwdAy0AcW3hh2C32vL3ch3jUW7fz5q0+P2u492Ohpn1W+YqO+B6+cK83nFHz/159iFPBUo7ug6DNO0AKhUNQip4MLjD5Q7ddWz7MtWbHT4REREREREREREREfHB1Y7zw9FmfjhkcR0Dnf3zWUrifVs59NUwe1ef8CevdO8bOsAPwOfzad6z1McEQHNvpaOlALOj3Mbj2jzfwTStZKqpfRXIKi3zOfQpGE9r7gbECcj8Na/3H1WzU9oJbeCSAAAAAElFTkSuQmCC);
    background-position: 100%;
    background-repeat: no-repeat;
    background-size: contain;
}
#chartMb {
  height: 400px; /* 或其他你想要的高度 */
}
.map-tool  {
    order: 4;
  position: absolute;
  right: 40px;
  top: 40px;
  border-radius: 6px;
  box-shadow: 0 0 8px rgba(0,0,0,0.2);
  z-index: 1000;
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
.el-radio-button.is-active .el-radio-button__inner {
  background-color: rgb(102, 177, 255);
  border-color: rgb(102, 177, 255);
  color: #fff;
}
.map-legend {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 10px 12px;
  border-radius: 6px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  font-size: 13px;
  color: #000;
  z-index: 1000;
  max-width: 260px;
}
.map-layer-menu {
  position: absolute;
  top: 100px;
  right: 40px;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.93); /* 深蓝背景 */
  border-radius: 6px;
  width: 166px;
  height: auto;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}
.menu-icon {
  width: 18px;
  height: 18px;
  margin-right: 4px;
  vertical-align: middle;
}
.title{
  font-size: 16px;
    color: #2e2e2e;
}
.el-menu-item {
  padding: 4px 12px !important;
  line-height: 20px !important;
  height: auto !important;
}

/* 调整 checkbox 的字体大小和行高 */
.el-checkbox {
  font-size: 13px;
  line-height: 18px;
  margin: 2px 0;
}

/* 调整图层菜单整体内边距 */
.el-sub-menu .el-menu {
  padding: 0;
}
</style>