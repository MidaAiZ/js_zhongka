// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require bootstrap
//= require nicescroll
//= require share/loading
//= require share/tagsinput-init

(function() {
    "use strict";

    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        // 手机端
        $("body").removeClass("left-side-collapsed")
    } else {
        // PC端
        // $("body").addClass('left-side-collapsed');
        // custom scrollbar
        // $("html").niceScroll({styler:"fb",cursorcolor:"#65cea7", cursorwidth: '6', cursorborderradius: '0px', background: '#424f63', spacebarenabled:false, cursorborder: '0',  zindex: '1000'});
        //
        // $(".left-side").niceScroll({styler:"fb",cursorcolor:"#65cea7", cursorwidth: '3', cursorborderradius: '0px', background: '#424f63', spacebarenabled:false, cursorborder: '0'});
        //
        // $(".left-side").getNiceScroll();
        // if ($('body').hasClass('left-side-collapsed')) {
        //     $(".left-side").getNiceScroll().hide();
        // }
    }


    // Toggle Left Menu
   jQuery('.menu-list > a').click(function() {

      var parent = jQuery(this).parent();
      var sub = parent.find('> ul');
      if(!jQuery('body').hasClass('left-side-collapsed')) {
         if(sub.is(':visible')) {
            sub.slideUp(200, function(){
               parent.removeClass('nav-active');
               jQuery('.main-content').css({height: ''});
               mainContentHeightAdjust();
            });
         } else {
            visibleSubMenuClose();
            parent.addClass('nav-active');
            sub.slideDown(200, function(){
                mainContentHeightAdjust();
            });
         }
      }
      return false;
   });

   function visibleSubMenuClose() {
      jQuery('.menu-list').each(function() {
         var t = jQuery(this);
         if(t.hasClass('nav-active')) {
            t.find('> ul').slideUp(200, function(){
               t.removeClass('nav-active');
            });
         }
      });
   }

   function mainContentHeightAdjust() {
      // Adjust main content height
      var docHeight = jQuery(document).height();
      if(docHeight > jQuery('.main-content').height())
         jQuery('.main-content').height(docHeight);
   }

   //  class add mouse hover
   jQuery('.custom-nav > li').hover(function(){
      jQuery(this).addClass('nav-hover');
   }, function(){
      jQuery(this).removeClass('nav-hover');
   });


   // Menu Toggle
   jQuery('.toggle-btn').click(function(){
       $(".left-side").getNiceScroll().hide();

       if ($('body').hasClass('left-side-collapsed')) {
           $(".left-side").getNiceScroll().hide();
       }
      var body = jQuery('body');
      var bodyposition = body.css('position');

      if(bodyposition != 'relative') {

         if(!body.hasClass('left-side-collapsed')) {
            body.addClass('left-side-collapsed');
            jQuery('.custom-nav ul').attr('style','');

            jQuery(this).addClass('menu-collapsed');

         } else {
            body.removeClass('left-side-collapsed chat-view');
            jQuery('.custom-nav li.active ul').css({display: 'block'});

            jQuery(this).removeClass('menu-collapsed');

         }
      } else {

         if(body.hasClass('left-side-show')) {
            body.removeClass('left-side-show');
            jQuery('.main-content').css('height', '');
         } else {
             body.addClass('left-side-show');
             mainContentHeightAdjust();
         }
      }

   });


   searchform_reposition();

   jQuery(window).resize(function(){

      if(jQuery('body').css('position') == 'relative') {

         jQuery('body').removeClass('left-side-collapsed');

      } else {

         jQuery('body').css({left: '', marginRight: ''});
      }

      searchform_reposition();

   });

   function searchform_reposition() {
      if(jQuery('.searchform').css('position') == 'relative') {
         jQuery('.searchform').insertBefore('.left-side-inner .logged-user').show();
      } else {
         jQuery('.searchform').insertBefore('.menu-right').show();
      }
   }

    // panel collapsible
    $('.tools .toggle-show').click(function () {
        var el = $(this).parents(".panel").children(".panel-body");
        if ($(this).hasClass("fa-chevron-up")) {
            $(this).removeClass("fa-chevron-up").addClass("fa-chevron-down");
            el.slideUp(200);
        } else {
            $(this).removeClass("fa-chevron-down").addClass("fa-chevron-up");
            el.slideDown(200); }
    });

    // panel collapsible
    $('.cdts-panel .tools .fa').click(function () {
        var el = $(this).parents(".cdts-panel").children(".cdts");
        var fa = $(this).parents(".panel-heading");
        if ($(this).hasClass("fa-chevron-up")) {
            $(this).removeClass("fa-chevron-up").addClass("fa-chevron-down");
            fa.addClass("c");
            el.slideUp(200);
        } else {
            $(this).removeClass("fa-chevron-down").addClass("fa-chevron-up");
            fa.removeClass("c");
            el.slideDown(200);
        }
        return false;
    });


    $('.todo-check label').click(function () {
        $(this).parents('li').children('.todo-title').toggleClass('line-through');
    });

    $(document).on('click', '.todo-remove', function () {
        $(this).closest("li").remove();
        return false;
    });

    // $("#sortable-todo").sortable();


    // panel close
    $('.panel .tools .fa-times').click(function () {
        $(this).parents(".panel").parent().remove();
    });

    // tool tips

    $('.tooltips').tooltip();

    // popovers

    $('.popovers').popover();
})(jQuery);

