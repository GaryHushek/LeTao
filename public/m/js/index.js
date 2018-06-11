// 需要调用的函数写在这里
$(function () {
  var letao = new LeTao();
  // 初始化轮播图
  letao.initSilder();
  // 初始化区域滚动
  letao.initScroll();
  letao.footerClick();
})

// 创建LeTao对象
var LeTao = function () {};
// 把方法放在原型中
LeTao.prototype = {
  // 初始化自动轮播
  initSilder: function () {
    var gallery = mui('.mui-slider');
    gallery.slider({
      interval: 3000 //自动轮播周期，若为0则不自动播放，默认为0；
    });
  },
  // 初始化滚动区域
  initScroll: function () {
    var options = {
      scrollY: true, //是否竖向滚动
      scrollX: false, //是否横向滚动
      startX: 0, //初始化时滚动至x
      startY: 0, //初始化时滚动至y
      indicators: false, //是否显示滚动条
      deceleration: 0.001, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
      bounce: true //是否启用回弹
    };
    mui('.mui-scroll-wrapper').scroll(options);
  },
  // 底部点击跳转
  footerClick: function () {
    // 底部a标签点击变色
    $("#footer a").click(function (event) {
      // 阻止默认事件
      // event.preventDefault();
      $("#footer a").removeClass("active");
      console.log($(this));
      $(this).addClass("active");
    })
  }
}