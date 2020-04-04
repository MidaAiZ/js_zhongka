
(function(f) {
    if(typeof exports === "object" && typeof module !== "undefined") {
        module.exports = f()
    } else if(typeof define === "function" && define.amd) {
        define([], f)
    } else {
        var g;
        if(typeof window !== "undefined") {
            g = window
        } else if(typeof global !== "undefined") {
            g = global
        } else if(typeof self !== "undefined") {
            g = self
        } else {
            g = this
        }
        g.Clipboard = f()
    }
})(function() {
    var copy = {};
    copy.coptText = function(copybtn, cb) {
        copybtn = event || document.querySelector(copybtn)
        copybtn.addEventListener('click', function() {
            var copyTextarea = document.querySelector(copybtn.getAttribute("data-copy")); //要拷贝的文本
            (copyTextarea.nodeName === 'INPUT' || copyTextarea.nodeName === 'TEXTAREA') ? copyTextarea.select(): copy.selectText(copyTextarea);

            copyTextarea.focus()

            try {
                var successful = document.execCommand('copy');
                cb(successful);
            } catch(err) {
                console.log('哎呀，无法复制');
                cb(false);
            }
        });
    }

    copy.selectText = function(copyTextarea) {
        if(copyTextarea.hasAttribute('contenteditable')) {
            copyTextarea.focus();
        }
        if(document.selection) {
            var range = document.body.createTextRange();
            range.moveToElementText(copyTextarea);
            range.select();
        } else if(window.getSelection) {
            var selection = window.getSelection();
            var range = document.createRange();

            range.selectNodeContents(copyTextarea);
            selection.removeAllRanges();
            selection.addRange(range);

            selectedText = selection.toString();
        }
    }
    this.copy = copy;
})
