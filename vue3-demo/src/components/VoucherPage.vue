<!-- VoucherPage.vue -->
<template>
  <div class="container">
    <div class="map-container">
      <div class="top-title">生态券核算需要上传基期和当期土地利用矢量图(shapefile格式)。</div>
      <div class="data">
        <div>基期利用数据:&nbsp;</div>
        <span>base.shp</span>&nbsp;&nbsp;
        <div>
          <button @click="triggerBaseUpload">上传</button>
          <input type="file" ref="baseInput" multiple style="display: none" @change="handleFileUpload('base', $event)" />
        </div> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <div>当前利用数据:&nbsp;</div>
        <span>current.shp</span>&nbsp;&nbsp;
        <div>
          <button @click="triggerCurrentUpload">上传</button>
          <input type="file" ref="currentInput" multiple style="display: none" @change="handleFileUpload('current', $event)" />
        </div> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button @click="quan" style="width: auto;padding-left: 15px;padding-right: 15px;">自动核算</button>
      </div>
      <div id="map">
        <div class="map-layer-menu">
          <el-menu background-color="transparent" text-color="#fff" active-text-color="#409eff">
            <el-sub-menu index="0">
              <template #title>
                <div class="title">
                  <img src="/icons/layers.svg" alt="图层" class="menu-icon" />
                  <span class="menu-title-text" style="color: black; font-size: 16px;">选择图层</span>
                </div>
              </template>
              <el-menu-item>
                <el-checkbox v-model="checkboxValues['标注']">标注</el-checkbox>
              </el-menu-item>
              <el-menu-item>
                <el-checkbox v-model="checkboxValues['三区三线']">三区三线</el-checkbox>
              </el-menu-item>
              <el-menu-item>
                <el-checkbox v-model="checkboxValues['遥感影像']">遥感影像</el-checkbox>
              </el-menu-item>
              <el-menu-item>
                <el-checkbox v-model="checkboxValues['地类分布']">地类分布</el-checkbox>
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </div>
        <div id="legend" class="map-legend"></div>
        <div id="dynamic-legend" class="dynamic-legend"></div>
        <div id="swipe-line" @mousedown="startDragging"><div class="swipe-handle"></div></div>
      </div>
    </div>
    <div class="right-option">
      <div>
        <div class="head">
          <span class="head-icon">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD3SURBVHgB7ZZBDoIwEEWnRO8BR/AGcASP4A10r5HE4BpPBDeh3gDXmo5t3Bmh81viqm/DggnzGH6mECUSiUj4fj1TBIoiYd2wvfTEz50qak0gma+Ah0tJfkpS646HOicQr4B7uFAi/0iIaiEBUCLrkFxIBRAJ+924lkogAriEbry5QAUwCUE4QwRQidlwhgoESPwOZ4wAjjEPWlCgV8WpF9aOxKZSxbH9vrGiMJDm2q7pampNh0wAaM7ujNjMnRHoBOTN2dxs7d5XhkwAaM4HSXOHdALS5i5sWyAfIgFp89mwTbHQD4kL28u+eT3Sv7HbsKVEIhHBG9eigWviToOVAAAAAElFTkSuQmCC"
              width="16" height="16"></span>
          <span class="headtitle"> 生态券核算结果 </span>
          <div class="head-bottom">
            <div class="head-bottom-left"></div>
            <div class="head-bottom-right"></div>
          </div>
        </div>
        <el-table :data="tableData" stripe>
          <el-table-column prop="name" label="土地类型" />
          <el-table-column prop="value" label="生态券(绿元)" />
        </el-table>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import { Style, Fill, Stroke } from 'ol/style'
import ImageLayer from 'ol/layer/Image'
import ImageArcGISRest from 'ol/source/ImageArcGISRest'
import proj4 from 'proj4'
import { register } from 'ol/proj/proj4'
import { get as getProjection } from 'ol/proj'
import { getRenderPixel } from 'ol/render'

// 注册 EPSG:4528 投影
proj4.defs('EPSG:4528', '+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=40500000 +y_0=0 +datum=CGCS2000 +units=m +no_defs')
register(proj4)
getProjection('EPSG:4528').setExtent([40500000, 3500000, 40600000, 3600000])

const map = ref(null)
let leftLayer = null
let rightLayer = null
const swipe = ref(50)

const landUseColors = {
  1: { label: '草地', color: '#7CFC00' },
  2: { label: '建设用地', color: '#FF0000' },
  3: { label: '林地', color: '#228B22' },
  4: { label: '陆地水域', color: '#1E90FF' }
}


const hexToRgba = (hex, alpha = 1) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const getFeatureStyle = (feature) => {
  const objectId = Math.floor(feature.get('OBJECTID'))  // 转为整数
  const landInfo = landUseColors[objectId] || { label: '其他', color: '#AAAAAA' }
  return new Style({
    fill: new Fill({ color: landInfo.color }),
    stroke: new Stroke({ color: '#000', width: 1 })
  })
}



const updateSwipeLine = () => {
  const swipeLine = document.getElementById('swipe-line')
  if (swipeLine) swipeLine.style.left = `${swipe.value}%`
}

