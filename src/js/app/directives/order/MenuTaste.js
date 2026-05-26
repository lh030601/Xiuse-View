define(['directives/module'], function(directives) {
	'use strict';
	directives.directive('menuTaste', function() {
		return {
			scope: {
 
            },
			restrict: 'EAC',
			templateUrl: "tpls/Order/taste.html",
			replace: true,
			transclude: true,
			controller: function($scope,  $xiuse,$compile) {
				
				
			},
			link:function (scope, element, attrs) {
				scope.taste ="正常";
				scope.ct = [];
				scope.SetTaste = function(tasteName,obj){
			 		scope.taste =tasteName;
			 		scope.dataValue = tasteName;
			 		scope.$parent.SetTaste(attrs.menuId,tasteName);
			 		$(obj.target).parent().parent().css({ "display": "none"});
			 	}
				scope.onFoucsOut = function(){
					$(obj.target).parent().parent().css({ "display": "none"});
				}
				scope.contentTaste = { "taste":[
					{"Name":"正常","Class":"label-default"},
					{"Name":"微辣","Class":"label-primary"},
					{"Name":"中辣","Class":"label-success"},
					{"Name":"超辣","Class":"label-danger"},
					{"Name":"清淡","Class":"label-default"},
					{"Name":"较咸","Class":"label-info"}
					]};
					scope.ct =scope.contentTaste.taste;
					//alert(JSON.stringify(scope.contentTaste));
				scope.tip = function(obj){
					$('div[name=taste_div]').css({ "display": "none"});
					var off = $(obj.target).offset();
					var tip =$(obj.target).next();
					var t = off.top+$(obj.target).height()+15;
					var l = off.left - tip.width()/2+$(obj.target).width()/2+10;
					tip.css({ "display": "block"});
					tip.offset({top:t,left:l});
				}
				
			}
		};
	});
})