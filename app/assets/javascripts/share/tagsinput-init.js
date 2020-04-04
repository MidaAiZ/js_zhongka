//tag input

function tagsInit() {
	$(".tags-pane").each(function(i, e) {
	    var $this = $(this);
	    var tagsText = $this.text().trim().split(",");
	    $this.text("");
	    for (var i in tagsText) {
	    	if (tagsText[i] != "") $this.append("<span class='tag'>" + tagsText[i] + "</span>");
	    }
	});
}

if (!$.dataUpdatedCBs) $.dataUpdatedCBs = {};
$.dataUpdatedCBs.tagsInit = tagsInit;

$(function() {
	tagsInit();
})
