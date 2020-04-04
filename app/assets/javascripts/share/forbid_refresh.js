//禁止页面回退
JavaScript: window.history.forward(1);
//禁止页面刷新
document.onkeydown = function() {
    if ((event.keyCode == 116) || (event.ctrlKey && event.keyCode == 82)) {
        event.keyCode = 0;
        event.returnValue = false;
    }
}

//js屏蔽浏览器（IE和FireFox）的刷新功能
document.onkeydown = function() {
    if ((window.event.keyCode == 116) || //屏蔽 F5
        (window.event.keyCode == 122) || //屏蔽 F11
        (window.event.shiftKey && window.event.keyCode == 121) //shift+F10
    ) {
        window.event.keyCode = 0;
        window.event.returnValue = false;
    }
    if ((window.event.altKey) && (window.event.keyCode == 115)) { //屏蔽Alt+F4
        window.showModelessDialog("about:blank", "", "dialogWidth:1px;dialogheight:1px");
        return false;
    }
}

//js屏蔽右键
if (window.Event)
    document.captureEvents(Event.MOUSEUP);

function nocontextmenu() {
    event.cancelBubble = true
    event.returnValue = false;
    return false;
}

function norightclick(e) {
    if (window.Event) {
        if (e.which == 2 || e.which == 3)
            return false;
    } else
    if (event.button == 2 || event.button == 3) {
        event.cancelBubble = true
        event.returnValue = false;
        return false;
    }
}
document.oncontextmenu = nocontextmenu; // for IE5+
document.onmousedown = norightclick; // for all others
