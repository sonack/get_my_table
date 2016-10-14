var cm = chrome.contextMenus.create;

var menus = [cm({"title": "表格数据抽取...","contexts": ["all"]})];

// console.log(menus);

// 上下文菜单

menus.push(cm({"title": "选择整行", "parentId": menus[0], "enabled": true, "contexts": ["all"], "onclick": function() {menuClick("selectRow")} }));
menus.push(cm({"title": "选择整列", "parentId": menus[0], "enabled": false, "contexts": ["all"], "onclick": function() {menuClick("selectColumn")} }));
menus.push(cm({"title": "选择整个表格", "parentId": menus[0], "enabled": false, "contexts": ["all"], "onclick": function() {menuClick("selectTable")} }));
menus.push(cm({"type": "separator", "parentId": menus[0], "enabled": false, "contexts": ["all"] }));
menus.push(cm({"title": "复制为富文本", "parentId": menus[0], "enabled": false, "contexts": ["all"], "onclick": function() {menuClick("copyRich")} }));
menus.push(cm({"title": "复制为纯文本", "parentId": menus[0], "enabled": false, "contexts": ["all"], "onclick": function() {menuClick("copyText")} }));
menus.push(cm({"title": "复制为HTML", "parentId": menus[0], "enabled": false, "contexts": ["all"], "onclick": function() {menuClick("copyHTML")} }));


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