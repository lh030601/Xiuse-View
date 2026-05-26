define([
	'angular',
	'ConfigApi',
	'route',
	'bootstrap',
	'nicescroll',
	'ctrl/index',
	'directives/index',
	'xiuse',
	'Common',
	'jqueryCookie'
], function(angular,ConfigApi) {
	var app = angular.module('app', [
		'ui.router',
		'route',
		'xiuse', /*初始化工厂*/
		'Common',/*初始化工厂*/
		'app.controllers',
		'app.directives',
	]);

	
	/*app.run(function($rootScope, AuthService) {
		$rootScope.$on('$routeChangeStart', function(evt, next, current) {
			// 如果用户未登录
			if(!AuthService.userLoggedIn()) {
				if(next.templateUrl === "login.html") {
					// 已经转向登录路由因此无需重定向
				} else {
					$location.path('/login');
				}
			}
		});
	});*/
	
	/*app.run(['$rootScope', '$location', '$state', '$Common', function($rootScope, $location, $state, $Common) {
		//TODO:监听路由事件
		$rootScope.$on('$stateChangeStart',
			function(event, toState, toParams, fromState, fromParams) {
				$Common.Header(8);
				if(toState.name !== 'login') {
					if($.cookie('userMessage') === null) {
						alert("请登录");

						$location.path('/login');
						window.location.reload();
					} else {
						var userMessage = $.cookie('userMessage').split(':');
						if(userMessage[3] === "building" && toState.name.indexOf('building') < 0 && toState.name !== '404') {
							$location.path("/notauthorized");
						} else if(userMessage[3] === "enterprise" && toState.name.indexOf('platform') > 0 && toState.name.indexOf('plate') > 0 && toState.name !== '404') {
							$location.path("/notauthorized");
						} else if(userMessage[3] === "plate" && toState.name.indexOf('platform') > 0 && toState.name !== '404') {
							$location.path("/notauthorized");
						} else {
							if(toState.url == '/notauthorized' || toState.url == '/404') {} else {
								setTimeout(function() {
									$Common.Header(8);
								}, 500)
							}
						}
					}
				}
			})
	}]);*/


	/*
	 * 拦截http请求的拦截器
	 */
	app.config(['$httpProvider', function($httpProvider){
	  $httpProvider.interceptors.push(HttpInterceptor);
	  $httpProvider.interceptors.push('myInterceptor');  
	 }]);
	app.factory('HttpInterceptor', ['$q','$state',HttpInterceptor]);
	function HttpInterceptor($q) {
	 return {
	   /*请求发出之前，可以用于添加各种身份验证信息*/
		  request: function(config){
		   /*if(localStorage.token) {
		    config.headers.token = localStorage.token;
		   }*/
		   //config.headers.headers = Header(8);
		   return config;
		  },
		  // 请求发出时出错
		  requestError: function(err){
		   return $q.reject(err);
		  },
		  // 成功返回了响应
		  response: function(res){
		   	return res;
		  },
		  // 返回的响应出错，包括后端返回响应时，设置了非 200 的 http 状态码
		  responseError: function(err){
		   return $q.reject(err);
		  }
	 };
	}
	app.factory('myInterceptor', ["$rootScope", function ($rootScope) {  
         var timestampMarker = {  
             request: function (config) { 
             	/*移除loding*/
             	if(config.url.indexOf('html')!=-1||config.url.indexOf('AllDesksWithAccount')!=-1){
             		$rootScope.loading = false;  
             	}
             	else
             		$rootScope.loading = true;  
                 return config; 
             },  
             response: function (response) {  
                $rootScope.loading = false;  
                 return response;  
             }  
         };  
         return timestampMarker;  
     }]);  
	
	/*
	 * 方便获得当前状态的方法，绑到根作用域
	 */
	app.run(['$rootScope', '$state', '$stateParams',
		function($rootScope, $state, $stateParams) {
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;
		}
	]);
	return app;
});