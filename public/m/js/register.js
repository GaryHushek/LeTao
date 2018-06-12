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
        $(".vcode").click(function (e) {
            // 只有在显示是获取验证码的状态下才能开启获取功能
            if ($(this).html() == "获取验证码") {
                var bgc = $(this).css("background-color");
                var bdc = $(this).css("border-color");
                console.log($(this));
                // 按钮变色，文本改变
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
                                if (sec > 0) {
                                    $(".vcode").html(sec + "S后再获取")
                                    sec--;
                                } else {
                                    // 按钮样式还原
                                    $('.vcode').css({
                                        backgroundColor: bgc,
                                        borderColor: bdc
                                    }).html("获取验证码");
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
        // 手机号正则
        var phoneReg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
        // 密码正则 最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
        var pwdReg = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/;
        // 点击注册时验证手机号，密码，验证码
        $("#main").on("click", ".btn-register", function () {
            // 拿到用户输入的用户名
            var userName = $("input[name=userName]").val().trim();
            console.log(userName);
            // 拿到用户输入的手机号
            var phone = $("input[name=phone-number]").val().trim();
            console.log(phone);
            // 获取到用户输入的密码，跟再次确认的密码
            var pwd = $("input[name=password]").val().trim();
            var pwd1 = $("input[name=agin-pwd]").val().trim();
            // 拿到用户输入的验证码内容
            var vcode = $("input[name=auth-code]").val().trim();
            // 拿到用户是否勾选协议
            var check = $("input[type=checkbox]").prop("checked");
            console.log(check);
            // 先做是否有内容的匹配
            if (!(phone && pwd && pwd1 && vcode && userName)) {
                // mui的消息弹出框
                mui.toast('请输入完成的表单', {
                    duration: 'short',
                    type: 'div'
                })
                return;
            }
            // 在进行用户输入的内容匹配
            if (!check) {
                // mui的消息弹出框
                mui.toast('请同意会员服务协议', {
                    duration: 'short',
                    type: 'div'
                })
                return;
                // } else if (!phoneReg.test(phone)) {
                //     // mui的消息弹出框
                //     mui.toast('请输入合法的手机号', {
                //         duration: 'short',
                //         type: 'div'
                //     })
                //     return;
                // } else if (pwd != pwd1) {
                //     // mui的消息弹出框
                //     mui.toast('两次密码输入不匹配', {
                //         duration: 'short',
                //         type: 'div'
                //     })
                //     return;
                // } else if (vcode != LeTao.VCode) {
                //     // mui的消息弹出框
                //     mui.toast('请输入正确的验证码', {
                //         duration: 'short',
                //         type: 'div'
                //     })
                //     return;
            }
            // 用户注册
            console.log("1111");
            $.ajax({
                url: "http://127.0.0.1:3000/user/register",
                data: {
                    username: userName,
                    password: pwd,
                    mobile: phone,
                    vCode: vcode
                },
                type: "post",
                success: function (backData) {
                    // 如果没有注册成功，给用户提示错误信息
                    if (!backData.success) {
                        // mui的消息弹出框
                        mui.toast(backData.message, {
                            duration: 'short',
                            type: 'div'
                        })
                    } else {
                        // 跳转到登录页面
                        window.location.href = "./login.html";
                    }
                }
            })
        })
    }

}