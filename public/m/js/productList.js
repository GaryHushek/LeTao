var letao;
$(function () {
  letao = new LeTao();
  // 初始化下拉刷新
  letao.initPullRefresh();
  // 初始化点击搜索商品
  letao.searchProduct();
  // 获取从上个页面跳转过来的搜索信息
  search = getQueryString("search");
  // 初始化保存搜索记录
  letao.saveSearchHistory();
  // 调用一次
  letao.getSearchData({
      proName: search,
      pageSize: 2,
      page: page
    },
    function (data) {
      console.log(data);
      var html = template("productLisTemp", data);
      $("#list .mui-row").html(html);
    }
  );
  // 商品排序
  letao.sortProducts();
  // 商品详情页的跳转
  letao.skipProductPage();
});

// 初始化LeTao构造函数
var LeTao = function () {};
var search;
var page = 1;
// 所有productList的功能挂载在LeTao构造函数的原型上
LeTao.prototype = {
  // 搜索过的内容的本地保存
  saveSearchHistory: function () {
    $(".btn-search").on("tap", function () {
      // 获取到搜索的内容
      searchText = $(".input-search")
        .val()
        .trim();
      // 查看本地是否有搜索内容的localStorage
      var searchLocalStorage = window.localStorage.getItem("searchHistory");
      if (searchLocalStorage) {
        if (searchText != "") {
          // 如果有就往里面添加
          var searchHistory = JSON.parse(
            window.localStorage.getItem("searchHistory")
          );
          // 如果搜索记录里有了一模一样的搜索内容就忽略本次保存
          for (var i = 0; i < searchHistory.length; i++) {
            for (var key in searchHistory[i]) {
              if (searchHistory[i]["searchText"] == searchText) {
                // 页面跳转带着搜索的内容
                window.location.href =
                  "./productList.html?search=" + searchText;
                // 此次搜索记录不写入localStorage
                return;
              }
            }
          }
          var searchContent = {
            searchText: searchText,
            id: searchLocalStorage[searchLocalStorage.length - 1].id + 1,
            searchTieme: new Date()
          };
          // 每次加到数组的填表为0也就是成为数组的第一个元素，这样就可以形成倒序显示搜索内容
          searchHistory.push(searchContent);
          window.localStorage.setItem(
            "searchHistory",
            JSON.stringify(searchHistory)
          );
        } else {
          return;
        }
      } else {
        if (searchText != "") {
          // 没有就创建一个，再添加当前搜索内容
          var searchArr = [];
          var searchContent = {
            searchText: searchText,
            id: 1,
            searchTieme: new Date()
          };
          searchArr.push(searchContent);
          window.localStorage.setItem(
            "searchHistory",
            JSON.stringify(searchArr)
          );
        }
      }
      // 页面跳转带着搜索的内容
      window.location.href = "./productList.html?search=" + searchText;
    });
  },
  // 初始化下拉刷新
  initPullRefresh: function () {
    mui.init({
      pullRefresh: {
        container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
        down: {
          // height: 50, //可选,默认50.触发下拉刷新拖动距离,
          auto: false, //可选,默认false.首次加载自动下拉刷新一次
          contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
          // contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
          contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
          callback: function () {
            // 停止刷新
            setTimeout(() => {
              letao.getSearchData({
                  proName: search
                },
                function (data) {
                  console.log(data);
                  var html = template("productLisTemp", data);
                  $("#list .mui-row").html(html);
                  // 重置上拉刷新
                  mui("#refreshContainer")
                    .pullRefresh()
                    .refresh(true);
                  page = 1;
                }
              );
              mui("#refreshContainer")
                .pullRefresh()
                .endPulldownToRefresh();
            }, 1000);
          } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        },
        up: {
          height: 50, //可选.默认50.触发上拉加载拖动距离
          auto: false, //可选,默认false.自动上拉加载一次
          contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
          contentnomore: "没有更多数据了", //可选，请求完毕若没有更多数据时显示的提醒内容；
          callback: function () {
            // 停止刷新
            setTimeout(() => {
              letao.getSearchData({
                  proName: search,
                  page: ++page
                },
                function (data) {
                  if (data.data.length > 0) {
                    console.log(data);
                    var html = template("productLisTemp", data);
                    $("#list .mui-row").append(html);
                    mui("#refreshContainer")
                      .pullRefresh()
                      .endPullupToRefresh();
                  } else if (data.data.length <= 0) {
                    mui("#refreshContainer")
                      .pullRefresh()
                      .endPullupToRefresh(true);
                  }
                }
              );
            }, 1500);
          } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        }
      }
    });
  },
  // 初始化点击搜索商品
  searchProduct: function () {
    $(".btn-search").on("tap", () => {
      // 拿到用户搜索的内容
      var searchText = $("input.input-search")
        .val()
        .trim();
      if (!searchText) {
        return;
      } else {
        console.log(searchText);
        search = searchText;
        letao.getSearchData({
            proName: search,
            pageSize: 2,
            page: page
          },
          function (data) {
            console.log(data);
            var html = template("productLisTemp", data);
            $("#list .mui-row").html(html);
          }
        );
      }
    });
  },
  // 加载商品
  getSearchData: function (obj, callback) {
    $.ajax({
      url: "http://127.0.0.1:3000/product/queryProduct",
      data: {
        page: obj.page || 1,
        pageSize: obj.pageSize || 2,
        proName: obj.proName,
        price: obj.price || 1,
        mun: obj.num || 1
      },
      type: "get",
      success: function (backData) {
        if (callback) {
          callback(backData);
        }
      }
    });
  },
  // 商品排序
  sortProducts: function () {
    $(".control-Panel").on("tap", "a", function () {
      var sortText = $(this).data("sort-type");
      // 获取到排序标志位
      var sortFlag = $(this).data("sort-flag");
      if (sortFlag == 1) {
        sortFlag = 2;
      } else if (sortFlag == 2) {
        sortFlag = 1;
      }
      // 修改完后把属性值设置到元素身上
      $(this).attr("data-sort-flag", sortFlag);
      if (sortText == "num") {
        letao.getSearchData({
            proName: search,
            num: sortFlag
          },
          function (data) {
            var html = template("productLisTemp", data);
            $("#list .mui-row").html(html);
          }
        );
      } else if (sortText == "price") {
        letao.getSearchData({
            proName: search,
            price: sortFlag
          },
          function (data) {
            var html = template("productLisTemp", data);
            $("#list .mui-row").html(html);
          }
        );
      }
    });
  },
  // 产品详情页的跳转
  skipProductPage: function () {
    $(".mui-row").on("tap", "button.buy", function (e) {
      // 带着ID跳转到商品详情页
      window.location.href = "./product.html?id=" + $(this).data("product-id");
    })
  }
};

//获取url地址栏的参数的函数 网上找的  name就是url参数名
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return decodeURI(r[2]);
  } else {
    return null;
  }
}