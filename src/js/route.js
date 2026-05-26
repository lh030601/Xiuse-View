define([ 'uirouter'], function() {
	'use strict';
	var route = angular.module('route', ['ui.router']);
	route.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider',
		function($stateProvider, $urlRouterProvider,$locationProvider,$httpProvider) {
			$urlRouterProvider
			.when("", "/login")
			/*.when("/platform", "/platform/home")
			.when("/plate", "/plate/home")
			.when("/building", "/building/home")
			.when("/enterprise", "/enterprise/home")*/
			.otherwise('404'); //都不符合的时候跳转到的位置
			$stateProvider
				.state("tpls", {
					url: "/tpls",
					templateUrl: "tpls/Tab.html",
					controller:'tabCtrl',
					data: {pageTitle: ''},
					params:{TabName:null}
				})
				.state("tpls.desk", {
					url: "/desk",
					templateUrl: "view/desk/desks.html",
					controller:'desksCtrl',
					data: {pageTitle: ''},
					params:{UserId:null}
				})
				.state("tpls.orderBefore", {
					url: "/orderBefore",
					templateUrl: "view/order/orderBefore.html",
					controller:'OrderBeforeCtrl',
					data: {pageTitle: ''},
					params: {'CurrentDeskId': null,'AddOrderId':null,'Order':null}
				})
				.state("tpls.orderAfter", {
					url: "/orderAfter",
					templateUrl: "view/order/orderAfter.html",
					controller:'OrderAfterCtrl',
					data: {pageTitle: '登陆'},
					params: {'OrderId': null}
				})
				.state("tpls.account", {
					url: "/account",
					templateUrl: "view/account/accounts.html",
					controller:'accountsCtrl',
					params: {'OrderId': null}
				})
				.state("tpls.sale", {
					url: "/sale",
					templateUrl: "view/sale/sales.html",
					controller:'saleCtrl'
				})
				.state("tpls.sale.analysis", {
					url: "/analysis",
					templateUrl: "view/sale/analysis.html",
					controller:'analysisCtrl'
				})
				.state("tpls.setting", {
					url: "/setting",
					templateUrl: "view/systemsetting/systemsetting.html",
					controller:'settingCtrl'
				})
				.state("tpls.setting.memberSetting", {
					url: "/memberSetting",
					templateUrl: "view/systemsetting/memberSetting.html",
					controller:'membersettingCtrl'
				})
				.state("tpls.setting.menusSetting", {
					url: "/menusSetting",
					templateUrl: "view/systemsetting/menusSetting.html",
					controller:'menussettingCtrl'
				})
				.state("tpls.setting.discountSetting", {
					url: "/discountSetting",
					templateUrl: "view/systemsetting/discountSetting.html",
					controller:'discountsettingCtrl'
				})
				.state("tpls.setting.deskSetting", {
					url: "/deskSetting",
					templateUrl: "view/systemsetting/deskSetting.html",
					controller:'desksettingCtrl'
				})
				
				.state("tpls.setting.userSetting", {
					url: "/userSetting",
					templateUrl: "view/systemsetting/userSetting.html",
					controller:'usersettingCtrl'
				})
				.state("tpls.setting.PrintSetting", {
					url: "/PrintSetting",
					templateUrl: "view/systemsetting/PrintSetting.html",
					controller:'printsettingCtrl'
				})
				.state("tpls.setting.restaurantSetting", {
					url: "/restaurantSetting",
					templateUrl: "view/systemsetting/restaurantSetting.html",
				//	controller:'restaurantsettingCtrl'
				})
				.state("login", {
					url: "/login",
					templateUrl: "view/login/login.html",
					controller:'loginCtrl'
					
				})
				.state("register", {
					url: "/register",
					templateUrl: "view/register/register.html",
					controller:'registerCtrl'
					
				});
		}]);
		return route;
});
