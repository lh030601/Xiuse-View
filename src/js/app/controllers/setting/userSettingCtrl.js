define(['ctrl/module', 'ConfigApi'], function(controllers, ConfigApi) {
	'use strict';
	controllers.controller('usersettingCtrl', function($scope, $xiuse, $state, $location, $Common) {
		var url1 = window.location.hash;
		$('li[href="' + url1 + '"]').click(function() {
			$(this).addClass("active");
			$(this).siblings().removeClass("active");
		});
		var currentRestaurant = JSON.parse($Common.DecryptByDES_Client(sessionStorage.User)).RestaurantId;

		function deepCopy(source) {
			var result = {};
			for(var key in source) {
				result[key] = typeof source[key] === 'object' ? deepCopy(source[key]) : source[key];
			}
			return result;
		}
		getEmployee();
		//获取餐桌信息
		function getEmployee() {
			$xiuse.GetEmployee(currentRestaurant).then(function(response) {
				$scope.employee = response;
				//$scope.employee="null";
				if($scope.employee == "null" || $scope.employee == "") {
					$('.userList').hide();
					if($('.tools').children('p').length == 0) {
						var test1 = "<p class=\"wa_message\">该餐厅暂时没有员工，请点击添加员工进行添加!</p>";
						$('.tools').append(test1);
					}

				} else {
					$('.tools').children('p').remove();
					$('.userList').show();
				}
			});
		}
		//添加员工模态
		$scope.addemployee = function() {
			$scope.emptitle = "添加员工";
			$scope.employeedet = new Object();
			$scope.editflag = false;
			$('.form-horizontal').children().eq(0).addClass('hidden');
			$scope.employeedet.UserRole = "1";
			$('.errormessage1').remove();
			$('.error_message_border').removeClass('error_message_border');
			$('#modalUserSetting').modal('show');
		}
		//添加员工保存
		$scope.addemp = function(employee) {
			var errortips = "";
			var test1 = "<div class=\"errormessage1\">";
			var test2 = "</div>";
			var test = [];
			if($scope.employeedet.UserName == "" || $scope.employeedet.UserName == undefined) {
				//无用户名
				errortips = "用户名为必填项，请填写！";
				$('.errormessage1').remove();
				$('.error_message_border').removeClass('error_message_border');
				$('#inputName1').addClass('error_message_border');
				if($('#inputName1').siblings().length == 0) {
					test = test1 + errortips + test2;
					$('#inputName1').parent().append(test);
				}
			} else {
				if($scope.employeedet.Password == "" || $scope.employeedet.Password == undefined) {
					errortips = "密码为必填项，请填写！";
					$('.errormessage1').remove();
					$('.error_message_border').removeClass('error_message_border');
					$("#inputPassword1").addClass('error_message_border');
					if($('#inputPassword1').siblings().length == 0) {
						test = test1 + errortips + test2;
						$('#inputPassword1').parent().append(test);
					}
				} 
				else {
					$('.errormessage1').remove();
					$('.error_message_border').removeClass('error_message_border');				
		$xiuse.Key().then(function(response) {
			ConfigApi.Common.Key=response.Data;	
			console.log(ConfigApi.Common.Key);
		});
					employee = $scope.employeedet;
					employee.RestaurantId=currentRestaurant;
					employee.Password=$Common.EncryptByDES($scope.employeedet.Password)
					//console.log(employee);
						$xiuse.AddEmployee(employee).then(function(response) {
					$('#modalUserSetting').modal('hide');
					getEmployee();
				});
				}
			}
		}
		//编辑员工模态
		$scope.editemployee = function(employee) {
			$scope.emptitle = "编辑员工";
			$scope.employeedet = deepCopy(employee);
			$scope.employeedet.Password="";
			$scope.editflag = true;
			$('.form-horizontal').children().eq(0).removeClass('hidden');
			$('.errormessage1').remove();
			$('.error_message_border').removeClass('error_message_border');
			$('#modalUserSetting').modal('show');
		}
		//编辑员工信息保存
		$scope.editempsave = function(employee) {
			var errortips = "";
			var test1 = "<div class=\"errormessage1\">";
			var test2 = "</div>";
			var test = [];
			if($scope.employeedet.UserName == "" || $scope.employeedet.UserName == undefined) {
				//无用户名
				errortips = "用户名为必填项，请填写！";
				$('.errormessage1').remove();
				$('.error_message_border').removeClass('error_message_border');
				$('#inputName1').addClass('error_message_border');
				if($('#inputName1').siblings().length == 0) {
					test = test1 + errortips + test2;
					$('#inputName1').parent().append(test);
				}
			}
				else {
					$('.errormessage1').remove();
					$('.error_message_border').removeClass('error_message_border');				
		$xiuse.Key().then(function(response) {
			ConfigApi.Common.Key=response.Data;	
			//console.log(ConfigApi.Common.Key);
		});
					employee = $scope.employeedet;
					employee.RestaurantId=currentRestaurant;
					employee.Password=$Common.EncryptByDES($scope.employeedet.Password)
					//console.log(employee);
					$xiuse.EditEmployee(employee).then(function(response) {
					$('#modalUserSetting').modal('hide');
					getEmployee();
				});
			}
		}
		//删除员工
		$scope.deleteemp = function(empid, empstate){
			if(confirm("您确定要删除此员工吗？") == true) {
				empid=$scope.employeedet.UserId;
			   empstate=2;
			   $xiuse.DeleteEmployee(empid, empstate).then(function(response) {
						$('#modalUserSetting').modal('hide');
						getEmployee();
						//console.log("success");
					})		
					}
			
		}
		//启用或禁用员工
		$scope.enabled = function(empid, empstate) {
				if(empstate == 0) { //禁用会员
					if(confirm("您确定要禁用此员工吗？") == true) {
						empstate = 1;
						//alert("aaa");
					}
				}
				else { //启用会员
					if(confirm("您确定要启用此员工吗？") == true) {
						empstate = 0;
					}
				}
				//console.log(empstate)
				$xiuse.DeleteEmployee(empid, empstate).then(function(response) {
						getEmployee();
						//console.log("success");
					})
			}
		
	});
});