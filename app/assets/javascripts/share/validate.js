/**
 * 自定义数据验证插件
 * 依赖jQuery插件
 * 使用方式：
 * $(selector).validate({
 *   rules: {
 *     'inputA': "required",
 *     'inputB': "number",
 *     'inputC': /^[a-z]+$/,
 *     'inputD': {
 *        "required": true,
 *        "regex": /pattern/,
 *        "maxLength": 3
 *      }
 *   },
 *   messages: {
 *     'inputA': "A不能为空",
 *     'inputB': "B只能为数字",
 *     'inputC': "C只能为小写字母"
 *     'inputD': {
 *        "required": "D不能为空",
 *        "regex": "D要符合xx格式",
 *        "maxLength": "D长度最大值为3"
 *      }
 *   },
 *   errorClass: "error-class-name"
 * });
 *
 * 注意事项：
 * 1. selector必须为表单元素
 * 2. inputA,B,C,D必须是该表单的子元素（不需要为直接子元素）
 * 3. 示例中的inputA,B,C,D分别是相应表单元素的name属性值
 *
 * Created by JasonSi
 */
(function($) {
    // 定义一些正则表达式用于判断
    var REGEX = {
        required: {
            reg: /\S+/,
            message: "不能为空"
        },

        number: {
            reg: /^$|^[+-]?\d+(\.\d+)?$/,
            message: "只能为数值或不填"
        },
        integer: {
            reg: /^$|^[+-]?\d+$/,
            message: "只能为整数或不填"
        },
        positiveInteger: {
            reg: /^$|^\+?[1-9]\d*$/,
            message: "只能为正整数或不填"
        },
        digits: {
            reg: /^$|^\d*$/,
            message: "只能含有数字或不填"
        },
        email: {
            reg: /^$|^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
            message: "请输入正确的邮箱"
        },
        account: {
            reg: /^$|^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
            //  ^[\u4e00-\u9fa5A-Za-z0-9-_]*$  只能中英文，数字，下划线，减号
            message: "汉字、数字、字母、下划线"
        },
        password: {
            // reg: /^\w{6,20}$/,

            reg: /^$|[a-zA-Z0-9_.,~!@#$%^&*()_+-=<>:;|?/\\`'"\[\]]+$/,
            message: "数字、字母或特殊符号，4-20位"
        },
        url: {
            reg: /^$|^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i,
            message: "只能为URL格式或不填"
        },
        cellphone: {
            reg: /^$|^1[0-9]{10}$/,
            message: "请输入正确的手机号"
        },
        date: {
            reg: /^$|^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
            message: "请输入正确的日期格式（xxxx-xx-xx）"
        },
        time: {
            reg: /^$|^((0\d|1\d)|(2[0123]))(:[0-5]\d){1,2}$/,
            message: "只能为时间格式（xx:xx:xx或xx:xx）或不填"
        },
        ID: {
            reg: /^$|(^\d{15}$)|(^\d{17}([0-9]|X)$)/,
            message: "请输入有效身份证"
        },
        gender: {
            reg: /^$|^(\u7537|\u5973)$/,
            message: "请输入男或女"
        }
    };

    var defaults = {

        // 定义默认错误类名，用以添加样式
        errorClass: "error",
        addErrorMsg: true,

        // 定义默认的错误提示信息
        errorMessage: function(regulation) {
            var defaultMessage = "格式不正确";

            if (RegExp.prototype.isPrototypeOf(regulation)) {
                return defaultMessage;
            } else if (typeof regulation == "string") {
                if (REGEX.hasOwnProperty(regulation)) {
                    return REGEX[regulation].message;
                } else {
                    return defaultMessage;
                }
            } else if (typeof regulation == "object") {
                var rName = regulation.regulationName;
                var rDetail = regulation.regulationDetail;
                switch (rName) {
                    case "equalTo":
                        return "两次输入内容不一致";
                    case "maxLength":
                        return "不能超过" + parseInt(rDetail) + "个字符";
                    case "minLength":
                        return "不能少于" + parseInt(rDetail) + "个字符";
                    case "max":
                        return "数值不能大于" + parseInt(rDetail);
                    case "min":
                        return "数值不能小于" + parseInt(rDetail);
                    default:
                        return (rDetail && REGEX[rName] ? REGEX[rName].message : defaultMessage);
                }


            } else {
                return defaultMessage;
            }
        }
    };

    var methods = {
        simpleJudge: function(regulation, value) {
            // TODO: 支持更多的验证格式
            if (RegExp.prototype.isPrototypeOf(regulation)) {
                return regulation.test(value);
            } else if (REGEX.hasOwnProperty(regulation)) {
                return REGEX[regulation].reg.test(value);
            } else {
                console.error(`不支持"${regulation}"类型数据验证，默认通过验证`);
                return true;
            }
        },
        furtherJudge: function(regulationName, regulationDetail, value) {
            if (typeof regulationName != 'string') return true;

            if (REGEX.hasOwnProperty(regulationName)) {
                return (!regulationDetail || REGEX[regulationName].reg.test(value));
            } else {
                switch (regulationName) {
                    case 'equalTo':
                        return $(this).find(`[name="${regulationDetail}"]`).val() == value;
                    case 'regex':
                        return RegExp(regulationDetail).test(value);
                    case 'maxLength':
                        return (value.length <= parseInt(regulationDetail));
                    case 'minLength':
                        return (value.length >= parseInt(regulationDetail));
                    case 'max':
                        return (!value || parseFloat(value) <= parseFloat(regulationDetail));
                    case 'min':
                        return (!value || parseFloat(value) >= parseFloat(regulationDetail));
                    default:
                        console.error(`不支持"${regulationName}"类型数据验证，默认通过验证`);
                        return true;
                }
            }
        },


        addError: function(element, message, errorClass) {
            // TODO: 当有多个错误时，寻找一个更友好的显示方式
            var existLabel = element.next("label." + errorClass);
            if (existLabel.length) {
                existLabel[0].innerHTML += " " + message;
            } else {
                var label = `<label class="${errorClass}" for="${element.attr("name")}">${message}</label>`
                element.after(label);
            }
        },
        errorMessage: function(regulation, customMessage) {
            var result;
            if (typeof customMessage == 'object') {

                // 如果是对象，则取对应regulation的message
                customMessage = customMessage || {};

                if (typeof regulation == "object") {
                    result = customMessage[regulation.regulationName];
                } else {
                    result = customMessage[regulation];
                }
            } else {
                result = customMessage;
            }
            // 如果result是0，“”，undefined，null等值，则返回默认值
            return result || defaults.errorMessage(regulation) || "格式不正确";
        },
        checkError: function(regulation, inputName, errorClass, callback) {
            // 根据name属性值寻找需要数据验证的元素
            var $input = $(this).find(`[name="${inputName}"]`);
            if (!$input.length) return true;

            // 清除之前检验产生的错误提示标签
            $input.next("label." + errorClass).remove();


            if (typeof regulation == "object" && !RegExp.prototype.isPrototypeOf(regulation)) {

                // Sample: rules:{"inputFoo": {"required": true, "maxLength": 16}}
                regulation = regulation || {};
                var inputVali = true;

                for (var r in regulation) {

                    if (!methods.furtherJudge.call(this, r, regulation[r], $input.val())) {

                        if (inputVali) {
                            $input.removeClass("legel").addClass("illegel");
                            inputVali = false;
                        }

                        callback($input, {
                            regulationName: r,
                            regulationDetail: regulation[r]
                        });
                    } else {
                        if (inputVali) {
                            $input.removeClass("illegel").addClass("legel")
                        }
                    }
                }
            } else {

                // Sample: rules:{"inputFoo": "required"}
                if (!methods.simpleJudge.call(this, regulation, $input.val())) {
                    $input.removeClass("legel").addClass("illegel");

                    callback($input, regulation);
                } else {
                    $input.removeClass("illegel").addClass("legel")
                }
            }
        },

        checkOnBlur: function(regulation, inputName) {

        },


    }

    var addValidator = function(arg) {
        var rules = arg.rules || {};
        var messages = arg.messages || {};
        var errorClass = arg.errorClass;
        var addErrorMsg = arg.addErrorMsg || defaults.addErrorMsg;
        var callback = arg.callback;

        // 如果传入对象或者null,undefined,''等空值，使用默认值
        if ((typeof errorClass == "object") || !errorClass) {
            errorClass = defaults.errorClass;
        }

        this.submit(function() {
            var isValid = true;
            for (var inputName in rules) {
                methods.checkError.call(this, rules[inputName], inputName, errorClass, function(element, regulation) {
                    if (addErrorMsg) {
                        var message = methods.errorMessage(regulation, messages[inputName]);
                        methods.addError(element, message, errorClass);
                    }

                    // 一旦有一个数据验证结果错误， 就会执行该回调， 将标志位置为false
                    isValid = false;
                });
            }
            if (callback) return callback(isValid);
            return isValid;
        });

        var inputValid = true;
        for (var inputName in rules) {
            var $this = $(this),
                $input = $this.find(`[name="${inputName}"]`);
            if (!$input.length) return true;

            (function($input, inputName) {
                $input.bind("blur", function() {
                    callback();
                })
                $input.bind("input propertychange", function() {
                    if ($input.hasClass("illegel")) {
                        callback();
                    }
                })

                function callback() {
                    methods.checkError.call($this, rules[inputName], inputName, errorClass, function(element, regulation) {
                        if (addErrorMsg) {
                            var message = methods.errorMessage(regulation, messages[inputName]);
                            methods.addError(element, message, errorClass);
                        }
                    });
                }
            })($input, inputName)

        }
    };

    $.fn.validate = function() {
        var arg = arguments[0];
        if (!this.length) {
            return this;
        } else {
            return addValidator.call(this, arg);
        }
    }
})(jQuery);
