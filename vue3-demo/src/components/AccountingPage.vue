<!-- AccountingPage.vue -->
<template>
  <div id="container" class="router-view main">
    <div class="left-map">
      <div class="map-container jy-theme">
        <div id="map" style="width: 100%; height: 100vh;">
          <div class="map-layer-menu">
            <el-menu
              class="el-menu-vertical-demo"
              background-color="transparent"
              text-color="#fff"
              active-text-color="#409eff"
            >
              <el-sub-menu index="0" >
                <template #title>
                  <div class="title">
                    <img src="/icons/layers.svg" alt="图层" class="menu-icon" />
                    <span class="menu-title-text">选择图层</span>
                  </div>
                </template>
                <el-menu-item >
                  <el-checkbox  v-model="checkboxValues['标注']" >标注</el-checkbox>
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
        </div>
      </div>
    </div>
    <div class="right-option">
      <div class="option-content">
        <div class="option-container">
          <div class="option-head">
            <div class="option-title">产品类型选择</div>
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange">全选</el-checkbox>
          </div>
          <div class="checkbox-container">
            <el-checkbox-group v-model="checkedProducts" >
            <el-row>
              <el-col :span="8" v-for="item in productList" :key="item">
                <el-checkbox :label="item">{{ item }}</el-checkbox>
              </el-col>
            </el-row>
          </el-checkbox-group>
        </div>
          
        </div>

        <div class="option-container">
          <div class="option-head">
            <div class="option-title">核算类型选择</div>
            <el-checkbox
              :indeterminate="isIndeterminateType"
              v-model="checkAllType"
              @change="handleCheckAllTypeChange">全选</el-checkbox>
          </div>
          <div class="checkbox-container">
            <el-checkbox-group v-model="checkedTypes">
            <el-row>
              <el-col :span="8" v-for="item in typeList" :key="item" >
                <el-checkbox :label="item">{{ item }}</el-checkbox>
              </el-col>
            </el-row>
          </el-checkbox-group>
          </div>
        </div>

        <div style="margin:1em; display:flex; flex-direction:row-reverse;">
          <el-button size="small" type="primary" @click="fetchData">价值核算</el-button>
        </div>

        <el-table v-if="tableData.length" :data="tableData" stripe>
          <el-table-column prop="productType" label="产品类型" />
          <el-table-column
            v-if="checkedTypes.includes('价值量')"
            prop="valueValue"
            label="价值量 (万元)"
          />
          <el-table-column
            v-if="checkedTypes.includes('功能量')"
            prop="functionValue"
            label="功能量"
          />
        </el-table>
        <div v-else style="text-align:center; margin-top:2em;">选择行政区、产品类型、核算类型后，点击“价值核算”。</div>
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

const checkAll = ref(false)
const checkAllType = ref(false)
const isIndeterminate = ref(false)
const isIndeterminateType = ref(false)
const checkedProducts = ref([])
const checkedTypes = ref([])
function handleCheckAllChange(val) {
  checkedProducts.value = val ? [...productList] : []
  isIndeterminate.value = false
}

function handleCheckAllTypeChange(val) {
  checkedTypes.value = val ? [...typeList] : []
  isIndeterminateType.value = false
}

const tableData = ref([])
// 注册 EPSG:4547 和 EPSG:4528 坐标系
proj4.defs('EPSG:4547', '+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=500000 +y_0=0 +datum=WGS84 +units=m +no_defs')
proj4.defs('EPSG:4528', '+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=40500000 +y_0=0 +datum=CGCS2000 +units=m +no_defs')
register(proj4)
getProjection('EPSG:4547').setExtent([40498532, 3507263, 40556464, 3541460])
getProjection('EPSG:4528').setExtent([40500000, 3500000, 40600000, 3600000])

// 2. 产品类型选择、核算类型选择的数据
const productList = [
  '水源涵养', '土壤保持', '防风固沙', '洪水调蓄',
  '空气净化', '水质净化', '碳固定', '氧气提供', '气候调节', '噪声消减'
]
const typeList = ['功能量', '价值量']
const map = ref(null)
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
// 清除图例
const clearLegend = () => {
  const legendDiv = document.getElementById('legend')
  if (legendDiv) legendDiv.innerHTML = ''
}

// 加载ArcGIS REST图例
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
    console.error('加载图例失败:', err)
  }
}
  // 多选高亮
