// = require froala_editor.min.js
// = require plugins/align.min.js
// = require plugins/char_counter.min.js
// = require plugins/code_beautifier.min.js
// = require plugins/code_view.min.js
// = require plugins/colors.min.js
// = require plugins/emoticons.min.js
// = require plugins/entities.min.js
// = require plugins/file.min.js
// = require plugins/font_family.min.js
// = require plugins/font_size.min.js
// = require plugins/fullscreen.min.js
// = require plugins/help.min.js
// = require plugins/image.min.js
// = require plugins/image_manager.min.js
// = require plugins/inline_style.min.js
// = require plugins/line_breaker.min.js
// = require plugins/link.min.js
// = require plugins/lists.min.js
// = require plugins/paragraph_format.min.js
// = require plugins/paragraph_style.min.js
// = require plugins/print.min.js
// = require plugins/quick_insert.min.js
// = require plugins/quote.min.js
// = require plugins/save.min.js
// = require plugins/table.min.js
// = require plugins/special_characters.min.js
// = require plugins/url.min.js
// = require plugins/video.min.js
// = require languages/zh_cn.js

// = require ../share/leave_tip

"//= require plugins/video.min.js"

$(function() {
    // var params = {
    //     csrfParam: $('meta[name=csrf-param]').attr('content'),
    //     csrfToken: $('meta[name=csrf-token]').attr('content')
    // }
    // params.csrf = {
    //     'authenticity_token': params.csrfToken
    // }
    //
    var params = {}
    var token = '';
    $.post({
      url: '/manage/upload_token',
      dataType: "json",
      success: function(res) {
        token = res.uptoken;
        params = {
          token: token,
        }
        $('#froala-editor').froalaEditor({
            language: "zh_cn",
            spellcheck: false,
            height: "600px",
            placeholderText: '请输入内容',
            imageUploadURL: '//upload.qiniup.com', //上传到服务器
            imageUploadParam: 'file',
            imageUploadParams: params,
            imageManagerLoadURL: "/manage/images",
            fileUploadURL: "//upload.qiniup.com",
            fileUploadParam: "file",
            fileUploadParams: params,
            imageMaxSize: 3145728, //最大允许上传3M的图片
            fileMaxSize: 10485760 //最大允许上传10M的文件
        }).on('froalaEditor.contentChanged', function() {
            $("#editor-content").val($('#froala-editor').froalaEditor('html.get'))
        });
        $(".fr-wrapper ").find("div").eq(0).find("a[href='https://www.froala.com/wysiwyg-editor?k=u']").remove();
        $(".fr-wrapper ").find("img").each(function(i, v) { // fix bug
          $(v).attr('src', "\/\/static.mxjyu.cn/" + $(v).data('key'));
        })
      },
      fail: function() {
        alert('系统错误，上传失败！(token fail)')
      },
    });
});
