define(['ctrl/module'], function(controllers) {
	'use strict';
	controllers.controller('desksCtrl', function($rootScope, $scope, $location, $xiuse, $interval, $state, $http,$Common,$filter) {
		if(sessionStorage.User == undefined)
			$state.go('login',{returnUrl:""});
		var currentRestaurant = JSON.parse($Common.DecryptByDES_Client(sessionStorage.User)).RestaurantId;
		var myDesks, getDataState = -1; /*设置状态*/
		/* 刷新餐桌的实时信息 30秒刷新周期*/
		if($rootScope.Timer == undefined||$rootScope.Timer=='undefined')
		$rootScope.Timer = $interval(function() {
			$xiuse.GetDeskes(currentRestaurant).then(function(response) {
				myDesks = response.Table;
				sessionStorage.myDesks = JSON.stringify(myDesks);
				GetDesks(getDataState);
			});
		}, 60000);
		
		/*获取餐桌状态*/
		$xiuse.GetDeskes(currentRestaurant).then(function(response) {
			myDesks = response.Table;
			sessionStorage.myDesks = JSON.stringify(myDesks);
			GetDesks(getDataState);
			/*alert(JSON.stringify(response));*/
		});
		/* 根据状态获取餐桌的内容*/
		function GetDesks(state) {
			var josnArry = [];
			if(state == -1)
				$rootScope.fName = myDesks;
			else {
				$.each(myDesks, function(index, item) {
					if(item.DeskState == state)
						josnArry.push(item);
				});
				$rootScope.fName = josnArry;
			}
		}
		/*获取不同属性的餐桌*/
		$scope.GetDeskes = function(state) {
				getDataState = state;
				GetDesks(getDataState);
			}
			/*点餐跳转事件*/
		$scope.ActiveDesk = function(deskId,DeskState) {
			
			sessionStorage.currentDesk = JSON.stringify($Common.GetFilterObj(myDesks,'DeskId',deskId));
			//sessionStorage.currentDesk = JSON.stringify(myDesks.filter((p)=>{return p.DeskId==deskId;})[0]);
			$xiuse.DeskState(deskId).then(function(response){
				if(response.Info == 1){
					DeskState = response.Data;
					if(DeskState==0)
						$state.go("tpls.orderBefore", {CurrentDeskId: deskId}, {reload: true});
					else
						$state.go("tpls.orderAfter", {CurrentDeskId: deskId}, {reload: true});
				}
			});
			
		}
		/*清台*/
		$scope.CleanRSDesk = function(){
			$xiuse.CleanRestaurantDesk(currentRestaurant).then(function(response1){
				$xiuse.GetDeskes(currentRestaurant).then(function(response) {
				myDesks = response.Table;
				sessionStorage.myDesks = JSON.stringify(myDesks);
				GetDesks(getDataState);
			});
			})
		}
			
	});
})
