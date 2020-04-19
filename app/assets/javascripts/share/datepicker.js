//= require moment
//= require moment/zh-cn.js
//= require bootstrap-datetimepicker
//= require bootstrap-datepicker
//= require bootstrap-datepicker/locales/bootstrap-datepicker.zh-CN.js

// 日期时间选择框

function initDate() {
  window.datepickerInstance = $('.input.date').datepicker({
      language: 'zh-CN',
      autoclose: true,
      format: 'yyyy-mm-dd',
      todayHighlight: true,
      orientation: 'bottom',
  }).on('changeDate', function(ev) {
      $(this).trigger("blur");
      // if (ev.date.valueOf() < date-start-display.valueOf()){}
  });

  $('.input.datetime').datetimepicker({
    format: 'YYYY-MM-DD HH:mm',
    locale: moment.locale('zh-cn'),
    showTodayButton: true,
  }).on('changeDate', function(ev) {
      $(this).trigger("blur");
      // if (ev.date.valueOf() < date-start-display.valueOf()){}
  });
}

$(document).ready(function() {
  initDate()
})
