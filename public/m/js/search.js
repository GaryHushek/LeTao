$(function () {
    // 创建一个letao实例
    var letao = new LeTao();
    // 保存搜索记录
    letao.saveSearchHistory();
    // 搜索记录功能初始化
    letao.queryHistory();
    // 删除搜索记录初始化
    letao.deleteSearchHistory();
    letao.deleteSearchHistory("id");
})
// 定义一个构造函数LeTao
var LeTao = function () {
    // 保存本地搜索的数据
    this.searchHistory = "";
};
// search页面的功能挂在LeTao构造函数的原型上
LeTao.prototype = {
    // 搜索过的内容的本地保存
    saveSearchHistory: function () {
        var that = this;
        $(".btn-search").click(function (e) {
            e.preventDefault();
            // 获取到搜索的内容
            var searchText = $(".input-search").val().trim();
            // 查看本地是否有搜索内容的localStorage
            var searchLocalStorage = window.localStorage.getItem("searchHistory");
            if (searchLocalStorage) {
                if (searchText != "") {
                    that.searchHistory = searchLocalStorage;
                    // 如果有就往里面添加
                    var searchHistory = JSON.parse(window.localStorage.getItem("searchHistory"));
                    // 如果搜索记录里有了一模一样的搜索内容就忽略本次保存
                    for (var i = 0; i < searchHistory.length; i++) {
                        for (var key in searchHistory[i]) {
                            if (searchHistory[i]["searchText"] == searchText) {
                                return;
                            }
                        }
                    }
                    var searchContent = {
                        "searchText": searchText,
                        "searchTieme": new Date()
                    }
                    // 每次加到数组的填表为0也就是成为数组的第一个元素，这样就可以形成倒序显示搜索内容
                    searchHistory.unshift(searchContent);
                    window.localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
                    // 本地搜索内容跟LeTao中保存的searchHistory属性同步
                    searchLocalStorage = window.localStorage.getItem("searchHistory");
                    that.searchHistory = searchLocalStorage;
                }
                that.queryHistory();
            } else {
                if (searchText != "") {
                    // 没有就创建一个，再添加当前搜索内容
                    var searchArr = [];
                    var searchContent = {
                        "searchText": searchText,
                        "searchTieme": new Date()
                    }
                    searchArr.unshift(searchContent);
                    window.localStorage.setItem("searchHistory", JSON.stringify(searchArr));
                    searchLocalStorage = window.localStorage.getItem("searchHistory");
                    that.searchHistory = searchLocalStorage;
                }
            }
            that.queryHistory();
        })
    },
    // 清空本地搜索记录
    deleteSearchHistory: function () {
        var that = this;
        if (arguments.length == 0) {
            // 删除本地所有的搜索记录
            $(".title").on("click", ".search-delete-all", function () {
                window.localStorage.removeItem("searchHistory");
                that.queryHistory();
            })
        } else {
            // 单独删除某条记录
            $(".container").on("click", ".search-delete", function () {
                // 获取到需要删除的记录的id
                var id = $(this).data("search-id");
                // 获取到本地的搜索记录
                var searchHistory = JSON.parse(window.localStorage.getItem("searchHistory"));
                searchHistory.splice(id, 1);
                window.localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
                that.queryHistory();
            })
        }

    },
    // 历史搜索内容列表根据搜索内容动态显示
    queryHistory: function () {
        if (arguments.length == 0) {
            // 找到本地的搜索记录
            var searchHistory = JSON.parse(window.localStorage.getItem("searchHistory"));
            if (searchHistory) {
                if (searchHistory.length != 0) {
                    var html = template("searchHistoryTem", searchHistory);
                    $(".container").html(html);
                } else {
                    $(".container").html("");
                }
            } else {
                $(".container").html("");
            }
        }
    },
}