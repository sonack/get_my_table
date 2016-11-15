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

// Send a command to tabs.
function sendCommand(cmd, broadcast, fn) {
    var qry = broadcast ? {} : {active: true, currentWindow: true};
    chrome.tabs.query(qry, function(tabs) {
        tabs.forEach(function(tab) {
            chrome.tabs.sendMessage(tab.id, {command: cmd}, fn || function(r) {});
        });
    });
}

// Menu selection - dispatch the message to the content.js
function menuClick(cmd) {
    sendCommand(cmd);
}

// Notify tab that it's activated.
chrome.tabs.onActivated.addListener(function() {
    sendCommand("activate");
});

// Content command - handle a message from the content.js
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
                // alert(message.content);
                popupPage.updateTablePreview(message.content);
                popupPage.makeTableEditable();
            }

            break;
    }
});

