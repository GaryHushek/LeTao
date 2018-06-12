var letao;
$(function () {
    // 创建一个letao实例
    letao = new LeTao();
    // 保存搜索记录
    letao.saveSearchHistory();
    // 搜索记录功能初始化
    letao.queryHistory();
    // 删除搜索记录初始化
    letao.deleteSearchHistory();
})
// 声明一个对象，所有全局变量放在这个对象身上
var options = {
    // 搜索记录最大保存的数量
    searchLength: 10
};
var searchText;
// 定义一个构造函数LeTao
var LeTao = function () {};
// search页面的功能挂在LeTao构造函数的原型上
LeTao.prototype = {
    // 搜索过的内容的本地保存
    saveSearchHistory: function () {
        $(".btn-search").on("tap", function () {
            // 获取到搜索的内容
            searchText = $(".input-search").val().trim();
            // 查看本地是否有搜索内容的localStorage
            var searchLocalStorage = window.localStorage.getItem("searchHistory");
            if (searchLocalStorage) {
                if (searchText != "") {
                    // 如果有就往里面添加
                    var searchHistory = JSON.parse(window.localStorage.getItem("searchHistory"));

                    // 如果搜索记录里有了一模一样的搜索内容就忽略本次保存
                    for (var i = 0; i < searchHistory.length; i++) {
                        for (var key in searchHistory[i]) {
                            if (searchHistory[i]["searchText"] == searchText) {
                                // 页面跳转带着搜索的内容
                                window.location.href = "./productList.html?search=" + searchText;
                                // 此次搜索记录不写入localStorage
                                return;
                            }
                        }
                    }
                    var searchContent = {
                        "searchText": searchText,
                        "id": searchHistory[searchHistory.length - 1].id + 1,
                        "searchTieme": new Date()
                    }
                    // 搜索历史长度检测
                    letao.setMaxSearchHistory(searchHistory);
                    // 添加记录到数组中
                    searchHistory.push(searchContent);
                    window.localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
                } else {
                    return;
                }
            } else {
                if (searchText != "") {
                    // 没有就创建一个，再添加当前搜索内容
                    var searchArr = [];
                    var searchContent = {
                        "searchText": searchText,
                        "id": 1,
                        "searchTieme": new Date()
                    }
                    // 向localStorage添加搜索记录
                    searchArr.push(searchContent);
                    window.localStorage.setItem("searchHistory", JSON.stringify(searchArr));
                }
            }
            // 页面跳转带着搜索的内容
            window.location.href = "./productList.html?search=" + searchText;
            // letao.queryHistory();
        })
    },
    // 清空本地搜索记录
    deleteSearchHistory: function () {
        // 删除本地所有的搜索记录
        $(".title").on("click", ".search-delete-all", function () {
            // 如果本地没有搜索记录的localStorage 就直接返回，不执行下面的代码
            if (!(window.localStorage.getItem("searchHistory"))) {
                letao.queryHistory();
                return;
            } else {
                window.localStorage.removeItem("searchHistory");
                letao.queryHistory();
            }
        })
        // 单独删除某条记录
        $(".container").on("click", ".search-delete", function () {
            var id = $(this).data("search-id");
            // 获取到本地的搜索记录
            var searchHistory = JSON.parse(window.localStorage.getItem("searchHistory"));
            for (var i = 0; i < searchHistory.length; i++) {
                if (searchHistory[i].id == id) {
                    searchHistory.splice(i, 1);
                }
            }
            window.localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
            letao.queryHistory();
        })
    },
    // 历史搜索内容列表根据搜索内容动态显示
    queryHistory: function () {
        // 找到本地的搜索记录
        var searchHistory = JSON.parse(window.localStorage.getItem("searchHistory"));
        if (searchHistory) {
            if (searchHistory.length != 0) {
                var html = template("searchHistoryTem", searchHistory.reverse());
                $(".container").html(html);
            } else {
                $(".container").html("");
                window.localStorage.removeItem("searchHistory");
            }
        } else {
            $(".container").html("");
        }
    },
    // 历史搜索记录长度控制
    setMaxSearchHistory: function (searchHistory) {
        if (searchHistory.length >= options.searchLength) {
            searchHistory.splice(0, 1);
            window.localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        }
    }
}