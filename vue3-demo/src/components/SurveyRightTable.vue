<!-- SurveyRightTable.vue -->
<template>
    <div class="right">
      <div class="card">
        <!-- 标题栏 -->
        <div class="head">
          <span class="head-icon">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD3SURBVHgB7ZZBDoIwEEWnRO8BR/AGcASP4A10r5HE4BpPBDeh3gDXmo5t3Bmh81viqm/DggnzGH6mECUSiUj4fj1TBIoiYd2wvfTEz50qak0gma+Ah0tJfkpS646HOicQr4B7uFAi/0iIaiEBUCLrkFxIBRAJ+924lkogAriEbry5QAUwCUE4QwRQidlwhgoESPwOZ4wAjjEPWlCgV8WpF9aOxKZSxbH9vrGiMJDm2q7pampNh0wAaM7ujNjMnRHoBOTN2dxs7d5XhkwAaM4HSXOHdALS5i5sWyAfIgFp89mwTbHQD4kL28u+eT3Sv7HbsKVEIhHBG9eigWviToOVAAAAAElFTkSuQmCC" width="16" height="16">
          </span>
          <span class="title"> 各行政区两品一标 </span>
          <div class="head-bottom">
            <div class="head-bottom-left"></div>
            <div class="head-bottom-right"></div>
          </div>
        </div>
  
        <!-- 表格部分 -->
        <div
          class="el-table el-table--fit el-table--striped el-table--enable-row-hover el-table--enable-row-transition"
          style="width: 100%;"
        >
          <!-- 表头 -->
          <div class="el-table__header-wrapper">
            <table cellspacing="0" cellpadding="0" border="0" class="el-table__header">
              <colgroup>
                <col width="99" />
                <col width="96" />
                <col width="96" />
                <col width="96" />
                <col width="96" />
              </colgroup>
              <thead class="has-gutter">
                <tr>
                  <th class="el-table__cell" style="text-align: center; color: white; font-size: 15px;">
                    <div class="cell">乡镇名称</div>
                  </th>
                  <th class="el-table__cell" style="text-align: center; color: white; font-size: 15px;">
                    <div class="cell">两品一标(个)</div>
                  </th>
                  <th class="el-table__cell" style="text-align: center; color: white; font-size: 15px;">
                    <div class="cell">绿色食品</div>
                  </th>
                  <th class="el-table__cell" style="text-align: center; color: white; font-size: 15px;">
                    <div class="cell">有机农产品</div>
                  </th>
                  <th class="el-table__cell" style="text-align: center; color: white; font-size: 15px;">
                    <div class="cell">农产品<br>地理标志</div>
                  </th>
                </tr>
              </thead>
            </table>
          </div>
  
          <!-- 表体 -->
          <div class="el-table__body-wrapper">
            <table cellspacing="0" cellpadding="0" border="0" class="el-table__body">
              <colgroup>
                <col width="99" />
                <col width="96" />
                <col width="96" />
                <col width="96" />
                <col width="96" />
              </colgroup>
              <tbody>
                <tr v-for="(item, i) in tableData" :key="i" :class="i % 2 === 0 ? 'el-table__row' : 'el-table__row el-table__row--striped'" style="color: white; text-align: center;">
                  <td class="el-table__cell">
                    <div class="cell">{{ item.name }}</div>
                  </td>
                  <td class="el-table__cell">
                    <div class="cell">{{ item.total }}</div>
                  </td>
                  <td class="el-table__cell">
                    <div class="cell">{{ item.green }}</div>
                  </td>
                  <td class="el-table__cell">
                    <div class="cell">{{ item.organic }}</div>
                  </td>
                  <td class="el-table__cell">
                    <div class="cell">{{ item.geoMark }}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  
  <script setup>
  const tableData = [
    { name: '澄江街道', total: 0, green: 0, organic: 0, geoMark: 0 },
    { name: '南闸街道', total: 2, green: 0, organic: 0, geoMark: 2 },
    { name: '云亭街道', total: 0, green: 0, organic: 0, geoMark: 0 },
    { name: '申港街道', total: 2, green: 0, organic: 0, geoMark: 2 },
    { name: '利港街道', total: 1, green: 0, organic: 0, geoMark: 1 },
    { name: '夏港街道', total: 0, green: 0, organic: 0, geoMark: 0 },
    { name: '璜土镇', total: 5, green: 3, organic: 0, geoMark: 2 },
    { name: '月城镇', total: 8, green: 3, organic: 0, geoMark: 5 },
    { name: '青阳镇', total: 2, green: 1, organic: 0, geoMark: 1 },
    { name: '徐霞客镇', total: 15, green: 7, organic: 0, geoMark: 8 },
    { name: '华士镇', total: 10, green: 1, organic: 2, geoMark: 7 },
    { name: '周庄镇', total: 2, green: 1, organic: 0, geoMark: 1 },
    { name: '新桥镇', total: 0, green: 0, organic: 0, geoMark: 0 },
    { name: '长泾镇', total: 3, green: 2, organic: 1, geoMark: 0 },
    { name: '顾山镇', total: 10, green: 6, organic: 0, geoMark: 4 },
    { name: '祝塘镇', total: 6, green: 5, organic: 0, geoMark: 1 },
    { name: '城东街道', total: 1, green: 1, organic: 0, geoMark: 0 }
  ]
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

/* 表格整体设置透明背景 + 白色文字 */
/* 表格背景完全透明 */
/* 强制让表头的 tr 背景透明 */
.el-table__header-wrapper tr {
  background-color: transparent !important;
}
.el-table,
.el-table__header,
.el-table__body,
.el-table__row,
.el-table__cell {
  background-color: transparent !important;
  color: white;
  font-size: 14px;
}
.el-table__header-wrapper thead {
  background-color: transparent !important;
}
/* 表头文字样式 */
.el-table__header .cell {
  font-size: 15px;
  font-weight: bold;
  text-align: center;
  color: white;
  padding: 6px 0;
}

/* 表体单元格文字居中 + 缩小行高 */
.el-table__body .cell {
  text-align: center;
  padding: 4px 0;
  line-height: 20px;
}

/* 表格边框线条样式 */
.el-table__header th,
.el-table__body td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

/* 斑马纹背景（淡蓝） */
.el-table__row {
  background-color: rgba(0, 123, 255, 0.05) !important;
}
.el-table__row--striped {
  background-color: rgba(0, 123, 255, 0.15) !important;
}

/* 鼠标悬停行高亮（淡绿色） */
.el-table__row:hover {
  background-color: rgba(0, 255, 153, 0.15) !important;
}

/* 表格滚动条隐藏 */
.el-table__body-wrapper {
  overflow: hidden;
}
</style>
  