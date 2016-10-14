(function(){

    // Settings
    var colSeparator = "\t";
    var rowSeparator = "\n";

    var scrollMinSpeed = 30;
    var scrollMaxSpeed = 150;
    var scrollAcceleration = 1.01;

    var scrollAmount = 30;

    var clsSelected = "__tableselect__A__";
    var clsDragover = "__tableselect__B__";
    var clsSelectedMark = "__tableselect__C__";

   // Common tools 

   var $ = function(id)
   {
        return document.getElementById(id);
   };

   var $A = function(a,coll)
   {
        Array.prototype.forEach.call(coll,function(x) {a.push(x)});
        return a;
   };

   var $W = function(str)
   {
        return (str || "").split(/\s+/);
   };
    
    var $$ = function(tags, where)
   {
        var els = [];
        $W(tags).forEach(function(tag){
            $A(els, (where || document).getElementsByTagName(tag));
        });
        return els;
   };

    var $C = function(cls,where)
    {
        return $A([], (where || document).getElementsByClassName(cls));
    };

    var walk = function(el,fun)
    {
        if(el.nodeType != 1)
            return;
        fun(el);
        var cs = el.childNodes;
        for(var i = 0; i < cs.length; i++)
        {
            walk(cs[i],fun);
        }
    }

    var each = function(tag, el, fun) {
        if(!tag.push)
            tag = $W(tag);
        if(el.nodeType != 1)
            return;
        if(tag.indexOf(el.nodeName) >= 0) {
            fun(el);
            return;
        }
        var cs = el.childNodes;
        for(var i = 0; i < cs.length; i++)
            each(tag, cs[i], fun);
    };

     var removeAll = function(els) {
        els.forEach(function(el) {
            if(el && el.parentNode)
                el.parentNode.removeChild(el);
        });
    };

     var closest = function(el, tags) {
        tags = $W(tags.toLowerCase());
        while(el) {
            if(el.nodeName && tags.indexOf(el.nodeName.toLowerCase()) >= 0)
                return el;
            el = el.parentNode;
        }
        return null;
    };

    var addClass = function(el, cls) {
        if(el) {
            var c = $W(el.className);
            if(c.indexOf(cls) < 0)
                c.push(cls);
            el.className = c.join(" ");
        }
    };

    var removeClass = function(el, cls) {
        if(el && el.className) {
            var cname = $W(el.className).filter(function(x) {
                return x != cls;
            }).join(" ");
            if(cname.length)
                el.className = cname;
            else
                el.removeAttribute("class");
        }
    };

    var hasClass = function(el, cls) {
        return el ? $W(el.className).indexOf(cls) >= 0 : false;
    };

    var isScrollable = function(el) {
        if(!el || el == document || el == document.body)
            return false;
        var css = document.defaultView.getComputedStyle(el);
        if(!css.overflowX.match(/scroll|auto/) && !css.overflowY.match(/scroll|auto/))
            return false;
        return el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight;
    };

    var closestScrollable = function(el) {
        while(el) {
            if(isScrollable(el))
                return el;
            el = el.parentNode;
        }
        return null;
    };

    var bounds = function(el) {
        var r = el.getBoundingClientRect();
        return [r.left, r.top, r.right, r.bottom];
    };

     var intersect = function(a, b) {
        return !(a[0] >= b[2] || a[2] <= b[0] || a[1] >= b[3] || a[3] <= b[1])
    };

    var transpose = function (m) {
        if(!m || !m[0])
            return m;
        return m[0].map(function(_, c) {
            return m.map(function(row) {
                return row[c];
            });
        });
    };

    var trimMatrix = function(mat, keep) {
        var fun = function(row) {
            return row.some(function(cell) { return keep(cell) });
        };
        mat = mat.filter(fun);
        mat = transpose(mat).filter(fun);
        return transpose(mat);
    };

    var lstrip = function(s) { return s.replace(/^\s+/, "") };
    var rstrip = function(s) { return s.replace(/\s+$/, "") };
    var strip  = function(s) { return lstrip(rstrip(s)) };

// Selection Manipulation

    var selection = null;

    var lastEvent = null;

    var isSelected = function(el)
    {
        return el ? (el.className || "").indexOf("__tableselect__") >= 0 : false;
    }

    var tableMatrix = function(table)
    {
        var tds = {},
            rows = {},
            cols = {};
        each("TD TH", table, function(td){
            var b = bounds(td);
            var c = b[0], r = b[1];
            cols[c] = rows[r] = 1;
            tds[r + "/" + c] = td;
        });

        rows = Object.keys(rows).sort(function(x,y) { return x - y; });
        cols = Object.keys(cols).sort(function(x,y) { return x - y; });

        var mat = rows.map(function(r){
            return cols.map(function(c))
            {
                return tds[r + "/" + c] ?
                    {td: tds[r + "/" + c]} :
                    {colRef: null, rowRef: null }
            }
        });
        // 处理存在行或列合并的情况
        mat.forEach(function(row, r))
        {
            row.forEach(function(cell, c))
            {
                if(!cell.td)
                    return;

                var rs = parseInt(cell.td.rowSpan) || 1;
                var cs = parseInt(cell.td.colSpan) || 1;

                for(var i = 1; i < cs ; i ++)
                {
                    if(row[c + i])
                        row[c + i].colRef = cell;
                }

                for(var i = 1; i < rs; i ++)
                {
                    if(mat[r + i])
                        mat[r + i][c].rowRef = cell;
                }
            }
        }

        return mat;
    };

    var trimTable = function(table)
    {
        var mat = tableMatrix(table);

        // 去掉无用的行或列

        mat = trimMatrix(mat, function(cell){
            return cell.td && isSelected(cell.td);
        });

        mat.forEach(function(row){
            row.forEach(function(cell){
                if(cell.td)
                {
                    cell.td._keep_ = 1;  // 要保留的cell
                    cell.colSpan = cell.rowSpan = 0;
                }
            });
        });

        var remove = [];

        each("TD TH", table,function(td){
            if(td._keep_ != 1)
                remove.push(td);
            else if(!isSelected(td))
                td.innerHTML = "";
        });

        removeAll(remove);

        remove = [];

        each("TR", table, function(tr){
            if(!$$("TD TH", tr).length)
                remove.push(tr);            // 去除没有数据元素的行
        });

        removeAll(remove);

        remove = [];

        mat.forEach(function(row){
            row.forEach(function(cell){
                if(cell.colRef)
                    cell.colRef.colSpan++;
                if(cell.rowRef)
                    cell.rowRef.rowSpan++;
            });
        });

        mat.forEach(function(row){
            row.forEach(function(cell){
                if(!cell.td)
                    return;
                cell.td.removeAttribute("colSpan");
                cell.td.removeAttribute("rowSpan");
                if(cell.colSpan) cell.td.colSpan = cell.colSpan + 1;
                if(cell.rowSpan) cell.td.rowSpan = cell.rowSpan + 1;
            });
        });
    };



    var selectedText = function(table, all)
    {
        var m = tableMatrix(table).map(function(row))
        {
            return row.map(function(cell){
                if(cell.td && (all || isSelected(cell.td)))
                    return strip(cell.td.innerText.replace(/[\r\n]+/g," "));  // 替换换行符为空格
                return "";
            });
        };

        m = trimMatrix(m,function(cell){
            return cell.length > 0;
        });

        return m.map(function(row){
            return rstrip(row.join(colSeparator));
        }).join(rowSeparator);
    };

    // Default table cell styles
     var defaultStyle = {
        "background-image": "none",
        "background-position": "0% 0%",
        "background-size": "auto",
        "background-repeat": "repeat",
        "background-origin": "padding-box",
        "background-clip": "border-box",
        "background-color": "rgba(0, 0, 0, 0)",
        "border-collapse": "collapse",
        "border-top": "0px none rgb(0, 0, 0)",
        "border-right": "0px none rgb(0, 0, 0)",
        "border-bottom": "0px none rgb(0, 0, 0)",
        "border-left": "0px none rgb(0, 0, 0)",
        "caption-side": "top",
        "clip": "auto",
        "color": "rgb(0, 0, 0)",
        "content": "",
        "counter-increment": "",
        "counter-reset": "",
        "direction": "ltr",
        "display": "table-cell",
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
        "unicode-bidi": "normal",
        "vertical-align": "middle",
        "visibility": "visible",
        "white-space": "normal",
        "word-spacing": "0px",
        "z-index": "auto"
    };

    var selectedHTML = function(table,all)
    {
        each("TD TH",table, function(td){
            if(hasClass(td, clsSelected))
            {
                removeClass(td, clsSelected);
                addClass(td, clsSelectedMark);
            }
        });

        var styles = [], props = Object.keys(defaultStatus);
        walk(table,function(el){
            var d = window.getComputedStyle(el), s = [];
            props.forEach(function(p){
                if(d[p] != defaultStyle[p])
                {
                    s.push(p + ":" + d[p]);
                }
            });
            styles.push(s.join(";"));
        });

        var frame = document.createElement("IFRAME");
        document.body.appendChild(frame);
        var fdoc = frame.contentDocument;
        fdoc.body.appendChild(fdoc.importNode(table,true));
        var ftable = fdoc.body.firstChild;

        walk(ftable, function(t){
            t.style.cssText = styles.shift();
        });

        if(!all)
        {
            trimTable(ftable);
        }

        each("TD TH", ftable, function(td){
            removeClass(td, clsSelectedMark);
        });

        var html = fdoc.body.innerHTML;

        each("TD TH", table, function(td){
            if(hasClass(td, clsSelectedMark))
            {
                removeClass(td, clsSelectedMark);
                addClass(td, clsSelected);
            }
        });

        document.body.removeChild(frame);

        html = "<base href=" + document.location + ">\n" + html;
        return html;
    }

})();