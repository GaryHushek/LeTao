$(function () {
    var letao = new LeTao();
    // 初始化下拉刷新
    letao.initPullRefresh();
})
// 初始化LeTao构造函数
var LeTao = function () {};
// 所有productList的功能挂载在LeTao构造函数的原型上
LeTao.prototype = {
    // 初始化下拉刷新
    initPullRefresh: function () {
        mui.init({
            pullRefresh: {
                container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
                down: {
                    // height: 50, //可选,默认50.触发下拉刷新拖动距离,
                    auto: true, //可选,默认false.首次加载自动下拉刷新一次
                    contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                    // contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                    contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                    callback: function () {
                        // 停止刷新
                        setTimeout(() => {
                            mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                        }, 1000)
                    } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                },
                up: {
                    height: 50, //可选.默认50.触发上拉加载拖动距离
                    auto: false, //可选,默认false.自动上拉加载一次
                    contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
                    contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
                    callback: function () {
                        // 停止刷新
                        setTimeout(() => {
                            mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                        }, 1500);
                    } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                }
            }
        });
    },
}