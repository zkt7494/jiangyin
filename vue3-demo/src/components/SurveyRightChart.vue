<!-- SurveyRightCharts.vue -->
<template>
    <div   class="right">
        <div   class="card">
            <div   class="head">
                <span class="head-icon">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD3SURBVHgB7ZZBDoIwEEWnRO8BR/AGcASP4A10r5HE4BpPBDeh3gDXmo5t3Bmh81viqm/DggnzGH6mECUSiUj4fj1TBIoiYd2wvfTEz50qak0gma+Ah0tJfkpS646HOicQr4B7uFAi/0iIaiEBUCLrkFxIBRAJ+924lkogAriEbry5QAUwCUE4QwRQidlwhgoESPwOZ4wAjjEPWlCgV8WpF9aOxKZSxbH9vrGiMJDm2q7pampNh0wAaM7ujNjMnRHoBOTN2dxs7d5XhkwAaM4HSXOHdALS5i5sWyAfIgFp89mwTbHQD4kL28u+eT3Sv7HbsKVEIhHBG9eigWviToOVAAAAAElFTkSuQmCC" width="16" height="16">
                </span>
                <span   class="title"> 各行政区产量和面积 </span>
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
import { onMounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  year: Number,
  type: String 
})
let chart = null

const loadChart = async (year, type) => {
  const dom = document.getElementById('chartMb')
  if (!dom || !year || !type) return

  if (!chart) {
    chart = echarts.init(dom)
  } else {
    chart.clear()
  }

  try {
    const res = await fetch(`/api/material/${year}`)
    const data = await res.json()
    if (!Array.isArray(data)) return

    // 处理数据
    const transformed = data.map(i => ({
      name: i.districtName,
      product: Number((+(i[`${type}Product`] || 0)).toFixed(2)),
      area: Number((+(i[`${type}Area`] || 0)).toFixed(2))
    }))

    // 排序
    const sorted = transformed.sort((a, b) => b.product - a.product)

    const names = sorted.map(i => i.name)
    const products = sorted.map(i => i.product)
    const areas = sorted.map(i => i.area)

    chart.setOption({
      backgroundColor: 'rgba(2, 16, 50, 0.4)',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: params => {
          const name = params[0].name
          const lines = params.map(p => {
            const unit = p.seriesName.includes('面积') ? '亩' : '吨'
            return `${p.marker} ${p.seriesName}: ${p.value} ${unit}`
          })
          return `${name}<br/>${lines.join('<br/>')}`
        },
        backgroundColor: 'rgba(9,40,84,0.8)',
        borderColor: 'rgba(9,40,84,0.8)',
        textStyle: {
          fontSize: 14,
          color: '#fff'
        }
      },
      legend: {
        data: ['产量（吨）', '面积（亩）'],
        textStyle: { color: '#fff' },
        top: 5 
      },
      grid: {
        left: '3%',
        right: '12%', 
        top: 40,      
        bottom: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        show: false
      },
      yAxis: {
        type: 'category',
        data: names,
        inverse: true,
        axisLabel: {
          color: '#fff',
          fontSize: 14
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(180, 228, 255, 0.3)',
            width: 1
          }
        },
        axisTick: { show: false },
        splitLine: { show: false }
      },
      series: [
        {
          name: '产量（吨）',
          type: 'bar',
          data: products,
          barWidth: 8,
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.3)'
          },
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: 'rgba(24, 144, 255, 0.35)' },
              { offset: 1, color: '#1890FF' }
            ])
          },
          z: 3
        },
        {
          name: '面积（亩）',
          type: 'bar',
          data: areas,
          barWidth: 8,
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.3)'
          },
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: 'rgba(251, 176, 59, 0.35)' },
              { offset: 1, color: '#fbb03b' }
            ])
          },
          z: 2
        },
        {
          name: 'label',
          type: 'bar',
          data: products.map((_, i) => ({
            value: Math.max(products[i], areas[i]),
            product: products[i],
            area: areas[i]
          })),
          barWidth: 1,
          itemStyle: { color: 'transparent' },
          label: {
            show: true,
            position: 'right',
            color: '#fff',
            fontSize: 12,
            lineHeight: 16,
            formatter: p =>
              `${p.data.product.toFixed(2)} 吨\n${p.data.area.toFixed(2)} 亩`
          },
          tooltip: { show: false },
          z: 10
        }
      ]
    })
  } catch (err) {
    console.error('图表加载失败:', err)
  }
}

watch(
  () => [props.year, props.type],
  ([newYear, newType]) => {
    loadChart(newYear, newType)
  },
  { immediate: true }
)

onMounted(() => {
  loadChart(props.year, props.type)
})
</script>


<style scoped>
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
.title{
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

</style>










