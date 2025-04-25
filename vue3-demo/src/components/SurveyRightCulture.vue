<!-- SurveyRightCulture.vue -->
<template>
    <div   class="right">
        <div   class="card">
            <div   class="head">
                <span class="head-icon">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD3SURBVHgB7ZZBDoIwEEWnRO8BR/AGcASP4A10r5HE4BpPBDeh3gDXmo5t3Bmh81viqm/DggnzGH6mECUSiUj4fj1TBIoiYd2wvfTEz50qak0gma+Ah0tJfkpS646HOicQr4B7uFAi/0iIaiEBUCLrkFxIBRAJ+924lkogAriEbry5QAUwCUE4QwRQidlwhgoESPwOZ4wAjjEPWlCgV8WpF9aOxKZSxbH9vrGiMJDm2q7pampNh0wAaM7ujNjMnRHoBOTN2dxs7d5XhkwAaM4HSXOHdALS5i5sWyAfIgFp89mwTbHQD4kL28u+eT3Sv7HbsKVEIhHBG9eigWviToOVAAAAAElFTkSuQmCC" width="16" height="16">
                </span>
                <span   class="title"> 徐霞客故居 </span>
                <div class="head-bottom">
                    <div class="head-bottom-left"></div>
                    <div class="head-bottom-right"></div>
                </div>
            </div>
            <!--  轮播图 -->
            <div class="swiper-container">
              <swiper-container
              :slidesPerView="1"
              :slidesPerGroup="1"
              :autoplay="{ delay: 3000, disableOnInteraction: false }"
              :loop="true"
                navigation='{"nextEl": ".swiper-button-next", "prevEl": ".swiper-button-prev"}'
                class="swiper-initialized swiper-horizontal swiper-backface-hidden"
              >
                <!-- 左右按钮 -->
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
            
                <!-- 图片滑块 -->
                <swiper-slide v-for="(img, i) in images" :key="i">
                  <img :src="img" class="swiper-img" />
                </swiper-slide>
              </swiper-container>
            </div>
            <div data-v-79f4f0da="" data-v-293c28f5="" class="description">徐霞客故居：2A级景区，由故居、胜水桥、晴山堂石刻、徐霞客墓和仰圣园等组成。</div>
<!-- 。。。。。。。。。。。。。。。。。。。。。。。。 -->
            <div   class="head">
                <span class="head-icon">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD3SURBVHgB7ZZBDoIwEEWnRO8BR/AGcASP4A10r5HE4BpPBDeh3gDXmo5t3Bmh81viqm/DggnzGH6mECUSiUj4fj1TBIoiYd2wvfTEz50qak0gma+Ah0tJfkpS646HOicQr4B7uFAi/0iIaiEBUCLrkFxIBRAJ+924lkogAriEbry5QAUwCUE4QwRQidlwhgoESPwOZ4wAjjEPWlCgV8WpF9aOxKZSxbH9vrGiMJDm2q7pampNh0wAaM7ujNjMnRHoBOTN2dxs7d5XhkwAaM4HSXOHdALS5i5sWyAfIgFp89mwTbHQD4kL28u+eT3Sv7HbsKVEIhHBG9eigWviToOVAAAAAElFTkSuQmCC" width="16" height="16">
                </span>
                <span   class="title"> 全市文化产品 </span>
                <div class="head-bottom">
                    <div class="head-bottom-left"></div>
                    <div class="head-bottom-right"></div>
                </div>
            </div>
            <div  class="card-body">
                <div id="cityGreenLand-charts" class="cityGreenLand-charts" _echarts_instance_="ec_1744101632643" style="user-select: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); position: relative;">
                    <div style="position: relative; width: 470px; height: 460px; padding: 0px; margin: 0px; border-width: 0px; cursor: default;">
                        <canvas width="470" height="460" style="width: 470px; height: 460px; position: absolute; left: 0px; top: 0px;"></canvas><canvas data-zr-dom-id="zr_0" width="470" height="460" style="position: absolute; left: 0px; top: 0px; width: 470px; height: 460px; user-select: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); padding: 0px; margin: 0px; border-width: 0px;">

                        </canvas>
                    </div>
                </div>
                <div class="bg">

                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
const images = [
  '/culture/xxkgj1.jpg',
  '/culture/xxkgj2.jpg',
  '/culture/xxkgj3.jpg',
  '/culture/xxkgj1.jpg',
  '/culture/xxkgj2.jpg',
  '/culture/xxkgj3.jpg'
]
// 饼图。。。。
onMounted(() => {
    nextTick(() => {
    loadCultureChart()
  })
})
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
        radius: ['40%', '58%'], 
        center: ['50%', '50%'], // 图表位置
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

.swiper-container {
    width: 464px;
    height: 312px;
    border-radius: 8px;
    margin: 8px 0 8px 0;
    padding: 8px;
    background-color: hsla(0, 0%, 100%, .1);
    display: flex;
    flex-direction: row;
}
.swiper-horizontal {
    touch-action: pan-y;
}
.swiper, swiper-container {
    margin-left: auto;
    margin-right: auto;
    position: relative;
    overflow: hidden;
    list-style: none;
    padding: 0;
    z-index: 1;
    display: block;
}
.swiper-button-next, .swiper-button-prev {
    z-index: 999;
}
.swiper-button-next, :host(.swiper-rtl) .swiper-button-prev {
    right: var(--swiper-navigation-sides-offset, 10px);
    left: auto;
}
.swiper-button-next, .swiper-button-prev {
    position: absolute;
    top: var(--swiper-navigation-top-offset, 50%);
    width: calc(var(--swiper-navigation-size) / 44 * 27);
    height: var(--swiper-navigation-size);
    margin-top: calc(0px - (var(--swiper-navigation-size) / 2));
    z-index: 10;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--swiper-navigation-color, var(--swiper-theme-color));
}
.swiper-img {
    width: 100%;
    height: 100%;
    -o-object-fit: cover;
    object-fit: cover;
}
.swiper-backface-hidden swiper-slide {
    transform: translateZ(0);
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
}
swiper-slide {
    flex-shrink: 0;
    width: 100%;
    height: 100%;
    position: relative;
    transition-property: transform;
    display: block;
}
.description {
    color: rgba(255, 255, 255, 0.8);
    width: 97%;
    margin-left: 2%;
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
</style>
