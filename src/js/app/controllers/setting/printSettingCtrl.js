define(['ctrl/module', 'ConfigApi'], function(controllers, ConfigApi) {
	'use strict';
	controllers.controller('printsettingCtrl', function($Common,$scope, $xiuse, $state, $location) {
	$scope.printtype=1;
	$scope.toprint=0;
	$scope.chooseprint=0;
	$scope.printsettitle="添加云端打印机";
	$scope.choprint=function(choos){
			if(choos==0)
				{
					$scope.chooseprint=0;
					$scope.printsettitle="添加云端打印机";
				}
			else{
					$scope.printsettitle="修改XX云端打印机配置";
			}
	}

	});
});
