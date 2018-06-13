var letao;
$(function () {
    letao = new LeTao();
    // 购物车下拉刷新初始化
    letao.initRefres();
    letao.getUserCarData();
    // 初始化删除购物车
    letao.deleteCarData();
    // 点击选中商品
    letao.selectedShop();
    // 全选商品
    letao.allSelected();
    // 购物车编辑功能
    letao.editCarShop();
})
// 声明一个对象，此页面的所有操作的全局变量的数据放在这个对象身上
var options = {
    carData: "",
}
var LeTao = function () {};
LeTao.prototype = {
    // 购物车下拉刷新初始化
    initRefres: function () {
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

                    } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                }
            }
        });
    },
    // 获取用户的购物车数据
    getUserCarData: function () {
        $.ajax({
            url: "/cart/queryCart",
            success: function (backData) {
                if (!backData.length) {
                    // 购物车为空
                } else {
                    // 根据返回的数据动态页面生成购物车数据
                    console.log(backData);
                    var html = template("carDataTemp", backData);
                    // console.log(html);
                    if (html) {
                        $("#catListContainer").html(html);
                    }
                }
            }
        })
    },
    // 删除购物车
    deleteCarData: function () {
        $("#catListContainer").on("tap", "a.delete", function () {
            $.ajax({
                url: "/cart/deleteCart",
                data: {
                    id: $(this).parent().data("product-id")
                },
                success: function (backData) {
                    if (backData.success) {
                        letao.getUserCarData();
                    } else {
                        mui.toast(backData.error, {
                            duration: 'short',
                            type: 'div'
                        })
                    }
                }
            })
        })
    },
    // 计算用户选中购物车的物品的总金额
    getSum: function () {
        var total = 0;
        // 获取到选中的商品的金额跟件数
        $("#catListContainer input[type=checkbox]:checked").each(function (index, ele) {
            letao.checkAllSelected();
            // 循环遍历得到每个选中的元素
            // 当前选中商品的数量
            var num = $(this).siblings(".shop-mun").children(".num").html();
            // 当前选中元素的单价
            var price = $(this).parent().siblings(".info").children(".price").find("span").html() + 0;
            total += num * price;
        });;
        // 把选中的商品算出的总价动态渲染到相应的位置
        // 价格保留2位小数,保留到分
        if (total == 0) {
            $("#orderBtn .total").html("00.00");
        } else {
            $("#orderBtn .total").html(Math.floor(total * 100) / 100);
        }
    },
    // 选中商品
    selectedShop: function () {
        $("#catListContainer").on("change", "input[type=checkbox]", function () {
            letao.getSum();
        })
    },
    // 全选商品
    allSelected: function () {
        $("#orderBtn .allCheck").change(function () {
            // console.log("1");
            // console.log($("#orderBtn .allCheck").prop("checked"));
            $("#catListContainer input[type=checkbox]").prop("checked", $("#orderBtn .allCheck").prop("checked"));
            // 然后出发一次选中商品事件
            letao.getSum();
        })
    },
    // 全选检测
    checkAllSelected: function () {
        $("#orderBtn .allCheck").prop("checked", $("#catListContainer input[type=checkbox]:checked").length == $("#catListContainer input[type=checkbox]").length ? true : false);
    },
    // 购物车编辑功能
    editCarShop: function () {
        $('#catListContainer').on("tap", ".edit", function () {
            mui.confirm('1', '编辑商品', ['确定', '取消'], function (e) {
                if (!e.index) {
                    // 点击的是确定
                    var data = {
                        id: $(this).parent().data("product-id") - 0,
                        size: ,
                        num: ,
                    };
                } else {
                    // 点击的是 '否'
                    return;
                }
            }, 'div');
            // 获取到当前商品的所有尺码
            var size = $(".product-info").data("product-size");
            var start = size.split("-")[0] - 0;
            var end = size.split("-")[1] - 0;
            var arr = [];
            for (var i = start; i <= end; i++) {
                arr.push(i);
            }
            console.log(arr);
            // 改变弹出框里面的主体部分的内容
            var data = {
                size: arr,
                num: $(".product-info").data("product-num"),
            }
            var html = template("editCarShopTemp", data);
            console.log(html);
            $(".mui-popup-text").html(html);
            // 初始化number-box
            mui(".mui-numbox").numbox();
            // 点击尺码尺码背景色改变
            $("body").on("tap", ".product-size", function () {
                $(this).addClass("active").siblings().removeClass("active");
            })
        })
    },

}