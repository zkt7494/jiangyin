<!-- SurveyMiddleCulture.vue -->
<template>
  <div class="center">
      <div class="material-content">     
          <div class="top-title">生态用地概况</div>
          <div class="top-intro">
              江阴市共有耕地25543.9公顷，整体质量等级较高，以6等级为主和零星7等级耕地，其中水田约占6级地的63%，早地约占37%。 江阴市园地面积约为34.17km2，土壤保持功能量呈现西高东低、南高北低的分布格局，月城镇、徐霞客镇、璜土镇和青阳镇土壤保持功能较好。 江阴市陆地水域总面积约为168.60km2，土壤保持功能量呈现四周高、中间低的分布格局，沿江区域土壤保持功能量表现为集中连片特征。 江阴市全市总面积98777.00hm2，其中林业用地面积12758.64hm2，占12.92%，非林业用地86018.36hm2，占87.08%。 江阴市草地面积约为15.49km2，土壤保持功能量呈现北高南低的分布格局，澄江街道、城东街道、申港街道和云亭街道土壤保持功能较好。 江阴市湿地面积约为15.49km2，土壤保持功能总量为11.31t/a，主要分布于璜土镇、城东街道和利港街道。 江阴市绿地与开敞空间总面积约为168.60km2，土壤保持功能量集中分布于北部沿江区域，澄江街道、城东街道、夏港街道和申港街道的土壤保持功能较好。
          </div>
          <div id="map" class="map-content">
            <div id="legend" class="map-legend"></div>
          </div>  

          <el-dialog
            v-model="attrVisible"
            title="属性信息"
            width="600px"
            :close-on-click-modal="false"
          >
            <el-table :data="attrData" stripe style="width: 100%">
              <el-table-column
                v-for="(value, key) in attrData[0] || {}"
                :key="key"
                :prop="key"
                :label="key"
              />
            </el-table>
          </el-dialog>
      </div>
  </div>
  <div class="right">
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
    <!-- 一级菜单：基础图层 -->
    <el-sub-menu index="0">
      <template #title>
        <div class="title">
          <img src="/icons/layers.svg" alt="图层" class="menu-icon" />
          <span class="menu-title-text">&nbsp选择图层</span>
        </div>
      </template>
      <el-menu-item index="0-0" >
        <el-checkbox v-model="checkboxValues['基础图层']['地类分布']">地类分布</el-checkbox>
      </el-menu-item>
      <el-menu-item index="0-1">
        <el-checkbox v-model="checkboxValues['基础图层']['三区三线']">三区三线</el-checkbox>
      </el-menu-item>
      <el-menu-item index="0-2">
        <el-checkbox v-model="checkboxValues['基础图层']['遥感影像']">遥感影像</el-checkbox>
      </el-menu-item>
      <el-menu-item index="0-3">
        <el-checkbox v-model="checkboxValues['基础图层']['行政边界']">行政边界</el-checkbox>
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</div>

</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import 'ol-ext/dist/ol-ext.min.css';
import 'ol/ol.css'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import TileArcGISRest from 'ol/source/TileArcGISRest'
import { fromLonLat } from 'ol/proj'  // 用于将经纬度转换为地图投影坐标
const attrVisible = ref(false)
const attrData = ref([])  // 存储 feature 属性对象

// 初始化加载“行政边界”和“地类分布”图层--------------------------------------------------------------------------
const loadLayer = (layerName) => {
  const newLayer = new TileLayer({
    source: new TileArcGISRest({
      url: layerUrls[layerName]  // 根据图层名称获取对应的 URL
    })
  })
  layers[layerName] = newLayer
  map.addLayer(newLayer)  // 将图层添加到地图中
}

//添加标注图层--------------------------------------------------------------------------------------------------
const labelLayer = new TileLayer({
    source: new TileArcGISRest({
      url:'http://gohhu.com:6080/arcgis/rest/services/%E6%B3%A8%E8%AE%B0/MapServer'  // 根据图层名称获取对应的 URL
    })
  })

//图例部分-------------------------------------------------------------------------------------------------------
const legendUrls = {
  '地类分布': 'http://gohhu.com:6080/arcgis/rest/services/地类分布/MapServer/legend?f=json',
  '三区三线': 'http://gohhu.com:6080/arcgis/rest/services/三区三线/MapServer/legend?f=json',
  '行政边界': 'http://gohhu.com:6080/arcgis/rest/services/行政边界/MapServer/legend?f=json'
}
const normalizeId = (name) => `legend-${encodeURIComponent(name)}`
// 加载图例
const loadLegend = async (layerName) => {
  const url = legendUrls[layerName]
  if (!url) return

  const legendContainer = document.getElementById('legend')
  const legendId = normalizeId(layerName)

  // ✅ 如果已经存在图例就跳过
  if (document.getElementById(legendId)) {
    return
  }

  const res = await fetch(url)
  const data = await res.json()

  const group = document.createElement('div')
  group.id = legendId
  group.style.marginBottom = '10px'

  const title = document.createElement('div')
  title.style.fontWeight = 'bold'
  title.style.marginBottom = '4px'
  title.textContent = layerName
  group.appendChild(title)

  data.layers.forEach(layer => {
    layer.legend.forEach(item => {
      const img = document.createElement('img')
      img.src = `data:image/png;base64,${item.imageData}`
      img.style.width = '20px'
      img.style.height = '20px'
      img.style.marginRight = '5px'

      const label = document.createElement('span')
      label.textContent = item.label?.trim() || layer.layerName || '未命名'

      const row = document.createElement('div')
      row.style.display = 'flex'
      row.style.alignItems = 'center'
      row.style.marginBottom = '4px'
      row.appendChild(img)
      row.appendChild(label)

      group.appendChild(row)
    })
  })

  legendContainer.appendChild(group)
}
// 移除图例
const removeLegend = (layerName) => {
  const el = document.getElementById(normalizeId(layerName))
  if (el) el.remove()
}
//图例结束-------------------------------------------------------------------------------------------------------


