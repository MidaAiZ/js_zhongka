//= require jQuery-emoji/lib/script/highlight.pack
//= require jQuery-emoji/lib/script/jquery.mousewheel-3.0.6.min
//= require jQuery-emoji/lib/script/jquery.mCustomScrollbar.min
//= require jQuery-emoji/dist/js/jquery.emoji.min

$(function() {
	$("#emoji-btn i").on("click", function(e) {
		e.stopPropagation();
		$("#emoji-btn").trigger("click");
	})

	$("#emoji-btn").on("click", function() {
		$("[role=emoji-input]").emoji({
			showTab: false,
			button: "#emoji-btn",
			animation: 'fade',
			icons: [{
				name: "90后",
				path: "/assets/jQuery-emoji/dist/img/qq/",
				maxNum: 91,
				excludeNums: [41, 45, 54],
				file: ".gif",
				placeholder: "#qq_{alias}#"
			},
			{
				name: "00后",
				path: "/assets/jQuery-emoji/dist/img/tieba/",
				maxNum: 50,
				file: ".jpg",
				placeholder: ":{alias}:"
			}]
		})
	})
})
