$(function () {
    var letao = new LeTao();
    letao.getVCode();
    // 初始化注册信息验证
    letao.initRegisterInfo();
})

var LeTao = function () {
    this.VCode = "";
    this.VCodeBtnBgc = "";
    this.VCodeBtnBdc = "";
};
LeTao.prototype = {
    // 验证的获取
    getVCode: function () {
        $(".vcode").click(function () {
            console.log($(this).css("backgroundColor"));
            console.log($(this).css());
            // 只有在显示是获取验证码的状态下才能开启获取功能
            if ($(this).html() == "获取验证码") {
                console.log(this);
                console.log($(this).css("backgroundColor"));
                console.log($(this).css("borderColor"));
                LeTao.VCodeBtnBgc = $(this).css("backgroundColor");
                LeTao.VCodeBtnBdc = $(this).css("borderColor");
                $(this).css({
                    backgroundColor: "#929292",
                    borderColor: "#929292"

                }).html("正在发送...");
                $.ajax({
                    url: "http://127.0.0.1:3000/user/vCode",
                    success: function (backData) {
                        console.log(backData.vCode);
                        LeTao.VCode = backData.vCode;
                        var timeId, sec = 60;
                        setTimeout(function () {
                            timeId = setInterval(function () {
                                if (sec >= 0) {
                                    $(".vcode").html(sec + "S后再获取")
                                    sec--;
                                } else {
                                    clearInterval(timeId);
                                }
                            }, 1000);
                        });
                    }
                });
            } else {
                // 其他状态不执行任何操作
                return;
            }
        })
    },
    // 注册信息验证（正则匹配）
    initRegisterInfo: function () {
        console.log("1");
    }

}