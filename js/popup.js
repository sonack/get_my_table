// ---------------------------------------------------------------------------------
// 全局状态变量
// ---------------------------------------------------------------------------------

// 当前用户是否在线?
var am_I_online = false;
// 远程云服务器地址
var remoteHost = "http://123.206.84.93:5000";
// main元素
var main = $("#main");


// 当前是否为保存状态

var save_status = false;
var tableID;
var cur_lang;
// 切换页面到target_div
function changeTo(target_div)
{
    main.transition('fade');   // 切换特效 消失
    main.html(target_div);  // 改变html
    updateLang();
    main.transition('fade'); // 切换特效 出现
}


// ---------------------------------------------------------------------------------
// 页面HTML
// ---------------------------------------------------------------------------------

// 表格保存确认页面
// 主页
// 注册页面
// 登录页面

// 保存表格 确认页面
var save_confirm_div = `
    <div id="save_confirm_div">
       
       <h3 class="ui header purple" style="margin-left: 30px;">
            <i class="plug icon"></i>   <div class="content"><span id="complete_table_text">请完善表格信息 </span></div>
       </h3>

        <div class="ui form" style="margin-left: 200px; margin-top: 40px;">
            <div class="seven wide required field">
                <label><span id="table_name_text">表格名称:</span></label>    <input type="text" id="table_name_input">
            </div>
            <div class="seven wide field" >
                <label><span id = "be_classified_in_text">分类于:</span></label>     
                <select class="ui search dropdown" id="all_class">
                    <option value="" id="input_the_cate_text">输入分类</option>
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
// 空主页
    empty_div = `
    <div id="main_header">
            <div id="please_login" class="float_right" style="margin-right: 20px;">
            </div>
           
            <div id="table_header" class="float_left" style="margin-left: 20px;">
                <h3 class="ui purple header">
                    <i class="table circle icon"></i>
                    <div class="content"><span id = "table_context_text">表格内容:</span></div>
                </h3>
                <!-- <img alt="Avatar" height="50px" width="50px" id="avatar" src="images/default_avatar.png"> -->
            </div>
        </div>

        <div id="main_content">
            <div class="currentTable">
                <div class="table_content" id="scrollbar">
                   
                </div>
                <div id="others_button" style="margin-left:240px;">
                    <button class="ui primary button circular" id="save_to_cloud" style="margin-bottom:40px; margin-top: 8px;">保存 </button>
                    <button class="ui button circular" style="margin-left: 50px;" id="discard_button" style="margin-bottom:40px; margin-top: 8px;">返回 </button>
                </div>
            </div>
      </div>
`,
// 主页
    home_div = `
        <div id="main_header">
            <div id="please_login" class="float_right" style="margin-right: 20px;">
                <h3 class="ui teal header">
                    <i class="warning circle icon"></i>     <div class="content"><span id = "plz_log_in_text">请登录以便在云端同步您的表格数据!</span></div>
                </h3>
            </div>
           
            <div id="table_header" class="float_left" style="margin-left: 20px;">
                <h3 class="ui purple header">
                    <i class="table circle icon" id="table_circle_icon"></i>
                    <div class="content"><span id="current_selected_table_text">当前选定表格:</span></div>
                </h3>
                <!-- <img alt="Avatar" height="50px" width="50px" id="avatar" src="images/default_avatar.png"> -->
            </div>
        </div>

        <div id="main_content">
            <div class="currentTable">
                <div class="table_content" id="scrollbar">
                    <h3 class="prompt" style="color:#2185D0" id="no_select_prompt">
                        <i class="info big circle icon blue" id="no_select_head"></i>   <span id="no_table_selected_text">当前未选中表格</span>
                    </h3>
                </div>
                <div id="table_button" style="display: none;">
                    <button class="ui primary button disabled" id="save_to_cloud">保存 </button>
                    <button class="ui button" style="margin-left: 50px;" id="discard_button">返回 </button>
                </div>
            </div>
      </div>
`,
// 注册页面
    signup_div = `
    <!-- 注册页面 开始 -->
    <div id="signup_div">
        <h3 class="ui blue header" style="margin-left: 10%;">
            <i class="add square icon"></i>
            <div class="content"><span id="sign_up_text">用户注册</span>
                <div class="sub header"><span id="after_sign_up_text">注册后，您就可以将表格保存到云端！</span></div>
            </div>
        </h3>
        
        <div class="ui divider"></div>

        <form class="ui form" style="width: 300px; margin: auto;" id="register_form">
            <!-- 用户名 必需 -->
            <div class="required field">
                <label><span id="user_name_text">用户名：</span><span id="username_errormsg" style='float:right'></span> </label>
                <input type="text" name="username" placeholder="请输入用户名" id="username_input">
            </div>

            <!-- 密码 必需 -->
            <div class="required field">
                <label><span id = "password_text">密码：<\span><span id="password_errormsg" style='float:right'></span></label>
                <input type="password" name="password" placeholder="请输入密码" id="password_input">
            </div>
            
            <!-- 电子邮箱 必需 -->
            <div class="required field">
                <label><span id = "email_text">电子邮箱：</span><span id="email_errormsg" style='float:right'></span></label>
                <input type="text" name="email" placeholder="请输入email" id="email_input">
            </div>

            <button class="ui red button" id="register_button" style="margin-right: 50px; margin-left: 50px;">注册</button>
            <button class="ui violet button" type="reset"><span id = "reset_text">重置</span></button>
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
            <div class="content"><span id="user_log_in_text">用户登录</span>
                <div class="sub header"><span id="no_account_text">还没有账号？请先注册用户</span></div>
            </div>
        </h3>

        <div class="ui divider"></div>

        <form class="ui form" style="width: 300px; margin: auto;" id="login_form">
    
            <div class="required field">
                <label><span id="user_name_text">用户名：</span><span id="username_errormsg" style='float:right'></span></label>
                <input type="text" name="username" placeholder="请输入用户名" id="username_input">
            </div>

            <div class="required field">
                <label><span id="password_text">密码：</span><span id="password_errormsg" style='float:right'></span></label>
                <input type="password" name="password" placeholder="请输入密码" id="password_input">
            </div>

            <button class="ui red button" id="login_submit_button" style="margin-left:100px; margin-top: 25px;"><span id="denglu_text">登录</span></button>
        </form>
    </div> 
    <!-- 登录页面 结束 -->
`;


var person_info_div = `
 <div>
        <div id="left_info">
          <img alt="Avatar" height="180px" width="180px" id="user_avatar" style="visible:hidden;">
          <div class="ui form" style="width:70%;margin:auto;margin-top:10px;">
          <div class="field" >
                <input type="text" name="avatar_url" placeholder="请输入个性化头像的url" id="avatar_url">
          </div>
          </div>
          <h2 id="username_info">sonack</h2>
        </div>

        <div id="right_info">
          <form class="ui form" style="margin: auto;" id="register_form">  
            <div class="field">
                <label><span id="email_text">电子邮箱：</span></label>
                <input type="text" name="email" readonly="" placeholder="请输入email" id="email">
            </div>

            <div class="field">
                <label><span id="personal_net_text">个人网址：</span></label>
                <input type="text" name="person_net" placeholder="请输入个人网址" id="person_net">
            </div>

            <div class="field">
                <label><span id="introduction_text">简介：</span></label>
                <textarea rows="4" name="intro" placeholder="快介绍一下自己吧~" id="intro"></textarea>
            </div>

             <button class="ui red button" id="info_confirm_button" style="margin-right: 50px; margin-left: 50px;">确定</button>
            <button class="ui violet button" id="info_cancel_button">取消</button>
        </form>
        </div>
    </div>


