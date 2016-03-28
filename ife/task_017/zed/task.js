/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

var elements = {
  timeRadio: document.getElementsByName("gra-time"),
  timeSelect: document.getElementById("form-gra-time"),
  citySelect: document.getElementById("city-select"),
  aqiChart: document.getElementsByClassName("aqi-chart-wrap")[0],
  title: document.getElementsByClassName("title")[0],
  text: document.getElementById("text"),
}

// helpers function
function addEvent(ele, event, listener) {
  if (ele.addEventListener) {
    ele.addEventListener(event, listener, false);
  } else if (ele.attachEvent) {
    ele.attachEvent("on" + event, listener);
  } else {
    ele["on" + event] = listener;
  }
}

function sumArr(arr) {
  return arr.reduce(function(a, b) {return a + b}, 0);
}

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: 0,
  nowGraTime: "day"
}

/**
 * 渲染图表
 */
function randomColor() {
  var rand = Math.floor(Math.random() * 0xffffff).toString(16);
  if (rand.length === 6) {
    return rand;
  } else {
    return randomColor();
  }
}

function showDetail(e) {
  e.childNodes[0].style.visibility = 'visible';
}

function hideDetail(e) {
  e.childNodes[0].style.visibility = 'hidden';
}

function renderChart() {
  elements.aqiChart.innerHTML = '';
  for (item in chartData) {
    var height = chartData[item];
    var color = randomColor(); 
    elements.aqiChart.innerHTML += `<div class="chart_item" onmouseover="showDetail(this)" onmouseout="hideDetail(this)" style="height: ${height}px; width: 50px; background-color: #${color}"><span class="detail">日期： ${item}<br />质量： ${height}</span></div>`;
  }
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  // 确定是否选项发生了变化 
  if (pageState.nowGraTime === this.value) {
    return
  } else {
    pageState.nowGraTime = this.value;
    initAqiChartData();
  }

  // 设置对应数据

  // 调用图表渲染函数
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 
  if (pageState.nowSelectCity === elements.citySelect.selectedIndex) {
    return
  } else {
    pageState.nowSelectCity = elements.citySelect.selectedIndex;
    initAqiChartData();
  }

  // 设置对应数据

  // 调用图表渲染函数
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  for (var i=0; i<elements.timeRadio.length; i++) {
    addEvent(elements.timeRadio[i], "click", graTimeChange);
  }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var cities = Object.keys(aqiSourceData);
  elements.citySelect.innerHTML = "";
  for (city in aqiSourceData) {
    elements.citySelect.innerHTML += `<option>${city}</option>`;
  }

  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  addEvent(elements.citySelect, "change", citySelectChange);

}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  chartData = {};
  var rawData = aqiSourceData[elements.citySelect.value];
  // 处理好的数据存到 chartData 中
  switch (pageState.nowGraTime) {
    case 'day':
      chartData = rawData;
      break;
    case 'week':
      var dayCount = 0;
      var valueCount = 0;
      var week = 1;
      for (item in rawData) {
        var weekday = new Date(item).getDay();
        if (weekday < 6) {
          dayCount += 1;
          valueCount += rawData[item];
        } else {
          dayCount += 1;
          valueCount += rawData[item];
          chartData[`2016年第${week}周`] = parseInt(valueCount / dayCount);
          dayCount = 0;
          valueCount = 0;
          week += 1;
        }
      }
      chartData[`2016年第${week}周`] = parseInt(valueCount / dayCount);
      break;
    case 'month':
      var month = 0;
      var avgValue = 0;
      for (item in rawData) {
        month = new Date(item).getMonth() + 1;
        if (`2016年第${month}月` in chartData) {
          chartData[`2016年第${month}月`].push(rawData[item]);
        } else {
          chartData[`2016年第${month}月`] = [];
        }
      }

      for (mth in chartData) {
        chartData[mth] = parseInt(sumArr(chartData[mth]) / chartData[mth].length);
      }
      break;
  }
  renderChart();
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm();
  initCitySelector();
  initAqiChartData();
}

init();
