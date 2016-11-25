// 背景页面
// 检查视图


// 主要包括     "上下文菜单" (Context Menu)
//             "消息传递机制"


// 默认enabled=false
var ctx = ["page", "selection", "link", "editable"];
var menu = {};
menu.root          = chrome.contextMenus.create({"title": "表格数据抽取...",                              "enabled": false, "contexts": ctx});
menu.selectRow     = chrome.contextMenus.create({ "title": "选择一行",    "parentId": menu.root, "enabled": false, "contexts": ctx, "onclick": function() { menuClick("selectRow")    }});
menu.selectColumn  = chrome.contextMenus.create({ "title": "选择一列", "parentId": menu.root, "enabled": false, "contexts": ctx, "onclick": function() { menuClick("selectColumn") }});
menu.selectTable   = chrome.contextMenus.create({ "title": "选择表格",  "parentId": menu.root, "enabled": false, "contexts": ctx, "onclick": function() { menuClick("selectTable")  }});
menu.break1        = chrome.contextMenus.create({ "type": "separator",      "parentId": menu.root, "enabled": false, "contexts": ctx });
menu.findPrevTable = chrome.contextMenus.create({ "title": "上一个表格","parentId": menu.root, "enabled": false, "contexts": ctx, "onclick": function() { menuClick("findPrevTable")  }});
menu.findNextTable = chrome.contextMenus.create({ "title": "下一个表格",    "parentId": menu.root, "enabled": false, "contexts": ctx, "onclick": function() { menuClick("findNextTable")  }});
menu.break2        = chrome.contextMenus.create({ "type": "separator",      "parentId": menu.root, "enabled": false, "contexts": ctx });
menu.copyRich      = chrome.contextMenus.create({ "title": "拷贝",          "parentId": menu.root, "enabled": false, "contexts": ctx, "onclick": function() { menuClick("copyRich")     }});
menu.copy          = chrome.contextMenus.create({ "title": "拷贝为...",    "parentId": menu.root, "enabled": false, "contexts": ctx });
menu.copyHTML      = chrome.contextMenus.create({ "title": "简单HTML",          "parentId": menu.copy, "enabled": false, "contexts": ctx, "onclick": function() { menuClick("copyHTML")     }});
menu.copyStyled    = chrome.contextMenus.create({ "title": "带样式的HTML",   "parentId": menu.copy, "enabled": false, "contexts": ctx, "onclick": function() { menuClick("copyStyled")  }});
menu.copyCSV       = chrome.contextMenus.create({ "title": "CSV格式",           "parentId": menu.copy, "enabled": false, "contexts": ctx, "onclick": function() { menuClick("copyCSV")      }});
menu.copyText      = chrome.contextMenus.create({ "title": "纯文本",     "parentId": menu.copy, "enabled": false, "contexts": ctx, "onclick": function() { menuClick("copyText")     }});

// 向标签页发送消息
// @Params
//      cmd 命令消息内容
//      broadcast 若为true, 则广播给所有tabs; 若为false, 只传递给当前窗口的活动标签页
//      fn 指定回调函数，默认为空
function sendCommand(cmd, broadcast, fn) {
    var qry = broadcast ? {} : {active: true, currentWindow: true};
    chrome.tabs.query(qry, function(tabs) {
        tabs.forEach(function(tab) {
            chrome.tabs.sendMessage(tab.id, {command: cmd}, fn || function(r) {});
        });
    });
}

// 点击上下文菜单，选择了某项操作，将其分发给tab，在content.js中继续处理
function menuClick(cmd) {
    sendCommand(cmd);
}

// 当tab被激活时，通知其消息
chrome.tabs.onActivated.addListener(function() {
    sendCommand("activate");
});


// 处理来自content.js消息命令
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    switch(message.command) {

        case "copyText":
        case "copyHTML":
        case "copyStyled":
        case "copyCSV":
            var t = document.getElementById("___copytables_clipboard___");
            t.value = message.content;
            t.focus();
            t.select();
            document.execCommand("copy");
            t.value = "";
            sendResponse({});
            break;

        case "copyRich":
            var t = document.getElementById("___copytables_div___");
            t.contentEditable = true;
            t.innerHTML = message.content;
            var range = document.createRange();
            range.selectNodeContents(t);
            var selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand("copy");
            t.innerHTML = "";
            sendResponse({});
            break;

        case "menuUpdate":

            var s = message.state;

            chrome.contextMenus.update(menu.root,           {enabled:s.hasTables});

            chrome.contextMenus.update(menu.selectRow,      {enabled:s.canSelect});
            chrome.contextMenus.update(menu.selectColumn,   {enabled:s.canSelect});
            chrome.contextMenus.update(menu.selectTable,    {enabled:s.canSelect});

            chrome.contextMenus.update(menu.findPrevTable,  {enabled:s.hasTables});
            chrome.contextMenus.update(menu.findNextTable,  {enabled:s.hasTables});

            chrome.contextMenus.update(menu.copyRich,       {enabled:s.canCopy});
            chrome.contextMenus.update(menu.copy,           {enabled:s.canCopy});
            chrome.contextMenus.update(menu.copyHTML,       {enabled:s.canCopy});
            chrome.contextMenus.update(menu.copyStyled,     {enabled:s.canCopy});
            chrome.contextMenus.update(menu.copyCSV,        {enabled:s.canCopy});
            chrome.contextMenus.update(menu.copyText,       {enabled:s.canCopy});

            sendResponse({});
            break;
    }
});


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    switch(message.popup_cmd) {
        case "hasSelected":
            var popupPage = chrome.extension.getViews({
                type: "popup"
            });
            if(popupPage)
            {
                popupPage = popupPage[0];
                popupPage.updateTablePreview(message.content);
                popupPage.makeTableEditable();
            }
            break;
    }
});

