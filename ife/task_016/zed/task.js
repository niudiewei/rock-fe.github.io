/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
  console.log('begin collect data');
  var errorCount = 0;
  var input = {
    city: document.getElementById("aqi-city-input"),
    quality: document.getElementById("aqi-value-input"),
    cityError: document.getElementById("city-error"),
    qualityError: document.getElementById("quality-error"),
  }

  if (!input.city.value.match(/^[A-Za-z\u4E00-\u9FA5]+$/) && !input.cityError) {
    var newNode = document.createElement('span');
    newNode.id = "city-error";
    newNode.innerHTML = '请输入中英文字符的城市';
    input.city.parentNode.appendChild(newNode);
    errorCount += 1;
  }

  if (!input.quality.value.match(/^\d+$/) && !input.qualityError) {
    var newNode = document.createElement('span');
    newNode.id = "quality-error";
    newNode.innerHTML = '请输入整数';
    input.quality.parentNode.appendChild(newNode);
    errorCount += 1;
  }

  if (errorCount >= 1) {
    return errorCount;
  }

  if (input.cityError && input.city.value.match(/^[A-Za-z\u4E00-\u9FA5]+$/)) {
    input.city.parentNode.removeChild(input.cityError);
  } else {
    errorCount += 1;
  }

  if (input.qualityError && input.quality.value.match(/^\d+$/)) {
    input.quality.parentNode.removeChild(input.qualityError);
  } else {
    errorCount += 1;
  }

  if (input.city.value.match(/^[A-Za-z\u4E00-\u9FA5]+$/) && input.quality.value.match(/^\d+$/)) {
    aqiData[input.city.value] = input.quality.value;
    errorCount = 0;
  }
  return errorCount;
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
  document.getElementById("aqi-table").innerHTML = "";
  document.getElementById("aqi-table").innerHTML += `<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>`;
  var count = 1;
  for (data in aqiData) {
    var className = "del" + 1;
    document.getElementById("aqi-table").innerHTML += `<tr><td>${data}</td><td>${aqiData[data]}</td><td><button onclick="delBtnHandle('${data}')">删除</button></td></tr>`;
    count += 1;
  }
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  var errorCount = addAqiData();
  console.log('errorCount: ', errorCount);
  if (errorCount <1) {
    renderAqiList();
  }
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(city) {
  // do sth.
  delete aqiData[city];

  renderAqiList();
}

function init() {

  var addBtn = document.getElementById("add-btn");
  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  addBtn.onclick = addBtnHandle;

  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  
}

init();
