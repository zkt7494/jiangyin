<!-- SurveyRightWaterQuality.vue -->
<template>
    <div class="center">
        <div class="material-content">
            <div class="top-title">断面水质</div>
            <div class="map-content">
                <div id="map"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import 'ol/ol.css'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import TileArcGISRest from 'ol/source/TileArcGISRest'
import { fromLonLat } from 'ol/proj'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Icon, Style } from 'ol/style'
import { Point } from 'ol/geom'
import Feature from 'ol/Feature'
import Overlay from 'ol/Overlay'

// 地图实例和图层管理
let map
let layers = {}
let overlay // 弹窗 overlay 全局变量

const waterQualityData = ref([]) // 存储水质数据

// 获取 API 数据
const fetchWaterQualityData = async () => {
  const response = await fetch('/api/section')  // 水质数据接口
  const data = await response.json()
  waterQualityData.value = data
  addMarkersToMap(data)
}

// 添加标注到地图
const addMarkersToMap = (data) => {
  const vectorSource = new VectorSource()
  data.forEach(item => {
    const coord = fromLonLat([item.x, item.y])
    const feature = new Feature({
      geometry: new Point(coord),
      name: item.name,
      disOxygen: item.disOxygen,
      codmn: item.codmn,
      bod5: item.bod5,
      nh3n: item.nh3n,
      tp: item.tp,
      codcr: item.codcr,
      oil: item.oil,
      level: item.level
    })

    const iconStyle = new Style({
      image: new Icon({
        src: '/icons/WaterQuality.svg',
        scale: 0.5
      })
    })
    feature.setStyle(iconStyle)
    vectorSource.addFeature(feature)
  })

  const vectorLayer = new VectorLayer({
    source: vectorSource
  })
  map.addLayer(vectorLayer)

  // 创建 overlay 弹窗元素
  const overlayElement = document.createElement('div')
  overlayElement.className = 'popup-overlay'
  overlayElement.style.cssText = 'background: white; padding: 10px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.3);'

  overlay = new Overlay({
    element: overlayElement,
    autoPan: true,
    autoPanAnimation: { duration: 250 }
  })
  map.addOverlay(overlay)

  // 地图点击事件，弹出信息窗
  map.on('singleclick', function (evt) {
    let featureFound = false
    map.forEachFeatureAtPixel(evt.pixel, function (feature) {
      const props = feature.getProperties()
      overlayElement.innerHTML = `
        <div>
          <strong>${props.name}</strong><br/>
          溶氧量: ${props.disOxygen}<br/>
          高锰酸盐指数: ${props.codmn}<br/>
          5日生化需氧量: ${props.bod5}<br/>
          氨氮: ${props.nh3n}<br/>
          总磷量: ${props.tp}<br/>
          重铬酸盐指数: ${props.codcr}<br/>
          石油类: ${props.oil}<br/>
          水质等级: ${props.level}
        </div>
      `
      overlay.setPosition(evt.coordinate)
      featureFound = true
      return true // 只处理第一个 feature
    })
    if (!featureFound) {
    overlay.setPosition(undefined)
  }
  })
}

onMounted(() => {
  map = new Map({
    target: 'map',
    layers: [],
    view: new View({
      center: fromLonLat([120.285246, 31.866448]),
      zoom: 11,
      projection: 'EPSG:3857'
    })
  })

  loadLayer('行政边界')
  fetchWaterQualityData()
})

// 加载图层
const loadLayer = (layerName) => {
  const newLayer = new TileLayer({
    source: new TileArcGISRest({
      url: layerUrls[layerName]
    })
  })
  layers[layerName] = newLayer
  map.addLayer(newLayer)
}

// 图层 URL 地址
const layerUrls = {
  '地类分布': 'http://gohhu.com:6080/arcgis/rest/services/%E5%9C%B0%E7%B1%BB%E5%88%86%E5%B8%83/MapServer',
  '三区三线': 'http://gohhu.com:6080/arcgis/rest/services/%E4%B8%89%E5%8C%BA%E4%B8%89%E7%BA%BF/MapServer',
  '遥感影像': 'http://gohhu.com:6080/arcgis/rest/services/%E9%81%A5%E6%84%9F%E5%BD%B1%E5%83%8F/MapServer',
  '行政边界': 'http://gohhu.com:6080/arcgis/rest/services/%E8%A1%8C%E6%94%BF%E8%BE%B9%E7%95%8C/MapServer'
}
</script>


<style scoped>
.center {
    order: 2;
    flex: 1 1 0%;
}
.material-content {
    display: flex;
    flex-direction: column;
    height: 100vh;
}
.top-title {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    margin: 20px 5px 5px;
    padding-left: 15px;
    width: 100%;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
    flex: 0 0 auto;
    order: 0;
    align-self: stretch;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 35px;
    text-transform: capitalize;
    color: rgb(255, 255, 255);
    text-shadow: rgb(77, 212, 255) 0px 2px 4px;
}
#map{
   width: 100%;
    height: calc(100vh - 120px);
    background: #fff;
}
.overlay-content {
    background-color: white;
    padding: 10px;
    border: 1px solid #ccc;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    max-width: 300px;
}
</style>