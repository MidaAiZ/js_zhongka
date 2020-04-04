// $(function() {
//     var UnloadConfirm = {};
//     UnloadConfirm.MSG_UNLOAD = "数据尚未保存，离开后可能会导致数据丢失\n\n您确定要离开吗？";
//     UnloadConfirm.set = function(a) {
//         window.onbeforeunload = function(b) {
//             b = b || window.event;
//             b.returnValue = a;
//             return a
//         }
//     };
//     UnloadConfirm.clear = function() {
//         fckDraft.delDraftById();
//         window.onbeforeunload = function() {}
//     };
//     UnloadConfirm.set(UnloadConfirm.MSG_UNLOAD);
// })

/**
 * 当离开页面时，内容有修改且未提交，弹出确认框警告
 * 暂时仅适用于form标签
 * 使用方法：在form标签中添加属性leavingTip=true即可
 */
$(function() {
    // 定义符合要求的表单元素
    var formSelected = "form[leaving-tip=true]";
    // 判断页面上是否有需要提示的表单
    if ($(formSelected).is('form')) {
        leaveWarning(formSelected);
    }

    function leaveWarning(formSelected) {
        var isModified = false;
        var notSubmit = true;

        $(formSelected).find('input,select,textarea').change(function() {
            // 可考虑扩展，利用this变量来高亮这个有内容修改的输入框来提示用户
            isModified = true;
        });
        window.onbeforeunload = function() {
            // 当表单内容有修改且并未提交时，离开页面弹出提示
            if (isModified && notSubmit) {
                return true;
            };
        }

        $(formSelected).on('submit', function() {
            notSubmit = false;
        });
    }
})
