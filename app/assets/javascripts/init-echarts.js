//= require echarts
//= require ./city-json
//= require ./china.js

$(function() {
  var planePath = 'path://M.6,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705';
  var convertData = function(data) {
      var res = [];
      for (var i = 0; i < data.length; i++) {
          var dataItem = data[i];
          var fromCoord = geoCoordMap[dataItem[0].name];
          var toCoord = geoCoordMap[dataItem[1].name];
          if (fromCoord && toCoord) {
              res.push([{
                  coord: fromCoord
              }, {
                  coord: toCoord
              }]);
          }
      }
      return res;
  };

function run(res) {
  var data = []
  for (var key of Object.keys(res)) {
    var tmp_map = {}
    for (var v of res[key]) {
      if (!tmp_map[v]) tmp_map[v] = 1;
      else tmp_map[v]++;
    }
    if (!tmp_map[key]) tmp_map[key] = 1;
    for (var tk of Object.keys(tmp_map)) {
      data.push([
        {
          name: key
        },
        {
          name: tk,
          value: tmp_map[tk]
        }
      ])
    }
  }

  var color = ['#3ed4ff', '#ffa022', '#a6c84c'];
  var series = [];

  [
      ['车辆运输调度图', data],
  ].forEach(function(item, i) {
      series.push({
          name: item[0],
          type: 'lines',
          zlevel: 1,
          effect: {
              show: true,
              period: 6,
              trailLength: 0.7,
              color: '#fff',
              symbolSize: 3
          },
          lineStyle: {
              normal: {
                  color: color[i],
                  width: 0,
                  curveness: 0.2
              }
          },
          data: convertData(item[1])
      }, {
          name: item[0],
          type: 'lines',
          zlevel: 2,
          effect: {
              show: true,
              period: 6,
              trailLength: 0,
              symbol: planePath,
              symbolSize: 15
          },
          lineStyle: {
              normal: {
                  color: color[i],
                  width: 1,
                  opacity: 0.4,
                  curveness: 0.2
              }
          },
          data: convertData(item[1])
      }, {
          name: item[0],
          type: 'effectScatter',
          coordinateSystem: 'geo',
          zlevel: 2,
          rippleEffect: {
              brushType: 'stroke'
          },
          label: {
              normal: {
                  show: true,
                  position: 'right',
                  formatter: '{b}'
              }
          },
          symbolSize: function(val) {
              return val[2] / 8;
          },
          itemStyle: {
              normal: {
                  color: color[i]
              }
          },
          data: item[1].map(function(dataItem) {
              return {
                  name: dataItem[1].name,
                  value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
              };
          })
      });
  });

  option = {
      backgroundColor: '#49586e',
      title: {
          text: '今日订单运输轨迹',
          subtext: '数据来源于订单统计(发货地、目的地)',
          left: 'left',
          textStyle: {
              color: '#fff'
          }
      },
      tooltip: {
          trigger: 'item'
      },
      legend: {
          orient: 'vertical',
          top: 'bottom',
          left: 'right',
          data: ['车辆运输调度图'],
          textStyle: {
              color: '#fff'
          },
          selectedMode: 'single'
      },
      geo: {
          map: 'china',
          label: {
              emphasis: {
                  show: false
              }
          },
          roam: true,
          itemStyle: {
              normal: {
                  areaColor: '#132937',
                  borderColor: '#0692a4'
              },
              emphasis: {
                  areaColor: '#0b1c2d'
              }
          }
      },
      series: series
  };

  var myChart = echarts.init(document.getElementById('car-line'));
  myChart.setOption(option);
  }

  $.ajax({
  	url: '/statistic_order_map',
  	type: 'GET',
  	dataType: 'JSON',
  	success: function(res) {
  	    console.log(res)
        run(res);
  	}
  })
})
