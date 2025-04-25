<!-- SurveyPage.vue -->
<template>
  <div class="content router-view main">
    <SurveyLeftMenu :active-index="selectedMenu" @menu-select="handleMenuSelect" />

    <SurveyMiddleIntro
      v-if="['0-0', '0-1', '0-2', '0-3'].includes(selectedMenu)"
      :active-index="selectedMenu"
      :current-type="currentType"
      :field="currentField"
      @field-switch="handleFieldSwitch"
      @toggle-year="handleYearChange"
    />
    
    <SurveyMiddleCulture v-else-if="selectedMenu === '1'" @culture-spot-clicked="handleSpotClick" />
    <SurveyRightChart
      v-if="['0-0', '0-1', '0-2'].includes(selectedMenu)"
      :type="currentType"
      :year="currentYear"
    />
    <SurveyRightTable v-else-if="selectedMenu === '0-3'" />
    <SurveyRightCulture v-else-if="selectedMenu === '1'" />
    <SurveyRightWaterQuality v-else-if="selectedMenu === '2-0'" />
    <SurveyRightEcology v-else-if="selectedMenu === '2-1'" />
  </div>
</template>
<script setup>
import { ref } from 'vue'
import SurveyMiddleIntro from '@/components/SurveyMiddleIntro.vue'
import SurveyLeftMenu from './SurveyLeftMenu.vue'
import SurveyRightChart from './SurveyRightChart.vue'
import SurveyRightTable from './SurveyRightTable.vue'
import SurveyRightCulture from './SurveyRightCulture.vue'
import SurveyRightWaterQuality from './SurveyRightWaterQuality.vue'
import SurveyMiddleCulture from './SurveyMiddleCulture.vue'
import SurveyRightEcology from './SurveyRightEcology.vue'

const selectedSpotData = ref(null);

const handleSpotClick = (event) => {
  selectedSpotData.value = event.detail;
}

// 当前选中的菜单项 index
const selectedMenu = ref('0-0')

// 当前展示字段：product | area
const currentField = ref('product')

// 当前物种类型：aquatic、fruit、grain
const typeMap = {
  '0-0': 'aquatic',
  '0-1': 'fruits',
  '0-2': 'grain',
  '0-3': 'labeled'
}
const currentType = ref(typeMap[selectedMenu.value] || 'aquatic')

const handleMenuSelect = (index) => {
  selectedMenu.value = index
  currentField.value = 'product' 
  currentType.value = typeMap[index] || ''
}
const currentYear = ref(2021)

const handleYearChange = (newYear) => {
  currentYear.value = newYear
}

// 接收地图组件点击“产量/面积”的切换
const handleFieldSwitch = (field) => {
  currentField.value = field
}
</script>
<style scoped>
.container .main {
  flex: 1;
  overflow: hidden;
  display: flex;
  width: 100%;
}
.content {
  display: flex;
  height: calc(100% - 64px);
  width: 100%;
}
</style>
