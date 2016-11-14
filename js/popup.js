// 全局状态变量

var am_I_online = false;
 var save_confirm_div = `<div id="save_confirm_div">
       <h3 class="ui header purple" style="margin-left: 30px;">
  <i class="plug icon"></i>
  <div class="content">请完善表格信息 </div>
</h3>
      <div class="ui form" style="margin-left: 200px; margin-top: 40px;">
   

    <div class="seven wide required field">
    <label>表格名称:</label>
    <input type="text" id="table_name_input">
  </div>
  <div class="seven wide field" >
    <label>分类于:</label>
    <select class="ui search dropdown" id="all_class">
      <option value="">输入分类</option>
    </select>
  </div>
  <div id="save_confirm_div_button" style="margin-top: 30px;">
  <button class="ui green button" style="margin-left: -30px;" id="add_new_class_button">新增分类 </button>
  <button class="ui primary button" style="margin-left: 20px;" id="confirm_button">确定 </button>
  <button class="ui red button" style="margin-left: 20px;" id="cancel_button">取消 </button>
  </div>
</div>
</div>
`,
    home_div = `
    <div id="main_header">
        <div id="please_login" class="float_right" style="margin-right: 20px;display: none;">
          <h3 class="ui teal header">
            <i class="warning circle icon"></i>
            <div class="content">请登录以便在云端同步您的表格数据!</div>
          </h3>
        </div>

        <div id="table_header" class="float_left" style="margin-left: 20px;">
          <h3 class="ui purple header">
          <i class="table circle icon"></i>
          <div class="content">当前选定表格:</div>
        </h3>
        </div>
      </div>
      <div id="main_content">
      
        <div class="currentTable">
         <div class="table_content" id="scrollbar">
            <h3 class="prompt" style="color:#2185D0">
            <i class="info big circle icon blue"></i>当前未选中表格</h3>
         </div>
         <div id="table_button" style="display: none;">
           <button class="ui primary button disabled" id="save_to_cloud">保存到云端... </button>
           <button class="ui button" style="margin-left: 50px;"">放弃 </button>
         </div>
        </div>
      </div>`,


    // 注册页面


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



    // 登录页面


    login_div = `
    <!-- 登录页面 开始-->
    <div id="login_div">
    <h3 class="ui brown header" style="margin-left: 10%;">
    <i class="home icon"></i>
    <div class="content">用户登录<div class="sub header">还没有账号？请先注册用户</div></div>
    </h3>
    <div class="ui divider"></div>
    <form class="ui form" style="width: 300px; margin: auto;" id="login_form">
    
    <div class="required field">
    <label>用户名：<span id="username_errormsg" style='float:right'></span></label>
    <input type="text" name="username" placeholder="请输入用户名" id="username_input">
    </div>

    <div class="required field">
    <label>密码：<span id="password_errormsg" style='float:right'></span></label>
    <input type="password" name="password" placeholder="请输入密码" id="password_input">
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
            'fade down'
            );
        main.html(target_div);
        main.transition('fade up');
    }
// UI相关
(function UI_relative($)
{


    //  main home index html
    // var home_div = ` <div id="home_div">
    // <h3 class="ui teal header">
    // <i class="warning circle icon"></i>
    // <div class="content">请登录以便在云端同步您的表格数据!
    // </div>
    // </h3>
    // <div class="currentTable">
    // <h3 class="prompt" style="color:#2185D0"> <i class="info big circle icon blue"></i>当前未选中表格</h3>  
    // </div>
    // </div>`,
   

   
    
     // 初始化
     function init(){
        var remoteHost = "http://0.0.0.0:5000";
        $(".dropdown").dropdown();


        // 注册页面
        $("#signup_button").click(function(){
           changeTo(signup_div);

           var state1 = true,
           state2 = true,
           state3 = true;

         // 用户名验证
         var validate_username = function()
         {
            var username_input = $("#username_input");
            if(username_input.val().length === 0)
            {
                $("#username_errormsg").css("color","red");
                $("#username_errormsg").text("请输入用户名!");
                state1 = false;
            }
            else if(!(/^\w{3,20}$/.test(username_input.val())))
            {

                $("#username_errormsg").css("color","red");
                $("#username_errormsg").text("用户名只能由3到20位的字母数字组成！");
                state1 = false;
            }
            else
            {
                $.ajax({type:"post", data:{username:username_input.val()},url:remoteHost+"/is_name_valid",success:function(result)
                {
                    var res = JSON.parse(result)
                    if(res.status === 'success')
                    {
                        $("#username_errormsg").css("color","green");
                        $("#username_errormsg").text("用户名合法")
                        state1 = true;
                    }
                    else
                    {
                        $("#username_errormsg").css("color","red");
                        $("#username_errormsg").text("用户名已注册!")
                        state1 = false;
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
                state2 = false;
            }
            else if(!(/^\w{6,}$/.test(password_input.val())))
            {

                $("#password_errormsg").css("color","red");
                $("#password_errormsg").text("密码至少6位!");
                state2 = false;
            }
            else
            {
                $("#password_errormsg").css("color","green");
                $("#password_errormsg").text("密码格式合法");
                state2 = true;
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
                state3 = false;
            }
            else if(!(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/ .test(email_input.val())))
            {

                $("#email_errormsg").css("color","red");
                $("#email_errormsg").text("邮箱格式不合法!");
                state3 = false;
            }
            else
            {
                $.ajax({type:"post", data:{email:email_input.val()},url:remoteHost+"/is_email_valid",success:function(result)
                {
                    var res = JSON.parse(result)
                    if(res.status === 'success')
                    {
                        $("#email_errormsg").css("color","green");
                        $("#email_errormsg").text("该邮箱可以注册");
                        state3 = true;
                    }
                    else
                    {
                        $("#email_errormsg").css("color","red");
                        $("#email_errormsg").text("该邮箱已注册!");
                        state3 = false;
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
            $("#username_input").blur();
            $("#password_input").blur();
            $("#email_input").blur();

            if(!state1 || !state2 || !state3)
            {
                alert("请检查输入是否有误!");
            }
            else
            {
                $.ajax({type:"post", data:$('#register_form').serialize(),url:"http://0.0.0.0:5000/register",success:function(result)
                {
                    var res = JSON.parse(result);
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
            }
            return false;
        });
    });



         // 登录界面
         $("#login_button").click(function(){
            changeTo(login_div);

            var state1 = true,
            state2 = true;

            var validate_username = function()
            {
                var username_input = $("#username_input");
                if(username_input.val().length === 0)
                {
                    $("#username_errormsg").css("color","red");
                    $("#username_errormsg").text("请输入用户名!");
                    state1 = false;
                }
                else if(!(/^\w{3,20}$/.test(username_input.val())))
                {

                    $("#username_errormsg").css("color","red");
                    $("#username_errormsg").text("用户名只能由3到20位的字母数字组成！");
                    state1 = false;
                }
                else
                {
                    $.ajax({type:"post", data:{username:username_input.val()},url:remoteHost+"/is_name_valid",success:function(result)
                    {
                        var res = JSON.parse(result)
                        if(res.status === 'success')
                        {
                            $("#username_errormsg").css("color","green");
                            $("#username_errormsg").text("用户不存在!")
                            state1 = false;
                        }
                        else
                        {
                            $("#username_errormsg").text("")
                            state1 = true;
                        }
                    }
                });

                }
            };

            (function()
            {
                $("#username_input").blur(validate_username);
            })();



            var validate_password = function()
            {
                var password_input = $("#password_input");
                if(password_input.val().length === 0)
                {
                    $("#password_errormsg").css("color","red");
                    $("#password_errormsg").text("请输入密码!");
                    state2 = false;
                }
                else if(!(/^\w{6,}$/.test(password_input.val())))
                {

                    $("#password_errormsg").css("color","red");
                    $("#password_errormsg").text("密码至少6位!");
                    state2 = false;
                }
                else
                {
                    $("#password_errormsg").text("");
                    state2 = true;
                }
            };
            
        // 绑定失去焦点事件
        (function ()
        {

            $("#password_input").blur(validate_password);
        }
        )();


        $("#login_submit_button").click(function(){
            $("#username_input").blur();
            $("username_input").blur();

            if(!state1 || !state2)
            {
               alert("请检查输入是否有误!");
           }
           else
           {
            $.ajax({type:"post", data:$('#login_form').serialize(),url:"http://0.0.0.0:5000/login",success:function(result)
            {
                var res = JSON.parse(result);
                if(res.status === 'success')
                {
                    alert("登录成功!");
                    am_I_online = true;
                    $("#login_or_register").hide();
                    $("#user_div").css("display","block");
                    $("#login_username").text(res.log_username);


                    $("#logout_button").unbind("click");
                    $("#logout_button").click(function(){
                        $.ajax({type:"get", url:"http://0.0.0.0:5000/logout",success:function(result){
                        var res = JSON.parse(result);
                        if(res.status === 'success')
                        {
                            alert("注销成功...");
                            am_I_online = false;
                            $("#login_or_register").show();
                            $("#please_login").css("display","block");
                            $("#user_div").css("display","none");
                        }
                        else
                            alert("注销失败!");
                        $("#home_button").click();
                    }});});

                    $(".cloud_button").unbind("click");
                    $(".cloud_button").click(function(){
                        alert("查看所有云表格...");
                    });

                    $("#home_button").click();

                }
                else
                {
                 alert("用户名或密码错误!");
             }
         }});
        }
        return false;
    })
    });
         
         $("#home_button").click(function(){


            $.ajax({type:"get",url:"http://0.0.0.0:5000/index",success:function(result)
            {
                var res = JSON.parse(result);
                if(res.status === 'success')
                {
                    console.log("在线中...");
                    $("#save_to_cloud").removeClass("disabled");
                }
                else
                {
                    console.log("离线中...");
                }
            }});
            changeTo(home_div);
            $("#save_to_cloud").click(function(){
                $.ajax({type:"get",url:"http://0.0.0.0:5000/get_all_class",success:function(result)
                {
                    var to_send_data = {}
                    to_send_data['content'] = $(".table_content").html()
                    changeTo(save_confirm_div);
                    var res = JSON.parse(result);
                    var prt = $("#all_class");
                    $.each(res,function(idx,ele){
                        var opt = $("<option></option>");
                        opt.text(ele);
                        opt.attr("value",ele);
                        prt.append(opt);
                        // alert("添加了" + ele)
                    });
                    $('select.dropdown').dropdown();

                    console.log("绑定kaishi");
                    $("#add_new_class_button").click(function(){
                    var new_class_name = ""
                    alert("增加新分类");
                });
                    console.log("绑定结束");

                    $('#confirm_button').click(function(){
                        var table_name = $("#table_name_input").val();
                        var table_class = $("#all_class").val();
                        if(table_name === "")
                        {
                           alert("请输入表格名字!");
                           return false;
                        }else if(table_class === "")
                        {
                            alert("请选择表格类别!");
                            return false;
                        }

                    to_send_data['table_name'] = table_name;
                    to_send_data['table_class'] = table_class;
                    $.ajax({type:"post", url:"http://0.0.0.0:5000/save_table",data : JSON.stringify(to_send_data) , contentType: 'application/json;charset=UTF-8',success:function(result){
                    var res = JSON.parse(result)
                    if(res.status === 'success')
                    {
                        alert("保存成功!");
                    }
                    else
                    {
                        alert("保存失败!");
                    }
                    changeTo(home_div);
                }});

                    });



                }});
              



                // if(am_I_online)
                //     alert("当前在线");
                // else
                //     alert("当前离线");
            });
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
    $.ajax({type:"get",url:"http://0.0.0.0:5000/online",success:function(result)
            {
                var res = JSON.parse(result);
                if(res.status === 'success')
                {
                    console.log("在线中...");
                    am_I_online = true;
                    $("#login_or_register").hide();
                    $("#save_to_cloud").removeClass("disabled");
                    $("#please_login").css("display","none");
                    $("#user_div").css("display","block");
                    $("#login_username").text(res.log_username);
                    var logout_button = $("#logout_button");
                    var obj_e = $._data(logout_button, "events");
                    if(!obj_e || !obj_e['click'])
                    {
                        logout_button.click(function(){
                        $.ajax({type:"get", url:"http://0.0.0.0:5000/logout",success:function(result){
                        var res = JSON.parse(result);
                        if(res.status === 'success')
                        {
                            alert("注销成功...");
                            am_I_online = false;
                            $("#login_or_register").show();
                            $("#please_login").css("display","block");
                            $("#user_div").css("display","none");
                        }
                        else
                            alert("注销失败!");
                        $("#home_button").click();
                    }});});
                    }

                }
                else
                {
                    console.log("离线中...");
                    $("#please_login").css("display","block");
                    $("#user_div").css("display","none");
                }
            }});
      
         $("#save_to_cloud").click(function(){
                $.ajax({type:"get",url:"http://0.0.0.0:5000/get_all_class",success:function(result)
                {
                    var to_send_data = {}
                    to_send_data['content'] = $(".table_content").html()
                    changeTo(save_confirm_div);
                    var res = JSON.parse(result);
                    var prt = $("#all_class");
                    $.each(res,function(idx,ele){
                        var opt = $("<option></option>");
                        opt.text(ele);
                        opt.attr("value",ele);
                        prt.append(opt);
                        // alert("添加了" + ele)
                    });
                    $('select.dropdown').dropdown();
                    $('#confirm_button').click(function(){
                        var table_name = $("#table_name_input").val();
                        var table_class = $("#all_class").val();
                        if(table_name === "")
                        {
                           alert("请输入表格名字!");
                           return false;
                        }else if(table_class === "")
                        {
                            alert("请选择表格类别!");
                            return false;
                        }

                    to_send_data['table_name'] = table_name;
                    to_send_data['table_class'] = table_class;
                    $.ajax({type:"post", url:"http://0.0.0.0:5000/save_table",data : JSON.stringify(to_send_data) , contentType: 'application/json;charset=UTF-8',success:function(result){
                    var res = JSON.parse(result)
                    if(res.status === 'success')
                    {
                        alert("保存成功!");
                    }
                    else
                    {
                        alert("保存失败!");
                    }
                    changeTo(home_div);

                }});

                    });
                }});
              

                $("#add_new_class_button").click(function(){
                    var new_class_name = ""
                });

                // if(am_I_online)
                //     alert("当前在线");
                // else
                //     alert("当前离线");
            });

    $(".cloud_button").click(function(){
        alert("查看所有云表格...");
        $("#cloud_select").show();
    });

    // start

     $("#choose_class").click(function(){
          $("#left_sidebar").sidebar('toggle');
      });
     $("#choose_id").click(function(){
          $("#right_sidebar").sidebar('toggle');
      });

     $("#left_sidebar *").click(function(event){
            alert("选择的是" + $(event.target).text());
            $("#left_sidebar").sidebar('toggle');
     });




});

})(jQuery);

var updateTablePreview = function(tableContent)
{
    $("#table_button").show();
    $(".table_content").html(tableContent);
}

var makeTableEditable = function()
{
    var tbl = document.getElementsByTagName("table");
    if(tbl) 
        tbl[0].contentEditable = true;
}