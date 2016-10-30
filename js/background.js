var createMenu = chrome.contextMenus.create;
var ctx = ["page", "selection", "link", "editable"];


// 上下文菜单
var menus = {};
menu.root = createMenu({"title": "表格数据抽取", "enabled": false, "contexts": ctx});
menu.selectRow     = createMenu({ "title": "选择一行",    "parentId": menu.root, "enabled": false, "contexts": ctx, "onclick": function() { menuClick("selectRow")    }});
menu.selectColumn  = createMenu({ "title": "Select Column", "parentId": menu.root, "enabled": false, "contexts": ctx, "onclick": function() { menuClick("selectColumn") }});
menu.selectTable   = createMenu({ "title": "Select Table",  "parentId": menu.root, "enabled": false, "contexts": ctx, "onclick": function() { menuClick("selectTable")  }});
menu.break1        = createMenu({ "type": "separator",      "parentId": menu.root, "enabled": false, "contexts": ctx });
menu.findPrevTable = createMenu({ "title": "Previous Table","parentId": menu.root, "enabled": false, "contexts": ctx, "onclick": function() { menuClick("findPrevTable")  }});
menu.findNextTable = createMenu({ "title": "Next Table",    "parentId": menu.root, "enabled": false, "contexts": ctx, "onclick": function() { menuClick("findNextTable")  }});
menu.break2        = createMenu({ "type": "separator",      "parentId": menu.root, "enabled": false, "contexts": ctx });
menu.copyRich      = createMenu({ "title": "Copy",          "parentId": menu.root, "enabled": false, "contexts": ctx, "onclick": function() { menuClick("copyRich")     }});
menu.copy          = createMenu({ "title": "Copy as...",    "parentId": menu.root, "enabled": false, "contexts": ctx });
menu.copyHTML      = createMenu({ "title": "HTML",          "parentId": menu.copy, "enabled": false, "contexts": ctx, "onclick": function() { menuClick("copyHTML")     }});
menu.copyStyled    = createMenu({ "title": "Styled HTML",   "parentId": menu.copy, "enabled": false, "contexts": ctx, "onclick": function() { menuClick("copyStyled")  }});
menu.copyCSV       = createMenu({ "title": "CSV",           "parentId": menu.copy, "enabled": false, "contexts": ctx, "onclick": function() { menuClick("copyCSV")      }});
menu.copyText      = createMenu({ "title": "Text-Only",     "parentId": menu.copy, "enabled": false, "contexts": ctx, "onclick": function() { menuClick("copyText")     }});


// var db;
function menuClick(cmd)
{
    chrome.tabs.query({active: true}, function(tab)
    {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {menuCommand: cmd},
            function(response) {console.log("click" + cmd);}
            )
    });
}