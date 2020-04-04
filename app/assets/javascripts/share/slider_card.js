//卡片切换
$(window).on('load', function() {
    new SliderCard("card-slider");
});

function SliderCard(obj) {
    this.obj = ID(obj);
    this.container = ID("s-card-cont");
    this.control = ID("control");
    this.items = $$$("item", this.container);
    this.iCenter = 1;
    this.aSort = [];
    this.timer = null;
    this.oData = [{
        left: 0,
        zIndex: 2,
        opacity: 70
    }, {
        left: 114,
        zIndex: 4,
        opacity: 100
    }, {
        left: 230,
        zIndex: 2,
        opacity: 70
    }];
    this.__create__()
};
SliderCard.prototype.__create__ = function() {
    var that = this;
    var oSpan = null;
    var i = 0;
    for (i = 0; i < that.items.length; i++) {
        that.items[i].number = i;
        that.aSort[i] = that.items[i];
        oSpan = document.createElement("span");
        oSpan.number = i;
        that.control.appendChild(oSpan)
    }
    for (i = 0; i < 2; i++) this.aSort.unshift(this.aSort.pop());
    that.aSpan = $$("span", that.control);
    that.control.onmouseover = function(ev) {
        var oEv = ev || event;
        var oTarget = oEv.target || oEv.srcElement;
        if (oTarget.tagName.toUpperCase() == "SPAN") {
            that.aSort.sort(function(a, b) {
                return a.number - b.number
            });
            if (oTarget.number < that.iCenter) {
                for (i = 0; i < that.iCenter - oTarget.number; i++) that.aSort.unshift(that.aSort.pop());
                that.__set__();
                return false
            } else if (oTarget.number > that.iCenter) {
                for (i = 0; i < oTarget.number - that.iCenter; i++) that.aSort.push(that.aSort.shift());
                that.__set__();
                return false
            } else {
                that.__set__()
            }
        }
    }
    this.__set__();
    this.__switch__();
};
SliderCard.prototype.__set__ = function() {
    var i = 0;
    for (i = 0; i < this.aSort.length; i++) this.container.appendChild(this.aSort[i]);
    for (i = 0; i < this.aSpan.length; i++) this.aSpan[i].className = "";
    this.aSpan[this.aSort[this.iCenter].number].className = "active";
    for (i = 0; i < this.aSort.length; i++) {
        this.aSort[i].index = i;
        if (i < 5) {
            new Animate(this.aSort[i], this.oData[i]);
        } else {
            new Animate(this.aSort[i], this.oData[this.oData.length - 1])
        }
    }
};
SliderCard.prototype.__switch__ = function() {
    var i = 0;
    var that = this;
    this.container.onclick = function(ev) {
        var oEv = ev || event;
        var oTarget = oEv.target || oEv.srcElement;
        var index = findItem(oTarget);

        if (index < that.iCenter) {
            for (i = 0; i < that.iCenter - index; i++) that.aSort.unshift(that.aSort.pop());
            that.__set__();
            return false
        } else if (index > that.iCenter) {
            for (i = 0; i < index - that.iCenter; i++) that.aSort.push(that.aSort.shift());
            that.__set__();
            return false
        }

        function findItem(element) {
            return element.className == "item" ? element.index : arguments.callee(element.parentNode)
        }
    };
};

function ID(id) {
    return typeof id === "string" ? document.getElementById(id) : id
};

function $$(tagName, oParent) {
    return (oParent || document).getElementsByTagName(tagName)
};
//
function $$$(className, element, tagName) {
    var i = 0;
    var aClass = [];
    var reClass = new RegExp("(^|//s)" + className + "(//s|$)");
    var aElement = $$(tagName || "*", element || document);
    for (i = 0; i < aElement.length; i++) reClass.test(aElement[i].className) && aClass.push(aElement[i]);
    return aClass
};

function Css(element, attr, value) {
    if (arguments.length == 2) {
        if (typeof arguments[1] === "string") {
            return element.currentStyle ? element.currentStyle[attr] : getComputedStyle(element, null)[attr]
        } else {
            for (var property in attr) {
                property == "opacity" ?
                    (element.style.filter = "alpha(opacity=" + attr[property] + ")", element.style.opacity = attr[property] / 100) :
                    element.style[property] = attr[property]
            }
        }
    } else if (arguments.length == 3) {
        switch (attr) {
            case "width":
            case "height":
            case "top":
            case "left":
            case "right":
            case "bottom":
                element.style[attr] = value + "px";
                break;
            case "opacity":
                element.style.filter = "alpha(opacity=" + value + ")";
                element.style.opacity = value / 100;
                break;
            default:
                element.style[attr] = value;
                break
        }
    }
    return element;
};

function Animate(element, options, fnCallBack) {
    this.obj = ID(element);
    this.options = options;
    this.__onEnd__ = fnCallBack;
    this.__startMove__()
};
Animate.prototype.__startMove__ = function() {
    var that = this;
    clearInterval(that.obj.timer);
    that.obj.timer = setInterval(function() {
        that.__doMove__()
    }, 30);
};
Animate.prototype.__doMove__ = function() {
    var complete = true;
    var property = null;
    for (property in this.options) {
        var iCur = parseFloat(Css(this.obj, property));
        property == "opacity" && (iCur = parseInt(iCur.toFixed(2) * 100));
        var iSpeed = (this.options[property] - iCur) / 5;
        iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
        this.options[property] == iCur || (complete = false, Css(this.obj, property, iSpeed + iCur))
    }
    complete && (clearInterval(this.obj.timer), this.__onEnd__ && this.__onEnd__.apply(this.obj))
};
