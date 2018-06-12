var letao;
$(function () {
    letao = new LeTao();
    // 初始化查询用户所有的收获地址
    letao.queryUserAllAddress();
    // 初始化左滑
    letao.initLeftSilder();
})

var LeTao = function () {};
LeTao.prototype = {
    // 查询用户的所有收货地址
    queryUserAllAddress: function () {
        $.ajax({
            url: 'http://127.0.0.1:3000/address/queryAddress',
            success: function (backData) {
                console.log(backData);
                if (backData.length > 0) {
                    var html = template("userAddressTemp", backData);
                    console.log(html);
                    $(".addressManage").html(html);
                }
            }
        })
    },
    // 初始化每个地址左滑
    initLeftSilder: function () {
        var options = {
            scrollY: true, //是否竖向滚动
            scrollX: false, //是否横向滚动
            startX: 0, //初始化时滚动至x
            startY: 0, //初始化时滚动至y
            indicators: false, //是否显示滚动条
            deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏
            bounce: true //是否启用回弹
        }
        mui('.mui-scroll-wrapper').scroll({
            deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        });
    }


}