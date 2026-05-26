define(['ctrl/module'], function(controllers) {
	'use strict';
	controllers.controller('tabCtrl', function($rootScope, $scope, $location, $state,$Common) {
		/*$stateParams.TabName*/
		$scope.Tab = $location.path();
		$scope.LoginOut = function(){
			sessionStorage.clear();
			$state.go("login", {}, {reload: true});
		}
	});
})