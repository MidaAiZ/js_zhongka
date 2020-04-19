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
