var letao;
$(function () {
    letao = new LeTao();
    // 是否登陆检测
    letao.checkLogin();
    // 初始化退出登录
    letao.logOut();
})

var LeTao = function () {};
LeTao.prototype = {
    // 是否登陆检测
    checkLogin: function () {
        // 查看是否有用户信息
        $.ajax({
            url: "http://127.0.0.1:3000/user/queryUserMessage",
            success: function (backData) {
                console.log(backData);
                if (backData.error) {
                    // 打回登陆页面
                    window.location.href = "./login.html";
                    return;
                } else {
                    letao.queryUserInfo();
                }
            }
        });
    },
    // 读取用户信息，渲染数据
    queryUserInfo: function () {
        $.ajax({
            url: "http://127.0.0.1:3000/user/queryUserMessage",
            success: function (backData) {
                console.log(backData);
                $(".mui-media-body .userName").html(backData.username);
                $(".mui-media-body .phone").html(backData.mobile);
            }
        })
    },
    // 退出登录
    logOut: function () {
        $(".logout button").tap(function () {
            $.ajax({
                url: "http://127.0.0.1:3000/user/logout",
                success: function (backData) {
                    // 跳转到登录页
                    window.location.href = "./login.html";
                }
            })
        })
    }
}