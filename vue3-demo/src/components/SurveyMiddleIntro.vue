<!-- SurveyMiddleIntro.vue -->
<template>
  <div class="center">
      <div class="material-content">     
          <div v-if="activeIndex === '0-0'"      class="top-title">水产品状况简介</div>
          <div v-else-if="activeIndex === '0-1'" class="top-title">果品状况简介</div>
          <div v-else-if="activeIndex === '0-2'" class="top-title">粮食状况简介</div>
          <div v-else-if="activeIndex === '0-3'" class="top-title">两品一标</div>
          <div class="top-intro"  v-if="activeIndex === '0-0'"     > 江阴市地处太湖水网平原北侧，境内河流密布水网密集，素有“鱼米之乡”之美誉。江阴全市水产养殖面积53700亩，常规鱼类养殖面积占62.63%，特种水产养殖面积占37.37%。 </div>
          <div class="top-intro"  v-else-if="activeIndex === '0-1'"> 江阴市地处太湖水网平原北侧，境内水果种植面积较大，形成了顾山水蜜桃、璜土葡萄、月城翠冠梨等特色果品。 </div>
          <div class="top-intro"  v-else-if="activeIndex === '0-2'"> 江阴市地处长三角经济发达地区，随着土地流转政策的出台及政府对农业的愈加重视，江阴市的粮食生产已由分散经营走向适度规模经营。 </div>
          <div class="top-intro"  v-else-if="activeIndex === '0-3'"> 江阴市依托优越的自然和社会条件，绿色有机农产品近年来发展迅速，打造了一批具有强市场竞争力和高知名度的农产品，如华西大米、顾山水蜜桃、双泾葡萄等。 </div>
          <div class="chart-header">
             <div class="swiper swiper-left" @click="changeYear(-1)"> &lt; </div>
           <div class="chart-title">
             {{ activeIndex === '0-3' ? currentYear + '全市两品一标分布' : currentYear + '全市' + typeLabel + fieldLabel + '分布' }}
           </div>            
           <div class="swiper swiper-right" @click="changeYear(1)"> &gt; </div>
           </div>
          <div class="map-tool" v-if="activeIndex !== '0-3'">
              <div role="radiogroup" class="el-radio-group">
                 <label @click="handleFieldChange('product')"
                :class="['el-radio-button', props.field === 'product' && 'is-active']">
                     <input type="radio" class="el-radio-button__orig-radio" value="Product" />
                     <span class="el-radio-button__inner">产量</span>
                   </label>
                   <label @click="handleFieldChange('area')"
                          :class="['el-radio-button', props.field === 'area' && 'is-active']">
                     <input type="radio" class="el-radio-button__orig-radio" value="Area" />
                     <span class="el-radio-button__inner">面积</span>
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
 </template>
