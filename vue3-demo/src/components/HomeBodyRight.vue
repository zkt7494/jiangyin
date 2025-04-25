<!-- HomeBodyRight.vue -->
<template>
<div class="right-column">
    <div class="card">
        <div class="head">
            <span class="head-icon">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD3SURBVHgB7ZZBDoIwEEWnRO8BR/AGcASP4A10r5HE4BpPBDeh3gDXmo5t3Bmh81viqm/DggnzGH6mECUSiUj4fj1TBIoiYd2wvfTEz50qak0gma+Ah0tJfkpS646HOicQr4B7uFAi/0iIaiEBUCLrkFxIBRAJ+924lkogAriEbry5QAUwCUE4QwRQidlwhgoESPwOZ4wAjjEPWlCgV8WpF9aOxKZSxbH9vrGiMJDm2q7pampNh0wAaM7ujNjMnRHoBOTN2dxs7d5XhkwAaM4HSXOHdALS5i5sWyAfIgFp89mwTbHQD4kL28u+eT3Sv7HbsKVEIhHBG9eigWviToOVAAAAAElFTkSuQmCC" width="16" height="16">
            </span>
            <span class="title"> 全市价值量总计 </span>
            <div class="head-bottom">
                <div class="head-bottom-left"></div>
                <div class="head-bottom-right"></div>
            </div>
        </div>
        <div class="index-container">
            <div class="index">
                <img src="@/icons/icon-wz.dc1041a3.png" width="64px" height="64px">
                <div class="index-type">
                    <span class="span-index-type">物质供给类</span>
                    <span class="span-index-unit">(亿元)</span>
                </div>
                <div class="index-text">{{ cityValue.material }}</div>
            </div>
            <div class="index">
                <img src="@/icons/icon-wh.2676ccaa.png" width="64px" height="64px">
                <div class="index-type">
                    <span class="span-index-type">文化服务类</span>
                    <span class="span-index-unit">(亿元)</span>
                </div>
                <div class="index-text">{{ cityValue.culture }}</div>
            </div>
            <div class="index">
                <img src="@/icons/icon-st.76109a7d.png" width="64px" height="64px">
                <div class="index-type">
                    <span class="span-index-type">调节服务类</span>
                    <span class="span-index-unit">(亿元)</span>
                </div>
                <div class="index-text">{{ cityValue.ecology }}</div>
            </div>
        </div>
        <div class="sum-container">
            <div class="sumone">各类生态产品总价值：</div>
            <div class="sumtwo">{{ ((cityValue.material || 0) + (cityValue.culture || 0) + (cityValue.ecology || 0)).toFixed(1) }}</div>
            <div class="sumthree">亿元</div>
        </div>
    </div>
    <div class="card">
        <div class="head">
            <span class="head-icon">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD3SURBVHgB7ZZBDoIwEEWnRO8BR/AGcASP4A10r5HE4BpPBDeh3gDXmo5t3Bmh81viqm/DggnzGH6mECUSiUj4fj1TBIoiYd2wvfTEz50qak0gma+Ah0tJfkpS646HOicQr4B7uFAi/0iIaiEBUCLrkFxIBRAJ+924lkogAriEbry5QAUwCUE4QwRQidlwhgoESPwOZ4wAjjEPWlCgV8WpF9aOxKZSxbH9vrGiMJDm2q7pampNh0wAaM7ujNjMnRHoBOTN2dxs7d5XhkwAaM4HSXOHdALS5i5sWyAfIgFp89mwTbHQD4kL28u+eT3Sv7HbsKVEIhHBG9eigWviToOVAAAAAElFTkSuQmCC" width="16" height="16">
            </span>
            <span class="title"> 调节服务类价值量与占比 </span>
            <div class="head-bottom">
                <div class="head-bottom-left"></div>
                <div class="head-bottom-right"></div>
            </div>
        </div>   
        <div class="table-rb">
            <div class="row">
                <div class="icon-column">&nbsp;</div>
                <div class="first-column">&nbsp;</div>
                <div class="value-column">价值量（万元）</div>
                <div class="value-column">占比（ % ）</div>
            </div>
            <div class="row" v-for="(item, index) in tableData" :key="index">
                 <div class="icon-column">
                   <img :src="item.icon" width="32" height="32" />
                 </div>
                 <div class="first-column">{{ item.name }}</div>
                 <div class="value-column">{{ item.value }}</div>
                 <div class="value-column">{{ item.percent }}</div>
            </div>
        </div>
    </div>
