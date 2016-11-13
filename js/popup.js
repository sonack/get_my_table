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
    <form class="ui form" style="width: 300px; margin: auto;" id="register_form">

    <div class="required field">
    <label>用户名：<span id="username_errormsg" style='float:right'></span></label>
    <input type="text" name="username" placeholder="请输入用户名" id="username_input">
    </div>

    <div class="required field">
    <label>密码：<span id="password_errormsg" style='float:right'></span></label>
    <input type="password" name="password" placeholder="请输入密码" id="password_input">
    </div>

    <div class="required field">
    <label>电子邮箱：<span id="email_errormsg" style='float:right'></span></label>
    <input type="text" name="email" placeholder="请输入email" id="email_input">
    </div>

    <button class="ui red button" id="register_button" style="margin-right: 50px; margin-left: 50px;">注册</button>
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
    <input type="text" name="username" placeholder="请输入用户名" id="username_input">
    </div>

    <div class="required field">
    <label>密码：</label>
    <input type="password" name="password" placeholder="请输入密码">
    </div>

    <button class="ui red button" id="login_submit_button" style="margin-left:100px; margin-top: 25px;">登录</button>
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
        var remoteHost = "http://0.0.0.0:5000";
        $(".dropdown").dropdown();


        // 注册页面
        $("#signup_button").click(function(){
         changeTo(signup_div);

         var state = true;
         // 用户名验证
         var validate_username = function()
         {
            var username_input = $("#username_input");
            if(username_input.val().length === 0)
            {
                $("#username_errormsg").css("color","red");
                $("#username_errormsg").text("请输入用户名!");
                return false;
            }
            else if(!(/^\w{3,20}$/.test(username_input.val())))
            {

                $("#username_errormsg").css("color","red");
                $("#username_errormsg").text("用户名只能由3到20位的字母数字组成！");
                return false;
            }
            else
            {
                $.ajax({type:"post", data:{username:username_input.val()},url:remoteHost+"/is_name_valid",success:function(result)
                {
                res = JSON.parse(result)
                if(res.status === 'success')
                {
                    $("#username_errormsg").css("color","green");
                    $("#username_errormsg").text("用户名合法")
                    return true;
                }
                else
                {
                    $("#username_errormsg").css("color","red");
                    $("#username_errormsg").text("用户名已注册!")
                    return false;
                }
                }
            });

            }
         };

         // 绑定失去焦点事件
         (function()
         {
            $("#username_input").blur(validate_username);
         })();
    


        // 密码验证
        var validate_password = function()
         {
            var password_input = $("#password_input");
            if(password_input.val().length === 0)
            {
                $("#password_errormsg").css("color","red");
                $("#password_errormsg").text("请输入密码!");
                return false;
            }
            else if(!(/^\w{6,}$/.test(password_input.val())))
            {

                $("#password_errormsg").css("color","red");
                $("#password_errormsg").text("密码至少6位!");
                return false;
            }
            else
            {
                $("#password_errormsg").css("color","green");
                $("#password_errormsg").text("密码格式合法");
                return true;
            }
         };
        
        // 绑定失去焦点事件
        (function ()
         {
            $("#password_input").blur(validate_password);
         }
        )();



        // 电子邮箱验证

        var validate_email = function()
         {
            var email_input = $("#email_input");
            if(email_input.val().length === 0)
            {
                $("#email_errormsg").css("color","red");
                $("#email_errormsg").text("请输入电子邮箱");
                return false;
            }
            else if(!(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/ .test(email_input.val())))
            {

                $("#email_errormsg").css("color","red");
                $("#email_errormsg").text("邮箱格式不合法!");
                return false;
            }
            else
            {
                $.ajax({type:"post", data:{email:email_input.val()},url:remoteHost+"/is_email_valid",success:function(result)
                {
                res = JSON.parse(result)
                if(res.status === 'success')
                {
                    $("#email_errormsg").css("color","green");
                    $("#email_errormsg").text("该邮箱可以注册");
                    return true;
                }
                else
                {
                    $("#email_errormsg").css("color","red");
                    $("#email_errormsg").text("该邮箱已注册!");
                    return false;
                }
                }
            });

            }
         };

         // 绑定失去焦点事件
         (function()
         {
            $("#email_input").blur(validate_email);
         })();

        // 注册
         $("#register_button").click(function(){
            $.ajax({type:"post", data:$('#register_form').serialize(),url:"http://0.0.0.0:5000/register",success:function(result)
            {
                res = JSON.parse(result);
                if(res.status === 'success')
                {
                    alert("注册成功,请登录!");
                    var username = $("#username_input").val();
                    $("#login_button").click();
                    $("#username_input").val(username);
                }
                else
                {
                   alert("注册失败!");
                }
            }});
            return false;
         });
     });



         // 登录界面
        $("#login_button").click(function(){
            changeTo(login_div);
            $("#login_submit_button").click(function(){
                return false;
            })
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
    sendCommand("anySelection",false);
}
)
})(jQuery);

var updateTablePreview = function(tableContent)
{
    $(".table_content").html(tableContent);
}

var makeTableEditable = function()
{
    var tbl = document.getElementsByTagName("table");
    if(tbl) 
        tbl[0].contentEditable = true;
}