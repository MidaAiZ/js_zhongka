//= require share/pjax
//= require cdtSelector/cdtSelect

//  条件选择器

$(function() {
	$(".cdts").on("click", "li a[data-role=opt]", function(e) {
		e.preventDefault();
		var $this = $(this);
		if ($this.parent("li").hasClass("active")) {
			$this.parent("li").removeClass("active");
		} else if (!$this.parents('.options').data('multi')) { // 判断支不支持多选
			$this.parent("li").addClass("active").siblings().removeClass("active");
			$this.parent("li").parent().find(".cdt-info span").remove();
		} else { // 支持多选
			$this.parent("li").addClass("active");
		}
		if (!$this.data('value')) { // 取消条件
			$this.parent("li").siblings().removeClass("active");
			var selector = $this.parents('.options').find(".cdt-select")[0];
			if (selector && selector.cdt_selector) selector.cdt_selector.clear();
		}
		onCdtsChange();
	})
})

function onCdtsChange() {
	var search = location.search;
	if (!search) search = "?";
	search = changeQuery(search);
	doSearch(search);
}

function changeQuery(search) {
	var cons = [];
	var $conE = $("#cdts").find("li.con-item");
	$conE.each(function(ele) {
		var $this = $(this);
		var $liList = $this.siblings("li.active");
		$liList.each(function(i, v) {
			cons.push([$this.data("name"), $(v).find("a").data("value")]);
		});
		var $cList = $this.parent().find(".cdt-info span");
		$cList.each(function(i, v) {
			cons.push([$this.data("name"), $(v).data("id")]);
		});
		// 条件没有选中 需要从search中删除
		if ($liList.length === 0 && $cList.length == 0) cons.push([$this.data("name"), undefined]);
	})
	cons.push(["page", 0]) // 定位到第一页
	for(var i in cons) { // 删除url中已选择条件
		search = clearSearch(search, cons[i][0], cons[i][1]);
	}
	for (var j in cons) {
		search = addSearch(search, cons[j][0], cons[j][1]);
	}
	return search.replace(/&$/, "").replace(/&{2,}/, "&");
}

// 清除
function clearSearch(search, name) {
	name = name.replace(/\[/g, '\\[').replace(/\]/g, '\\]')
	var reg = new RegExp(name +"=([^&]*)", 'g');
	return search.replace(reg, '');
}

// 追加
function addSearch(search, name, value) {
	if (value === undefined || value === '' || value === null) { //清除条件
			return search;
	}
	if (search.indexOf(name + '=' + value) > -1) return search; // 条件已存在
	if (search.length == 1) {
		search += (name + "=" + value);
	} else {
		search += ("&" + name + "=" + value);
	}
	return search;
}

// 替换
function replaceQuery(search, name, value) {
	var reg = new RegExp(name +"=([^&]*)", 'g');
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

function doSearch(search) {
	var url = location.pathname + search;
	$.pjax({
		url: url,
		type: "GET",
		container: "#pjax-replace",
		success: function(res) {
			sucBK(res, url)
		},
		error: errBK,
		complete: completeBK
	})
}

// 禁止分页默认事件
$(function() {
	$("body").on("click", ".pagination li a", function(e) {
		e.preventDefault();
		var url = $(this).attr("href");
		$.pjax({
			url: url,
			type: "GET",
			container: "#pjax-replace",
			success: function(res) {
				sucBK(res, url)
			},
			error: errBK
		})
	})
})

function sucBK(res, url) {
	$("body").find("#pjax-replace").replaceWith($(res).find("#pjax-replace"));
	if ($.dataUpdatedCBs) {
		for (var i in $.dataUpdatedCBs) {
			$.dataUpdatedCBs[i](res);
		}
	}
}

function completeBK() {
	// TODO 以下代码适配上拉加载插件，耦合性较高
	if ($.myDropload) {
		$.dropLoadPage = 2;
		$.dropLoadUrl = location.pathname + location.search;
		$.myDropload.unlock();
		$.myDropload.noData(false);
		$.myDropload.resetload();
	}
}

function errBK(err) {
	console.log(err);
}

// 自定义查询
$(function() {
	$('.cdt-select').each(function() {
		var $this= $(this);
		var json = $this.data("json");
		var key = $this.data('key');
		if (key && key !== 'name') {
			for (var i in datas) {
				datas[i].name = datas[i][key];
			}
		}
		var hots = [];
		for (var i in json) {
			hots.push(json[i].name)
		}
		var multiSelect = $this.data('multi') || false;
		var selector = $(this).cdtSelect({
			dataJson: json,
			multiSelect: multiSelect,
			search: true,
			searchPlaceholder: $this.data("placeholder"),
			hotcdt: hots,
			onInit: function () {
				// console.log(this)
			},
			onForbid: function () {
				// console.log(this)
			},
			onTabsAfter: function (target) {
				console.log(event)
			},
			onCallerAfter: function (target, values) {
				var $option = target.parents("li").siblings(".con-item");
				var search = location.search;
				if (!search) search = "?";
				if (multiSelect) { // 支持多选
					values.id.forEach(function(v) {
						search = addSearch(search, $option.data("name"), v);
					})
				} else { // 不支持多选
					search = replaceQuery(search, $option.data("name"), values.id);
					$option.siblings(".active").removeClass("active");
				}
				doSearch(search);
			},
			onAjaxSearch: function(value, $ele) {
				var result = [];
				var keywords = $ele.parents('.cdt-select').data('keywords');
        if (!keywords)
          keywords = 'name';
        keys = keywords.split('|');
        cdts = keys.map(function (k) {
          return k + '=' + value;
        }).join('&');
				$.ajax({
					url: $ele.parents("li").siblings(".con-item").data("search-url") + "?" + cdts,
					type: "GET",
					async: false,
					success: function(data) {
						result = data.list || data;
					},
					error: function(err) {

					}
				})
				if (key) {
					for (var i in result) {
						result[i].name = result[i][key];
					}
				}
				return result;
			}
		});
		this.cdt_selector = selector;
	})
})

// 监听搜索框取消选择事件
$('.cdt-select').on('click', '.cdt-info .del', function() {
	setTimeout(onCdtsChange, 0);
})

// 输入类型的条件选择
$('.options input').on('change', function() {
	if ($(this).val()) {
		$(this).parent().data('value', $(this).val()).parent().addClass('active');
	} else {
		$(this).parent().data('value', void(0)).parent().removeClass('active');
	}
	setTimeout(onCdtsChange, 0);
})

$('.options input').on('click', function(e) {
	e.preventDefault();
	e.stopPropagation();
})


// 加载页面时绑定已选择条件
$(function() {
	var search = window.location.search.substr(1);
	var arr = search.split("&");
	var cons = [];
	var arg = [];
	for (var i in arr) {
		if (arr[i] != "") {
			arg = arr[i].split("=");
			cons.push([arg[0], arg[1]]);
		}
	}

	for (var i in cons) {
		$(".con-item[data-name='" + decodeURI(cons[i][0]) + "']")
			.parent().find("[data-value='" + decodeURI(cons[i][1]) + "']")
			.parent().addClass("active");
	}

	if ($("#cdts").find("li.active").length != 0 && getQueryString("cdts") != 'false' ) {
		$(".cdts-panel .tools .fa-chevron-down").trigger("click");
	}
})

// 数据加载成功后的回调
if (!$.dataUpdatedCBs) $.dataUpdatedCBs = {};
$.dataUpdatedCBs.tooltipInit = function() {
	$('.tooltips').tooltip();
}
