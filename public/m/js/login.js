$(function () {
    var letao = new LeTao();
    // 初始化登陆
    letao.checkLogin();
})

var LeTao = function () {};
LeTao.prototype = {
    // 初始化登陆
    checkLogin: function () {
        $("#main").on("tap", ".login", function () {
            // 拿到用户输入的用户名
            var userName = $("input[name=userName]").val();
            // 拿到用户输入的密码
            var pwd = $("input[name=password]").val();
            // 
            if (!userName && pwd) {
                // 用户无输入
                return;
            } else {
                $.ajax({
                    url: "http://127.0.0.1:3000/user/login",
                    data: {
                        username: userName,
                        password: pwd
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
                            window.location.href = "./profile.html";
                        }
                    }
                })
            }
        })
    }
}