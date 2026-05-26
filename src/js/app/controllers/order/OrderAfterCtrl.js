define(['ctrl/module'], function(controllers) {
	'use strict';
	controllers.controller('OrderAfterCtrl', function($rootScope, $scope, $location, $xiuse, $state,$stateParams, $filter,$Common) {
		
		/*当前餐桌*/
		var currentDesk = "";
		/*当日账单*/
		$scope.OrderBillsFlag =false;
		$scope.billsListShow = true;
		/*初始页面*/
		GetUseDeskOrder();
		$('#switch_desk').on('hidden.bs.modal', function(e) {
			$(this).removeData("bs.modal");
			});
		/*创建新的订单*/
		$scope.NewOrder = function(){
			//if(currentDesk.DeskState != 0)
			if(confirm("当前还有未结账或者未清台的订单，是否创建新的订单？")){
				/*跳转点餐页面*/
				$state.go("tpls.orderBefore", {
					CurrentDeskId: currentDesk.DeskId
				}, {
					reload: true
				});
			}
			
		}
		/*转台*/
		$scope.SwitchDesk =function(){
			if($scope.currentOrderId == undefined)
			{
				alert("请选择转台的订单！");
				return;
			}
			$rootScope.obj = {"State":1};/*指引弹出选择控制函数*/
			$('#switch_desk').removeData("bs.modal");
			$('#switch_desk').modal({keyboard: false,show: true});
		}
		/*转台*/
		$rootScope.SwitchTarget = function()
		{
			var current = JSON.parse(sessionStorage.currentDesk)
			if(currentDesk.DeskId!=current.DeskId)
				$xiuse.SwitchDesk($scope.currentOrderId,currentDesk.DeskId,current.DeskId).then(function(response){
					if(response.Info == 1)
						$state.go("tpls.desk", {UserId:null}, {reload: true});
				});
		}
		/*清台*/
		$scope.ClearDesk = function(CurrentDeskid){
			$scope.OrderBillsFlag =false;
			$xiuse.CleanDesk(CurrentDeskid).then(
				function(response){
					if(response.Info == 1)
					{GetUseDeskOrder();}
					else
					{}
				}
			);
		}
		/*获取当前餐桌的今日完成订单信息*/
		$scope.GetDeskBil = function(CurrentDeskid){
			$scope.OrderBillsFlag =true;
			$xiuse.DailyBills(CurrentDeskid).then(
				function(response){
					if(response != "null")
						$scope.OrderBills = response;
				}
			);
		}
		/*获取订单的详细信息*/
		$scope.GetOrderDetail = function(OrderId)
		{
			$scope.OrderBillsFlag =false;
			$scope.currentOrderId = OrderId;
			$xiuse.OrderDetail(OrderId).then(function(response){
				$scope.OrderDetail = response;
				$scope.personNum = response.Order.CustomerNum;
				var tmpNoneSer = 0;
				$.each($scope.OrderDetail.Ordermenu, function(index,element) {
					if(element.MenuServing == 0)
						tmpNoneSer+=1;
				});
				$scope.NoneSer = tmpNoneSer;
			});
		}
		function calNoneSer(){
			var tmpNoneSer = 0;
				$.each($scope.OrderDetail.Ordermenu, function(index,element) {
					if(element.MenuServing == 0)
						tmpNoneSer+=1;
				});
				$scope.NoneSer = tmpNoneSer;
		}
		/*更新是否上菜*/
		$scope.UpdateMenuServing = function(OrderMenuId){
			var menu = $Common.GetFilterObj($scope.OrderDetail.Ordermenu,'OrderMenuId',OrderMenuId);
			/*var menu = $scope.OrderDetail.Ordermenu.filter((p) => {return p.OrderMenuId==OrderMenuId});*/
			if(menu != null)
			$xiuse.UpdateMenuServing(menu).then(
				function(response){
					if(response.Info == 1)
					{
						calNoneSer();
					}
					else 
						menu.MenuServing = menu.MenuServing==0?1:0;
						
				}
			);
			
		}
		/*获取当前未清台的订单*/
		function GetUseDeskOrder(CurrentDeskid){
			$scope.OrderBillsFlag =false;
			/*当前订单*/
			if(sessionStorage.currentDesk != null)
			 	currentDesk = JSON.parse(sessionStorage.currentDesk);
			else
				/*跳转点餐页面*/
				$state.go("tpls.orderBefore", {
					reload: true
				});
			$scope.CurrentDeskName = currentDesk.DeskName;
			$scope.CurrentDeskid = currentDesk.DeskId;
			$scope.currentOrderId = $stateParams.OrderId
			$xiuse.DeskOrderSin($scope.CurrentDeskid).then(function(response){
				if(response.length ==0)
					$state.go("tpls.orderBefore",{CurrentDeskId:null},{reload: true});
				if($scope.currentOrderId == null)
					$scope.currentOrderId = response[0].Order.OrderId;
				$scope.OrdersBill = response;
				$scope.billNum = response.length;
				$scope.GetOrderDetail($scope.currentOrderId);
			});
		}
		/*添加新的菜品信息*/
		$scope.AddOrderMenus = function(OrderId){
			$state.go("tpls.orderBefore", {
					CurrentDeskId: currentDesk.DeskId,AddOrderId:OrderId,Order:$scope.OrderDetail
				}, {
					reload: true
				});
		}
		/*结账按钮*/
		$scope.PayBill = function(OrderId){
			$state.go("tpls.account", {OrderId: OrderId}, {
					reload: true
				});
		}
		$scope.TogleBill = function(){
			$scope.billsListShow = !$scope.billsListShow;
		}
		$scope.ConvertTrue = function(state)
		{
			if(state == 1)
				return true;
			else
				return false
		}
		
	})	
})