const startDragging = () => {
  const onMouseMove = (e) => {
    const mapWidth = document.getElementById('map').clientWidth
    swipe.value = Math.min(100, Math.max(0, (e.clientX / mapWidth) * 100))
    updateSwipeLine()
    map.value.render()
  }
  const onMouseUp = () => {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}

const baseInput = ref(null)
const currentInput = ref(null)
const triggerBaseUpload = () => baseInput.value.click()
const triggerCurrentUpload = () => currentInput.value.click()

const parseGeoJSON = async (response) => {
  let data = await response.json()
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      console.error('GeoJSON 解析失败:', e)
      return null
    }
  }
  return data
}

const updateCurrentLegend = () => {
  const legendEl = document.getElementById('dynamic-legend')
  if (!legendEl) return
  legendEl.innerHTML = '<strong>用地类型图例：</strong><br/>'
  for (const [id, info] of Object.entries(landUseColors)) {
    const row = document.createElement('div')
    row.style.display = 'flex'
    row.style.alignItems = 'center'
    row.style.margin = '4px 0'

    const colorBox = document.createElement('div')
    colorBox.style.width = '14px'
    colorBox.style.height = '14px'
    colorBox.style.backgroundColor = info.color
    colorBox.style.border = '1px solid #333'
    colorBox.style.marginRight = '8px'

    const label = document.createElement('span')
    label.textContent = info.label

    row.appendChild(colorBox)
    row.appendChild(label)
    legendEl.appendChild(row)
  }
}


const reloadLayer = async (layerType) => {
  const res = await fetch(`/api/MapLayerUpload?fileName=${layerType}&layer=${layerType}`)
  const data = await parseGeoJSON(res)
  if (!data) return

  const features = new GeoJSON().readFeatures(data, {
    dataProjection: 'EPSG:4528',
    featureProjection: 'EPSG:4528'
  })

  let layer = layerType === 'base' ? leftLayer : rightLayer
  if (!layer) {
    layer = new VectorLayer({
      renderMode: 'image',
      source: new VectorSource({}),
      style: layerType === 'current' ? getFeatureStyle : new Style({
      fill: new Fill({ color: 'rgba(0,0,0,0)' }), // 完全透明填充
      stroke: new Stroke({ color: '#00FF00', width: 1.5 }) // 绿色边框
    }),
      zIndex: layerType === 'base' ? 99 : 100
    })
    map.value.addLayer(layer)
    if (layerType === 'base') leftLayer = layer
    if (layerType === 'current') rightLayer = layer

    if (layerType === 'current') {
      layer.on('prerender', (event) => {
        const ctx = event.context
        const size = map.value.getSize()
        if (!size) return
        const width = size[0] * (swipe.value / 100)
        const tl = getRenderPixel(event, [width, 0])
        const bl = getRenderPixel(event, [width, size[1]])
        const tr = getRenderPixel(event, [size[0], 0])
        const br = getRenderPixel(event, [size[0], size[1]])
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(tl[0], tl[1])
        ctx.lineTo(bl[0], bl[1])
        ctx.lineTo(br[0], br[1])
        ctx.lineTo(tr[0], tr[1])
        ctx.closePath()
        ctx.clip()
      })

      layer.on('postrender', (e) => {
        try {
          e.context.restore()
        } catch (err) {
          console.warn('restore failed', err)
        }
      })

      layer.getSource().on('change', () => {
        if (layer.getSource().getState() === 'ready') map.value.render()
      })
    }
  }

  layer.getSource().clear()
  layer.getSource().addFeatures(features)

  if (layerType === 'current') updateCurrentLegend()

  const extent = layer.getSource().getExtent()
  if (extent && extent[0] < extent[2]) {
    map.value.getView().fit(extent, {
      size: map.value.getSize(),
      padding: [0, 0, 0, 0],
      duration: 1000,
      maxZoom: 7
    })
  }
}

const handleFileUpload = async (layerType, event) => {
  const files = event.target.files
  if (!files.length) return
  const formData = new FormData()
  for (let i = 0; i < files.length; i++) {
    formData.append(files[i].name, files[i])
  }

  const uploadRes = await fetch('/api/MapLayerUpload', {
    method: 'POST',
    body: formData
  })

  if (!uploadRes.ok) return alert('上传失败')
  const baseName = files[0].name.split('.')[0]
  const parseRes = await fetch(`/api/MapLayerUpload?fileName=${baseName}&layer=${layerType}`)
  if (!parseRes.ok) return alert('后端解析失败')

  await reloadLayer(layerType)
  event.target.value = ''
}

onMounted(() => {
  const boundaryLayer = new ImageLayer({
    source: new ImageArcGISRest({
      url: 'http://gohhu.com:6080/arcgis/rest/services/行政边界/MapServer'
    })
  })
  boundaryLayer.setZIndex(1)

  map.value = new Map({
    target: 'map',
    layers: [boundaryLayer],
    view: new View({
      projection: 'EPSG:4528',
      center: [40527350, 3522218],
      zoom: 2.8
    })
  })

  updateSwipeLine()
})

