// = require drop-load/dropload.min

$(function () {
    myDropLoadInit(); // 初始化

    // dropload
    $.myDropload = $('.dropload').dropload({
        scrollArea: window,
        domDown: {
            domClass: 'dropload-down',
            domRefresh: '<div class="dropload-refresh">上拉加载更多</div>',
            domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
            domNoData: '<div class="dropload-noData">暂无更多</div>'
        },
        loadUpFn: function(me) {
            $.dropLoadPage = 1;
            $.ajax({
                type: 'GET',
                url: setDropUrl(),
                dataType: 'html',
                success: function(data){
                    setTimeout(function(){
                        $('#lists').html(data);
                        if ($.dataUpdatedCBs) {
                            for (var i in $.dataUpdatedCBs) {
                                $.dataUpdatedCBs[i](data);
                            }
                        }

                        // 每次数据加载完，必须重置
                        me.unlock();
                        me.noData(false);
                        me.loading = false;
                        me.resetload();
                    },500);
                },
                error: function(xhr, type){
                    // 即使加载出错，也得重置
                    setTimeout(me.resetload(), 1000);
                }
            });
        },
        loadDownFn: function (me) {
            console.log("load");
            $.ajax({
                type: 'GET',
                url: setDropUrl(),
                dataType: 'html',
                success: function(data){
                    if(!data){
                        // 锁定
                        me.lock();
                        // 无数据
                        me.noData();
                    } else {
                        var $lists = $("#lists");
                        // 去重
                        var new_list = uniq($lists, $(data));
                        $('#lists').append(new_list);

                        // 加载成功后的回调函数
                        if ($.dataUpdatedCBs) {
                            for (var i in $.dataUpdatedCBs) {
                                $.dataUpdatedCBs[i](data);
                            }
                        }
                    }

                    // 每次数据加载完，必须重置
                    me.resetload();

                },
                error: function(xhr, type){
                    // 即使加载出错，也得重置
                    setTimeout(me.resetload(), 1000);
                }
            });
        }
    });

    function setDropUrl() {
        if (!$.dropLoadUrl) {
            var url = $(".dropload").data("url");
            if (url.split("?")[1] && url.split("?")[1] != "") {
                $.dropLoadUrl = url + "&dl=true"
            } else {
                $.dropLoadUrl = url + "?dl=true"
            }
        }

        urls = $.dropLoadUrl.split("?");
        var path = urls[0], search = urls[1];
        if (!search) search = "";

        var cons = [['dl', true], ['page', $.dropLoadPage], ['count', $.dropLoadCount]]
        for(var i in cons) {
    		search = replaceQuery(search, cons[i][0], cons[i][1]);
    	}
        url = path + "?" + search.replace(/&$/, "").replace(/&{2,}/, "&");
        console.log(url);
        $.dropLoadPage++;
    	return url;
    }

    function setPage() {
        var pageStart = $(".dropload").data("page");
        if (!pageStart) pageStart = 2;
        $.dropLoadPage = pageStart;
    }

    function setCount() {
        var count = $(".dropload").data("count");
        if (!count) count = 10;
        $.dropLoadCount = count;
    }

    function myDropLoadInit() {
        setCount();
        setPage()
    }

    function uniq($fa, $list) {
        return $list.map(function() {
            if ($fa.find("[data-id="+ $(this).data("id") +"]").length == 0) return this;
        })
    }

    function replaceQuery(search, name, value) {
    	var reg = new RegExp(name +"=([^&]*)");
    	var r = search.substr(1).match(reg);
    	if (r) {
    		if (!value) return search.replace(reg, "");
    		return search.replace(reg, name + "=" + value);
    	} else if (value) {
    		if (search.length == 1) {
    			search += (name + "=" + value);
    		} else {
    			search += ("&" + name + "=" + value);
    		}
    	}
    	return search;
    }
});
