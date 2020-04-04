/**
 * cdtSelect
 * v-1.0.2
 * author：lquan
 * https://github.com/lquan529/cdtSelect
 * dataJson			    [Array]				json数据，是html显示的列表数据
 * convert              [Boolean]           转换json数据，以适应这个插件的运行，如果传入的格式是指定的格式则不需要，默认(true)
 * shorthand            [Boolean]           显示的是简称还是全称，默认(false)，显示全称
 * search               [Boolean]           开启搜索功能，默认(true)，开启
 * multiSelect          [Boolean]           多选设置，默认不开启
 * multiMaximum         [Number]            允许能选择几个，默认5，只用于多选
 * multiType            [Number]            值允许1或者0，默认0；只用于多选，选中的值显示是一行还是多行
 * placeholder          [String]            默认提示语
 * searchPlaceholder    [String]            搜索文本框的默认提示
 * hotcdt               [Array]              热门条件显示数据，传就生成热门条件，没有就插件生成
 * onInit               [function]          插件初始化后的回调
 * onForbid             [function]          插件禁止后再点击的回调
 * onTabsAfter          [function]          点击tabs切换显示条件后的回调
 * onTabsForbid         [function]          tabs禁止后再点击的回调
 * onCallerAfter        [function]          选择条件后的回调
 */