const tableData = ref([])
const quan = async () => {
  const res = await fetch('/api/Quan')
  const data = await res.json()
  tableData.value = Object.entries(data).map(([key, value]) => ({
    name: key,
    value: value.toFixed(4)
  }))
}

const checkboxValues = ref({
  '标注': false,
  '三区三线': false,
  '遥感影像': false,
  '地类分布': false
})

const baseLayerUrls = {
  '标注': 'http://gohhu.com:6080/arcgis/rest/services/注记/MapServer',
  '三区三线': 'http://gohhu.com:6080/arcgis/rest/services/三区三线/MapServer',
  '遥感影像': 'http://gohhu.com:6080/arcgis/rest/services/遥感影像/MapServer',
  '地类分布': 'http://gohhu.com:6080/arcgis/rest/services/地类分布/MapServer'
}

const baseLayers = reactive({})

const clearLegend = () => {
  const el = document.getElementById('legend')
  if (el) el.innerHTML = ''
}

const loadLegend = async (url) => {
  const el = document.getElementById('legend')
  if (!el || !url) return
  try {
    const res = await fetch(`${url}/legend?f=json`)
    const json = await res.json()
    json.layers.forEach(layer => {
      const title = document.createElement('div')
      title.style.fontWeight = 'bold'
      title.style.margin = '6px 0'
      title.textContent = layer.layerName
      el.appendChild(title)

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
        el.appendChild(row)
      })
    })
  } catch (err) {
    console.error('图例加载失败:', err)
  }
}

watch(checkboxValues, async (newVals) => {
  clearLegend()
  for (const [key, isChecked] of Object.entries(newVals)) {
    const url = baseLayerUrls[key]
    if (isChecked) {
      if (!baseLayers[key]) {
        const layer = new ImageLayer({ source: new ImageArcGISRest({ url }) })
        layer.setZIndex(10)
        baseLayers[key] = layer
        map.value.addLayer(layer)
      }
      loadLegend(url)
    } else {
      const layer = baseLayers[key]
      if (layer) {
        map.value.removeLayer(layer)
        delete baseLayers[key]
      }
    }
  }
}, { deep: true, immediate: true })
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
}

.map-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.top-title {
  padding-left: 10px;
  padding-top: 10px;
  color: white;
}

.data {
  padding-left: 10px;
  padding-top: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: white;
}

.table {
  width: 400px;
  order: 2;
}

span {
  color: white;
}

button {
  height: 40px;
  width: 70px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 15px;
}

button:hover {
  background-color: #66b1ff;
  cursor: pointer;
}

#map {
  width: 100%;
  height: 100%;
  background-color: #fff;
  margin-top: 10px;
  position: relative;
}

.right-option {
  order: 2;
  width: 400px;
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

.headtitle {
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

/* 表格整体设置透明背景 + 白色文字 */
/* 表格背景完全透明 */
/* 强制让表头的 tr 背景透明 */
::v-deep(.el-table__header-wrapper tr) {
  background-color: transparent !important;
}

::v-deep(.el-table),
::v-deep(.el-table__header),
::v-deep(.el-table__body),
::v-deep(.el-table__row),
::v-deep(.el-table__cell) {
  background-color: transparent !important;
  color: white;
  font-size: 14px;
}

::v-deep(.el-table__header-wrapper thead) {
  background-color: transparent !important;
}

/* 表头文字样式 */
::v-deep(.el-table__header .cell) {
  font-size: 15px;
  font-weight: bold;
  text-align: center;
  color: white;
  padding: 6px 0;
}

/* 表体单元格文字居中 + 缩小行高 */
::v-deep(.el-table__body .cell) {
  text-align: center;
  padding: 4px 0;
  line-height: 20px;
}

/* 表格边框线条样式 */
::v-deep(.el-table__header th),
::v-deep(.el-table__body td) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

/* 斑马纹背景（淡蓝） */
::v-deep(.el-table__row) {
  background-color: rgba(0, 123, 255, 0.05) !important;
}

::v-deep(.el-table__row--striped) {
  background-color: rgba(0, 123, 255, 0.15) !important;
}

/* 鼠标悬停行高亮（淡绿色） */
::v-deep(.el-table__row:hover) {
  background-color: rgba(0, 255, 153, 0.15) !important;
}

/* 表格滚动条隐藏 */
::v-deep(.el-table__body-wrapper) {
  overflow: hidden;
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
  top: 40px;
  right: 40px;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.93);
  /* 深蓝背景 */
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
#swipe-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: white;
  border-left: 1px solid black;
  border-right: 1px solid black;
  left: 50%;
  z-index: 1000;
  cursor: col-resize;
  display: flex;
  justify-content: center;
}

.swipe-handle {
  width: 16px;
  height: 16px;
  background-color: white;
  border: 1px solid black;
  position: absolute;
  top: 50%;
  margin-top: -8px; /* center vertically */
  z-index: 1001;
}
.dynamic-legend {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 10px;
  border-radius: 6px;
  font-size: 13px;
  box-shadow: 0 0 6px rgba(0,0,0,0.2);
  color: #000;
  z-index: 1000;
}
</style>