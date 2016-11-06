// UI相关
(function UI_relative($)
{


    //  main home index html
    var home_div = ` <div id="home_div">
    <h3 class="ui teal header">
    <i class="warning circle icon"></i>
    <div class="content">请登录以便在云端同步您的表格数据!
    </div>
    </h3>
    <div class="currentTable">
    <h3 class="prompt" style="color:#2185D0"> <i class="info big circle icon blue"></i>当前未选中表格</h3>  
    </div>
    </div>`,

    signup_div = `
    <!-- 注册页面 开始-->
    <div id="signup_div">
    <h3 class="ui blue header" style="margin-left: 10%;">
    <i class="add square icon"></i>
    <div class="content">用户注册<div class="sub header">注册后，您就可以将表格保存到云端！</div></div>
    </h3>
    <div class="ui divider"></div>
    <form class="ui form" style="width: 300px; margin: auto;">

    <div class="required field">
    <label>用户名：</label>
    <input type="text" name="username" placeholder="请输入用户名">
    </div>

    <div class="required field">
    <label>密码：</label>
    <input type="password" name="password" placeholder="请输入密码">
    </div>

    <div class="field">
    <label>电子邮箱：</label>
    <input type="text" name="email" placeholder="请输入email">
    </div>

    <button class="ui red button" type="submit" style="margin-right: 50px; margin-left: 50px;">注册</button>
    <button class="ui violet button" type="reset">重置</button>
    </form>
    </div>
    <!-- 注册页面 结束 -->
    `,

    login_div = `
    <!-- 登录页面 开始-->
    <div id="login_div">
    <h3 class="ui brown header" style="margin-left: 10%;">
    <i class="home icon"></i>
    <div class="content">用户登录<div class="sub header">还没有账号？请先注册用户</div></div>
    </h3>
    <div class="ui divider"></div>
    <form class="ui form" style="width: 300px; margin: auto;">

    <div class="required field">
    <label>用户名：</label>
    <input type="text" name="username" placeholder="请输入用户名">
    </div>

    <div class="required field">
    <label>密码：</label>
    <input type="password" name="password" placeholder="请输入密码">
    </div>

    <button class="ui red button" type="submit" style="margin-left:100px; margin-top: 25px;">登录</button>
    </form>

    </div> 

    <!-- 登录页面 结束 -->
    `;


    var main = $("#main");
    
    function changeTo(target_div)
    {
        main.transition(
            'slide down'
            );
        main.html(target_div);
        main.transition('tada');
    }
     // 初始化
     function init(){
        $(".dropdown").dropdown();
        $("#signup_button").click(function(){
         changeTo(signup_div);
     });
        $("#login_button").click(function(){
            changeTo(login_div);
        });
        
        $("#home_button").click(function(){
            changeTo(home_div);
        });
    };


    $(function(){
        init();
    });
})(jQuery);


// 与background通信
(function communicate($)
{
  // Send a command to the content.
  function sendCommand(cmd, broadcast, fn) {
    var qry = broadcast ? {} : {active: true, currentWindow: true}; 
    chrome.tabs.query(qry, function(tabs) {
      tabs.forEach(function(tab) {
        chrome.tabs.sendMessage(tab.id, {command: cmd}, fn || function(r) {});
    });
  });
}



  // Update buttons state.
  var updateState = function(state) {
    // alert("UpdateState Called!");
    // console.log(state);
    if(state.modKey == 0)
    {
        $("#modKey0").addClass("active");
        $("#modKey1").removeClass("active");
    }
    else if(state.modKey == 1)
    {
        $("#modKey1").addClass("active");
        $("#modKey0").removeClass("active");
    }

    if(!state.canCopy)
        $(".mCopy").addClass("disabled");
    else
        $(".mCopy").removeClass("disabled");

    if(!state.hasTables)
        $(".mFind").addClass("disabled");
     else
        $(".mFind").removeClass("disabled");
}

var init = function(state) {

    document.addEventListener("click", function(e) {

        var cmd = e.target.getAttribute("cmd");
        if(!cmd)
            return;
        console.log(cmd);
        sendCommand("updateOptions", true);

        sendCommand(cmd, false, function(state) {
            updateState(state);
            if(e.target.getAttribute("close") == "1")
            {
                window.close();
            }
        });

    });

    if(navigator.userAgent.indexOf("Macintosh") > 0) {
        $("#modKey0").html("&#8984;");
        $("#modKey1").html("&#8997;");

    }
    updateState(state);
}

$(function(){
    sendCommand("openPopup", false, init)
})
})(jQuery);