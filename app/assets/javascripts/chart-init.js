//= require morris-chart/morris
//= require morris-chart/raphael-min
// = require flot-chart/jquery.flot.min
//= require flot-chart/jquery.flot.tooltip.min
//= require flot-chart/jquery.flot.resize.min

$(function(){
    $.ajax({
        url: '/manage/products_count',
        type: 'get',
        dataType: 'json',
        success: function(res) {
            build_chart(res);
        },
        error: function() {

        }
    })
    function build_chart(data) {
        // Use Morris.Area instead of Morris.Line
        Morris.Donut({
            element: 'graph-donut',
            data: get_cates(data),
            backgroundColor: false,
            labelColor: '#fff',
            colors: [
                '#5ab6df','#4bccae','#6a8bbe','#fb8575', '#febd48', '#c5c5c5'
            ],
            formatter: function (x, data) { return data.formatted; }
        });
        set_color_labels(data);
    }

    function get_cates(data) {
        var arr = [];
        for (var i in data) {
            arr.push({
                value: data[i],
                label: i,
                formatted: '总数' + data[i]
            })
        }
        return arr;
    }

    function set_color_labels(data) {
        var $labels = $(".bar-legend");
        var index = 0;
        var classes = ['blue', 'green', 'purple', 'red', 'yellow', 'grey'];
        for(var i in data) {
            $labels.append("<li><span class='" + classes[index] + "'></span>" + i + "</li>");
            index ++;
        }
    }
})

$(function() {

    $.ajax({
        url: '/manage/viewers_count',
        type: 'get',
        dataType: 'JSON',
        success: function(res) {
            build_v_chart(res);
        },
        error: function() {

        }
    })
    function build_v_chart(data) {

        var d1 = [
            [1, data.p_7_count],
            [2, data.p_6_count],
            [3, data.p_5_count],
            [4, data.p_4_count],
            [5, data.p_3_count],
            [6, data.p_2_count],
            [7, data.p_1_count],
            [8, data.p_0_count]
        ];

        var d2 = [
            [1, data.o_7_count],
            [2, data.o_6_count],
            [3, data.o_5_count],
            [4, data.o_4_count],
            [5, data.o_3_count],
            [6, data.o_2_count],
            [7, data.o_1_count],
            [8, data.o_0_count]
        ];

        var d3 = [
            [1, data.pt_7_count],
            [2, data.pt_6_count],
            [3, data.pt_5_count],
            [4, data.pt_4_count],
            [5, data.pt_3_count],
            [6, data.pt_2_count],
            [7, data.pt_1_count],
            [8, data.pt_0_count]
        ]
        var data = ([
            {
                label: "商品点击量",
                data: d1,
                lines: {
                    show: true,
                    fill: true,
                    fillColor: {
                        colors: ["rgba(255,255,255,.0)", "rgba(183,236,240,.4)"]
                    }
                }
            },
            {
                label: "订单量",
                data: d2,
                lines: {
                    show: true,
                    fill: true,
                    fillColor: {
                        colors: ["rgba(255,255,255,.0)", "rgba(253,96,91,.7)"]
                    }
                }
            },
        ]);

        var options = {
            grid: {
                backgroundColor:
                {
                    colors: ["#ffffff", "#f4f4f6"]
                },
                hoverable: true,
                clickable: true,
                tickColor: "#eeeeee",
                borderWidth: 1,
                borderColor: "#eeeeee"
            },
            // Tooltip
            tooltip: true,
            tooltipOpts: {
                content: "%x%s: %y",
                shifts: {
                    x: -60,
                    y: 25
                },
                defaultTheme: false
            },
            legend: {
                labelBoxBorderColor: "#000000",
                container: $("#main-chart-legend"), //remove to show in the chart
                noColumns: 0
            },
            xaxis: {
                tickSize: 1,
                tickFormatter: function(v, axis) {
                                    if (8 - v == 0) return '今天';
                                    if (8 - v == 1) return '昨天';
                                    else if (8 - v == 2) return '前天';
                                    else return (8 - v) + '天前';
                                }
            },
            yaxis: {
                // tickFormatter: function(v, axis) { return v + '人' }
                min: 0
            },
            series: {
                stack: true,
                shadowSize: 0,
                highlightColor: 'rgba(000,000,000,.2)'
            },
           lines: {
               show: true,
               fill: true

           },
            points: {
                show: true,
                radius: 3,
                symbol: "circle"
            },
            colors: ["#6a8abe", "#ff8673", "#65cea7"]
        };
        var plot = $.plot($("#main-chart #main-chart-container"), data, options);
    }

});
