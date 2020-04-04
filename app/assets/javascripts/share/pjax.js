(function($) {

    // pjax
    var pjax = function(options) {
        pjax.options = $.extend(true, pjax.defaultOptions, options);
        pjax.request(pjax.options);

        if (!pjax.options.container || !pjax.options.url) {
            throw new Error('url & container options must be set');
        }
    };

    // check if bower is support pjax
    pjax.support = window.history && window.history.pushState && window.history.replaceState;

    // 默认选项
    pjax.defaultOptions = {
        timeout: 5000,
        container: null,
        url: '', // 链接地址
        replace: true, // true is push, false is replace, null for do nothing
        type: 'GET',
        data: {
            pjax: true
        },
        cache: true,
        dataType: 'html',
        callback: null, // 回调函数
        beforeSend: function(xhr) {
            $(pjax.options.container).trigger('pjax.start', [xhr, pjax.options]);
            xhr && xhr.setRequestHeader('X-PJAX', true);
        },
        success: function(data, status) {
            var pjaxHtml = $(data);
            $(pjax.options.container).html(data);
        },
        error: function() {
            pjax.options.callback && pjax.options.callback.call(pjax.options.element, {
                type: 'error'
            });
            location.href = pjax.options.url;
        },
        complete: function(xhr) {
            $(pjax.options.container).trigger('pjax.end', [xhr, pjax.options]);
        },
        showFx: null
    };


    // 发送请求
    pjax.request = function(options) {
        $.ajax(options).done(function(data, status) {
            !pjax.options.replace && history.pushState(pjax.state, document.title, pjax.options.url);
            pjax.options.replace && history.replaceState(pjax.state, document.title, pjax.options.url);
        });
    };

    // popstate event
    // 浏览器后退的时候拦截事件 自动生成一个新的请求
    var popped = ('state' in window.history),
        initialURL = location.href;
    $(window).bind('popstate', function(event) {
        var initialPop = !popped && location.href == initialURL;
        popped = true;
        if (initialPop) return;
        var state = event.state;
        if (state && state.container) {
            if ($(state.container).length) {
                var data = {
                    url: state.url,
                    container: state.container,
                    push: null,
                    timeout: state.timeout,
                    cache: state.cache,
                    storage: state.storage,
                    title: state.title,
                    element: null
                };
                pjax.request(data);
            } else {
                window.location = location.href;
            }
        }
    });

    // not support
    if (!pjax.support) {
        pjax = function(options) {
            if (options && options.url) {
                location.href = options.url;
            }
            return false;
        };
    }
    // pjax bind to $
    $.pjax = pjax;
    $.pjax.support = pjax.support;
    // extra
    if ($.inArray('state', $.event.props) < 0) {
        $.event.props.push('state')
    }

})(jQuery);
