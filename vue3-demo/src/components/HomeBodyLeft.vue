<!-- HomeBodyLeft.vue -->
<template>
    <div class="left-column">
        <div class="card">
            <div class="head">
                <span class="head-icon">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD3SURBVHgB7ZZBDoIwEEWnRO8BR/AGcASP4A10r5HE4BpPBDeh3gDXmo5t3Bmh81viqm/DggnzGH6mECUSiUj4fj1TBIoiYd2wvfTEz50qak0gma+Ah0tJfkpS646HOicQr4B7uFAi/0iIaiEBUCLrkFxIBRAJ+924lkogAriEbry5QAUwCUE4QwRQidlwhgoESPwOZ4wAjjEPWlCgV8WpF9aOxKZSxbH9vrGiMJDm2q7pampNh0wAaM7ujNjMnRHoBOTN2dxs7d5XhkwAaM4HSXOHdALS5i5sWyAfIgFp89mwTbHQD4kL28u+eT3Sv7HbsKVEIhHBG9eigWviToOVAAAAAElFTkSuQmCC" width="16" height="16">
                </span>
                <span class="title"> 全市物质供给类产量和面积 </span>
                <div class="head-bottom">
                <div class="head-bottom-left"></div>
                <div class="head-bottom-right"></div>
                </div>
            </div>
            <div   id="chart1" _echarts_instance_="ec_1742795978558" style="width: 100%; height: 400px; user-select: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); position: relative;">
                <div style="position: relative; width: 194px; height: 469px; padding: 0px; margin: 0px; border-width: 0px; cursor: default;" class="">
                    <canvas data-zr-dom-id="zr_0" width="194" height="469" style="position: absolute; 
                    left: 0px; top: 0px; width: 194px; height: 469px; user-select: none;
                     -webkit-tap-highlight-color: rgba(0, 0, 0, 0); padding: 0px; margin: 0px; border-width: 0px;">
                     </canvas>
                </div>
            </div>
        </div>
        <div    class="flex-card card">
            <div class="flex-head">
                <span class="head-icon">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD3SURBVHgB7ZZBDoIwEEWnRO8BR/AGcASP4A10r5HE4BpPBDeh3gDXmo5t3Bmh81viqm/DggnzGH6mECUSiUj4fj1TBIoiYd2wvfTEz50qak0gma+Ah0tJfkpS646HOicQr4B7uFAi/0iIaiEBUCLrkFxIBRAJ+924lkogAriEbry5QAUwCUE4QwRQidlwhgoESPwOZ4wAjjEPWlCgV8WpF9aOxKZSxbH9vrGiMJDm2q7pampNh0wAaM7ujNjMnRHoBOTN2dxs7d5XhkwAaM4HSXOHdALS5i5sWyAfIgFp89mwTbHQD4kL28u+eT3Sv7HbsKVEIhHBG9eigWviToOVAAAAAElFTkSuQmCC" width="16" height="16">
                </span>
                <span class="title"> 全市文化服务类产品 </span>
                <div class="head-bottom">
                    <div class="head-bottom-left"></div>
                    <div class="head-bottom-right"></div>
                </div>
            </div>
            <div  class="card-body">
                <div   id="cityGreenLand-charts" class="cityGreenLand-charts" _echarts_instance_="ec_1742795978561" style="user-select: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); position: relative;">
                    <div style="position: relative; width: 203px; height: 500px; padding: 0px; margin: 0px; border-width: 0px; cursor: default;">
                        <canvas width="203" height="500" style="width: 203px; height: 500px; position: absolute; left: 0px; top: 0px;"></canvas>
                        <canvas data-zr-dom-id="zr_0" width="203" height="500" style="position: absolute; left: 0px; top: 0px; width: 203px; height: 500px; user-select: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); padding: 0px; margin: 0px; border-width: 0px;"></canvas>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  year: Number
})

onMounted(() => {
  loadMaterialChart(props.year)
  loadCultureChart()
})

watch(() => props.year, (newYear) => {
  loadMaterialChart(newYear)
})

