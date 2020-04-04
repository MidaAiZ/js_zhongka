//= require bootstrap-datepicker
//= require bootstrap-datepicker/locales/bootstrap-datepicker.zh-CN.js

// 日期时间选择框

$(document).ready(function() {

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
})
