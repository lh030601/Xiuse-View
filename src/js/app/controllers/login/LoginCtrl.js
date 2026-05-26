define(['ctrl/module','ConfigApi'], function(controllers,ConfigApi) {
	'use strict';
	controllers.controller('loginCtrl', function($scope,$xiuse,$rootScope,$location,$interval,$Common,$state) {
		IsLogin();
		/*检查是否已经登录*/
		function IsLogin(){
			if(sessionStorage.Token != undefined&&sessionStorage.User != undefined){
				$xiuse.AuthenticatedUser(sessionStorage.Token).then(function(response){
					if(response.Info == "1")
						$location.path("tpls/desk");
					
				});
			}
			else if($rootScope.Timer == undefined||$rootScope.Timer=='undefined')
				$interval.cancel($rootScope.Timer);
		}
		
		$(document).keydown(function(event){ 
			if(event.keyCode==13){ 
			
			$scope.login();
					}
			}); 
		$xiuse.Key().then(function(response) {
			ConfigApi.Common.Key=response.Data;	
			//console.log(ConfigApi.Common.Key);
		});
		$xiuse.KeyClient().then(function(response) {ConfigApi.Common.KeyClient=response.Data;	});
		$('#login').css("height",$(window).height());
		$scope.username=$.cookie("userName");
		$scope.password="";
		$scope.goToFirstPage= function () {
        $location.path("tpls");
		}
		$scope.goToRegister= function () {
        $location.path("register");
		}
		$scope.findpw=function(){
			$(".loginform").attr("hidden",true);
			$(".findpassword").attr("hidden",false);
			$(".errormessage").attr("hidden",true);
		}
		$scope.backlogin=function(){
			$(".loginform").attr("hidden",false);
			$(".findpassword").attr("hidden",true);
			$(".errormessage").attr("hidden",true);
		}
		$scope.paracont = "获取验证码";
		$scope.paraclass = "but_null";
		$scope.sendphonecode=function(){
       $scope.paraevent = true;  
       var second = 60,  
       timePromise = undefined; 
       timePromise = $interval(function(){  
          if(second<=0){  
            $interval.cancel(timePromise);  
            timePromise = undefined;  
            second = 60;  
            $scope.paracont = "重发验证码";  
            $scope.paraclass = "but_null";  
            $scope.paraevent = true;  
          }
          else{
            $scope.paracont = second + "秒后可重发";  
            $scope.paraclass = "not but_null";  
            second--;     
          }  
        },1000,100);  
		}
		$(".username").focus(function(){
			if($scope.password!=""){
			$(".errormessage").attr("hidden",true);
			}
		})
		$(".password").focus(function(){
			if($scope.username!=""){
			$(".errormessage").attr("hidden",true);
			}
		})	
		function savecookie(){
			
			if ($("#rmbUser").is(":checked") == true) {  
               // console.log("cookie");
                var userName = $scope.username;
                $.cookie("rmbUser", "true", {  
                    expires : 7  
                }); // 存储一个带7天期限的 cookie  
                $.cookie("userName", userName, {  
                    expires : 7  
                }); // 存储一个带7天期限的 cookie  
            } else {  
            	//  console.log($("#rmbUser").is(":checked"));
                $.cookie("rmbUser", "false", {  
                    expires : -1  
                }); // 删除 cookie  
                $.cookie("userName", '', {  
                    expires : -1  
                });  
            }  
		}

		
		$scope.login=function(){
			//console.log($Common.EncryptByDES($scope.username));
			//console.log($Common.EncryptByDES($scope.password));
			$xiuse.Login($Common.EncryptByDES($scope.username),$Common.EncryptByDES($scope.password))
			.then(function(response) {
			if(response.Info==0){
				//登录不成功console.log("error");
				if($scope.username==null)
				{//用户名或密码为空
					$(".errormessage").attr("hidden",false);
					$(".errormessage").html("<i class='fa fa-warning'></i><p>请填写正确用户名</p>");
					$scope.username=null;
			        $scope.password=null;
				}
		        else if($scope.password==null){
			        $(".errormessage").attr("hidden",false);
					$(".errormessage").html("<i class='fa fa-warning'></i><p>请填写正确密码</p>");
		        }
		        else
		        {
			        $(".errormessage").attr("hidden",false);
					$(".errormessage").html("<i class='fa fa-warning'></i><p>请准确填写用户名及密码</p>");
		        }
			}
			else {
				ConfigApi.Common.Token=response.Data;
				sessionStorage.Token=JSON.stringify(response.Data);
				$xiuse.GetMyUser(response.Data.StaffId).then(function(response1){
					if(response1.Info == "1"){
						sessionStorage.User = $Common.EncryptByDES_Client(JSON.stringify(response1.Data));
						savecookie();
				    	$location.path("tpls/desk");
					}
					else
						$location.path("login");
					
				});
			}
		});
			
		}
	});
});