const selectedFeatures = new Set()
onMounted(() => {

  // 加载GeoServer的WFS图层
  const vectorSource = new VectorSource({
    format: new GeoJSON(),
    url: 'http://localhost:8080/geoserver/jiangyin/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=jiangyin:%E8%A1%8C%E6%94%BF%E5%8C%BA&outputFormat=application/json'
  })

  const vectorLayer = new VectorLayer({
    source: vectorSource,
    style: new Style({
      fill: new Fill({ color: 'rgba(0, 0, 0, 0)' }), // 透明填充
      stroke: new Stroke({ color: '#000', width: 1 }) // 黑色边界
    })
  })
  vectorLayer.setZIndex(10)

  // ArcGIS行政边界底图
  const arcgisBoundaryLayer = new ImageLayer({
    source: new ImageArcGISRest({
      url: 'http://gohhu.com:6080/arcgis/rest/services/行政边界/MapServer'
    })
  })
  arcgisBoundaryLayer.setZIndex(-1)

  map.value = new Map({
    target: 'map',
    layers: [arcgisBoundaryLayer, vectorLayer],
    view: new View({
      projection: 'EPSG:4528',
      center: [40527350, 3522218],
      zoom: 2.8
    })
  })

map.value.on('click', (evt) => {
  map.value.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
    if (selectedFeatures.has(feature)) {
      // 取消高亮
      feature.setStyle(new Style({
        fill: new Fill({ color: 'rgba(0, 0, 0, 0)' }),
        stroke: new Stroke({ color: '#000', width: 1 })
      }))
      selectedFeatures.delete(feature)
    } else {
      // 添加高亮
      feature.setStyle(new Style({
        fill: new Fill({ color: 'rgba(128, 128, 128, 0.5)' }),
        stroke: new Stroke({ color: '#666', width: 2 })
      }))
      selectedFeatures.add(feature)
      console.log('点击元素属性：', feature.getProperties())
    }
  })
})

  // 勾选底图动态切换
  watch(
  checkboxValues,
  async (newVals) => {
    clearLegend() // 每次变更前清空图例
    for (const [key, isChecked] of Object.entries(newVals)) {
      const url = baseLayerUrls[key]

      if (isChecked) {
        if (!baseLayers[key]) {
          const layer = new ImageLayer({
            source: new ImageArcGISRest({ url })
          })
          layer.setZIndex(0)
          baseLayers[key] = layer
          map.value.addLayer(layer)
        }

        // ✅ 加载图例
        await loadLegend(url)

      } else {
        const layer = baseLayers[key]
        if (layer) {
          map.value.removeLayer(layer)
          delete baseLayers[key]
        }
      }
    }
  },
  { deep: true, immediate: true }
)
})

async function fetchData() {
  if (selectedFeatures.size === 0) {
    alert('请在地图中选择区域')
    return
  }

  const districts = Array.from(selectedFeatures)
    .map(f => f.get('xzqmc'))
    .filter(Boolean)

  if (districts.length === 0) {
    alert('选中的区域中没有找到 xzqmc 属性')
    return
  }

  const queryString = districts.join(',')
  const url = `/api/StatisticByDistrict?districts=${encodeURIComponent(queryString)}`

  try {
    const response = await fetch(url)
    const raw = await response.json()

    const fieldMap = {
      '水源涵养': ['waterFun', 'waterValue'],
      '土壤保持': ['soilFun', 'soilValue'],
      '防风固沙': ['windSandFun', 'windSandValue'],
      '洪水调蓄': ['floodFun', 'floodValue'],
      '空气净化': ['airFun', 'airValue'],
      '水质净化': ['waterQualityFun', 'waterQualityValue'],
      '碳固定': ['co2Fun', 'co2Value'],
      '氧气提供': ['o2Fun', 'o2Value'],
      '气候调节': ['climateFun', 'climateValue'],
      '噪声消减': [null, 'noiseValue']
    }

    const result = []

    for (const product of checkedProducts.value) {
      const [funKey, valueKey] = fieldMap[product] || []

      const row = { productType: product }

      if (checkedTypes.value.includes('功能量')) {
        row.functionValue = funKey ? raw[funKey] ?? 0 : 0
      }

      if (checkedTypes.value.includes('价值量')) {
        row.valueValue = valueKey ? raw[valueKey] ?? 0 : 0
      }

      result.push(row)
    }

    tableData.value = result
  } catch (e) {
    console.error('重新核算请求失败:', e)
  }
}
// 监听产品类型是否全选
watch(checkedProducts, (newVal) => {
  checkAll.value = newVal.length === productList.length
  isIndeterminate.value = newVal.length > 0 && newVal.length < productList.length
})

// 监听核算类型是否全选
watch(checkedTypes, (newVal) => {
  checkAllType.value = newVal.length === typeList.length
  isIndeterminateType.value = newVal.length > 0 && newVal.length < typeList.length
})

</script>


<style scoped>
#map {
  width: 100%;
  height: 100%;
  position: relative; 
}
#container {
  display: flex;
  flex-direction: row;
  height: 100%;
}
#container .left-map {
  order: 1;
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.map-container {
  order: 1;
  flex: 1;
  background-color: #fff;
  margin: 1em;
  height: 100%;
}
#container .right-option {
  order: 2;
  width: 450px;
  color: #fff;
}
.option-container {
  margin: 1em;
  font-family: PingFang SC;
}
.option-container .option-head {
  display: flex;
  justify-content: space-between;
}
.el-checkbox {
  color: #fff;
}
.checkbox-container {
  background-color: rgba(0, 0, 0, .2);
  margin: 10px 0;
  padding: .5em 1em .5em 1em;
}
.el-row {
  box-sizing: border-box;
}
.map-layer-menu {
  position: absolute;
  top: 40px;
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
.map-legend {
  position: absolute;
  bottom: 100px;
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
.title{
  font-size: 16px;
    color: #2e2e2e;
}
.map-layer-menu .el-checkbox {
  color: #333 !important; /* 或其他深色系 */
}
/* 表格整体设置透明背景 + 白色文字 */
/* 表格背景完全透明 */
/* 强制让表头的 tr 背景透明 */
::v-deep(.el-table__header-wrapper tr ){
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
::v-deep(.el-table__body td ){
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

/* 斑马纹背景（淡蓝） */
::v-deep(.el-table__row ){
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
</style>