(function ($, window) {
    var functionality = {};

    /**
     * 构造器
     */
    function cdtselect(options, selector) {
        this.options = $.extend({}, cdtselect.defaults, options);
        this.$selector = $(selector);
        this.multiSelectResult = [];
        this.multiSelectResultId = [];
        this.optionId = [];
        this.values = [];
        this.selectIndex = 0;
        this.isfocus = true;

        this.init();
    }

    /**
     * 默认参数
     */
    cdtselect.defaults = {
        dataJson: null,
        convert: true,
        shorthand: false,
        search: true,
        multiSelect: false,
        multiMaximum: 5,
        multiType: 0,
        mosaic: ',',
        placeholder: '请选择条件',
        searchPlaceholder: '输入关键词搜索',
        hotcdt: [],
        onInit: function () {},
        onForbid: function () {},
        onTabsAfter: function (target) {},
        onTabsForbid: function (target) {},
        onCallerAfter: function (target, values) {},
        onAjaxSearch: function(condition) {}
    };

    /**
     * 内部函数
     */
    functionality.recombine = function (data) {
        var resultId = [],
            result = [],
            option = [];

            $.each(data, function (key, value) {
                result.push(value);
            });

        //存储父条件
        this.option = option;

        return result;
    }

    functionality.filter = function (parameter) {
        var configure = parameter;

        //分类的条件
        parameter.filtercdt = {
            HOT: []
        };

        $.each(configure.newcdtData, function (key, value) {

            //如果有设置热门条件，就输出设置的，反正就去取默认条件前面18条做热门条件
            if (parameter.options.hotcdt.length < 1 && key < 18) {
                parameter.filtercdt.HOT.push(value);
            } else {
                $.each(parameter.options.hotcdt, function (hkey, hvaluef) {
                    if (hvaluef === value.name) {
                        parameter.filtercdt.HOT.push(value);
                    }
                });
            }
        });

        return parameter.filtercdt;
    }

    functionality.montage = function (cdtdata, letter) {
        var self = this,
            data = cdtdata === 0 ? self.filtercdt : cdtdata,
            html = '',
            name;

        $.each(data, function (key, value) {

            name = self.options.shorthand ? value.shortName : value.name; //显示的是简称还是全称

            if (cdtdata < 1) {

                if (letter === key) {

                    $.each(value, function (lkey, lvalue) {
                        name = self.options.shorthand ? lvalue.shortName : lvalue.name; //显示的是简称还是全称
                        html += '<a href="javascript:;" class="caller" data-id="' + lvalue.id + '" data-title="' + name + '" data-letter="' + lvalue.letter + '">' + name + '</a>';
                    });

                }

            } else {

                html += '<li class="caller" data-id="' + value.id + '" data-title="' + name + '" data-letter="' + value.letter + '">' +
                        '<span class="name">' + name + '</span>' +
                     '</li>';
            }

        });

        return html;
    }

    functionality.template = [
        '<div class="cdt-pavilion hide">',
        '<div class="cdt-tabs">',
                '<a href="javascript:;" class="tab-a active" data-letter="HOT">热门搜索</a>',
            '</div>',
            '<div class="cdt-cont">',
                '{cont}',
                '<p>',
                '<a href="javascript:;" class="empty"><i></i>清空</a><span></span>',
                '</p>',
            '</div>',
        '</div>',
        '<div class="cdt-info{type}">',
            '{name}',
            '<div class="cdt-input {not}">',
                '<input type="text" class="input-search" value="" placeholder="{placeholder}" />',
            '</div>',
        '</div>',
        '<ul class="cdt-list hide"></ul>',
        '<div class="cdt-tips hide">最多只能选择<span>{maxnum}</span>项</div>'
    ];

    functionality.split = function (str) {
        var letArray = [];

        for ( var i = 0; i < str.length; i++ ) {
            letArray.push(str[i]);
        }

        return letArray;
    }

    functionality.groupArray = [
        'HOT'
    ];

    functionality.showDrop = function (event) {
        var self = this,
            configure = self.options,
            $target = $(event.target);

        //禁止点击后的回调
        if ($(event.currentTarget).hasClass('forbid')) {
            configure.onForbid.call(self);
            return false;
        }

        //点击删除
        if ($target.hasClass('del')) {
            functionality.deletes.call(self, $target);
            return false;
        }

        self.isfocus = true;

        self.$selector.addClass('down').find('.cdt-pavilion').removeClass('hide').siblings('.cdt-list').addClass('hide');

        $(event.currentTarget).find('.input-search').focus();

        //有值就加选中状态
        functionality.defSelected.call(self);
    }

    functionality.tabs = function (event) {
        var $target = $(event.target),
            configure = this.options,
            letter = $target.data('letter');

        //tabs禁止点击后的回调
        if ($target.hasClass('forbid')) {
            configure.onTabsForbid.call(self, $target);
            return false;
        }

        //添加选中状态
        $target.addClass('active').siblings().removeClass('active');

        //显示对应索引的条件列表
        this.$selector.find('dl').addClass('hide').siblings('.cdt-'+ letter).removeClass('hide');

        //切换列表回调
        configure.onTabsAfter.call(this, $target);
    }

    functionality.singleAchieve = function (event) {
        var $target = $(event.currentTarget),
            $input = this.$selector.find('.input-search'),
            $cdtInfo = this.$selector.find('.cdt-info'),
            configure = this.options,
            id = $target.attr('data-id'),
            name = $target.data('title');

        //存储选中的值
        this.values = [];
        this.values.push({ 'name': name, 'id': id });

        //添加选中状态
        this.$selector.find('.caller').removeClass('active');
        this.$selector.find('.caller[data-id="'+ id +'"]').addClass('active');

        //赋值选中的给文本框
        $cdtInfo.find('span').remove();
        this.$selector.find('.cdt-input').before('<span data-id="'+ id +'">'+ name +'<i class="del"></i></span>').find('.input-search').val('');

        //调整文本框位置
        functionality.singleResize.call(this);

        //隐藏弹窗
        this.$selector.removeClass('down').find('.cdt-pavilion, .cdt-list').addClass('hide');

        //没有开启搜索且数组是不为空
        if (!this.options.search && this.values.length > 0) {
            this.$selector.find('.cdt-input').addClass('hide');
        }

        this.$selector.find("input.input-search").val("");

        //选择之后的回调
        configure.onCallerAfter.call(this, $target, this.values[0]);
    }

    functionality.multiAchieve = function (event) {
        var self = this,
            $selector = self.$selector,
            $target = $(event.currentTarget),
            $input = $selector.find('.input-search'),
            configure = self.options,
            id = $target.attr('data-id'),
            name = $target.data('title'),
            inputVal = $input.val(),
            hasActive = $target.hasClass('active'),
            joinSpan, mosaicName;

        if (!hasActive) {
            //选中的是否大于限制的
            if (self.selectIndex >= configure.multiMaximum) {
                $selector.find('.cdt-tips').removeClass('hide');

                setTimeout(function() {
                    $selector.find('.cdt-tips').addClass('hide');
                }, 1000);

                return false;
            }

            //选择的条件
            if ($.inArray(name, self.multiSelectResult) < 0) {
                self.multiSelectResult.push(name);
                self.multiSelectResultId.push(id);

                //拼接生成选中值
                joinSpan = '<span data-id="'+ id +'">'+ name +'<i class="del"></i></span>';

                //添加选中状态
                $selector.find('.caller[data-id="'+ id +'"]').addClass('active');

                //添加选中的条件显示方式
                if (configure.multiType < 1) {
                    $selector.find('.cdt-input').before(joinSpan);
                }

                //选中数
                self.selectIndex += 1;
            }

        } else {
            //删除去掉选中条件
            self.multiSelectResult.splice($.inArray(name, self.multiSelectResult), 1);
            self.multiSelectResultId.splice($.inArray(id, self.multiSelectResultId), 1);
            self.optionId.splice($.inArray(self.optionId), 1);

            //去掉选中状态
            $selector.find('.caller[data-id="'+ id +'"]').removeClass('active');

            //删除选中的条件
            $selector.find('.cdt-info').find('span[data-id="'+ id +'"]').remove();

            //选中数
            self.selectIndex -= 1;
        }

        //存储选中的值
        self.values = [];
        self.multiSelectResult.length > 0 ? self.values.push({ 'name': self.multiSelectResult, 'id': self.multiSelectResultId }) : '';

        //拼接后的选中name
        mosaicName = self.multiSelectResult.join(configure.mosaic);

        //添加选中的条件显示方式
        if (configure.multiType === 1) {
            $selector.find('.cdt-name').html('<span class="span-over" title="'+ mosaicName +'">'+ mosaicName +'</span>');
        }

        //有选中就清除，没有值就添加
        if (self.selectIndex < 1) {
            $selector.find('.cdt-input').addClass('not-val');
            $selector.find('.span-over').remove();
        } else {
            $selector.find('.cdt-input').removeClass('not-val');
        }

        //添加选中数
        $selector.find('p').find('span').text(self.selectIndex > 0 ? self.selectIndex : '');

        $selector.find("input.input-search").val("");
        //选择之后的回调
        configure.onCallerAfter.call(self, $target, self.values[0]);
    }

    functionality.search = function (event) {
        var self = this,
            $target = $(event.target),
            configure = this.options,
            inputVal = $target.val(),
            result = [],
            resultHtml;

        if (!inputVal) return false;

        self.isfocus = false;

        $.each(self.newcdtData, function(key, value) {
            //拼音或者名称搜索
            if(value.name.search(inputVal) > -1){
                result.push(value);
            }
        });
        if (result.length == 0) {
            result = configure.onAjaxSearch(inputVal, $target);
            if (!result) result = [];
        }

        resultHtml = result.length > 0 ? functionality.montage.call(self, result) : '<li class="not-have">没有找到<strong>'+ inputVal +'</strong>相关条件</li>';

        self.$selector.find('.cdt-list').html(resultHtml);

        //有值就加选中状态
        functionality.defSelected.call(self);

        //弹窗隐藏，搜索列表显示
        functionality.searchShow.call(self);

        return false;
    }

    functionality.searchShow = function (event) {
        // this.$selector.addClass('down').find('.cdt-pavilion').addClass('hide');
        this.$selector.find('.cdt-input').addClass('search-show');
        this.$selector.find('.cdt-list').removeClass('hide');
    }

    functionality.defSelected = function (event) {
        var self = this;

        //有选中的，就添加选中状态
        if (self.values.length > 0) {
            if (self.values[0].id instanceof Array) {
                $.each(self.values[0].id, function (key, value) {
                    self.$selector.find('.caller[data-id="'+ value +'"]').addClass('active');
                });
            } else {
                self.$selector.find('.caller[data-id="'+ self.values[0].id +'"]').addClass('active');
            }
        }
    }

    functionality.operation = function (event) {
        var self = this,
            $selector = self.$selector,
            $cdtList = $selector.find('.cdt-list'),
            $target = $(event.target),
            $items = $cdtList.find('.caller'),
            hasNothave = $cdtList.find('li').hasClass('not-have'),
            keyCode = event.keyCode,
            index = 0,
            direction,
            itemIndex;

        //按下enter键，执行选中事件
        if (keyCode === 13) {

            $cdtList.find('.caller.hover').trigger('click');

            return false;
        }

        //按下上下键
        if (keyCode === 38 || keyCode === 40) {

            //方向
            direction = keyCode === 38 ? -1 : 1;

            //选中的索引
            itemIndex = $items.index($cdtList.find('.caller.hover'));

            if (itemIndex < 0) {
                index = direction > 0 ? -1 : 0;
            } else {
                index = itemIndex;
            }

            //键盘去选择的索引
            index = index + direction;

            //循环选择
            index = index === $items.length ? 0 : index;

            //添加选中状态
            $items.removeClass('hover').eq(index).addClass('hover');

            if (!hasNothave) {
                //滚动条跟随定位
                functionality.scroll.call(self);
            }

            return false;

        }

    }

    functionality.scroll = function (event) {
        var self = this,
            $cdtList = self.$selector.find('.cdt-list'),
            $callerHover = $cdtList.find('.caller.hover'),
            oh = $cdtList.outerHeight(),
            ch = $callerHover.outerHeight() + 1,
            dy = $callerHover.position().top,
            sy = $cdtList.scrollTop();

        $cdtList.animate({
            scrollTop: dy + ch - oh + sy
        }, 200);
    }

    functionality.singleResize = function () {
        var self = this,
            $selector = self.$selector,
            $cdtInfo = $selector.find('.cdt-info'),
            _iw = $cdtInfo.outerWidth(),
            _p = $cdtInfo.innerWidth() - $cdtInfo.width(),
            _sw = $cdtInfo.find('span').outerWidth(true);

        $selector.find('.cdt-input').width(_iw - _sw - _p - 2);
    }

    functionality.multiResize = function () {
        var self = this,
            $selector = self.$selector,
            _h = $selector.outerHeight(true) - 1;

        $selector.find('.cdt-pavilion, .cdt-list').animate({
            'top': _h
        }, 10);
    }

    functionality.forbid = function () {
        var self = this;

        $.each(self.$selector.find('.cdt-cont').find('dl'), function (key, value) {
            var _this = $(value),
                _letter = _this.data('letter');

            if (!$(value).text()) {
                self.$selector.find('.tab-a[data-letter="'+ _letter +'"]').addClass('forbid');
            }
        });

    }

    functionality.deletes = function (target) {
        var self = this,
            $target = target,
            $parent = $target.parent(),
            name = $parent[0].innerText,
            id = $parent.attr('data-id');

        //删除去掉选中条件
        self.multiSelectResult.splice($.inArray(name, self.multiSelectResult), 1);
        self.multiSelectResultId.splice($.inArray(id, self.multiSelectResultId), 1);
        self.optionId.splice($.inArray(self.optionId), 1);

        //存储剩下条件的值
        self.values = [];
        self.multiSelectResult.length > 0 ? self.values.push({ 'name': self.multiSelectResult, 'id': self.multiSelectResultId }) : '';

        //删除
        $parent.remove();
        self.$selector.find('.caller[data-id="'+ id +'"]').removeClass('active');

        //如果是多选才执行以下事情
        if (self.options.multiSelect) {
            self.selectIndex -= 1;
            self.$selector.find('p').find('span').text(self.selectIndex > 0 ? self.selectIndex : '');

            //数组是空
            self.values.length < 1 ? self.$selector.find('.cdt-input').addClass('not-val') : '';
        } else {
            //调整文本框位置
            functionality.singleResize.call(self);

        }
    }

    /**
     * 原型方法
     */
    cdtselect.prototype.init = function () {
        var self = this,
            configure = this.options;

        //开启转换就用新的json，否则就用正常格式
        self.newcdtData = configure.convert ? functionality.recombine.call(self, configure.dataJson) : configure.dataJson;

        //条件分类生成json
        if (configure.hotcdt != false) {
            functionality.filter(self);
        }

        //主结构生成输出
        self.createSubject();

        //绑定事件
        self.bindEvent();

        //初始化回调
        configure.onInit.call(self);
    };

    cdtselect.prototype.groupcdt = function () {
        var self = this,
            domtel = '',
            letterStr,
            groupArray,
            list,
            montage,
            hide;

        for ( var i = 0; i < functionality.groupArray.length; i++ ) {
            //字母数组
            groupArray = functionality.groupArray[i];

            //不是热点条件的字母就不做拆分处理
            letterStr = groupArray !== 'HOT' ? functionality.split(groupArray) : '';

            //添加隐藏class
            hide = i > 0 ? ' hide' : '';

            //创建对应的dl
            domtel += '<dl class="cdt-'+ groupArray + hide +'" data-letter="'+ groupArray +'">{dl}</dl>';

            if (letterStr && letterStr.length > 1) {

                list = '';

                for (var j = 0; j < letterStr.length; j++) {

                    montage = functionality.montage.call(self, 0, letterStr[j]);

                    //不为空就执行下面创建节点
                    if (montage) {

                        list += '<dt>'+ letterStr[j] +'</dt>'+
                                '<dd>'+ montage +'</dd>';

                    }

                }

            } else {

                montage = functionality.montage.call(self, 0, groupArray);

                //不为空就执行下面创建节点
                if (montage) {

                    list = groupArray !== 'HOT' ?
                            '<dt>'+ groupArray +'</dt>'+
                            '<dd>'+ functionality.montage.call(self, 0, groupArray) +'</dd>' :
                            '<dd>'+ functionality.montage.call(self, 0, groupArray) +'</dd>';

                }

            }

            domtel = domtel.replace('{dl}', list);
        }

        return domtel;
    };

    cdtselect.prototype.createSubject = function () {
        var self = this,
            configure = self.options,
            template = functionality.template.join('');

        //添加搜索默认文本提示
        template = template.replace('{placeholder}', configure.searchPlaceholder);

        //添加多选提示最大选择数
        template = template.replace('{maxnum}', configure.multiMaximum);

        //添加多选选中的值显示的方式
        template = template.replace('{type}', configure.multiType === 1 ? ' multi-type' : '');

        //添加多选选中的值显示的方式
        template = template.replace('{name}', configure.multiType === 1 ? '<div class="cdt-name"></div>' : '');

        //添加多选class
        configure.multiSelect ? self.$selector.addClass('multi') : '';

        template = template.replace('{not}', 'not-val not-search');

        //把条件弹窗dom添加到容器中
        self.$selector.html(template.replace('{cont}', self.groupcdt()));

        //没有开启搜索，就remove掉搜索dom

        if (!configure.search) {
            self.$selector.find('.cdt-input').addClass('not-search').html('<em>'+ configure.placeholder +'</em>');
            self.$selector.find('.cdt-cont').find('p').find('em').remove();
        } else {
            self.$selector.find('.cdt-input').removeClass('not-search');
        }

        //没有数据输出的就添加禁止点击
        functionality.forbid.call(self);
    }

    cdtselect.prototype.bindEvent = function (event) {
        var self = this,
            configure = self.options,
            $selector = self.$selector;

        //显示条件-弹窗
        $selector.on('click.cdtselect', '.cdt-info', $.proxy(functionality.showDrop, self));

        //tabs-切换索引的条件显示
        $selector.on('click.cdtselect', '.tab-a', $.proxy(functionality.tabs, self));

        //点击选择条件
        $selector.on('click.cdtselect', '.caller', $.proxy(configure.multiSelect ? functionality.multiAchieve : functionality.singleAchieve, self));

        //点击清空
        $selector.on('click.cdtselect', '.empty', $.proxy(self.clear, self));

        //搜索
        $selector.on('input.cdtselect', '.input-search', $.proxy(functionality.search, self));

        //键盘切换列表
        $selector.on('keydown.cdtselect', $.proxy(functionality.operation, self));
    }

    cdtselect.prototype.unBindEvent = function (event) {
        var self = this,
            $selector = self.$selector;

        $selector.off('click.cdtselect', '.cdt-info');

        $selector.off('click.cdtselect', '.tab-a');

        $selector.off('click.cdtselect', '.caller');

        $selector.off('click.cdtselect', '.empty');

        $selector.off('keyup.cdtselect', '.input-search');

        $selector.off('keydown.cdtselect');
    }

    cdtselect.prototype.setcdtVal = function (val) {
        var self = this,
            configure = self.options,
            setcdt = val.replace(/\s/g, ''),
            cdtArray = setcdt.split(','),
            name, joinSpan, mosaicName;

        if (val) {
            //存储设置条件变量
            self.cdtVal = val;
            //根据多选还是单选，多选不能超过设定的个数输出; 单选只能输出一个，设置多个只会输出第一个
            !configure.multiSelect ? cdtArray = cdtArray.splice(0, 1) : cdtArray = cdtArray.splice(0, configure.multiMaximum);

            for (var i = 0; i < cdtArray.length; i++) {

                $.each(self.newcdtData, function (key, value) {
                    name = self.options.shorthand ? value.shortName : value.name; //显示的是简称还是全称

                    if (cdtArray[i] === value.name) {

                        self.multiSelectResult.push(name);
                        self.multiSelectResultId.push(value.id);

                        //添加选中状态
                        self.$selector.find('.caller[data-id="'+ value.id +'"]').addClass('active');

                        //选中的值拼接dom
                        joinSpan = '<span data-id="'+ value.id +'">'+ name +'<i class="del"></i></span>';

                        //添加选中的条件显示方式
                        if (configure.multiType < 1) {
                            self.$selector.find('.cdt-input').before(joinSpan);
                        }

                    }

                });

                //如果是多选才执行以下事情
                if (self.options.multiSelect) {
                    self.selectIndex = i + 1;
                    self.$selector.find('p').find('span').text(i + 1);
                }

            };

            //存储设置条件的值
            self.values = [];
            self.multiSelectResult.length > 0 ? self.values.push({ 'name': self.multiSelectResult, 'id': self.multiSelectResultId }) : '';

            //拼接后的选中name
            mosaicName = self.multiSelectResult.join(configure.mosaic);

            //添加选中的条件显示方式
            if (configure.multiType === 1) {
                self.$selector.find('.cdt-name').html('<span class="span-over" title="'+ mosaicName +'">'+ mosaicName +'</span>');
            }

            //有值就去掉此class
            self.values.length > 0 ? self.$selector.find('.cdt-input').removeClass('not-val') : '';

        }
    }

    cdtselect.prototype.getcdtVal = function () {
        //返回选中的条件
        return this.values[0];
    }

    cdtselect.prototype.update = function (data) {
        var self = this,
            template = functionality.template.join('');

        if (data.length > 0) {
            //重新更新条件数据
            self.newcdtData = data;
            //重新生成条件分组
            functionality.filter(self);
            //主结构生成输出
            self.createSubject();
            //有设置条件默认的就重新设置
            self.cdtVal ? self.setcdtVal(self.cdtVal) : '';
        }
    }

    cdtselect.prototype.clear = function () {
        //清空选中的值
        this.multiSelectResult = [];
        this.multiSelectResultId = [];
        this.optionId = [];
        this.values = [];
        this.selectIndex = 0;
        this.isfocus ? this.$selector.find('.input-search').val('').focus() : '';

        this.$selector.find('.caller').removeClass('active');
        this.$selector.find('p').find('span').text('');
        this.$selector.find('.cdt-info').find('span').remove();

        if (this.values.length < 1) {
            this.$selector.find('.cdt-input').removeClass('hide').addClass('not-val');
        }
    }

    cdtselect.prototype.status = function (status) {
        var self = this,
            $cdtInfo = self.$selector.find('.cdt-info');

        if (status === 'disabled') {
            self.$selector.addClass('disabled').find('.input-search').prop('disabled', true);
            self.unBindEvent();
        } else if (status === 'readonly') {
            self.$selector.addClass('readonly').find('.input-search').prop('readonly', true);
            self.unBindEvent();
        }
    }

    //点击以外的地方就隐藏
    $(document).on('click.cdtselect', function (event) {
        var $cdtSelect = $('.cdt-select');

        if ($cdtSelect.find(event.target).length < 1) {
            $cdtSelect.removeClass('down').find('.cdt-pavilion, .cdt-list').addClass('hide');
            $cdtSelect.find('.cdt-input').removeClass('search-show').find('.input-search').val('');
        }
    });

    $.fn.cdtSelect = function (options) {
        return new cdtselect(options, this);
    };

})(jQuery, window);
