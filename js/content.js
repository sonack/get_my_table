// 获取和改变用户正在浏览的页面
// 向背景页面发送命令，接受背景页面的命令 

(function main() {

    // ---------------------------------------------------------------------------------
    // 设置
    // ---------------------------------------------------------------------------------

    // 最小滚动速度(每秒中多少滚)
    var scrollMinSpeed = 30;

    // 最大滚动速度(每秒钟多少滚) 
    var scrollMaxSpeed = 150;

    // 滚动加速度，速度线性增加
    var scrollAcceleration = 1.01;

    // 每次滚动的像素数
    var scrollAmount = 30;

    // 选中cell的类
    var clsSelected = "__copytables__A__";

    // 拖动选中cell的类
    var clsDragover = "__copytables__B__";

    // 同样表示选中cell的另一个类
    var clsSelectedMark = "__copytables__C__";

    // 表示拖动选中cell的另一个类
    var clsHighlight = "__copytables__D__";

    // 修改热键，ctrl/command或者alt
    var modKeys = [(navigator.userAgent.indexOf("Macintosh") > 0) ? "metaKey" : "ctrlKey","altKey"];


    // ---------------------------------------------------------------------------------
    // 工具方法
    // ---------------------------------------------------------------------------------

    // 根据id获取元素
    var $ = function(id) {
        return document.getElementById(id)
    };

    // 将集合coll添加进数组a中
    var $A = function(a, coll) {
        Array.prototype.forEach.call(coll, function(x) { a.push(x) });
        return a;
    };

    // 分割字符串(以空白为分隔符)
    var $W = function(str) {
        return (str || "").split(/\s+/);
    };

    // 根据标签名得到元素
    // where 根节点
    // tags 标签名集合
    var $$ = function(tags, where) {
        var els = [];
        $W(tags).forEach(function(tag) {
            $A(els, (where || document).getElementsByTagName(tag));
        });
        return els;
    };

    // 根据类名获得元素
    var $C = function(cls, where) {
        return $A([], (where || document).getElementsByClassName(cls));
    };

    // 应用函数fun到el及其所有后代
    var walk = function(el, fun) {
        if(el.nodeType != 1)
            return;
        fun(el);
        var cs = el.childNodes;
        for(var i = 0; i < cs.length; i++)
            walk(cs[i], fun);
    };

    // 应用函数fun到el及其后代的tags标签元素上
    var each = function(tag, el, fun) {
        if(el.nodeType != 1)
            return;
        if(!tag.push)
            tag = $W(tag);
        if(tag.indexOf(el.nodeName) >= 0) {
            fun(el);
            return;
        }
        var cs = el.childNodes;
        for(var i = 0; i < cs.length; i++)
            each(tag, cs[i], fun);
    };

    // 移除els中所有的元素
    var removeAll = function(els) {
        els.forEach(function(el) {
            if(el && el.parentNode)
                el.parentNode.removeChild(el);
        });
    };

    // 寻找标签名在tags中的el的最近父节点
    var closest = function(el, tags) {
        tags = $W(tags.toLowerCase());
        while(el) {
            if(el.nodeName && tags.indexOf(el.nodeName.toLowerCase()) >= 0)
                return el;
            el = el.parentNode;
        }
        return null;
    };

    // 给元素el添加类cls
    var addClass = function(el, cls) {
        if(el) {
            var c = $W(el.className);
            if(c.indexOf(cls) < 0)          // 没有出现过，则添加
                c.push(cls);
            el.className = c.join(" ");
        }
    };

    // 从元素el中移除类cls
    var removeClass = function(el, cls) {
        if(el && el.className) {
            var cname = $W(el.className).filter(function(x) {
                return x != cls;
            }).join(" ");               // 过滤掉要被移除的class名
            if(cname.length)           
                el.className = cname;
            else
                el.removeAttribute("class");     // 如果已经没有class，则移除属性
        }
    };

    // 如果元素el含有类cls，则返回true
    var hasClass = function(el, cls) {
        return el ? $W(el.className).indexOf(cls) >= 0 : false;
    };

    // 如果元素能够被滚动(scrollable)，则返回true
    var isScrollable = function(el) {
        if(!el || el == document || el == document.body)
            return false;
        var css = document.defaultView.getComputedStyle(el);
        if(!css.overflowX.match(/scroll|auto/) && !css.overflowY.match(/scroll|auto/))
            return false;
        return el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight;
    };

    // el的最近可滚动父元素
    var closestScrollable = function(el) {
        while(el) {
            if(isScrollable(el))
                return el;
            el = el.parentNode;
        }
        return null;
    };

    // 获得元素的位置
    var bounds = function(el) {
        var r = el.getBoundingClientRect();
        return [r.left, r.top, r.right, r.bottom];
    };

    // 获得元素的偏移量(offset)
    var offset = function(el) {
        var r = [0, 0];
        while(el) {
            r[0] += el.offsetLeft;
            r[1] += el.offsetTop;
            el = el.offsetParent;
        }
        return r;
    };

    // 如果矩形a和b相交，则返回true，注意这里的矩形的边都是平行于坐标轴的，边的重叠不算相交
    var intersect = function(a, b) {
        return !(a[0] >= b[2] || a[2] <= b[0] || a[1] >= b[3] || a[3] <= b[1])
    };

    // 转置一个矩阵
    var transpose = function (m) {
        if(!m || !m[0])
            return m;
        return m[0].map(function(_, c) {
            return m.map(function(row) {
                return row[c];
            });
        });
    };

    // 移除矩阵中不满足keep函数的行或列
    var trimMatrix = function(mat, keep) {
        var fun = function(row) {
            return row.some(function(cell) { return keep(cell) });
        };
        mat = mat.filter(fun);
        mat = transpose(mat).filter(fun);
        return transpose(mat);
    };

    // 移除字符串两端多余的空白
    var lstrip = function(s) { return s.replace(/^\s+/, "") };
    var rstrip = function(s) { return s.replace(/\s+$/, "") };
    var strip  = function(s) { return lstrip(rstrip(s)) };


    // ---------------------------------------------------------------------------------
    // 选项
    // ---------------------------------------------------------------------------------
    
    var options = {
        modKey: 0,           // 默认选取第一个，ctrl键
        modLang: 0,          // 英文
        modSkin: 1           // 默认皮肤
    };



    var processLang = function()
    {
        switch(options.modLang)
        {
            case 0:
                 chrome.runtime.sendMessage({popup_cmd:"setLang0"});  
                break;
            case 1:
                // alert("当前语言为中文");
            break;
        }
    }

    var processSkin = function()
    {
        switch(options.modSkin)
        {
            case 0:
                chrome.runtime.sendMessage({popup_cmd:"setSkin0"});
                break;
            case 1:
                chrome.runtime.sendMessage({popup_cmd:"setSkin1"});
                break;
            case 2:
                chrome.runtime.sendMessage({popup_cmd:"setSkin2"});
                break;
            case 3:
                chrome.runtime.sendMessage({popup_cmd:"setSkin3"});
                break;
        }
    }

    // 获得chrome存储的选项信息
    var updateOptions = function(fn) {
        chrome.storage.local.get(null, function(opts) {
            if(Object.keys(opts).length)
                options = opts;
            if(fn)
                fn();
        });
    }

   

    // 设置选项信息
    var setOption = function(key, val) {
        console.log("update before...");
        console.log(options);
        options[key] = val;
        console.log("update...");
        console.log(options);
        chrome.storage.local.set(options,function()
        {
            console.log(options);
            // alert("设置成功!");
        });
        processLang();
        processSkin();
        chrome.storage.local.clear();
       
    }

    // ---------------------------------------------------------------------------------
    // 选择操作
    // ---------------------------------------------------------------------------------

    // 当前选择区域
    var selection = null;

    // 上次处理的事件
    var lastEvent = null;

    // 如果cell有一个selected类，则返回true
    var isSelected = function(el) {
        return el ? (el.className || "").indexOf("__copytables__") >= 0 : false;
    };

    // 将一个表格转换为矩阵. 矩阵中的元素，要么是代表一个真实存在的数据单元格，表示为`{td:some-cell}`),
    // 要么是一个虚拟单元格，表示为 (`{colRef:other, rowRef:other}`)
    var tableMatrix = function(table) {
        var tds = {}, rows = {}, cols = {};

        each("TD TH", table, function(td) {
            var b = bounds(td);
            var c = b[0], r = b[1];
            cols[c] = rows[r] = 1;
            tds[r + "/" + c] = td;
        });

        // 按行从上到下，按列从左到右
        rows = Object.keys(rows).sort(function(x, y) { return x - y });
        cols = Object.keys(cols).sort(function(x, y) { return x - y });

        var mat = rows.map(function(r) {
            return cols.map(function(c) {
                return tds[r + "/" + c] ?
                { td: tds[r + "/" + c] } :
                { colRef: null, rowRef: null }
            });
        });

        mat.forEach(function(row, r) {
            row.forEach(function(cell, c) {
                if(!cell.td)
                    return;

                // 处理存在行或列合并的情况
                var rs = parseInt(cell.td.rowSpan) || 1;
                var cs = parseInt(cell.td.colSpan) || 1;

                for(var i = 1; i < cs; i++) {
                    if(row[c + i])
                        row[c + i].colRef = cell;
                }
                for(var i = 1; i < rs; i++) {
                    if(mat[r + i])
                        mat[r + i][c].rowRef = cell;
                }
            });
        });

        return mat;
    };

    // 移除没有被选中的行或列
    var trimTable = function(table) {
        var mat = tableMatrix(table);

        mat = trimMatrix(mat, function(cell) {
            return cell.td && isSelected(cell.td);
        });

        mat.forEach(function(row) {
            row.forEach(function(cell) {
                if(cell.td) {
                    cell.td._keep_ = 1;
                    cell.colSpan = cell.rowSpan = 0;
                }
            });
        });

        var remove = [];

        each("TD TH", table, function(td) {
            if(td._keep_ != 1)
                remove.push(td);
            else if(!isSelected(td))        //没有选中的单元格，内容置空
                td.innerHTML = "";
        });

        removeAll(remove);
        remove = [];

        each("TR", table, function(tr) {    // 移除无用的tr
            if(!$$("TD TH", tr).length)
                remove.push(tr);
        });

        removeAll(remove);
        remove = [];

        mat.forEach(function(row) {     // 处理行或列合并
            row.forEach(function(cell) {
                if(cell.colRef)
                    cell.colRef.colSpan++;
                if(cell.rowRef)
                    cell.rowRef.rowSpan++;
            });
        });

        mat.forEach(function(row) {
            row.forEach(function(cell) {
                if(!cell.td)
                    return;
                cell.td.removeAttribute("colSpan");
                cell.td.removeAttribute("rowSpan");
                if(cell.colSpan) cell.td.colSpan = cell.colSpan + 1;
                if(cell.rowSpan) cell.td.rowSpan = cell.rowSpan + 1;
            });
        });
    };

    // 返回纯文本矩阵，如果all是true返回全部表格内容，否则返回选中内容
    var selectedTextMatrix = function(table, all) {
        var m = tableMatrix(table).map(function(row) {
            return row.map(function(cell) {
                if(cell.td && (all || isSelected(cell.td)))
                    return strip(cell.td.innerText.replace(/[\r\n]+/g, " "));   // 替换换行符为空格符
                return "";  // 空内容
            });
        });

        return trimMatrix(m, function(cell) {
            return cell.length > 0;
        });
    };

    // 将表格中的相对URL转换为绝对URL
    var fixRelativeLinks = function(el) {

        function fix(tags, attrs) {
            each(tags, el, function(e) {
                $W(attrs).forEach(function(attr) {
                    if(e.hasAttribute(attr))
                        e[attr] = e[attr]; // 强制chrome使用绝对路径
                });
            });
        }

        fix("A AREA LINK", "href");
        fix("IMG INPUT SCRIPT", "src longdesc usemap");
        fix("FORM", "action");
        fix("Q BLOCKQUOTE INS DEL", "cite");
        fix("OBJECT", "classid codebase data usemap");
    };

    // 移除html中的空白符
    var reduceWhitespace = function(html) {
        html = html.replace(/\n\r/g, "\n");
        html = html.replace(/\n[ ]+/g, "\n");
        html = html.replace(/[ ]+\n/g, "\n");
        html = html.replace(/\n+/g, "\n");
        return html;
    };

    // 默认table cell的样式
    var defaultStyle = {
        "background-image": "none",
        "background-position": "0% 0%",
        "background-size": "auto",
        "background-repeat": "repeat",
        "background-origin": "padding-box",
        "background-clip": "border-box",
        "background-color": "rgba(0, 0, 0, 0)",
        "border-collapse": "separate",
        "border-top": "0px none rgb(0, 0, 0)",
        "border-right": "0px none rgb(0, 0, 0)",
        "border-bottom": "0px none rgb(0, 0, 0)",
        "border-left": "0px none rgb(0, 0, 0)",
        "caption-side": "top",
        "clip": "auto",
        "color": "rgb(0, 0, 0)",
        "content": "",
        "counter-increment": "none",
        "counter-reset": "none",
        "direction": "ltr",
        "empty-cells": "show",
        "float": "none",
        "font-family": "Times",
        "font-size": "16px",
        "font-style": "normal",
        "font-variant": "normal",
        "font-weight": "normal",
        "letter-spacing": "normal",
        "line-height": "normal",
        "list-style": "disc outside none",
        "margin": "0px",
        "outline": "rgb(0, 0, 0) none 0px",
        "overflow": "visible",
        "padding": "1px",
        "table-layout": "auto",
        "text-align": "start",
        "text-decoration": "none solid rgb(0, 0, 0)",
        "text-indent": "0px",
        "text-transform": "none",
        "vertical-align": "middle",
        "visibility": "visible",
        "white-space": "normal",
        "word-spacing": "0px",
        "z-index": "auto"
    };

    var defaultStyleProps = Object.keys(defaultStyle);

    // 获得元素el实际的样式信息
    var getStyle = function(el) {
        var computed = window.getComputedStyle(el),
            style = [];

        defaultStyleProps.forEach(function(p) {
            var val = computed[p];

            // 对小数像素值四舍五入取整
            val = val.replace(/\b([\d.]+)px\b/g, function(_, $1) {
                return Math.round(parseFloat($1)) + "px";
            });

            if(val.length && val != defaultStyle[p])
                style.push(p + ":" + val);
        });

        if(computed["display"] == "none")
            style.push("display:none");

        return style.join(";");
    };

    // 返回HTML，如果all是true返回全部表格内容，否则返回选中内容
    // 如果withCSS为true，则带样式，否则为简单HTML
    var selectedHTML = function(table, withCSS, all) {

        each("TD TH", table, function(td) {
            if(hasClass(td, clsSelected)) {
                removeClass(td, clsSelected);
                addClass(td, clsSelectedMark);
            }
        });

        var styles = [];
        walk(table, function(el) {
            styles.push(getStyle(el));
        });

        var frame = document.createElement("IFRAME");
        document.body.appendChild(frame);
        var fdoc = frame.contentDocument;

        var base = fdoc.createElement("BASE");
        base.setAttribute("href", document.location);

        fdoc.body.appendChild(base);
        fdoc.body.appendChild(fdoc.importNode(table, true));

        var ftable = fdoc.body.lastChild;

        walk(ftable, function(el) {
            if(withCSS)         // 加样式
                el.style.cssText = styles.shift();
            else
                el.style = "";
        });

        if(!all)
            trimTable(ftable);

        each("TD TH", ftable, function(td) {
            removeClass(td, clsSelectedMark);
        });

        fixRelativeLinks(ftable);
        fdoc.body.removeChild(fdoc.body.firstChild);    // 删除BASE标签

        var html = fdoc.body.innerHTML;

        each("TD TH", table, function(td) {
            if(hasClass(td, clsSelectedMark)) {
                removeClass(td, clsSelectedMark);
                addClass(td, clsSelected);
            }
        });

        document.body.removeChild(frame);

        return reduceWhitespace(html);
    };


    // ---------------------------------------------------------------------------------
    // 滚动选择
    // ---------------------------------------------------------------------------------

    // 滚动计时器
    var scrollTimer = 0;

    // 滚动
    var scrollWatch = function() {
        if(!selection)
            return;

        function adjust(sx, sy, ww, hh, cx, cy) {
            if(cx < scrollAmount)      sx -= scrollAmount;
            if(cx > ww - scrollAmount) sx += scrollAmount;
            if(cy < scrollAmount)      sy -= scrollAmount;
            if(cy > hh - scrollAmount) sy += scrollAmount;
            return [sx, sy];
        }

        if(selection.scrollBase) {  // 相对于滚动基点滚动

            var b = bounds(selection.scrollBase);
            var s = adjust(
                selection.scrollBase.scrollLeft,
                selection.scrollBase.scrollTop,
                selection.scrollBase.clientWidth,
                selection.scrollBase.clientHeight,
                lastEvent.clientX - b[0],
                lastEvent.clientY - b[1]
            );

            selection.scrollBase.scrollLeft = s[0];
            selection.scrollBase.scrollTop = s[1];

        } else {        // 相对于浏览器窗口滚动

            var s = adjust(
                window.scrollX,
                window.scrollY,
                window.innerWidth,
                window.innerHeight,
                lastEvent.clientX,
                lastEvent.clientY
            );

            if(s[0] != window.scrollX || s[1] != window.scrollY)
                window.scrollTo(s[0], s[1]);
        }

        selection.scrollSpeed *= scrollAcceleration;    // 滚动速度线性增加
        if(selection.scrollSpeed > scrollMaxSpeed)
            selection.scrollSpeed = scrollMaxSpeed;

        scrollTimer = setTimeout(scrollWatch, 1000 / selection.scrollSpeed);    // 持续滚动
    };

    // 重置滚动速度
    var scrollReset = function() {
        if(!selection)
            return;
        selection.scrollSpeed = scrollMinSpeed;
    };

    // 停止滚动循环
    var scrollUnwatch = function() {
        clearTimeout(scrollTimer);
    }


    // ---------------------------------------------------------------------------------
    // 选择函数
    // ---------------------------------------------------------------------------------

    // 向背景视图发送选择操作结束消息      Debug1
    var selectFinished = function(){
        chrome.runtime.sendMessage({popup_cmd:"hasSelected", content:contentForCopy("copyHTML")});  
    }

    // 检查元素el是否可以选择，即el包含在table中，且el不包含在a\input\button中
    var canSelect = function(el) {
        return !!(el &&  closest(el, "TABLE") && !closest(el, "A INPUT BUTTON"));
    }

    // 初始化选区
    var selectionInit = function(el, extend) {

        var td = closest(el, "TH TD"),          // 最近的单元格
            table = closest(td, "TABLE");       // 最近的表格

        if(!table)      // 不存在表格，返回false
            return false;

        window.getSelection().removeAllRanges();    // 清空选区

        if(selection && selection.table != table)   // 改变表格，重置选区
            selectionReset();

        if(!extend)     // 如果不是extend，清空选区
            selection = null;

        scrollReset();  // 滚动复位

        if(selection) {     // 更新当前锚点
            selection.anchor = td;
            return true;
        }

        selection = {            // 选中单元格
            anchor: td,
            table: table,
            x: bounds(td)[0] + 1,   // 向右移动一单位
            y: bounds(td)[1] + 1    // 向下移动一单位
        };

        var t = closestScrollable(selection.anchor.parentNode);     // 最近的可滚动父元素，即寻找滚动基点
        if(t && t != document.documentElement) {
            selection.scrollBase = t;
            selection.x += selection.scrollBase.scrollLeft;
            selection.y += selection.scrollBase.scrollTop;
        } else {
            selection.scrollBase = null;
            selection.x += window.scrollX;
            selection.y += window.scrollY;
        }
        return true;
    };

    // 更新当前选区
    var selectionUpdate = function(e) {
        var cx = e.clientX;     // 当前鼠标指针位置
        var cy = e.clientY;

        var ax = selection.x;       // anchor的client rect
        var ay = selection.y;

        // 计算出相对滚动位置
        if(selection.scrollBase) {
            ax -= selection.scrollBase.scrollLeft;
            ay -= selection.scrollBase.scrollTop;
        } else {
            ax -= window.scrollX;
            ay -= window.scrollY;
        }

        var rect = [
            Math.min(cx, ax),
            Math.min(cy, ay),
            Math.max(cx, ax),
            Math.max(cy, ay)
        ];

        $C(clsDragover, selection.table).forEach(function(td) {
            removeClass(td, clsDragover);
        });

        // 添加拖拽类
        each("TD TH", selection.table, function(td) {
            if(intersect(bounds(td), rect))
                addClass(td, clsDragover);
        });

        if(!selection.selectAnchor)
            removeClass(selection.anchor, clsDragover);
    };

    // 重置选区，移除旧的listener
    var selectionReset = function() {
        // 清除标志
        $C(clsSelected).forEach(function(td) { removeClass(td, clsSelected) });
        $C(clsDragover).forEach(function(td) { removeClass(td, clsDragover) });

        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);

        selection = null;
    };

    // 选择/反选 一行、一列或者整个表格
    var selectionExtend = function(command, toggle) {
        var tds = [], sel = bounds(selection.anchor);

        each("TD TH", selection.table, function(td) {
            var b = bounds(td), ok = false;
            switch(command) {
                case "selectRow":    ok = sel[1] == b[1]; break;
                case "selectColumn": ok = sel[0] == b[0]; break;
                case "selectTable":  ok = true; break;
            }
            if(ok)
                tds.push(td);
        });

        // toggle = true 允许反选, 默认不允许
        var isSelected = tds.every(function(td) { return hasClass(td, clsSelected) });

        if(toggle && isSelected)
            tds.forEach(function(td) { removeClass(td, clsSelected) });
        else
            tds.forEach(function(td) { addClass(td, clsSelected) });

        selectFinished();
    };


    // ---------------------------------------------------------------------------------
    // 功能函数
    // ---------------------------------------------------------------------------------

    // 产生拷贝内容
    var contentForCopy = function(command) {

        var anySelected = $$("TD TH", selection.table).some(function(td) {
            return isSelected(td);
        });
        // 如果有任何被选中，则all=false,则选择选中区域
        switch(command) {
            case "copyRich":
            case "copyStyled":
                return selectedHTML(selection.table, true, !anySelected);
            case "copyHTML":
                return selectedHTML(selection.table, false, !anySelected);
            case "copyText":
                var m = selectedTextMatrix(selection.table, !anySelected);
                return m.map(function(row) {
                    return rstrip(row.join("\t"));  // 列连接符
                }).join("\n");  // 行连接符
            case "copyCSV":
                var m = selectedTextMatrix(selection.table, !anySelected);
                return m.map(function(row) {
                    return row.map(function(cell) {
                        return '"' + cell.replace(/"/g, '""') + '"';
                    }).join(",");
                }).join("\n");
        }
        return "";
    };

    // 向background发送拷贝命令，将内容拷贝至剪贴板
    var doCopy = function(command) {
        if(!selection)
            return;
        chrome.runtime.sendMessage({command:command, content:contentForCopy(command)});
    };

    // 表格定位，选中一个表格
    var selectTable = function(table) {
        if(!table)
            return;
        var tds = $$("TD TH", table);   // 没有单元格的表格 忽略
        if(!tds)
            return;
        if(!selectionInit(tds[0]))
            return;
        selectionExtend("selectTable");

        var xy = offset(table);
        // 滚动到表格位置
        window.scrollTo(
            xy[0] - window.innerWidth / 3,
            xy[1] - window.innerHeight /3
        );
    }

    // 获得菜单状态
    var menuState = function() {
        var n = document.body.getElementsByTagName("TABLE").length, // 当前页面的表格数量
            sel = lastEvent && canSelect(lastEvent.target); // 右键所在的单元格
        // console.log(lastEvent.target);
        return {
            hasSelection: !!selection,
            numTables:  n,
            hasTables: n > 0,
            canSelect: sel,
            canCopy: !!selection || sel,
            modKey: options.modKey
        }
    }

    // 更新上下文菜单（右键菜单）
    var menuUpdate = function() {
        var ms = menuState();
        chrome.runtime.sendMessage({command:"menuUpdate", state:ms});
    }

    // ---------------------------------------------------------------------------------
    // 事件处理
    // ---------------------------------------------------------------------------------

    // 监听处理来自后台background的事件
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        switch(message.command) {
            case "anySelection":
                if(selection)
                    selectFinished();   // 向后台发送有选区
                break;
            case "openPopup":
                processLang();
                processSkin();
                break;
            case "selectRow":
            case "selectColumn":
            case "selectTable":
                if(lastEvent && selectionInit(lastEvent.target))
                    selectionExtend(message.command, true);         // 支持反选
                else
                    selectionReset();
                break;
            case "findPrevTable":
            case "findNextTable":
                var tables = $$("TABLE"),
                    index = 0;
                if(selection) {
                    index = tables.indexOf(selection.table);
                    if(message.command == "findPrevTable")
                        index = index == 0 ? tables.length - 1 : index - 1;  // 循环切换
                    else
                        index = index == tables.length - 1 ? 0 : index + 1;
                }
                selectTable(tables[index]);
                break;
            case "copyRich":
            case "copyText":
            case "copyHTML":
            case "copyStyled":
            case "copyCSV":
                if(selection)
                    doCopy(message.command);
                else if(lastEvent && selectionInit(lastEvent.target)) { // 没有选区，默认选取整个表格
                    selectionExtend("selectTable", false);  // 直接正选
                    doCopy(message.command);
                    selectionReset();
                } else
                    selectionReset();
                break;
            case "setModKey0":
                setOption("modKey", 0); // 设置热键
                break;
            case "setModKey1":
                setOption("modKey", 1);
                break;

            case "setLang0":            // 设置语言
                // alert("设置语言为英语");
                setOption("modLang",0);
                break;
            case "setLang1":
                // alert("设置语言为中文");
                setOption("modLang",1);
                break;
            
            case "setSkin0":            // 设置皮肤
                setOption("modSkin",0);
                break;
            case "setSkin1":
                setOption("modSkin",1);
                break;
            case "setSkin2":
                setOption("modSkin",2);
                break;
            case "setSkin3":
                setOption("modSkin",3);
                break;

            case "updateOptions":  // 获取选项信息
                updateOptions();
                break;
            case "activate":  // 当前tab页面被激活，更新右键菜单
                menuUpdate();
                break;

        }
        sendResponse(menuState());   // 返回当前菜单状态
    });


    // 判断是否是有效的点击
    // 有效的点击条件
    // @1 鼠标左键按下
    // @2 同时按着热键
    // @3 事件对象可以被选择
    var isValidClick = function(e) {
        if(e.which != 1)    // 是不是鼠标左键
            return false;
        if(!e[modKeys[options.modKey]]) {   // 有没有同时按着热键
            selectionReset();   // 重置选区
            return false;
        }
        if(!canSelect(e.target)) {  // 能不能选择
            selectionReset();
            return false;
        }
        return true;
    }

    // '鼠标按下' - 初始化选区
    var onMouseDown = function(e) {
        lastEvent = e;
        menuUpdate();       // 更新菜单状态

        if(!isValidClick(e))    // 不合法的点击
            return;

        selectionInit(e.target, e.shiftKey);    // 按住shift 实现扩展选择
        selection.selectAnchor = true;  // 选择锚点确定
        if(hasClass(selection.anchor, clsSelected)) {
            removeClass(selection.anchor, clsSelected); // 反选
            selection.selectAnchor = false;
        }
        // 更新单元格状态
        selectionUpdate(e);
        scrollWatch();    // 滚动选择

        e.preventDefault(); 
        e.stopPropagation(); // 阻止事件冒泡

        // 绑定鼠标移动事件和鼠标松开事件
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    // '鼠标移动' - 更新选区
    var onMouseMove = function(e) {
        lastEvent = e;
        if(!selection || e.which != 1 || !e[modKeys[options.modKey]])
            return;
        selection.scrollSpeed = scrollMinSpeed;
        selectionUpdate(e);
        e.preventDefault();
        e.stopPropagation();
    };

    // '鼠标松开' - 停止选区选择
    var onMouseUp = function(e) {
        scrollUnwatch();    //停止滚动
        if(selection) {         // 拖拽类升级为选中类
            $C(clsDragover, selection.table).forEach(function(td) {
                removeClass(td, clsDragover);
                addClass(td, clsSelected);
            });
        }
        selectFinished();       // 选择结束
        // 清理事件监听器
        document.removeEventListener("mousemove", onMouseMove); 
        document.removeEventListener("mouseup", onMouseUp);
    };

    // '鼠标双击' - 选择一行或者一列
    var onDblClick = function(e) {
        if(!isValidClick(e))
            return;
        selectionInit(e.target, 0);
        var secondaryKey = e[modKeys[1 - options.modKey]];  // 判断有没有同时按着两个功能键   互补
        selectionExtend(secondaryKey ? "selectRow" : "selectColumn", true); // 同时按着alt+ctrl选择一行，否则只选择一列
        e.preventDefault();
        e.stopPropagation();
    };

    // '复制' - 默认复制为富文本
    var onCopy = function(e) {
        if(!selection)
            return;
        doCopy("copyRich"); // 默认富文本，可黏贴到word中
        e.preventDefault();
        e.stopPropagation();
    };

    // '上下文菜单' - 注册上一次事件，即选区建立后，更新菜单信息
    var onContextMenu = function(e) {
        lastEvent = e;
        menuUpdate();
    }


    // ---------------------------------------------------------------------------------
    // main()
    // ---------------------------------------------------------------------------------

    document.addEventListener("mousedown", onMouseDown, true);  // Capture Stage Catch
    document.addEventListener("contextmenu", onContextMenu);    // 触发上下文菜单
    document.addEventListener("dblclick", onDblClick);  // 双击
    document.addEventListener("copy", onCopy);  // 复制操作

    updateOptions();    // 更新选项
    menuUpdate();       // 更新上下文菜单

})();