$(function() {
    $("[role=back]").on("click", function() {
        if (history.length <= 1) { // 沒有历史记录的情况
            window.location = $(this).data("back-url");
            return;
        }
        backState = getQueryString("back");
        if (!backState) backState = -1;
        history.go(backState);
    })

    $("body").on("click", "[role=delete-confirm]", function() {
        var $this = $(this);
        if ($this.data("info")) {
            if(!confirm($this.data("info"))) return false;
        }
        $.ajax({
            url: $this.data("href"),
            type: $this.data("method"),
            dataType: "json",
            success: function(data) {
                $this.parents("[role=remove]").remove();
            },
            error: function() {
                alert("删除失败！");
            }
        })
    })
})

$(function() {
    $("#print").click(function() {
       bdhtml=window.document.body.innerHTML;
       sprnstr="<!--startprint-->";
       eprnstr="<!--endprint-->";
       prnhtml=bdhtml.substr(bdhtml.indexOf(sprnstr)+17);
       prnhtml=prnhtml.substring(0,prnhtml.indexOf(eprnstr));
       window.document.body.innerHTML=prnhtml;
       window.print();
    })
})

// $(function() {
//     //生成下拉列表
//     if ($.fn.editableSelect) {
//         $('select').editableSelect({
//             effects: 'slide',
//             duration: 200,
//             filter: false
//         });
//     }
// })

// $(document).ready(function() {
//     // lazy load image after document has been ready
//     $("img").each(function() {
//         var _this = $(this);
//         _this.attr("src", _this.data("src")).addClass("loader").on("load", function() {
//             $(this).removeClass("loader");
//         });
//     });
//
// })

//构建用于ajax交互的表单
function buildForm($inputEle) {
    if (!$inputEle) $inputEle = "";
    var $form = $("<form id='ajaxForm' method='post'></form>"),
        csrfToken = $('meta[name=csrf-token]').attr('content'),
        csrfParam = $('meta[name=csrf-param]').attr('content');

    if (csrfParam !== undefined && csrfToken !== undefined) {
        $form.append($('<input name="' + csrfParam + '" value="' + csrfToken + '" type="hidden" />'));
    }
    $(document.body).append($form);
    $form.append($inputEle);
    return $form;
}

//获取参数方法
function getQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  decodeURI(r[2]); return null;
}

// 导航栏搜索功能
$("#navSearch").on("submit", function(e) {
    e.preventDefault();
    var $this = $(this);
    var value = $this.find("input").val();
    if (value)
        window.location = encodeURI('/materials?search=true&cdts=false&school=NONE&name=' + value + '&tag=' + value);
    else
        window.location = '/materials?search=true&cdts=false&school=NONE';
    return false;
})

// 设置编码
$(function() {
    $.ajaxSetup({
    	contentType: "application/x-www-form-urlencoded; charset=utf-8",
        // beforeSend: function(xhr) {
        // }
    });
})
