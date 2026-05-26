define(['angular','app'],function(angular) {
	"use strict";
	require(['angular','jquery','app'], function(angular) {
		angular.bootstrap($('body'), ['app']);//收到绑定启动
	});
});