</div>
</template>
<script setup>
import { onMounted, watch, ref } from 'vue'

const props = defineProps({ year: Number })
const cityValue = ref({})
const tableData = ref([])

async function loadRightData(year) {
  // 获取全市价值量统计
  const res1 = await fetch(`/api/cityValue/${year}`)
  const data1 = await res1.json()
  cityValue.value = data1

  // 获取调节服务类数据
  const res2 = await fetch(`/api/ecologyFunctionValue/${year}`)
  const data2 = await res2.json()
  const ecologyTotalValue = (
  data2.airv +
  data2.o2v +
  data2.co2v +
  data2.cliv +
  data2.soilv +
  data2.waterqv +
  data2.floodv +
  data2.waterv +
  data2.windsandv +
  data2.noisev
)
  tableData.value = [
    { icon: '/icons/table1.png', name: '水源涵养', value: data2.waterv, percent: data2.watervPer },
    { icon: '/icons/table2.png', name: '土壤保持', value: data2.soilv, percent: data2.soilvPer },
    { icon: '/icons/table3.png', name: '防风固沙', value: data2.windsandv, percent: data2.windsandvPer },
    { icon: '/icons/table4.png', name: '洪水调蓄', value: data2.floodv, percent: data2.floodvPer },
    { icon: '/icons/table5.png', name: '空气净化', value: data2.airv, percent: data2.airvPer },
    { icon: '/icons/table6.png', name: '水质净化', value: data2.waterqv, percent: data2.waterqvPer },
    { icon: '/icons/table7.png', name: '碳固定', value: data2.co2v, percent: data2.co2vPer },
    { icon: '/icons/table8.png', name: '氧气提供', value: data2.o2v, percent: data2.o2vPer },
    { icon: '/icons/table9.png', name: '气候调节', value: data2.cliv, percent: data2.clivPer },
    { icon: '/icons/table10.png', name: '噪声消减', value: data2.noisev, percent: data2.noisevPer },
    {
      icon: '/icons/table11.png',
      name: '总计',
      value: ecologyTotalValue,
      percent: 100
    }
  ]
}

onMounted(() => loadRightData(props.year))
watch(() => props.year, (newVal) => loadRightData(newVal))

</script>
<style scoped>
.right-column {
    order: 3;
    width: 25%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.card {
    width: 100%;
    order: 1;
    flex: 1;
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
.index-container {
    display: flex;
    flex-direction: row;
    text-align: center;
}
.index {
    width: 158px;
    height: 140px;
    padding: 10px;
}
.span-index-type {
    color: #cde1f8;
    
}
.span-index-unit {
    color: #5bb0ff;
}
.index-text {
    font-size: 2em;
    color: #fff;
}
.sum-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    color: #fff;
}
.sumone {
    color: #fff;
    font-size: 20px;
    font-family: YouSheBiaoTiHei;
}
.sumtwo {
    color: transparent;
    font-size: 40px;
    font-family: YouSheBiaoTiHei;
    background-image: -webkit-linear-gradient(top, #fff, #c89000);
    background-clip: text;
}
.sumthree {
    color: #fff;
    font-size: 25px;
    font-family: YouSheBiaoTiHei;
}
.table-rb {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 500px;
}
.row {
    height: 36px;
    display: flex;
    flex-direction: row;
    color: #fff;
    font-size: large;
    padding: 2px;
    background: linear-gradient(90deg, rgba(74, 147, 255, 0), rgba(74, 147, 255, .1) 50%, rgba(74, 147, 255, 0));
}
.icon-column {
    width: 64px;
    padding-top: 4px;
}
.first-column {
    width: 150px;
    text-align: left;
    vertical-align: middle;
    line-height: 36px;
    display: table-cell;
}
.value-column {
    width: 150px;
    text-align: center;
    vertical-align: middle;
    line-height: 36px;
    display: table;
}
.value-column {
    width: 150px;
    text-align: center;
    vertical-align: middle;
    line-height: 36px;
    display: table;
}
</style>