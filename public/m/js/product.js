var letao;
$(function () {
    letao = new LeTao();
    // 获取到跳转过来的产品id
    id = getQueryString("id");
    console.log(id);
    // 初始化下拉刷新
    letao.initDownRefresh();
    // 初始化产品图的轮播
    letao.initSilder();
    // 商品详细信息查询
    letao.getProductInfo();
    // 尺码选中状态
    letao.selectSize();
    // 加入购物车
    letao.addBuyCar();

})
var id;
// 声明LeTao构造函数
var LeTao = function () {};
// 产品信息页面的所有业务逻辑，功能全部存放在LeTao构造函数的原型上
LeTao.prototype = {
    // 初始化下拉刷新
    initDownRefresh: function () {
        mui.init({
            pullRefresh: {
                container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
                down: {
                    height: 50, //可选,默认50.触发下拉刷新拖动距离,
                    auto: false, //可选,默认false.首次加载自动下拉刷新一次
                    contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                    contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                    contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                    callback: function () {
                        setTimeout(function () {
                            console.log("111");
                            mui("#refreshContainer").pullRefresh().endPulldownToRefresh();
                        }, 1500)
                    } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                }
            }
        });
    },
    // 初始化产品图轮播
    initSilder: function () {
        //获得slider插件对象
        var gallery = mui('.mui-slider');
        gallery.slider({
            interval: 2000 //自动轮播周期，若为0则不自动播放，默认为0；
        });
    },
    // 产品信息的数据获取
    getProductInfo: function () {
        // 通过id查询商品的详细信息
        $.ajax({
            url: "http://127.0.0.1:3000/product/queryProductDetail",
            data: {
                id: id
            },
            success: function (backData) {
                console.log(backData);
                // 尺码转化
                var size = backData.size;
                var start = size.split("-")[0] - 0;
                var end = size.split("-")[1] - 0;
                var arr = [];
                for (var i = start; i <= end; i++) {
                    arr.push(i);
                }
                backData.size = arr;
                // 产品信息动态加载
                var html = template("saleInfoTemp", backData);
                $(".saleInfo").html(html);
                // 数字输入框如果是动态生成的是不能点击 如果要点击怎么办再次初始化
                mui(".mui-numbox").numbox();
                // 渲染轮播图
                var html = template("silderTemp", backData);
                // console.log(html);
                $(".mui-slider").html(html);
                // 初始化轮播图
                letao.initSilder();
            }
        })
    },
    // 尺码选中状态
    selectSize: function () {
        $(".saleInfo").on("tap", ".size span", function () {
            $(this).toggleClass("active").siblings().removeClass("active");
        })
    },
    // 加入购物车
    addBuyCar: function () {
        $("#footer button.buyCar").tap(function () {
            // 尺码验证 验证是否选中了尺码(查看尺码的span中是否有active这个类的元素)
            if (!($(".size").children(".active").length)) {
                // 没有选则尺码，提示用户选择尺码
                mui.toast('请选择尺码', {
                    duration: 'short',
                    type: 'div'
                })
                return;
            }
            if (!(mui(".mui-numbox").numbox().getValue())) {
                // 没有选则数量，提示用户选择尺码
                mui.toast('请选择数量', {
                    duration: 'short',
                    type: 'div'
                })
                return;
            } else {
                var data = {
                        productId: $(".title").data("product-id") - 0,
                        num: $("input.product-number").val() - 0,
                        size: $(".size").children(".active").html() - 0,
                    };
                    console.log(data);
                    // 把数据加如购物车
                    $.ajax({
                        url: "/cart/addCart",
                        data: data,
                        type: "post",
                        success: function (backData) {
                            console.log(backData)
                            // 尺码数量都选择了，弹出确认框，确认是否加入购物车
                            mui.confirm('是否去购物车看看?', '添加成功', ['是', '否'], function (e) {
                                if (!e.index) {
                                    // 点击的是 '是'
                                    window.location.href = "./car.html";
                                } else {
                                    // 点击的是 '否'
                                    return;
                                }
                            }, 'div');
                        }
                    })
            }
        })
    }
}

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