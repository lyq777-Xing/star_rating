let starContainer = document.querySelectorAll(".star-container");
const submitButton = document.querySelector("#submit");
const message = document.querySelector("#message");
const submitSection = document.querySelector("#submit-section");

let events = {
  mouse: {
    over: "click",
  },
  touch: {
    over: "touchstart",
  },
};

let deviceType = "";
const isTouchDevice = () => {
  try {
    document.createEvent("TouchEvent");
    deviceType = "touch";
    return true;
  } catch (e) {
    deviceType = "mouse";
    return false;
  }
};

isTouchDevice();

starContainer.forEach((element, index) => {
  element.addEventListener(events[deviceType].over, () => {
    submitButton.disabled = false;
    if (element.classList.contains("inactive")) {
      ratingUpdate(0, index, true);
    } else {
      ratingUpdate(index, starContainer.length - 1, false);
    }
  });
});

const ratingUpdate = (start, end, active) => {
  for (let i = start; i <= end; i++) {
    if (active) {
      starContainer[i].classList.add("active");
      starContainer[i].classList.remove("inactive");
      starContainer[i].firstElementChild.className = "fa-star fa-solid";
    } else {
      starContainer[i].classList.remove("active");
      starContainer[i].classList.add("inactive");
      starContainer[i].firstElementChild.className = "fa-star fa-regular";
    }
  }
  let activeElements = document.getElementsByClassName("active");
  if (activeElements.length > 0) {
    switch (activeElements.length) {
      case 1:
        message.innerText = "Terrible";
        break;
      case 2:
        message.innerText = "Bad";
        break;
      case 3:
        message.innerText = "Satisfied";
        break;
      case 4:
        message.innerText = "Good";
        break;
      case 5:
        message.innerText = "Excellent";
        break;
    }
  } else {
    message.innerText = "";
  }
};

submitButton.addEventListener("click", () => {
  submitSection.classList.remove("hide");
  submitSection.classList.add("show");
  submitButton.disabled = true;
});
window.onload = () => {
  submitButton.disabled = true;
  submitSection.classList.add("hide");
};


function push() {
  const username = GetQueryString("username");
  let activeElements = document.getElementsByClassName("active");
  document.getElementById("code").innerHTML ="";
  console.log(activeElements.length);
  config = {
    locateFile: filename => `/dist/${filename}`
  }
  initSqlJs(config).then(function(SQL){
    const db = new SQL.Database();
    db.run("CREATE TABLE rate (user, code);");
    db.run("INSERT INTO rate VALUES (?,?), (?,?),(?,?)", ["admin","3","user","4",username,activeElements.length]);
    const stmt = db.prepare("SELECT * FROM rate");
    while(stmt.step()) { //
      const row = stmt.getAsObject();
      console.log(row);
      console.log('Here is a row: ' + JSON.stringify(row));
      var html = "用户名：" + row.user + "  评分：" + row.code +  "<br>";
      // 3. 将元素添加到HTML文档中
      document.getElementById("code").innerHTML += html; // 将元素添加到<body>标签中
    }
  });
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
    var context = "";
    if (r != null)
        context = decodeURIComponent(r[2]);
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ? "" : context;
}