// 地图实例和图层管理 -----------------------------------------------------------------------------------------------
let map
let layers = {}
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
  loadLayer('地类分布')
  map.addLayer(labelLayer)

  //  初始勾选图层加载图例
  Object.entries(checkboxValues.value['基础图层']).forEach(([layerName, checked]) => {
    if (checked) {
      loadLegend(layerName)
    }
  })
})

// 图层对应的 URL 地址----------------------------------------------------------------------------------
const layerUrls = {
  '地类分布': 'http://gohhu.com:6080/arcgis/rest/services/%E5%9C%B0%E7%B1%BB%E5%88%86%E5%B8%83/MapServer',
  '三区三线': 'http://gohhu.com:6080/arcgis/rest/services/%E4%B8%89%E5%8C%BA%E4%B8%89%E7%BA%BF/MapServer',
  '遥感影像': 'http://gohhu.com:6080/arcgis/rest/services/%E9%81%A5%E6%84%9F%E5%BD%B1%E5%83%8F/MapServer',
  '行政边界': 'http://gohhu.com:6080/arcgis/rest/services/%E8%A1%8C%E6%94%BF%E8%BE%B9%E7%95%8C/MapServer',
}
// 管理复选框状态----------------------------------------------------------------------------------------
const checkboxValues = ref({
  '基础图层': {
    '地类分布': true,
    '三区三线': false,
    '遥感影像': false,
    '行政边界': true
  }
})
// 根据复选框的选中状态添加或移除图层--------------------------------------------------------------------
const handleLayerToggle = (layerName, isChecked) => {
  if (isChecked) {
    // 如果图层没有添加，则添加到地图
    if (!layers[layerName]) {
      const newLayer = new TileLayer({
        source: new TileArcGISRest({
          url: layerUrls[layerName]  // 根据图层名称获取对应的 URL
        })
      })
      layers[layerName] = newLayer
      map.addLayer(newLayer)  // 将新图层添加到地图中
      map.removeLayer(labelLayer)
      map.addLayer(labelLayer)
    }
  } else {
    // 如果图层已经添加，则移除
    if (layers[layerName]) {
      map.removeLayer(layers[layerName])
      delete layers[layerName]  // 从层管理中删除该图层
    }
  }
}
// 监听复选框状态的变化，自动更新地图上的图层--------------------------------------------------------------------
watch(checkboxValues, (newVal) => {
  Object.entries(newVal['基础图层']).forEach(([layerName, checked]) => {
    handleLayerToggle(layerName, checked)
    if (checked) {
      loadLegend(layerName)
    } else {
      removeLegend(layerName)
    }
  })
}, { deep: true })
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

 .map-content {
    order: 4;
    flex: 1;
    margin: 5px;
    background-color: #fff;
}

.right {
    order: 3;
    width: 250px;
    height: 100%;
}
.svg-img {
    width: 20px;
    height: 20px;
    filter: brightness(0) invert(1);
    flex-shrink: 0;
  }
  .menu-icon{  width: 23px;
    height: 23px;}

  /* 单独菜单项样式 */
  .el-menu-item.single {
    padding-left: 20px !important;
    display: flex;
    align-items: center;
    gap: 8px;
  }  
  /* 鼠标悬停变灰 */
  .el-menu-item:hover,
  .el-submenu__title:hover {
    background-color: rgba(255, 255, 255, 0.2) !important;
  }
  
  /* 激活状态下文字变蓝 */
  .el-menu-item.is-active span,
  .el-submenu__title.is-active span {
    color: #409eff !important;
    font-weight: bold;
  }
  .el-sub-menu .title,
.el-menu-item .el-radio {
  color: white; /* 设置字体为白色 */
  display: flex;
  align-items: center; /* 竖直居中 */
}
/* 设置菜单项（一级菜单、二级菜单）的字体颜色 */
.el-menu-item {
  color: white !important; /* 强制设置菜单项字体为白色 */
  display: flex;
  align-items: center; /* 竖直居中 */
  padding: 10px 20px; /* 给每个菜单项添加内边距 */
}
.checkbox-before{
  color: white !important; /* 强制设置菜单项字体为白色 */
  display: flex;
  align-items: center; /* 竖直居中 */
}
.el-radio-group .el-radio {
  display: flex;
  align-items: center; /* 竖直居中 */
}
/* 调整一级菜单和二级菜单的间距 */
.el-sub-menu {
  padding: 5px 0; /* 控制子菜单项之间的间距 */
}
.el-sub-menu .el-menu-item,
.el-sub-menu .el-menu-item .el-checkbox {
  color: white !important; /* 强制将菜单项文字颜色设置为白色 */
}
.el-sub-menu  {
  color: white; /* 将一级菜单标题（基础图层）字体颜色设置为白色 */
}
.menu-title-text{
  color: white;
  font-size: 20px;
}
/* 保证子菜单项竖直居中 */
.el-menu-item {
  display: flex;
  align-items: center; /* 竖直居中 */
}
.el-menu-item .el-checkbox {
  color: white !important; /* 确保复选框旁边的文字也是白色 */
}
#map {
  position: relative; /* ✅ 这是关键点 */
}
.map-legend {
  position: absolute;
  right: 10px;
  bottom: 70px;
  background-color: rgba(255, 255, 255, 0.95);
  padding: 10px 12px;
  border-radius: 6px;
  box-shadow: 0 0 8px rgba(0,0,0,0.2);
  font-size: 13px;
  color: #000;
  z-index: 1000;
  max-width: 260px;
}
</style>