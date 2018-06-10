$(function() {
  // 创建LeTao对象
  var letao = new LeTao();
  // 初始化top-category
  letao.initTopCategory();
  // 初始化second-category
  letao.initSecondCategory(1);
  letao.secondCategory();
  // 初始化区域滚动
  letao.initSecondCategoryScroll();
});

// 定义LeTao构造函数
var LeTao = function() {};
// 所有category.html的功能挂载在LeTao构造函数的原型上
LeTao.prototype = {
  // TopCategory初始化
  initTopCategory: function() {
    $.ajax({
      url: "http://127.0.0.1:3000/category/queryTopCategory",
      // type:"get", get可以不写
      success: function(backData) {
        console.log(backData);
        var html = template("categoryTopTem", backData);
        if (html) {
          $(".topCategory").html(html);
        }
      }
    });
  },
  // 初始化second-category
  initSecondCategory: function(id) {
    $.ajax({
      url: "http://127.0.0.1:3000/category/querySecondCategory",
      data: {
        id: id
      },
      success: function(backData) {
        console.log(backData);
        var html = template("secondCategoryTem", backData);
        if (html) {
          $(".secondCategory").html(html);
        }
      }
    });
  },
  //根据topCategory的id动态生成相应的secondCategory数据
  secondCategory: function(e) {
    $(".topCategory").on("click", "li", e => {
      this.initSecondCategory($(e.target).data("id"));
    });
  },
  // 初始化secondCategory区域滚动
  initSecondCategoryScroll: function() {
    var options = {
      scrollY: true, //是否竖向滚动
      scrollX: false, //是否横向滚动
      startX: 0, //初始化时滚动至x
      startY: 0, //初始化时滚动至y
      indicators: false, //是否显示滚动条
      deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏
      bounce: true //是否启用回弹
    };
    mui(".mui-scroll-wrapper").scroll(options);
  }
};
