// ---------------------------------------------------------------------------------
// 全局状态变量
// ---------------------------------------------------------------------------------

// 当前用户是否在线?
var am_I_online = false;
// 远程云服务器地址
var remoteHost = "http://123.206.84.93:5000";
// main元素
var main = $("#main");

// 切换页面到target_div
function changeTo(target_div)
{
    main.transition('fade down');   // 切换特效 消失
    main.html(target_div);  // 改变html
    main.transition('fade up'); // 切换特效 出现
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
            <i class="plug icon"></i>   <div class="content">请完善表格信息 </div>
       </h3>

        <div class="ui form" style="margin-left: 200px; margin-top: 40px;">
            <div class="seven wide required field">
                <label>表格名称:</label>    <input type="text" id="table_name_input">
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
// 主页
    home_div = `
        <div id="main_header">
            <div id="please_login" class="float_right" style="margin-right: 20px;">
                <h3 class="ui teal header">
                    <i class="warning circle icon"></i>     <div class="content">请登录以便在云端同步您的表格数据!</div>
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
                        <i class="info big circle icon blue"></i>   当前未选中表格
                    </h3>
                </div>
                <div id="table_button" style="display: none;">
                    <button class="ui primary button disabled" id="save_to_cloud">保存到云端... </button>
                    <button class="ui button" style="margin-left: 50px;" id="discard_button">放弃 </button>
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
            <div class="content">用户注册
                <div class="sub header">注册后，您就可以将表格保存到云端！</div>
            </div>
        </h3>
        
        <div class="ui divider"></div>

        <form class="ui form" style="width: 300px; margin: auto;" id="register_form">
            <!-- 用户名 必需 -->
            <div class="required field">
                <label>用户名：<span id="username_errormsg" style='float:right'></span> </label>
                <input type="text" name="username" placeholder="请输入用户名" id="username_input">
            </div>

            <!-- 密码 必需 -->
            <div class="required field">
                <label>密码：<span id="password_errormsg" style='float:right'></span></label>
                <input type="password" name="password" placeholder="请输入密码" id="password_input">
            </div>
            
            <!-- 电子邮箱 必需 -->
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
            <div class="content">用户登录
                <div class="sub header">还没有账号？请先注册用户</div>
            </div>
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
                        url: "http://123.206.84.93:5000/login",
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
                            }
                    });
                }
                return false; // 禁止默认点击行为
            });
        });
        
        // 单击主页页面 绑定事件 
        $("#home_button").click(function(){
            $.ajax(
                {
                    type: "get", 
                    url: remoteHost+"/index",
                    success:
                        function(result){
                            changeTo(home_div);
                            // 云端表格选择按钮组 隐藏
                            // $("#cloud_select").slideUp();
                            $("#cloud_select").fadeOut();                            
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
                                                                    $("#home_button").click();
                                                                }
                                                        });
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
                                        // 保存完表格，回到预览主页
                                        $("#home_button").click();
                                        }
                                    });
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
                $("#cloud_select").fadeIn();
                $.ajax({type:"get", url:remoteHost+"/get_all_class", success:function(result)
                {
                    var res = JSON.parse(result);
                    // 左侧类别
                    var prt = $("#left_sidebar");
                    prt.empty();
                    // 添加类别
                    $.each(res,function(idx,ele){
                        var opt = $("<a class='item'></a>");
                        opt.text(ele);
                        opt.attr("class_name",ele);
                        prt.append(opt);
                        console.log("添加了类别" + ele);
                    });
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
                                            updateTablePreview(res.content);
                                            makeTableEditable();
                                        }
                                        else
                                        {
                                            console.log("获取表格信息失败...");
                                        }
                                    }
                                });
                                $("#right_sidebar").sidebar('toggle');
                            });
                            // $("left_sidebar").sidebar('toggle');
                            // 选择表格
                            $("#choose_id").click();
                        }
                        });
                    }
                    );

                }
                });
            });

            $("#please_select_class_first").click(function(){
                $("#choose_class").click();
            });

            // start 为云表格选取按钮绑定事件

            $("#choose_class").click(function(){
                $("#left_sidebar").sidebar('toggle');
            });
            $("#choose_id").click(function(){
                $("#right_sidebar").sidebar('toggle');
            });
    });
})(jQuery);

// 更新表格预览
var updateTablePreview = function(tableContent)
{
    $("#table_button").show();
    $(".table_content").html(tableContent);
}

// 使表格可编辑
var makeTableEditable = function()
{
    var tbl = document.getElementsByTagName("table");
    if(tbl) 
        tbl[0].contentEditable = true;
}