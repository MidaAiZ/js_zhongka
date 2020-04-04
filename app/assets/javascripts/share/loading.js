//= require loading/js/loading

function showLoading(title, info, width) {
	if (!title) title = "请稍候";
	if (!info) info = "";
	if (!width) width = 240;
	$('body').loading({
		loadingWidth: width,
		title: title,
		name:'loading',
		discription: info,
		direction:'column',
		type:'origin',
		// originBg:'#71EA71',
		originDivWidth:40,
		originDivHeight:40,
		originWidth:6,
		originHeight:6,
		smallLoading:false,
		loadingMaskBg:'rgba(0,0,0,0.2)'
	});
}

function showTip(tip, interval, title) {
	if (!title) title = "<i class='fa fa-lightbulb-o'>提示</i>";
	// if (!tip) tip = "";
	if (!interval) interval = 3000;
	$('body').loading({
		loadingWidth:240,
		title: title,
		name:'tip',
		discription: tip,
		direction:'column',
		type:'tip',
		originBg:'#71EA71',
		originDivWidth:30,
		originDivHeight:30,
		originWidth:4,
		originHeight:4,
		smallLoading:false,
		titleColor:'#65cea7',
		discColor: '#7a7676',
		loadingBg:'white',
		loadingMaskBg:'rgba(22,22,22,0.2)'
	});
	setTimeout(function() {
		removeLoading('tip');
	}, interval)
}

function hideLoading() {
	removeLoading('loading');
}
