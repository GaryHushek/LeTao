var letao;
$(function () {
    letao = new LeTao();
    // 省市区tap事件初始化
    letao.initPicker();
    // 判断是否是需要编辑地址
    var id = getQueryString("id");
    if (id) {
        // 把当前此条地址的id存到options对象的addressID属性身上
        options.addressID = id;
        $("#header h2").html("编辑收货地址");
        $("#main .btn-action").html("保存");
        // 拿到用户编辑的地址信息
        letao.getEditAdderss();
        letao.setAddressToInput(options.editAddress);
    }
    // 点击返回地址页面，清除sessionStorage
    letao.removeEditAdrress();
    // 保存用户的地址/新增用户输入的地址信息
    letao.addressAction();
})

var options = {
    addressID: "",
    // 用户从地址编辑页面点击过来的时，此条地址的详细信息
    editAddress: {},
    // 用户地址的信息
    userAddressInfo: {}
}
var LeTao = function () {};
LeTao.prototype = {
    // 省市区tap事件初始化
    initPicker: function () {
        $("input[name=city]").tap(function (e) {
            // 阻止默认事件
            e.preventDefault();
            // 通过new mui.PopPicker()初始化popPicker组件
            var picker = new mui.PopPicker({
                // 最上面左右的操作按钮
                buttons: ['取消', '确认'],
                // 三列 三级联动
                layer: 3
            });
            // 获取到省市区的信息
            $.ajax({
                url: "/address/queryAddressTree",
                success: function (backData) {
                    // 因为返回数据跟Mui 的组件picker有冲突，pickerme每一个列读取的值的默认键是text  二级是一级的children属性，数据类型又是一个数组
                    // console.log(backData);
                    // 最后设置到picker里面的数据
                    var arr = [];
                    // 三层循环抽取到数据，设置键值，数据 成Mui picker组件相应的数据格式
                    for (var i = 0; i < backData.length; i++) {
                        // 拿到一级内容
                        var obj = {
                            value: backData[i].id,
                            text: backData[i].areaName,
                        }
                        var arr2 = [];
                        for (var j = 0; j < backData[i].child.length; j++) {
                            var obj2 = {
                                text: backData[i].child[j].areaName,
                                value: backData[i].child[j].id
                            }
                            arr2.push(obj2);
                            var arr3 = [];
                            for (var k = 0; k < backData[i].child[j].child.length; k++) {
                                var obj3 = {
                                    text: backData[i].child[j].child[k].areaName,
                                    value: backData[i].child[j].child[k].id
                                }
                                arr3.push(obj3);
                            }
                            obj2.children = arr3;
                        }
                        obj.children = arr2;
                        arr.push(obj);
                    }
                    // console.log(arr);
                    picker.setData(arr);
                    // 设置组件的每一列默认选中第一个数据
                    picker.pickers[0].setSelectedIndex(0);
                    picker.pickers[1].setSelectedIndex(0);
                    picker.pickers[2].setSelectedIndex(0);
                    // 显示picker组件
                    picker.show(function (getSelected) {
                        // 拿到用户选择的数据
                        var addr1 = getSelected[0].text;
                        var addr2 = getSelected[1].text;
                        var addr3 = getSelected[2].text;
                        // 设置给对应的input
                        $("#main input[name=city]").val(addr1 + addr2 + addr3);
                    });
                }
            })
        })
    },
    // 拿到用户编辑的地址信息
    getEditAdderss: function () {
        var post = JSON.parse(window.sessionStorage.getItem("editAddress")).post;
        var user = JSON.parse(window.sessionStorage.getItem("editAddress")).user;
        var address = JSON.parse(window.sessionStorage.getItem("editAddress")).address;
        var city = JSON.parse(window.sessionStorage.getItem("editAddress")).city;
        options.editAddress = {
            post: post,
            user: user,
            city: city,
            address: address
        };
    },
    // 把用户从地址页面点击进来的当前编辑的地址信息渲染在相应的位置
    setAddressToInput: function (obj) {
        $(".mui-input-row input[name=userName]").val(obj.user);
        $(".mui-input-row input[name=postID]").val(obj.post);
        $(".mui-input-row input[name=city]").val(obj.city);
        $(".mui-input-row textarea").val(obj.address);
    },
    // 点击返回地址页面，清除sessionStorage
    removeEditAdrress: function () {
        $("#header .back").tap(function () {
            // 清除编辑地址信息
            window.sessionStorage.removeItem("editAddress");
        })
    },
    // 保存更新用户的提交的地址信息
    addressAction: function () {
        $("#main").on("tap", '.btn-action', function () {
            if ($(this).html() == "保存") {
                // 拿到最新的用户输入的地址信息
                letao.getUserAddressInfo();
                console.log(options.userAddressInfo);
                // update用户的地址
                $.ajax({
                    url: "/address/updateAddress",
                    data: options.userAddressInfo,
                    type: "post",
                    success: function (backData) {
                        console.log(backData);
                        if (backData.error) {
                            console.log(back.error);
                        } else if (backData.success) {
                            // 跟新sessionStorage,防止用户再次刷新加载原始的地址信息
                            var data = JSON.parse(window.sessionStorage.getItem("editAddress"));
                            // data.splice(0,1,0,);
                            mui.toast("修改成功!", {
                                duration: 'short',
                                type: 'div'
                            })
                        }
                    }
                })

            } else if ($(this).html() == "确认") {
                // 新增一个用户地址
                // 拿到最新的用户输入的地址信息
                letao.getUserAddressInfo();
                if (!letao.checkInput()) {
                    // 非空验证
                    mui.toast("请输入完整的表单", {
                        duration: 'short',
                        type: 'div'
                    })
                    return;
                } else {
                    $.ajax({
                        url: "/address/addAddress",
                        data: options.userAddressInfo,
                        type: "post",
                        success: function (backData) {
                            mui.toast("新增成功!", {
                                duration: 'short',
                                type: 'div'
                            })
                        }
                    })
                }

            }
        })
    },
    getUserAddressInfo: function () {
        // 获取到用户所有的地址信息输入内容，赋值给全局对象options的userAddressInfo属性身上
        if (options.addressID != "") {
            options.userAddressInfo = {
                id: options.addressID,
                address: $(".mui-input-row input[name=city]").val(),
                addressDetail: $(".mui-input-row textarea").val(),
                recipients: $(".mui-input-row input[name=userName]").val(),
                postcode: $(".mui-input-row input[name=postID]").val()
            }
        } else {
            options.userAddressInfo = {
                address: $(".mui-input-row input[name=city]").val(),
                addressDetail: $(".mui-input-row textarea").val(),
                recipients: $(".mui-input-row input[name=userName]").val(),
                postcode: $(".mui-input-row input[name=postID]").val()
            }
        }
    },
    // 用户输入非空验证
    checkInput: function () {
        var address = $(".mui-input-row input[name=city]").val();
        var addressDetail = $(".mui-input-row textarea").val();
        var recipients = $(".mui-input-row input[name=userName]").val();
        var postcode = $(".mui-input-row input[name=postID]").val();
        if (address && addressDetail && recipients && postcode) {
            return true;
        } else {
            return false;
        }
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