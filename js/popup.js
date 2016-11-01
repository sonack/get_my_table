 
// UI相关
 (function($)
 {

    
    //  main home index html
    var home_div = ` <div id="home_div">
           <h3 class="ui teal header">
         <i class="warning circle icon"></i>
         <div class="content">请登录以便在云端同步您的表格数据!
         </div>
       </h3>
         <div class="currentTable">
           <h3 class="prompt">当前未选中表格</h3>
         </div>
   </div>`,

   signup_div = `
        <!-- 注册页面 开始-->
       <div id="signup_div">
       <h3 class="ui blue header" style="margin-left: 10%;">
         <i class="add square icon"></i>
         <div class="content">用户注册<div class="sub header">注册后，您就可以将表格保存到云端！</div></div>
       </h3>
      
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

    function main_switch()
    {

    }



    


    $(function(){
        init();
    });
 })(jQuery)
