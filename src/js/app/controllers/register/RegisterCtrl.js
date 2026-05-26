define(['ctrl/module','ConfigApi'], function(controllers,ConfigApi) {
	'use strict';
	controllers.controller('registerCtrl', function($scope,$xiuse,$http,$location,$interval,$Common) {
	$('#register').css("height",$(window).height());
	$scope.goToFirstPage= function () {
        $location.path("tpls");
		}
		$scope.goToLogin= function () {
        $location.path("login");
		}
	});
});