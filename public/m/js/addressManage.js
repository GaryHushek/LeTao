var letao;
$(function () {
    letao = new LeTao();
    // 省市区tap事件初始化
    letao.initCaity();
    letao.getAddressTree();
})

var LeTao = function () {};
LeTao.prototype = {
    //  三级联动地址picker初始化
    initPicker: function () {
        var picker = new mui.PopPicker();
    },
    // 省市区tap事件初始化
    initCaity: function () {
        $("input[name=city]").tap(function () {
            // 通过new mui.PopPicker()初始化popPicker组件
            var picker = new mui.PopPicker({
                buttons: ['取消', '确认']
            });
            picker.show(function (Items) {

            });
        })
    },
    // 拿到三级联动的地址数
    getAddressTree: function () {
        $.ajax({
            url: "/address/queryAddressTree",
            success: function (backData) {
                console.log(backData);
            }
        })
    }
}