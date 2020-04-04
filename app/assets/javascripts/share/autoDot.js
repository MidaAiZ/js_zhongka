function countLines($ele) {
	var lh = parseInt($ele.css("line-height").replace("px",""));
	var h = parseInt($ele.innerHeight());
	var lc = Math.round(h / lh);
	return lc;
}

function autoDot() {
	var $dots = $(".dot").not(".dotted");
	$dots.each(function() {
		var $this = $(this);
		if ($this.find('.dot-collapse').innerHeight() > (21 * 8 + 8)) {
			$this.after('\
				<a href="javascript: void(0)" role="dot-more">展开</a>\
			').addClass("dotted");
		}
	})
}


if (!$.dataUpdatedCBs) $.dataUpdatedCBs = {};
$.dataUpdatedCBs.autoDot = autoDot;

$(function() {
	$("body").on("click", "[role=dot-more]", function() {
		var $this = $(this);
		if ($this.hasClass("dot-show")) {
			$this.text("展开").removeClass("dot-show").siblings(".__dot__").removeClass("__dot__").addClass("dot");
			var offsetTop = $this.offset().top - 200;
			window.scrollTo(0, offsetTop);
		} else {
			$this.text("收起").addClass("dot-show").siblings(".dot").removeClass("dot").addClass("__dot__");
		}
	})
	autoDot();
})
