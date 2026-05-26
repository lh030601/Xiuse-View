define(['ctrl/module', 'ConfigApi'], function(controllers, ConfigApi) {
	'use strict';
	controllers.controller('desksettingCtrl', function($scope, $xiuse, $state, $location,$Common) {
		var url1 = window.location.hash;
		$('li[href="' + url1 + '"]').click(function() {
			$(this).addClass("active");
			$(this).siblings().removeClass("active");
		});
		var currentRestaurant = JSON.parse($Common.DecryptByDES_Client(sessionStorage.User)).RestaurantId;
			function deepCopy(source) { 
				    var result={};
				    for (var key in source) {
				        result[key] = typeof source[key]==='object'?deepCopy(source[key]): source[key];
				     } 
				   return result; 
				}
		getDesks();
		//获取餐桌信息
		function getDesks(){
		$xiuse.setGetDesks(currentRestaurant).then(function(response) {
				$scope.desks = response;
				//$scope.desks="null";
				if($scope.desks == "null"||$scope.desks == "") {
					$('.desk-content').hide();
					if($('.deskSettingContent').children('p').length == 0) {
					var test1 = "<p class=\"wa_message\" style=\"color:white\">该餐厅暂时没有设置餐桌，可点击添加餐桌进行添加!</p>";
					$('.deskSettingContent').append(test1);
					}

				}
				else {
					$('.deskSettingContent').children('p').remove();
					$('.desk-content').show();
				}
			});
		}
		//添加餐桌模态
	$scope.adddesk=function(){
		$scope.desktitle="添加餐桌";
		$scope.desk = new Object();
		$scope.editflag=false;
		$scope.desk.TakeOut="1";
		$('#modalDeskSetting').modal('show');
	}
	//创建餐桌
	$scope.adddesks=function(desk){
		desk=$scope.desk;
		desk.RestaurantId=currentRestaurant;
		//console.log(desk);
		$xiuse.AddDesks(desk)
				.then(function(response) {
					$('#modalDeskSetting').modal('hide');
		getDesks();
       });
	}
	//编辑餐桌模态
	$scope.editdesk=function(desk){
		$scope.desktitle="编辑";
		//console.log(desk);
		$scope.desk =deepCopy(desk);
		$scope.editflag=true;
		$('#modalDeskSetting').modal('show');
		
	}
	//编辑餐桌保存
	$scope.editdesksave=function(desk){
		desk=$scope.desk;
		desk.RestaurantId=currentRestaurant;
	//	console.log(desk);
	$xiuse.EditDesks(desk).then(function(response) {
					$('#modalDeskSetting').modal('hide');
		getDesks();
       });
	}
	//删除餐桌
	$scope.deletedesk=function(desk){
		desk=$scope.desk;
		desk.RestaurantId=currentRestaurant;
		//console.log(desk);
			if(confirm('您确定要删除餐桌“' + desk.DeskName + '”吗？')) {
	$xiuse.DeleteDesks(desk.DeskId).then(function(response) {
					$('#modalDeskSetting').modal('hide');
		getDesks();
       });
	}
		}
		
			});
	
});