<script setup>
 import { ref, watch, onMounted } from 'vue'
 import * as echarts from 'echarts'
 
 const props = defineProps({
   activeIndex: String,
   currentType: String,
   field: String
 })
 
 const emit = defineEmits(['field-switch', 'toggle-year'])
 
 const currentYear = ref(2021)
 const fieldLabel = ref('产量')
 const typeLabel = ref('水产品')
 
 // 更新字段标签
 watch(() => props.field, (val) => {
   fieldLabel.value = val === 'product' ? '产量' : '面积'
   loadMapData()
 })
 const handleFieldChange = (val) => {
  if (props.field === val) return 
  emit('field-switch', val)
}
 // 更新类型标签
 watch(() => props.currentType, (val) => {
   const typeMap = {
     aquatic: '水产品',
     fruits: '水果',
     grain: '粮食'
   }
   typeLabel.value = typeMap[val] || ''
   loadMapData()
 })
 
 // 年份切换
 const changeYear = (delta) => {
   const newYear = currentYear.value + delta
   if (newYear === 2021 || newYear === 2022) {
     currentYear.value = newYear
     emit('toggle-year', newYear)
     loadMapData()
   }
 }
 
 // 图例分段配置
 const getVisualMapPieces = () => {
   if (props.activeIndex === '0-3') {
     return [
       { min: 15, max: 999, label: '15个以上', color: '#9c5571' },
       { min: 10, max: 14, label: '10-15个', color: '#999999' },
       { min: 5, max: 9, label: '5-10个', color: '#66c2a5' },
       { min: 1, max: 4, label: '1-5个', color: '#5e9cd0' },
       { value: 0, label: '无', color: '#31688e' }
     ]
   }
 
   const type = props.currentType
   const field = props.field
 
   if (field === 'product') {
     if (type === 'grain') {
       return [
         { min: 10000, label: '10000吨以上', color: '#9c5571' },
         { min: 1000, max: 10000, label: '1000 - 10000吨', color: '#999999' },
         { min: 500, max: 1000, label: '500 - 1000吨', color: '#66c2a5' },
         { min: 100, max: 500, label: '100 - 500吨', color: '#5e9cd0' },
         { min: 0, max: 100, label: '0 - 100吨', color: '#31688e' }
       ]
     }
     return [
       { min: 5000, label: '5000吨以上', color: '#9c5571' },
       { min: 1000, max: 5000, label: '1000 - 5000吨', color: '#999999' },
       { min: 500, max: 1000, label: '500 - 1000吨', color: '#66c2a5' },
       { min: 100, max: 500, label: '100 - 500吨', color: '#5e9cd0' },
       { min: 0, max: 100, label: '0 - 100吨', color: '#31688e' }
     ]
   } else {
     if (type === 'grain') {
       return [
         { min: 40000, label: '40000亩以上', color: '#9c5571' },
         { min: 30000, max: 40000, label: '30000 - 40000亩', color: '#999999' },
         { min: 20000, max: 30000, label: '20000 - 30000亩', color: '#66c2a5' },
         { min: 10000, max: 20000, label: '10000 - 20000亩', color: '#5e9cd0' },
         { min: 0, max: 10000, label: '0 - 10000亩', color: '#31688e' }
       ]
     }
     return [
       { min: 8000, label: '8000亩以上', color: '#9c5571' },
       { min: 6000, max: 8000, label: '6000 - 8000亩', color: '#999999' },
       { min: 4000, max: 6000, label: '4000 - 6000亩', color: '#66c2a5' },
       { min: 2000, max: 4000, label: '2000 - 4000亩', color: '#5e9cd0' },
       { min: 0, max: 2000, label: '0 - 2000亩', color: '#31688e' }
     ]
   }
 }
 
 // 加载地图数据
 const loadMapData = async () => {
   const res = await fetch(`/api/material/${currentYear.value}`)
   const data = await res.json()
 
   let fieldKey
   if (props.activeIndex === '0-3') {
     fieldKey = 'standardCount' 
   } else {
     const keyMap = {
       aquatic: { product: 'aquaticProduct', area: 'aquaticArea' },
       fruits: { product: 'fruitsProduct', area: 'fruitsArea' },
       grain: { product: 'grainProduct', area: 'grainArea' }
     }
     fieldKey = keyMap[props.currentType]?.[props.field]
   }
 
   if (!fieldKey && props.activeIndex !== '0-3') return
 
   const chart = echarts.init(document.getElementById('chart'))
 
   const mapData = data.map(item => {
     if (props.activeIndex === '0-3') {
       const total = Number(item.greenfood || 0) + Number(item.organic || 0) + Number(item.geographical || 0)
       const tooltip = [
         item.greenfoodname ? `绿色食品：${item.greenfoodname}` : '',
         item.organicname ? `有机产品：${item.organicname}` : '',
         item.geographicalname ? `地理标志：${item.geographicalname}` : ''
       ].filter(Boolean).join('\n')
       return {
         name: item.districtName,
         value: total,
         tooltip
       }
     } else {
       return {
         name: item.districtName,
         value: Number(item[fieldKey] || 0)
       }
     }
   })
 
   chart.setOption({
     tooltip: {
       trigger: 'item',
       formatter: (params) => {
         if (props.activeIndex === '0-3') {
           return `${params.name}<br/>数量：${params.value} 个<br/>${params.data.tooltip || ''}`
         } else {
           return `${params.name}: ${params.value}${props.field === 'product' ? ' 吨' : ' 亩'}`
         }
       }
     },
     visualMap: {
       type: 'piecewise',
       pieces: getVisualMapPieces(),
       left: 20,
       bottom: 20,
       textStyle: { color: '#fff' }
     },
     series: [
       {
         name: '分布数据',
         type: 'map',
         map: 'jiangyin',
         label: {
           show: true,
           color: '#fff',
           fontSize: 12,
           formatter: (p) =>
             `${p.name}\n${p.value}${props.activeIndex === '0-3' ? ' 个' : (props.field === 'product' ? ' 吨' : ' 亩')}`
         },
         data: mapData,
         itemStyle: {
           borderColor: '#999'
         },
         emphasis: {
           label: { show: true, color: '#fff', fontWeight: 'bold' }
         }
       }
     ]
   })
 }
 
 // 注册地图
 onMounted(async () => {
   const geoJson = await fetch('/geo/map.geojson').then(res => res.json())
   echarts.registerMap('jiangyin', geoJson)
   loadMapData()
 })
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
.el-radio-button.is-active .el-radio-button__inner {
  background-color: rgb(102, 177, 255);
  border-color: rgb(102, 177, 255);
  color: #fff;
}

</style>
  