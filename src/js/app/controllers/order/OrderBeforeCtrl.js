define(['ctrl/module'], function(controllers) {
	'use strict';
	controllers.controller('OrderBeforeCtrl', function($Common,$rootScope, $scope, $location, $state,$xiuse, $stateParams, $filter) {
		var selectMenus = [];/*选择菜单*/
		var allMenus = [];/*全部的菜单*/
		var AddOrderId = null;
		$scope.personNum = 1;
		$rootScope.obj = {"State":0};/*指引弹出选择控制函数*/
		if(sessionStorage.User == undefined)
			$state.go('login',{returnUrl:""});
		var User = JSON.parse($Common.DecryptByDES_Client(sessionStorage.User))
		var currentRestaurant = User.RestaurantId;
		var myDesks = JSON.parse(sessionStorage.myDesks);
		
		if($stateParams.CurrentDeskId == null)
			$('#transfer_desk').modal({
				keyboard: false,
				show: true
			});
		else
			InitOrder($stateParams.CurrentDeskId);
		/*获取是否添加订单的菜品,为null,重新创建订单.不为null,订单号.*/
		AddOrderId = $stateParams.AddOrderId;
		if($stateParams.Order!=null)
			$scope.personNum = $stateParams.Order.Order.CustomerNum;
			
		/*强制选择空桌*/
		$('#transfer_desk').on('hidden.bs.modal', function(e) {
			$rootScope.obj = {"State":0};/*指引弹出选择控制函数*/
			$(this).removeData("bs.modal");
			if($rootScope.CurrentDeskName == null || $rootScope.CurrentDeskName == undefined)
				$('#transfer_desk').modal({
					keyboard: false,
					show: true
				});
			})
			/*获取所有餐单信息*/
		$xiuse.GetMenus(currentRestaurant).then(function(response) {
			allMenus = GetMenus(response);
			$scope.menusAll = allMenus;
			$scope.classify = response;
		});
		/*初始化订单todo*/
		function InitOrderInfo()
		{
			var current = JSON.parse(sessionStorage.currentDesk);
			$rootScope.CurrentDeskName == current.DeskName;
		}

		/*初始化餐桌信息*/
		function InitOrder(deskId) {
			$rootScope.obj = {"State":0};/*指引弹出选择控制函数*/
			var current = null;
			var tmpAll = [];
			if($rootScope.fName == undefined) {
				$.each(JSON.parse(sessionStorage.myDesks), function(index, item) {
					if(item.DeskId == deskId)
						current = item;
					if(current == null)
						$('#transfer_desk').modal({
							keyboard: false,
							show: true
						});
					else {
						$scope.CurrentDeskid = current.DeskId;
						$rootScope.CurrentDeskName = current.DeskName;
					}
				});
			} else {
				$.each($rootScope.fName, function(index, item) {
					if(item.DeskId == deskId)
						current = item;
				});
				if(current == null)
					$('#transfer_desk').modal({
						keyboard: false,
						show: true
					});
				else {
					$scope.CurrentDeskid = current.DeskId;
					$rootScope.CurrentDeskName = current.DeskName;
				}
			}
		}
		/*获取所有的菜单*/
		function GetMenus(data) {
			var a = [];
			angular.forEach(data, function(item) {
				angular.forEach(item.LstMenuItems, function(menus) {
					a.push(menus);
				});
			});
			return a;
		}
		/*模态切换餐桌*/
		$rootScope.SwitchModalDesk = function(DeskId) {
				InitOrder(DeskId);
			}
		
			/* 显示模态*/
		$scope.modalDesks = function() {
			$rootScope.obj = {"State":0};/*指引弹出选择控制函数*/
				$('#transfer_desk').modal({
					keyboard: true,
					show: true,
				});
			}
		/*点餐显示菜单*/
		$scope.ShowMenus = function(){
			$("#order-diner").attr("class","order-diner hidden-xs col-sm-5 col-md-4 bg ");
			$("#order-menus").attr("class","order-menus visibite-xs col-sm-7 col-md-8  bg");
			SetOrderHeight();
		}
		$scope.ShowOrder = function(){
			$("#order-diner").attr("class","order-diner visibite-xs col-sm-5 col-md-4 bg ");
			$("#order-menus").attr("class","order-menus  hidden-xs col-sm-7 col-md-8  bg");
		}
		/*控制高度*/
		function SetOrderHeight()
		{	
			var height=parseInt($("#order-menus .panel").css("height")) 
			- parseInt($("#order-menus .panel>.nav").css("height"))
			- parseInt($("#order-menus .panel .panel-footer").css("height"))
			- parseInt($("#order-menus .panel>.input-group").css("height")) - 10;
			//alert(height);
			
			$("#order-menus .tab-content>.tab-pane").css("height",height);
			if(document.body.offsetWidth>=768){
			height=parseInt($("#order-more").css("height"))
			-parseInt($("#order-more .diner-num").css("height"))
			-parseInt($("#order-more .panel-heading").css("height"))
			-parseInt($("#order-more .order-opreate").css("height"))
			-parseInt($("#order-more .order-bills .bills-status").css("height"))-5;
			$("#order-more .order-bills .bills-list ul").css("height",height);
			
			height=parseInt($("#order-detail .detail-content .tab-content .active").css("height"))
			-parseInt($("#order-detail .detail-content .tab-content .active .detail-title").css("height"))
			-parseInt($("#order-detail .detail-content .tab-content .active .detail-status").css("height"));
			$("#order-detail .detail-content .tab-content .active .detail-bills").css("height",height);
			}
			else{
				$("#order-more .order-bills .bills-list ul").css("height","auto");
				$("#order-detail .detail-content .tab-content .active .detail-bills").css("height","auto");
			}
			//alert(myChart);
			  //myChart.resize();
				 //menusale.resize();
		}
			/*添加已选菜品*/
		$scope.menuClick = function(menusId) {
			$.each(allMenus, function(index, item) {
				if(item.MenuId == menusId) {
					AddselectMenus(item);
				}
			});
			$scope.STMenus = selectMenus;
			GetMenuNum(selectMenus);
		}
		/*添加菜品*/
		function AddselectMenus(obj) {
			var tmp = null;
			tmp = $Common.GetFilterObj(selectMenus,'MenuId',obj.MenuId);
			/*tmp = selectMenus.filter((p) => {
				return p.MenuId == obj.MenuId;
			});*/
			if(tmp == null) {
				obj.MenuNo = 1;
				obj.MenuTag = "正常";
				selectMenus.push(obj);
			} else {
				tmp.MenuNo += 1;
			}
		}

		/*菜单加减按钮*/
		$scope.Plus = function(menusId) {
			/*var tmp = selectMenus.filter((p) => {
				return p.MenuId == menusId;
			});*/
			var tmp = $Common.GetFilterObj(selectMenus,'MenuId',menusId);
			if(tmp != null)
				tmp.MenuNo += 1;
			$scope.STMenus = selectMenus;
			GetMenuNum(selectMenus);
		}
		$scope.Minus = function(menusId) {
			/*var tmp = selectMenus.filter((p) => {
				return p.MenuId == menusId;
			});*/
			var tmp = $Common.GetFilterObj(selectMenus,'MenuId',menusId);
			if(tmp != null) {
				if(tmp.MenuNo >= 2)
					tmp.MenuNo -= 1;
				else {
					var index = selectMenus.indexOf(tmp);
					selectMenus.splice(index, 1);
				}
			}

			$scope.STMenus = selectMenus;
			GetMenuNum(selectMenus);
		}
		/*获取菜品数量和价格*/
		function GetMenuNum(obj) {
			var tmpnum = 0;
			var tmpPay = 0;
			$.each(obj, function(index, item) {
				tmpnum += item.MenuNo;
				tmpPay += item.MenuPrice*item.MenuNo;
			});
			$scope.diner_price =$filter('number')(tmpPay, 2);/*设置小数点两位*/
			$scope.diner_num = tmpnum;
		}
		/*删除菜单*/
		$scope.DelMenu = function(menusId) {
			/*var tmp = selectMenus.filter((p) => {
				return p.MenuId == menusId;
			});*/
			var tmp = $Common.GetFilterObj(selectMenus,'MenuId',menusId);
			if(tmp != null) {
				var index = selectMenus.indexOf(tmp);
				selectMenus.splice(index, 1);
			}
			$scope.STMenus = selectMenus;
			GetMenuNum(selectMenus);
		}
		/*加减人数*/
		$scope.PMinus = function() {
			if($scope.personNum >= 2)
				$scope.personNum--;
		}
		/*加减人数*/
		$scope.PPlus = function() {
			$scope.personNum++;
		}
		$scope.SetTaste = function(Id,taste){
			/*var tmp = selectMenus.filter((p) => {
				return p.MenuId == Id;
			});*/
			var tmp = $Common.GetFilterObj(selectMenus,'MenuId',Id);
			if(tmp != null)
				tmp.MenuTag = taste;
		}
		/*下单*/
		$scope.OrderBill = function(CurrentDeskId)
		{
			/*下单*/
			if(selectMenus.length == 0)
				return;
			/*创建新的订单*/
			if(AddOrderId == null){
				var order ={
				"DeskId": $scope.CurrentDeskid,
			  	"BillAmount": $scope.diner_price,
			  	"AccountsPayable":$scope.diner_price,
			  	"DishCount": $scope.diner_num,
			  	"CustomerNum": $scope.personNum,
			  	"ServiceUserId": User.UserId,
			  	"Menus":selectMenus
				};
				/*下单处理*/
				$xiuse.AddOrderBill(order).then(function(response){
					if(response.Info == 1)
					/*跳转到详细页面*/
						$state.go("tpls.orderAfter", {OrderId:response.Data}, {reload: true});
					else{}
				});
			}
			/*订单添加菜品*/
			else
			{
				
				var menus = [];
				$.each(selectMenus, function(index,element) {
					menus.push({
					'OrderId':AddOrderId,
					'MenuId':element.MenuId,
					'MenuName':element.MenuName,
					'MenuPrice':element.MenuPrice,
					'MenuTag':element.MenuTag,
					'MenuNum':element.MenuNo,
					'MenuImage':element.MenuImage,
					'MenuInstruction':element.MenuInstruction,
					'MenuServing':"0"
				});
				});
				
				$xiuse.AddOrderMenus(menus).then(
					function(response){
						if(response.Info == 1){
							$state.go("tpls.orderAfter", {OrderId:AddOrderId}, {reload: true});
						}
					}
				);
			}
			
		}
		
	})	
})