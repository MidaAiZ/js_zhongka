//= require sparkline/jquery.sparkline
//= require sparkline/sparkline-init
//= require easypiechart/jquery.easypiechart
//= require ./init-echarts

$(function() {
	$.ajax({
		url: '/counts',
		type: 'GET',
		dataType: 'JSON',
		success: function(res) {
			$("#s-count").text(res.s_count);
			$("#c-count").text(res.c_count);
			$("#o-count").text(res.o_count);
			$("#total-money").text(res.total_money);
			$("#t-o-count").text(res.t_o_count);
			$("#t-s-count").text(res.t_s_count);
			$("#today-money").text(res.today_money);
		}
	})
})

$(function() {
	$('.edit-loc').click(function() {
		var $this = $(this);
		var $loc = $this.siblings('.loc');
		if ($(this).text() == '编辑') {
			var $loc = $(this).siblings('.loc');
			$loc.html("<input class='input form-control' style='width:110px' value='"+ $loc.text() +"'>");
			$(this).find('a').text('保存');
		} else {
			$.ajax({
				method: "PATCH",
				url: $(this).data("href"),
				dataType: "JSON",
				data: {
					[$(this).data('attr')]: $loc.find("input").val(),
				},
				success: function(res) {
					$loc.html(res["loc"]);
					// $this.siblings('.updated-time').text(res['updated_at']);
				}
			})
			$this.find('a').text('编辑');
		}
	})
})