// 左侧柱状图
async function loadMaterialChart(year) {
  const res = await fetch(`/api/material/${year}`)
  const data = await res.json()
  if (!Array.isArray(data)) return

  const names = data.map(i => i.districtName)
  const products = data.map(i => ((+i.fruitsProduct || 0) + (+i.grainProduct || 0) + (+i.aquaticProduct || 0)).toFixed(0))
  const areas = data.map(i => ((+i.fruitsArea || 0) + (+i.grainArea || 0) + (+i.aquaticArea || 0)).toFixed(0))

  const chartDom = document.getElementById('chart1')
  let chart = echarts.getInstanceByDom(chartDom)

  if (!chart) {
    chart = echarts.init(chartDom)  
  } else {
    chart.clear() // 清空之前的配置和数据
  }
  chart.setOption({
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['产量（吨）', '面积（亩）'],
      top: '4%',
      itemWidth: 30,
      itemHeight: 20,
      textStyle: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold'
      },
      textStyle: { color: '#fff' }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'value',
      axisLabel: { color: '#fff' }
    },
    yAxis: {
      type: 'category',
      data: names,
      axisLabel: { color: '#fff' }
    },
    series: [
      {
        name: '产量（吨）',
        type: 'bar',
        data: products,
        itemStyle: { color: '#42A1FF' }
      },
      {
        name: '面积（亩）',
        type: 'bar',
        data: areas,
        itemStyle: { color: '#FF8C00' }
      }
    ]
  })
}

// 右侧文化类饼图
async function loadCultureChart() {
  const res = await fetch('/api/countCulture')
  const raw = await res.json()

  const data = [
    { name: '场馆', value: raw.place || 0, color: '#f5a623' },
    { name: '文物', value: (raw.nationalCulturalRelics || 0) + (raw.provincialCulturalRelics || 0), color: '#7bd5d3' },
    { name: '景点', value: raw.aScenicSpot || 0, color: '#4a90e2' },
    { name: '示范村', value: raw.ruralModelVillage || 0, color: '#c38fff' }
  ]

  const total = data.reduce((sum, i) => sum + i.value, 0)

  const chart = echarts.init(document.getElementById('cityGreenLand-charts'))
  chart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{b}<br/>数量：{c}个<br/>占比：{d}%'
    },
    legend: {
      orient: 'horizontal',
      top: '8%',
      left: 'center',
      itemGap: 15,
      itemWidth: 20,
      itemHeight: 20,
      textStyle: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold'
      },
      formatter: (name) => {
        const item = data.find(d => d.name === name)
        if (!item) return name
        const percent = ((item.value / total) * 100).toFixed(2)
        return `${item.name}  ${item.value}个  ${percent}%`
      }
    },
    series: [
      {
        name: '文化类',
        type: 'pie',
        radius: ['40%', '58%'], // 缩小一点避免压住图例
        center: ['50%', '50%'], // 稍微往下放
        label: {
          show: true,
          position: 'center',
          formatter: `{count|${total}}\n{title|文化类}`,
          rich: {
            title: {
              fontSize: 16,
              color: '#ffffff',
              fontFamily: 'YouSheBiaoTiHei',
              padding: [6, 0]
            },
            count: {
              fontSize: 32,
              color: '#2defff',
              fontFamily: 'YouSheBiaoTiHei'
            }
          }
        },
        labelLine: { show: false },
        itemStyle: {
          borderColor: '#0f2d49',
          borderWidth: 4,
          shadowBlur: 15,
          shadowColor: 'rgba(0, 0, 0, 0.4)'
        },
        data: data.map(d => ({
          name: d.name,
          value: d.value,
          itemStyle: {
            color: d.color,
            borderRadius: 6
          }
        }))
      }
    ]
  })
}
</script>


<style scoped>
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
.title {
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
.left-column {
    order: 1;
    width: 25%;
    height: 100%;
    display: flex;
    flex-direction: column;
    margin: 0 5px 5px 5px;
}
.card {
    width: 100%;
}
#chart1 {
    margin-left: 2px;
    margin-right: 2px;
}
.card {
    order: 2;
    width: 472px;
    height: 450px;
}
.flex-card {
    display: flex !important;
    flex-direction: column;
    width: 100%;
}
.flex-head {
    order: 1;
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
.head-bottom {
    height: 4px;
}
.card-body {
    display: flex !important;
    order: 2;
    flex: 1;
}
.cityGreenLand-charts {
    bottom: 25px;
    left: 0;
    width: 470px;
    height: 500px;
    z-index: 1;
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
</style>