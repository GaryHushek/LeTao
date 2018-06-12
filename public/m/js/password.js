var letao;
$(function () {
    letao = new LeTao();
    // 初始化修改密码
    letao.updatePassword();
    // 发送验证码
    letao.sendVCode();
})

var LeTao = function () {};
LeTao.prototype = {
    // 密码的修改
    updatePassword: function () {
        $(".btn-update").tap(function () {
            // 获取到用户的输入内容
            var oldPwd = $("input[name=oldpassword]").val();
            var pwd = $("input[name=password]").val();
            var pwdAgain = $("input[name=passwordAgain]").val();
            var vcode = $("input[name=auth-code]").val();
            // console.log(oldPwd + "|" + pwd + "|" + pwdAgin + "|" + vcode);
            $.ajax({
                url: "http://127.0.0.1:3000/user/updatePassword",
                type: "post",
                data: {
                    oldPassword: oldPwd,
                    newPassword: pwd
                },
                success: function (backData) {
                    console.log(backData);
                    if (backData.error) {
                        mui.toast(backData.message, {
                            duration: 'short',
                            type: 'div'
                        })
                    } else {
                        mui.toast("修改成功", {
                            duration: 'short',
                            type: 'div'
                        })
                        setTimeout(function () {
                            window.location.href = "./profile.html";
                        }, 1500)
                    }
                }
            })
        })
    },
    // 验证码的发送
    sendVCode: function () {
        $(".vcode").tap(function (e) {
            // 只有在显示是获取验证码的状态下才能开启获取功能
            if ($(this).html() == "获取认证码") {
                var bgc = $(this).css("background-color");
                var bdc = $(this).css("border-color");
                console.log($(this));
                // 按钮变色，文本改变
                $(this).css({
                    backgroundColor: "#929292",
                    borderColor: "#929292"
                }).html("正在发送...");
                $.ajax({
                    url: "http://127.0.0.1:3000/user/vCodeForUpdatePassword",
                    success: function (backData) {
                        console.log(backData.vCode);
                        if (!backData.error) {
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
                                        }).html("获取认证码");
                                        clearInterval(timeId);
                                    }
                                }, 1000);
                            });
                        }
                    }
                });
            } else {
                // 其他状态不执行任何操作
                return;
            }
        })
    }
}