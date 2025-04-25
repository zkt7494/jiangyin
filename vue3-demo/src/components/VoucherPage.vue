<template>
  <div id="map" style="width: 100%; height: 100vh;"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import 'ol/ol.css'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import TileArcGISRest from 'ol/source/TileArcGISRest'

// 地图加载逻辑
onMounted(() => {
  const arcgisLayer = new TileLayer({
    source: new TileArcGISRest({
      url: 'http://gohhu.com:6080/arcgis/rest/services/注记/MapServer'
    })
  })
  const map = new Map({
    target: 'map',
    layers: [
      arcgisLayer
    ],
    view: new View({
      center: [120, 31], // 中心点坐标，可使用 transform 转为 EPSG:3857
      zoom: 10,
      projection: 'EPSG:4326' // 使用 WGS84 坐标系，方便中国地图显示
    })
  })
})
</script>

  
  <style scoped>
  #map {
    width: 100vw;
    height: 100vh;
  }
  </style>
  