`;



var cloud_square_div = `
<div id="share_square">
        <div>
          <h3 class="ui header blue" id="share_square_header">
            <i class="users icon"></i>
            <div class="content"><span id="shared_tables_text">动态广场</span> </div>
          </h3>  
        </div>

        <div id="share_square_content_div">
            <div class="ui feed share_feed_div" id="scrollbar">

            </div>
        </div>
</div>
`;

var share_event = `
<div class="event">
    <div>
        <img src="images/default_avatar.png" id='ava'>
    </div>
    <div class="content">
        <div class="summary" id="share_sum">
            <span id="user"></span> 分享了表格 <img src="images/left_yinhao.png" id="l_y"> <a id="table"></a> <img src="images/right_yinhao.png" id="r_y">,并表示<span id="comm"></id> <div class="date" style="float:right; margin-right:20px;"> </div>
        </div>
    </div> 
</div>
`;

var cloud_save_buttons = `
    <div id="cloud_table_button">
    
        <div class="ui buttons">
        <button class="ui primary button" id="cloud_save">保存 </button>
        <div class="or" data-text="或"></div>
        <button class="ui positive button" id="cloud_save_as">另存为 </button>
        </div>

        <div class="ui buttons" style="margin-left:25px;">
         <button class="ui teal button" id="cloud_reset">恢复 </button>
        <div class="or" data-text="或"></div>
        <button class="ui red button" id="cloud_delete">删除 </button>
        </div>


        <button class="ui circular purple button icon cloud_share_button" tabindex="0" style="margin-left:60px; id="">
            <div class="visible content "> <i class="share alternate icon"></i>&nbsp;<span id="share_text">分享... </span>&nbsp;</div>
        </button>

    </div>
