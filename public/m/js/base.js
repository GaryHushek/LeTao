var base;
$(function () {
    base = new Base();
    // 初始化是否登陆检测
    base.checkLogin();
})

var Base = function () {};
Base.prototype = {
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
                    return;
                }
            }
        });
    },
}