`;
// ---------------------------------------------------------------------------------
// UI相关部分
// ---------------------------------------------------------------------------------
(function UI_relative($)
{    
    // 初始化函数
    function init(){
      

        // 初始化UI元素
        $(".dropdown").dropdown();


        // 事件注册
        // 单击注册按钮 事件注册
        $("#signup_button").click(function(){
            changeTo(signup_div);   // 切换页面
            var state1 = true,  // 三个表单输入字段正确与否
            state2 = true,
            state3 = true;

            // 表单验证部分

            // 用户名验证函数
            var validate_username = function()
            {
                var username_input = $("#username_input");
                // 判断为空
                if(username_input.val().length === 0)
                {
                    // 设置错误信息
                    $("#username_errormsg").css("color","red");
                    $("#username_errormsg").text("请输入用户名!");
                    state1 = false;
                } 
                // 判断是否为3到20位的数字字母格式
                else if(!(/^\w{3,20}$/.test(username_input.val())))
                {
                    $("#username_errormsg").css("color","red");
                    $("#username_errormsg").text("用户名只能由3到20位的字母数字组成！");
                    state1 = false;
                }
                // ajax方式判断是否用户名已存在
                else
                {
                    $.ajax(
                        {
                            type: "post",
                            data: { username : username_input.val() },
                            url: remoteHost+"/is_name_valid",
                            success: // 回调函数
                                function(result) {
                                    // 返回结果
                                    var res = JSON.parse(result);
                                    if(res.status === 'success')
                                    {
                                        // 验证成功
                                        $("#username_errormsg").css("color","green");
                                        $("#username_errormsg").text("用户名合法")
                                        state1 = true;
                                    }
                                    else
                                    {
                                        // 用户名已存在
                                        $("#username_errormsg").css("color","red");
                                        $("#username_errormsg").text("用户名已注册!")
                                        state1 = false;
                                    }
                                }
                        });

                }
            };
            // 绑定失去焦点事件，失去焦点即检查表单
            (function(){
                $("#username_input").blur(validate_username);
            })();
        

            // 密码验证
            var validate_password = function()
            {
                var password_input = $("#password_input");
                // 判断为空
                if(password_input.val().length === 0)
                {
                    $("#password_errormsg").css("color","red");
                    $("#password_errormsg").text("请输入密码!");
                    state2 = false;
                }
                // 至少6位字母数字组成
                else if(!(/^\w{6,}$/.test(password_input.val())))
                {
                    $("#password_errormsg").css("color","red");
                    $("#password_errormsg").text("密码至少6位!");
                    state2 = false;
                }
                // 验证成功
                else
                {
                    $("#password_errormsg").css("color","green");
                    $("#password_errormsg").text("密码格式合法");
                    state2 = true;
                }
            };
        
            // 绑定失去焦点事件
            (function (){
                $("#password_input").blur(validate_password);
            })();



            // 电子邮箱验证
            var validate_email = function()
            {
                var email_input = $("#email_input");
                // 判断为空
                if(email_input.val().length === 0)
                {
                    $("#email_errormsg").css("color","red");
                    $("#email_errormsg").text("请输入电子邮箱");
                    state3 = false;
                }
                // 检查email格式
                else if(!(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/ .test(email_input.val())))
                {
                    // 设置错误信息
                    $("#email_errormsg").css("color","red");
                    $("#email_errormsg").text("邮箱格式不合法!");
                    state3 = false;
                }
                else
                {
                    $.ajax(
                        {
                            type: "post",
                            data: { email : email_input.val() },
                            url: remoteHost+"/is_email_valid",
                            success: 
                                function(result){
                                    var res = JSON.parse(result)
                                    // 验证成功
                                    if(res.status === 'success')
                                    {
                                        $("#email_errormsg").css("color","green");
                                        $("#email_errormsg").text("该邮箱可以注册");
                                        state3 = true;
                                    }
                                    // 邮箱已注册 
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
            (function(){
                $("#email_input").blur(validate_email);
            })();

            // 点击“注册”按钮 事件注册
            $("#register_button").click(function(){
                // 再次验证
                $("#username_input").blur();
                $("#password_input").blur();
                $("#email_input").blur();

                // 存在错误
                if(!state1 || !state2 || !state3)
                {
                    alert("请检查输入是否有误!");
                }
                else
                {
                    $.ajax(
                        {
                            type: "post",
                            data: $('#register_form').serialize(), // 传送表单数据
                            url: remoteHost+"/register",
                            success: 
                                function(result){
                                    var res = JSON.parse(result);
                                    // 注册成功
                                    if(res.status === 'success')
                                    {
                                        alert("注册成功,请登录!");
                                        // 得到用户名
                                        var username = $("#username_input").val();
                                        // 跳转到登录页面
                                        $("#login_button").click();
                                        // 自动填充用户名
                                        $("#username_input").val(username);
                                    }
                                    // 注册失败
                                    else
                                    {
                                        alert("注册失败!");
                                    }
                                }
                        });
                }
                return false;   // 禁止默认提交方式
            });
        });  // 点击注册页面，事件绑定结束


         // 单击登录界面，事件绑定
        $("#login_button").click(function(){
            // 切换页面
            changeTo(login_div);
            var state1 = true,
            state2 = true;

            // 验证用户名
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
                    $.ajax(
                        {
                            type: "post",
                            data: { username : username_input.val() },
                            url: remoteHost+"/is_name_valid",
                            success:
                                function(result){
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

            // 绑定验证用户名事件
            (function(){
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
            (function (){
                $("#password_input").blur(validate_password);
            })();


            $("#login_submit_button").click(function(){
                // 激活验证
                $("#username_input").blur();
                $("username_input").blur();
                if(!state1 || !state2)
                {
                    alert("请检查输入是否有误!");
                }
                else
                {
                    $.ajax({
                        type: "post",
                        data: $('#login_form').serialize(),
                        url: remoteHost+"/login",
                        success:
                            function(result){
                                var res = JSON.parse(result);
                                if(res.status === 'success')
                                {
                                    alert("登录成功!");
                                    // 更新状态信息
                                    am_I_online = true;
                                    // 登录/注册 按钮组 隐藏
                                    $("#login_or_register").hide();
                                    // 显示用户管理区块
                                    $("#user_div").css("display","block");
                                    // 长用户名处理，显示前6位加...
                                    if(res.log_username.length > 9)
                                        res.log_username = res.log_username.substr(0,6) + "...";
                                    // 显示用户名
                                    $("#login_username").text(res.log_username);
                                    // 注销按钮解除事件
                                    $("#logout_button").unbind("click");
                                    // 注销按钮重新绑定事件
                                    $("#logout_button").click(function(){
                                        $.ajax(
                                            {
                                                type: "get",
                                                url: remoteHost+"/logout",
                                                success: 
                                                    function(result){
                                                        var res = JSON.parse(result);
                                                        // 注销成功
                                                        if(res.status === 'success')
                                                        {
                                                            alert("注销成功...");
                                                            // 更新状态信息
                                                            am_I_online = false;
                                                            $("#cloud_select").hide();
                                                            // 显示登录或注册按钮组
                                                            $("#login_or_register").show();
                                                            // 显示提示信息
                                                            $("#please_login").css("display","block");
                                                            // 用户管理区块隐藏
                                                            $("#user_div").css("display","none");
                                                        }
                                                        else
                                                        {
                                                            alert("注销失败!");
                                                        }
                                                        // 注销完毕，回到主页
                                                        $("#home_button").click();
                                                    }   
                                            });
                                    });

                                    // 显示主页 登录完毕
                                    $("#home_button").click();

                                }
                                // 登录失败
                                else
                                {
                                    alert("用户名或密码错误!");
                                }
                            },
                        error:
                            function(){
                                alert("网络好像有问题...等下试试吧！");
                            }
                        
                    });
                }
                return false; // 禁止默认点击行为
            });
        });
        
        // 单击主页页面 绑定事件 
        $("#home_button").click(function(){
            save_status = false;
            var prt = $("#right_sidebar");
            prt.empty();
            prt.append('<a class="item" id="please_select_class_first">请首先选择分类</a>');
            $("#please_select_class_first").click(function(){
                $("#choose_class").click();
            });
            
            $("#choose_class").removeClass("disabled");
            $("#choose_id").removeClass("disabled");
            $(".mFind").removeClass("disabled");

            $.ajax(
                {
                    type: "get", 
                    url: remoteHost+"/index",
                    success:
                        function(result){
                            changeTo(home_div);
                            // 云端表格选择按钮组 隐藏
                            // $("#cloud_select").slideUp();
                            // $("#cloud_select").fadeOut();                            
                            var res = JSON.parse(result);
                            if(res.status === 'success')
                            {
                                console.log("在线中...");
                                // 已经在线，可以保存到云端，不需要提示登录
                                $("#save_to_cloud").removeClass("disabled");
                                $("#please_login").css("display","none");
                            }
                            else
                            {
                                console.log("离线中...");
                            }
                            // 舍弃按钮绑定事件
                            $("#discard_button").click(function(){
                                // 返回主页
                                $("#home_button").click();
                            });

                            // 点击保存到云端 绑定事件
                            $("#save_to_cloud").click(function(){
                                // 获取所有的分类信息
                                $.ajax(
                                    {
                                        type: "get",
                                        url: remoteHost+"/get_all_class",
                                        success:
                                            function(result){
                                                var to_send_data = {};
                                                to_send_data['content'] = $(".table_content").html();
                                                // 转到保存页面
                                                changeTo(save_confirm_div);
                                                var res = JSON.parse(result);
                                                // 添加分类目录
                                                var prt = $("#all_class");
                                                $.each(res,function(idx,ele){
                                                    var opt = $("<option></option>");
                                                    opt.text(ele);
                                                    opt.attr("value",ele);
                                                    prt.append(opt);
                                                    console.log("添加了" + ele)
                                                });
                                                // 初始化select元素
                                                $('select.dropdown').dropdown();
                                                // 回车键直接提交
                                                $('input.search').keypress(function(e)
                                                {
                                                    if(e.which == 13)
                                                        $('#confirm_button').click();
                                                });
                                                // console.log($('#table_name_input'));
                                                $('#table_name_input').keypress(function(e)
                                                {
                                                    if(e.which == 13)
                                                        $('#confirm_button').click();
                                                });

                                                // 绑定事件，点击添加新分类按钮
                                                $("#add_new_class_button").click(function(){
                                                        while(true)
                                                        {
                                                            var new_class_name = prompt("请输入新分类的名称:","新分类");
                                                            // 点击取消
                                                            if(new_class_name === null) 
                                                                break;
                                                            // 输入为空
                                                            else if(new_class_name === "")
                                                                alert("分类名不能为空!");
                                                            else
                                                            {
                                                                console.log("新增加的分类名称为" + new_class_name);
                                                                $.ajax(
                                                                    {
                                                                        type: "post",
                                                                        data: '{ "new_class_name" : "' + new_class_name + '" }',
                                                                        url: remoteHost + "/add_new_class",
                                                                        contentType: "application/json;charset=UTF-8",  //json格式
                                                                        success:
                                                                            function(result){
                                                                                var res = JSON.parse(result);
                                                                                // 添加成功后，重新获取所有类名
                                                                                if(res.status === 'success')
                                                                                {
                                                                                    // 提示添加分类成功
                                                                                    alert("添加分类 [ " + new_class_name+" ] 成功!");
                                                                                    $.ajax(
                                                                                        {
                                                                                            type: "get",
                                                                                            url: remoteHost+"/get_all_class",
                                                                                            success: 
                                                                                                function(result){
                                                                                                    var res = JSON.parse(result);
                                                                                                    var prt = $("#all_class");
                                                                                                    // 清空类别选择下拉菜单
                                                                                                    prt.empty();
                                                                                                    $.each(res,function(idx,ele){
                                                                                                        var opt = $("<option></option>");
                                                                                                        opt.text(ele);
                                                                                                        opt.attr("value",ele);
                                                                                                        prt.append(opt);
                                                                                                        console.log("添加了" + ele)
                                                                                                    });
                                                                                                // $('#all_class').dropdown("set selected",new_class_name);
                                                                                                }
                                                                                        });
                                                                                }
                                                                                else if(res.status === 'existed')
                                                                                {
                                                                                    alert("分类[ "+new_class_name+" ]已存在!");
                                                                                }
                                                                                else if(res.status === "failed")
                                                                                {
                                                                                    alert("添加失败!");
                                                                                }
                                                                        }
                                                                    });
                                                                break;
                                                            }
                                                        }
                                                });

                                                // 绑定事件，点击确认保存按钮
                                                $('#confirm_button').click(function(){
                                                    var table_name = $("#table_name_input").val();
                                                    var table_class = $("#all_class").val();
                                                    if(table_name === "")
                                                    {
                                                       alert("请输入表格名字!");
                                                       return false;
                                                    }
                                                    else if(table_class === "")
                                                    {
                                                        alert("请选择表格类别!");
                                                        return false;
                                                    }
                                                    to_send_data['table_name'] = table_name;
                                                    to_send_data['table_class'] = table_class;
                                                    $.ajax(
                                                        {
                                                            type: "post",
                                                            url: remoteHost+"/save_table",
                                                            data: JSON.stringify(to_send_data),
                                                            contentType: 'application/json;charset=UTF-8',
                                                            success: 
                                                                function(result){
                                                                    var res = JSON.parse(result)
                                                                    if(res.status === 'success')
                                                                    {
                                                                        alert("保存成功!");
                                                                    }
                                                                    else
                                                                    {
                                                                        alert("保存失败!");
                                                                    }
                                                                }
                                                        });

                                                    if(save_status)
                                                         $.ajax({type:"post",data: '{"table_id":"' + tableID + '"}', url: remoteHost+"/delete_table_by_id", contentType:"application/json;charset=UTF-8", success:function(result)
                                                                {
                                                                    var res = JSON.parse(result);
                                                                    console.log(res);
                                                                    if(res.status === 'success')
                                                                    {
                                                                        console.log("删除成功");
                                                                    }
                                                                    else
                                                                    {
                                                                        console.log("删除失败...");
                                                                    }
                                                                }
                                                        });

                                                    $("#home_button").click();
                                                    return false;
                                                });


                                                // 取消保存按钮
                                                $("#cancel_button").click(function(){
                                                    $("#home_button").click();
                                                });

                                            }
                                    }); // 点击“保存到云端”的ajax操作结束            
                            // 点击按钮 事件绑定结束
                            });
                        // 点击主页按钮，获得登录状态后
                        // if(am_I_online)
                        //     alert("当前在线");
                        // else
                        //     alert("当前离线");
                        }
                });
        }); // 主页按钮 click事件绑定结束
    };  // init函数结束

    $(function(){
        init();
    });
 })(jQuery);

// ---------------------------------------------------------------------------------
// 与背景页面通信
// ---------------------------------------------------------------------------------
(function communicate($)
{
    // 向标签页发送消息
    function sendCommand(cmd, broadcast, fn) {
        var qry = broadcast ? {} : {active: true, currentWindow: true}; 
        chrome.tabs.query(qry, function(tabs) {
            tabs.forEach(function(tab) {
                chrome.tabs.sendMessage(tab.id, {command: cmd}, fn || function(r) {});
            });
        });
    }

    // 更新按钮状态，与CSS相结合
    var updateState = function(state) {
        if(!state)
        {
            $("#modKey0").addClass("active");
            $("#modKey1").removeClass("active");
            $(".mCopy").addClass("disabled");
            $(".mFind").addClass("disabled");
            return;
        }
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

    // 初始化函数 
    var init = function(state) {
        document.addEventListener("click", function(e) {
            var cmd = e.target.getAttribute("cmd");
            if(!cmd)
                return;
            // 获取点击按钮命令
            console.log(cmd);
            // 更新选项
            sendCommand("updateOptions", true);
            sendCommand(cmd, false, function(state) {
                updateState(state);
                if(e.target.getAttribute("close") == "1")
                {
                    window.close();
                }
            });
        });

        // Mac 处理
        if(navigator.userAgent.indexOf("Macintosh") > 0) {
            $("#modKey0").html("&#8984;");
            $("#modKey1").html("&#8997;");
        }

        updateState(state);
    }

    $(function(){
        // 打开PopUp页

        sendCommand("openPopup", false, init);  // 打开PopUp页
        sendCommand("anySelection",false);  // 检查是否有选区
        // 检查是否在线
        $.ajax(
            {
                type: "get",
                url: remoteHost+"/online",
                success: 
                    function(result) {
                        var res = JSON.parse(result);
                        if(res.status === 'success')
                        {
                            console.log("在线中...");
                            am_I_online = true;
                            // 隐藏登录/注册按钮组
                            $("#login_or_register").hide();
                            // 可以“保存到云端”
                            $("#save_to_cloud").removeClass("disabled");
                            // 隐藏提示登录的消息
                            $("#please_login").css("display","none");
                            // 显示用户管理区块
                            $("#user_div").css("display","block");
                            // 显示登录用户名
                            if(res.log_username.length > 9)
                                res.log_username = res.log_username.substr(0,6) + "...";   
                            $("#login_username").text(res.log_username);

                            // 绑定注销按钮事件
                            var logout_button = $("#logout_button");
                            var obj_e = $._data(logout_button, "events");
                            // 如果没有绑定，则绑定
                            if(!obj_e || !obj_e['click'])
                            {
                                logout_button.click(function(){
                                    $.ajax(
                                        {
                                            type:"get",
                                            url: remoteHost+"/logout",
                                            success:
                                            function(result){
                                                var res = JSON.parse(result);
                                                if(res.status === 'success')
                                                {
                                                    alert("注销成功...");
                                                    am_I_online = false;
                                                    $("#cloud_select").hide();
                                                    $("#login_or_register").show();
                                                    $("#please_login").css("display","block");
                                                    $("#user_div").css("display","none");
                                                }
                                                else
                                                    alert("注销失败!");
                                                $("#home_button").click();
                                            }
                                    });
                                });
                            }
                        }
                        else
                        {
                            console.log("离线中...");
                            $("#please_login").css("display","block");
                            $("#user_div").css("display","none");
                        }
                    }
        
            });


            // 触发主页，绑定按钮事件

            (function(){
                    save_status = false;
                    $.ajax({type:"get",url:remoteHost+"/index",success:function(result)
                    {
                        $("#cloud_select").fadeOut();
                        var res = JSON.parse(result);
                        if(res.status === 'success')
                        {
                            console.log("在线中...");
                            $("#save_to_cloud").removeClass("disabled");
                            $("#please_login").css("display","none");
                        }
                        else
                        {
                            console.log("离线中...");
                        }
                        $("#discard_button").click(function(){
                            $("#home_button").click();
                        });
                        // 点击保存到云端后
                        $("#save_to_cloud").click(function(){
                            // 获取分类信息
                            $.ajax({type:"get",url:remoteHost+"/get_all_class",success:function(result)
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
                                    console.log("添加了" + ele)
                                });
                                $('select.dropdown').dropdown();
                                $('input.search').keypress(function(e)
                                {
                                    if(e.which == 13)
                                    {
                                            $('#confirm_button').click();
                                    }
                                });
                                $('#table_name_input').keypress(function(e)
                                {
                                    if(e.which == 13)
                                        $('#confirm_button').click();
                                });
                                // 增加新分类按钮
                                // console.log("绑定开始");
                                $("#add_new_class_button").click(function(){
                                    while(true)
                                    {
                                        var new_class_name = prompt("请输入新分类的名称:","新分类");
                                        if(new_class_name === null) break;
                                        if(new_class_name === "")
                                        {
                                            alert("分类名不能为空!");
                                        }
                                        else
                                        {
                                            console.log("新增加的分类名称为" + new_class_name);
                                            $.ajax({type:"post",data:'{"new_class_name":"' + new_class_name + '"}', url:remoteHost+"/add_new_class", contentType:"application/json;charset=UTF-8", success:function(result)
                                            {
                                                var res = JSON.parse(result);
                                                if(res.status === 'success')
                                                {
                                                    alert("添加分类 [ " + new_class_name+" ] 成功!");
                                                    $.ajax({type:"get",url:remoteHost+"/get_all_class",success:function(result)
                                                    {
                                                        var res = JSON.parse(result);
                                                        var prt = $("#all_class");
                                                        prt.empty();
                                                        $.each(res,function(idx,ele){
                                                            var opt = $("<option></option>");
                                                            opt.text(ele);
                                                            opt.attr("value",ele);
                                                            prt.append(opt);
                                                            console.log("添加了" + ele)
                                                        });
                                                        // $('#all_class').dropdown("set selected",new_class_name);
                                                    }});
                                                }
                                                else if(res.status === 'existed')
                                                {
                                                    alert("分类[ "+new_class_name+" ]已存在!");
                                                }
                                                else if(res.status === "failed")
                                                {
                                                    alert("添加失败!");
                                                }
                                            }
                                            });
                                            break;
                                        }
                                    }
                                });
                                // console.log("绑定结束");

                                // 确认按钮 开始绑定事件
                                $('#confirm_button').click(function(){
                                    var table_name = $("#table_name_input").val();
                                    var table_class = $("#all_class").val();
                                    if(table_name === "")
                                    {
                                        alert("请输入表格名字!");
                                        return false;
                                    }
                                    else if(table_class === "")
                                    {
                                        alert("请选择表格类别!");
                                        return false;
                                    }

                                    to_send_data['table_name'] = table_name;
                                    to_send_data['table_class'] = table_class;
                                    $.ajax({type:"post", url:remoteHost+"/save_table", data:JSON.stringify(to_send_data), contentType:'application/json;charset=UTF-8', success:function(result){
                                        var res = JSON.parse(result)
                                        if(res.status === 'success')
                                        {
                                            alert("保存成功!");
                                        }
                                        else
                                        {
                                            alert("保存失败!");
                                        }
                                        }
                                    });

                                    if(save_status)
                                        $.ajax({type:"post",data: '{"table_id":"' + tableID + '"}', url: remoteHost+"/delete_table_by_id", contentType:"application/json;charset=UTF-8", success:function(result)
                                            {
                                                var res = JSON.parse(result);
                                                console.log(res);
                                                if(res.status === 'success')
                                                {
                                                    console.log("删除成功");
                                                }
                                                else
                                                {
                                                    console.log("删除失败...");
                                                }
                                            }
                                    });
                                    // 保存完表格，回到预览主页
                                    $("#home_button").click();
                                    return false;
                                });
                                
                                // 取消保存 按钮
                                $("#cancel_button").click(function(){
                                    $("#home_button").click();
                                });
                            }
                            });
                        });
                            // if(am_I_online)
                            //     alert("当前在线");
                            // else
                            //     alert("当前离线");
                    }
                    });
            })();
    
            
            // 点击云表格按钮
            $(".cloud_button").click(function(){
                $("#home_button").click();
                $("#cloud_select").fadeIn();
                
                $.ajax({type:"get", url:remoteHost+"/get_all_class", success:function(result)
                {
                    var res = JSON.parse(result);
                    // alert("更新分类信息");
                    console.log(res);
                    // 左侧类别
                    var prt = $("#left_sidebar");
                    var no_item = true;
                    prt.empty();
                    if(res.length)
                    {
                        no_item = false;
                    }
                    else
                    {
                        prt.append('<a class="item" id="no_class_item">当前没有类别</a>');
                        no_item = true;
                    }
                    // 添加类别
                    $.each(res,function(idx,ele){
                        var opt = $("<a class='item'></a>");
                        opt.text(ele);
                        opt.attr("class_name",ele);
                        opt.append("<img class='remove_button' src='images/remove.png'  height='20px' style='float:right; margin-right:10px;'/>")
                        prt.append(opt);
                        console.log("添加了类别" + ele);
                    });


                    $("#left_sidebar a .remove_button").click(function(e){
                        var class_name = $(this.parentNode).attr("class_name");
                        
                        var con = confirm("您确定要删除分类 [ " + class_name + " ] 吗？（注意！该分类下的所有表格都将被删除）");
                        if(con)
                        {
                            $.ajax({type:"post",data: '{"class_name":"' + class_name + '"}', url: remoteHost+"/delete_class_name", contentType:"application/json;charset=UTF-8", success:function(result)
                            {
                                var res = JSON.parse(result);
                                console.log(res);
                                if(res.status === 'success')
                                {
                                    alert("删除成功!");
                                    $("#home_button").click();
                                }
                                else
                                {
                                    alert("删除失败!");
                                }
                            }
                            });
                        }
                        e.stopPropagation();
                        
                    });

                    if(!no_item)
                    // 添加超链接事件
                    $("#left_sidebar a").click(function()
                    {
                        var class_name = $(this).attr("class_name");
                        // 获取该类别所有的表格
                        $.ajax({type:"get", url: remoteHost+"/get_all_table?class_name=" + class_name ,success:function(result)
                        {
                            var tbls = JSON.parse(result);
                            var prt = $("#right_sidebar");
                            prt.empty();
                            // 每个表格都有一个table_id
                            $.each(tbls,function(idx,ele)
                            {
                                var opt = $("<a class='item'></a>");
                                opt.text(ele[0]);
                                opt.attr("table_id",ele[1]);
                                prt.append(opt);
                                console.log("添加了表格" + ele);
                            });

                            $("#right_sidebar a").click(function(){
                            	
                                var tbl_id = $(this).attr("table_id");
                                $.ajax({type:"post",data: '{"table_id":"' + tbl_id + '"}', url: remoteHost+"/get_table_by_id", contentType:"application/json;charset=UTF-8", success:function(result)
                                    {
                                        var res = JSON.parse(result);
                                        console.log(res);
                                        if(res.status === 'success')
                                        {
                                            updateTablePreview(res.content,true,tbl_id);
                                            updateLang();
                                            makeTableEditable();
                                        }
                                        else
                                        {
                                            console.log("获取表格信息失败...");
                                        }
                                    }
                                });
                                $("#right_sidebar").sidebar('setting', 'transition', 'overlay').sidebar('toggle');
                            });
                            // $("left_sidebar").sidebar('toggle');
                            // 选择表格
                            $("#choose_id").click();
                        }
                        });
                    }
                    );
                    // no class item
                    else
                    {
                        $("#no_class_item").unbind("click");
                        $("#no_class_item").click(
                            function()
                            {
                                $("#left_sidebar").sidebar('setting', 'transition', 'overlay').sidebar('toggle');
                            }
                        )
                    }

                }
                });
            });



            $("#please_select_class_first").click(function(){
                $("#choose_class").click();
            });

            // start 为云表格选取按钮绑定事件

            $("#choose_class").click(function(){
            	updateLang();
                $("#left_sidebar").sidebar('setting', 'transition', 'overlay').sidebar('toggle');
                // $(".cloud_button").click();
            });
            $("#choose_id").click(function(){
                $("#right_sidebar").sidebar('setting', 'transition', 'overlay').sidebar('toggle');
            });

            // 开始 *************************************************
            $(".info_button").click(function(){
                // alert("点击个人信息...");
                changeTo(person_info_div);


                var set_obj_un = $("#username_info");
                var set_obj_ava = $("#user_avatar");
                var set_obj_emi = $("#email");
                var set_obj_pn = $("#person_net");
                var set_obj_intr = $("#intro");
                var input_ava_url = $("#avatar_url");

                
                $("#choose_class").addClass("disabled");
                $("#choose_id").addClass("disabled");
                $(".mFind").addClass("disabled");
                $(".mCopy").addClass("disabled");


                $("#info_cancel_button").click(function(){
                    $("#home_button").click();
                    return false;
                });

                $("#info_confirm_button").click(function(e){
                    e.preventDefault();
                    var info_dict = {};

                    info_dict['ava_url'] = input_ava_url.val();
                    if(($.trim(input_ava_url.val())).length > 0)
                        info_dict['ava_url'] = input_ava_url.val();
                    else
                        info_dict['ava_url'] = set_obj_ava.attr("src");
                    
                    if(($.trim(set_obj_pn.val())).length > 0)
                        info_dict['person_net'] = set_obj_pn.val();
                    else
                        info_dict['person_net'] = '无';
                    
                    if(($.trim(set_obj_intr.val())).length > 0)
                        info_dict['intro'] = set_obj_intr.val();
                    else
                        info_dict['intro'] = '无';
                    
                    console.log(info_dict);
                    $.ajax(
                            {
                                type: "post",
                                url: remoteHost+"/save_info",
                                data: JSON.stringify(info_dict),
                                contentType: 'application/json;charset=UTF-8',
                                success: 
                                    function(result){
                                        var res = JSON.parse(result)
                                        if(res.status === 'success')
                                        {
                                            alert("修改成功!");
                                        }
                                        else
                                        {
                                            alert("修改失败!");
                                        }
                                        $("#home_button").click();
                                    }
                            });

                    return false;
                });


                $.ajax(
                        {
                            type: "get",
                            url: remoteHost+"/get_info",
                            success: 
                                function(result){
                                    var res = JSON.parse(result);
                                    if(res.status === 'success')
                                    {
                                       
                                        // alert("获取个人信息成功...");
                                        var un = res.username,
                                            ava = res.ava_url,
                                            emi = res.email,
                                            pn = res.person_net,
                                            intr = res.intro;
                                        set_obj_un.text(un);
                                        set_obj_ava.attr('src',ava);
                                        set_obj_emi.val(emi);
                                        if(pn !== '无') set_obj_pn.val(pn);
                                        if(intr !== '无')set_obj_intr.val(intr);
                                        
                                        var ava_dom =set_obj_ava[0];
                                        ava_dom.onerror = function(){
                                            // alert("Hello");
                                            this.src="images/default_avatar.png";
                                            set_obj_ava.show();
                                            this.onerror = null;
                                        }

                                        set_obj_ava.show();
                                    }
                                    else
                                    {
                                        alert("获取个人信息失败!");
                                        console.log(res);
                                    }
                                }   
                        });
                
            });

            // 云广场
            $(".cloud_square").click(function(){
                console.log("进入云广场");
                changeTo(cloud_square_div);
                
                $("#choose_class").addClass("disabled");
                $("#choose_id").addClass("disabled");
                $(".mFind").addClass("disabled");
                $(".mCopy").addClass("disabled");

                // 解析时间戳
                function formatDate(now)
                {     
                    var year=now.getYear();     
                    var month=now.getMonth()+1;     
                    var date=now.getDate();     
                    var hour=now.getHours();     
                    var minute=now.getMinutes();     
                    var second=now.getSeconds();     
                    return year+"-"+month+"-"+date+"   "+hour+":"+minute+":"+second;     
                }     


                function processTime(ts)
                {
                    var res;
                    var now = Date.parse(new Date()) / 1000;
                    var diff = now - ts;
                    if(diff < 60)
                    {
                        res = diff + " 秒以前";
                    }
                    else if(diff < 3600)
                    {
                        res = parseInt(diff / 60) + " 分钟以前";
                    }
                    else if(diff < 3600 * 24)
                    {
                        res = parseInt(diff / 3600) + "小时以前";
                    }
                    else if(diff < 3600 * 24 * 7)
                    {
                        res = parseInt(diff / ( 3600 * 24 )) + "天以前";
                    }
                    else
                    {
                        res = formatDate(ts);
                    }
                    return res;
                }
                $.ajax(
                {
                    type: "get",
                    url: remoteHost+"/get_all_share",
                    success: 
                        function(result){
                            var res = JSON.parse(result);
                            // 注销成功
                            if(res.status === 'success')
                            {
                                console.log("获取动态成功");
                                console.log(res);
                                var items = res.content;
                                console.log(items);
                               
                                
                                var prt = $(".share_feed_div");
                                if(items.length == 0)
                                {
                                    prt.append('<h2 style="margin-left:20px; line-height:180px;">还没有人分享过表格呢，快来分享吧!</h2>')
                                }
                                else
                                {
                                    prt.empty();
                                    $.each(items,function(idx,ele){
                                        var evt = $(share_event);
                                        var username = evt.find("#user");
                                        var table = evt.find("#table");
                                        var date = evt.find(".date");
                                        var ava = evt.find("#ava"); 
                                        var com = evt.find("#comm");


                                        var username_v = ele[0];
                                        var table_v = ele[2];
                                        var date_v = ele[1];
                                        var comm = ele[3];


                                        username.text(username_v);
                                        com.text(comm);
                                        $.ajax({type:"post",data: '{"table_id":"' + table_v + '"}', url: remoteHost+"/get_table_name", contentType:"application/json;charset=UTF-8", success:function(result)
                                            {
                                                var res = JSON.parse(result);
                                                console.log(res);
                                                if(res.status === 'success')
                                                {
                                                    console.log("获取成功!");
                                                    table.text(res.name);
                                                    table.attr("table_id",table_v);
                                                }
                                                else
                                                {
                                                    console.log("获取失败!!");
                                                }
                                            }
                                        });

                                        $.ajax({type:"get", url: remoteHost+"/get_avatar_url?username="+username_v, success:function(result)
                                            {
                                                var res = JSON.parse(result);
                                                console.log(res);
                                                if(res.status === 'success')
                                                {
                                                    console.log("头像获取成功!");
                                                    ava.attr("src",res.url);
                                                }
                                                else
                                                {
                                                    console.log("头像获取失败!");
                                                }
                                        }}
                                        );

                                        date.text(processTime(date_v));    
                                        prt.append(evt);
                                        table.click(function(){
                                            var tbl_id = $(this).attr("table_id");
                                            $.ajax({type:"post",data: '{"table_id":"' + tbl_id + '"}', url: remoteHost+"/get_table_by_id", contentType:"application/json;charset=UTF-8", success:function(result)
                                            {   
                                                var res = JSON.parse(result);
                                                console.log(res);
                                                if(res.status === 'success')
                                                {
                                                    main.html(empty_div);
                                                    $(".table_content").html(res.content);
                                                    makeTableEditable();
                                                    $("#save_to_cloud").click(function(){
                                                        // 获取所有的分类信息
                                                        $.ajax(
                                                            {
                                                                type: "get",
                                                                url: remoteHost+"/get_all_class",
                                                                success:
                                                                    function(result){
                                                                        var to_send_data = {};
                                                                        to_send_data['content'] = $(".table_content").html();
                                                                        // 转到保存页面
                                                                        changeTo(save_confirm_div);
                                                                        var res = JSON.parse(result);
                                                                        // 添加分类目录
                                                                        var prt = $("#all_class");
                                                                        $.each(res,function(idx,ele){
                                                                            var opt = $("<option></option>");
                                                                            opt.text(ele);
                                                                            opt.attr("value",ele);
                                                                            prt.append(opt);
                                                                            console.log("添加了" + ele)
                                                                        });
                                                                        // 初始化select元素
                                                                        $('select.dropdown').dropdown();
                                                                        // 回车键直接提交
                                                                        $('input.search').keypress(function(e)
                                                                        {
                                                                            if(e.which == 13)
                                                                                $('#confirm_button').click();
                                                                        });
                                                                        $('#table_name_input').keypress(function(e)
                                                                        {
                                                                            if(e.which == 13)
                                                                                $('#confirm_button').click();
                                                                        });
                                                                        // 绑定事件，点击添加新分类按钮
                                                                        $("#add_new_class_button").click(function(){
                                                                                while(true)
                                                                                {
                                                                                    var new_class_name = prompt("请输入新分类的名称:","新分类");
                                                                                    // 点击取消
                                                                                    if(new_class_name === null) 
                                                                                        break;
                                                                                    // 输入为空
                                                                                    else if(new_class_name === "")
                                                                                        alert("分类名不能为空!");
                                                                                    else
                                                                                    {
                                                                                        console.log("新增加的分类名称为" + new_class_name);
                                                                                        $.ajax(
                                                                                            {
                                                                                                type: "post",
                                                                                                data: '{ "new_class_name" : "' + new_class_name + '" }',
                                                                                                url: remoteHost + "/add_new_class",
                                                                                                contentType: "application/json;charset=UTF-8",  //json格式
                                                                                                success:
                                                                                                    function(result){
                                                                                                        var res = JSON.parse(result);
                                                                                                        // 添加成功后，重新获取所有类名
                                                                                                        if(res.status === 'success')
                                                                                                        {
                                                                                                            // 提示添加分类成功
                                                                                                            alert("添加分类 [ " + new_class_name+" ] 成功!");
                                                                                                            $.ajax(
                                                                                                                {
                                                                                                                    type: "get",
                                                                                                                    url: remoteHost+"/get_all_class",
                                                                                                                    success: 
                                                                                                                        function(result){
                                                                                                                            var res = JSON.parse(result);
                                                                                                                            var prt = $("#all_class");
                                                                                                                            // 清空类别选择下拉菜单
                                                                                                                            prt.empty();
                                                                                                                            $.each(res,function(idx,ele){
                                                                                                                                var opt = $("<option></option>");
                                                                                                                                opt.text(ele);
                                                                                                                                opt.attr("value",ele);
                                                                                                                                prt.append(opt);
                                                                                                                                console.log("添加了" + ele)
                                                                                                                            });
                                                                                                                        // $('#all_class').dropdown("set selected",new_class_name);
                                                                                                                        }
                                                                                                                });
                                                                                                        }
                                                                                                        else if(res.status === 'existed')
                                                                                                        {
                                                                                                            alert("分类[ "+new_class_name+" ]已存在!");
                                                                                                        }
                                                                                                        else if(res.status === "failed")
                                                                                                        {
                                                                                                            alert("添加失败!");
                                                                                                        }
                                                                                                }
                                                                                            });
                                                                                        break;
                                                                                    }
                                                                                }
                                                                        });

                                                                        // 绑定事件，点击确认保存按钮
                                                                        $('#confirm_button').click(function(){
                                                                            var table_name = $("#table_name_input").val();
                                                                            var table_class = $("#all_class").val();
                                                                            if(table_name === "")
                                                                            {
                                                                            alert("请输入表格名字!");
                                                                            return false;
                                                                            }
                                                                            else if(table_class === "")
                                                                            {
                                                                                alert("请选择表格类别!");
                                                                                return false;
                                                                            }
                                                                            to_send_data['table_name'] = table_name;
                                                                            to_send_data['table_class'] = table_class;
                                                                            $.ajax(
                                                                                {
                                                                                    type: "post",
                                                                                    url: remoteHost+"/save_table",
                                                                                    data: JSON.stringify(to_send_data),
                                                                                    contentType: 'application/json;charset=UTF-8',
                                                                                    success: 
                                                                                        function(result){
                                                                                            var res = JSON.parse(result)
                                                                                            if(res.status === 'success')
                                                                                            {
                                                                                                alert("保存成功!");
                                                                                            }
                                                                                            else
                                                                                            {
                                                                                                alert("保存失败!");
                                                                                            }
                                                                                        }
                                                                                });

                                                                            if(save_status)
                                                                                $.ajax({type:"post",data: '{"table_id":"' + tableID + '"}', url: remoteHost+"/delete_table_by_id", contentType:"application/json;charset=UTF-8", success:function(result)
                                                                                        {
                                                                                            var res = JSON.parse(result);
                                                                                            console.log(res);
                                                                                            if(res.status === 'success')
                                                                                            {
                                                                                                console.log("删除成功");
                                                                                            }
                                                                                            else
                                                                                            {
                                                                                                console.log("删除失败...");
                                                                                            }
                                                                                        }
                                                                                });

                                                                            $("#home_button").click();
                                                                            return false;
                                                                        });


                                                                        // 取消保存按钮
                                                                        $("#cancel_button").click(function(){
                                                                            $("#home_button").click();
                                                                        });

                                                                    }
                                                            }); // 点击“保存到云端”的ajax操作结束            
                                                    // 点击按钮 事件绑定结束
                                            });

                                              // 舍弃按钮绑定事件
                                                $("#discard_button").click(function(){
                                                    // 返回主页
                                                    $("#home_button").click();
                                                });
                                                    console.log(res);
                                                    // alert("成功");
                                                }
                                                else
                                                {
                                                    // alert("失败");
                                                }
                                            }
                                            });
                                        });
                                    });
                                }
                            }
                            else
                            {
                                console.log("获取动态失败");
                            }
                        }   
                });
            });
    });
})(jQuery);



var updateLang = function(lang)
{
    if(typeof(lang) !== "undefined")
        cur_lang = lang;
    console.log("当前语言" + cur_lang);
    switch(cur_lang)
    {
        case 0:
            setLang0();
            break;
        case 1:
            setLang1();
            break;
    }
}


// 更换语言为英语
var setLang0 = function()
{
    console.log("语言更换为英语");
    $("#previous_text").text("Prev");
    $("#next_text").text("Next");
    $(".or").attr("data-text","OR");
    $("#copy_text").text("Copy");
    $("#complete_table_text").text("Please Complete Table Info:");
    $("#input_the_cate_text").text("Type In Category ... ");
    $("#current_selected_table_text").text("Currently Selected Table:");
    $("#no_table_selected_text").text("No Table Selected");
    $("#save_to_cloud").text("Save");
    $("#add_new_class_button").text("Add New Class");
    $("#confirm_button").text("Submit");
    $("#cancel_button").text("Cancel");
    $("#plz_log_in_text").text("Please Log In!");
    $("#table_name_text").text("Table Name:");
    $("#table_context_text").text("Table Context:");
    $("#discard_button").text("Return");
    $("#sign_up_text").text("Sign Up");
    $("#after_sign_up_text ").text("You can save your tables after signing up!");
    $("#username_input").attr("placeholder","Please Type In Your Username.");
    $("#user_name_text").text("Username:");
    $("#password_text").text("Password:");
    $("#password_input").attr("placeholder","Please Type In Your Password.");
    $("#email_text").text("Email:");
    $("#email_input").attr("placeholder","Please Type In Your Email.");
    $("#register_button").text("Sign Up");
    $("#reset_text").text("Reset");
    $("#user_log_in_text").text("Log In");
    $("#no_account_text").text("If you don't have an account before, please sign up first.");
    $("#login_submit_button").text("Log In");
    $("#denglu_text").text("Log In");
    $("#avatar_url").attr("placeholder","Url Of The Image");
    $("#email").attr("placeholder","Please Type In Your Email.");
    $("#person_net").attr("placeholder","Please Type In Your Personal Net.");
    $("#intro").attr("placeholder","Please Introduce Yourself.");
    $("#personal_net_text").text("Personal Net:");
    $("#introduction_text").text("Introduction:");
    $("#info_confirm_button").text("Submit");
    $("#info_cancel_button").text("Cancel");
    $("#shared_tables_text").text("Share Center");
    $("#cloud_save").text("Save");
    $("#cloud_save_as").text("Save as");
    $("#cloud_reset").text("Reset");
    $("#cloud_delete").text("Delete");
    $("#share_text").text("Share");
    $("#please_select_class_first").text("Plese Select A Category First!");
    $("#no_class_item").text("There is no category!");
    $("#text_text").text("Text");
    $("#puretext_text").text("Pure Text");
    $("#richtext_text").text("Rich Text");
    $("#simplehtml_text").text("Simple HTLM");
    $("#otherformat_text").text("Other Formats");
    $("#hotkey_text").text("Hot Key");
    $("#language_text").text("Language");
    $("#langKey0").text("English");
    $("#langKey1").text("Chinese");
    $("#skin_text").text("Skin");
    $("#skin0_text").text("Blank");
    $("#skin1_text").text("Skin1");
    $("#skin2_text").text("Skin2");
    $("#skin3_text").text("Skin3");
    $("#saved_tables_text").text("Saved Tables");
    $("#information_text").text("Information");
    $("#sign_out_text").text("Sign Out");
    $("#select_category_text").text("Category");
    $("#select_table_text").text("　Table　"); 
    $("#be_classified_in_text").text("Category:"); 
    $("#zhuce_text").text("Sign Up");
    $("#share_center_text").text("Share Center");
}

// 更换语言为汉语
var setLang1 = function()
{
    console.log("汉语");
    $("#previous_text").text("上一张");
    $("#next_text").text("下一张");
    $(".or").attr("data-text","或");
    $("#copy_text").text("拷贝");
    $("#complete_table_text").text("请完善表格信息");
    $("#input_the_cate_text").text("输入分类");
    $("#current_selected_table_text").text("当前选定表格：");
    $("#no_table_selected_text").text("当前未选中表格");
    $("#save_to_cloud").text("保存");
    $("#add_new_class_button").text("新增一个类");
    $("#confirm_button").text("确定");
    $("#cancel_button").text("取消");
    $("#plz_log_in_text").text("请登录以便在云端同步您的表格数据!");
    $("#table_name_text").text("表格名称:");
    $("#table_context_text").text("表格内容：");
    $("#discard_button").text("返回");
    $("#sign_up_text").text("用户注册");
    $("#after_sign_up_text ").text("注册后，您就可以将表格保存到云端！");
    $("#username_input").attr("placeholder","请输入用户名");
    $("#user_name_text").text("用户名：");
    $("#password_text").text("密码：");
    $("#password_input").attr("placeholder","请输入密码");
    $("#email_text").text("电子邮箱：");
    $("#email_input").attr("placeholder","请输入email");
    $("#register_button").text("注册");
    $("#reset_text").text("重置");
    $("#user_log_in_text").text("用户登录");
    $("#no_account_text").text("还没有账号？请先注册用户");
    $("#login_submit_button").text("登录");
    $("#denglu_text").text("登录");
    $("#avatar_url").attr("placeholder","请输入个性化头像的url");
    $("#email").attr("placeholder","请输入email");
    $("#person_net").attr("placeholder","请输入个人网址");
    $("#intro").attr("placeholder","快介绍一下自己吧~");
    $("#personal_net_text").text("个人网址：");
    $("#introduction_text").text("简介：");
    $("#info_confirm_button").text("确定");
    $("#info_cancel_button").text("取消");
    $("#shared_tables_text").text("动态广场");
    $("#cloud_save").text("保存");
    $("#cloud_save_as").text("另存为");
    $("#cloud_reset").text("恢复");
    $("#cloud_delete").text("删除");
    $("#share_text").text("分享...");
    $("#please_select_class_first").text("请首先选择分类");
    $("#no_class_item").text("当前没有类别");
    $("#text_text").text("文本");
    $("#puretext_text").text("纯文本");
    $("#richtext_text").text("富文本");
    $("#simplehtml_text").text("简单HTML");
    $("#otherformat_text").text("其他格式");
    $("#hotkey_text").text("热键");
    $("#language_text").text("语言");
    $("#langKey0").text("英文");
    $("#langKey1").text("中文");
    $("#skin_text").text("皮肤");
    $("#skin0_text").text("无皮肤");
    $("#skin1_text").text("皮肤1");
    $("#skin2_text").text("皮肤2");
    $("#skin3_text").text("皮肤3");
    $("#saved_tables_text").text("云表格");
    $("#information_text").text("信息");
    $("#sign_out_text").text("注销");
    $("#select_category_text").text("选择分类");
    $("#select_table_text").text("选择表格"); 
    $("#be_classified_in_text").text("分类于:"); 
    $("#zhuce_text").text("注册");
    $("#share_center_text").text("云广场");
}

// 
var changeSkin = function(skinID)
{
    console.log("换肤" + skinID);
    var skinPath = "skins/skin"+skinID+".css";
    var theme = $("#theme");
    theme.attr("href",skinPath);
} 

// 更新表格预览
var updateTablePreview = function(tableContent,on_cloud,tbl_id)
{
    // console.log("UPDATE TABLE PREVIEW");
    // console.log(tableContent);
    if(!on_cloud)
    {
        $("#cloud_table_button").hide();
        $("#table_button").show();
    }
    else
    {
        if($("#cloud_table_button").length)
        {
            $("#table_button").hide();
            $("#cloud_table_button").show();
        }
        else
        {
            $("#table_button").hide();
            $("#table_button").after($(cloud_save_buttons));
            $("#cloud_table_button").show();
        }

        $("#cloud_save").unbind("click");
        $("#cloud_save").click(function()
            {
                save_status = true;
                tableID = tbl_id;
                $("#save_to_cloud").click();
            }
        );
        $("#cloud_save_as").unbind("click");
        $("#cloud_save_as").click(function()
            {
                $("#save_to_cloud").click();
                return false;
            }
        );

        $("#cloud_reset").unbind("click");
        console.log("点击" + tableContent);
        $("#cloud_reset").click(function()
        {
            console.log(tableContent);
            alert("恢复");
            $(".table_content").html(tableContent);
            return false;
        });

        $("#cloud_delete").unbind("click");
        $("#cloud_delete").click(function(){
            var con = confirm("您确定要删除这张表格吗?");
            if(con)
            {
                    $.ajax({type:"post",data: '{"table_id":"' + tbl_id + '"}', url: remoteHost+"/delete_table_by_id", contentType:"application/json;charset=UTF-8", success:function(result)
                        {
                            var res = JSON.parse(result);
                            console.log(res);
                            if(res.status === 'success')
                            {
                                alert("删除成功!");
                                $("#home_button").click();
                            }
                            else
                            {
                                alert("删除失败!");
                            }
                        }
                });
            }
            
        });

        $(".cloud_share_button").unbind("click");
        $(".cloud_share_button").click(function(e){
            var share_detail = {}
            share_detail['tbl_id'] = tbl_id;
            share_detail['time'] = Date.parse(new Date())/1000;
            share_detail['comment'] = prompt("说点什么吧~","赞爆了!!");
            if($.trim(share_detail['comment']).length == 0)
            {
                share_detail['comment'] = "不想和你说话...";
            }

            $.ajax(
                {
                    type: "post",
                    url: remoteHost+"/new_share",
                    data: JSON.stringify(share_detail),
                    contentType: 'application/json;charset=UTF-8',
                    success: 
                        function(result){
                            var res = JSON.parse(result)
                            if(res.status === 'success')
                            {
                                alert("分享成功!");
                            }
                            else
                            {
                                alert("分享失败!");
                            }
                            $("#home_button").click();
                        }
                });
            
        });        
    }

    $(".table_content").html(tableContent);
}

// 使表格可编辑
var makeTableEditable = function()
{
    var tbl = document.getElementsByTagName("table");
    if(tbl) 
        tbl[0].contentEditable = true;
}