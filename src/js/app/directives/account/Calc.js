define(['directives/module'], function(directives) {
	'use strict';
	directives.directive('calculator', function() {
		return {
			scope: {
				res:"@",
				value:"=",
				model:"="
            },
			restrict: 'EAC',
			templateUrl: "tpls/account/Calc.html",
			transclude: true,
			controller: function($scope, $xiuse,$rootScope) {
				
			},
			link:function(scope, $xiuse,$rootScope){
				var value = null;
				scope.model = new Object();
				scope.model.reset = function(){
					var obj = "#"+scope.res;
					s('0',obj);
					scope.value = value;
				}
				scope.model.resetValue = function(val){
					var obj = "#"+scope.res;
					s(val,obj);
					scope.value = value;
				}
				scope.CalcNum = function(Num){
					var obj = "#"+scope.res;
					a(Num,obj);
					scope.value = value;
					scope.$root.SetAccount(value);
				}
				scope.CNum =function(Num){
					var obj = "#"+scope.res;
					s(Num,obj);
					scope.value = value;
					scope.$root.SetAccount(value);
				}
				scope.minus = function(){
					var obj = "#"+scope.res;
					minus(obj);
					scope.$root.SetAccount(value);
				}
				function s(v,ele) {
					$(ele).val(v); 
					value = $(ele).val();
				}
				
				function a(v,ele) {
					value = $(ele).val();
					switch(v){
						case '.':
							if(value.indexOf('.')<0)
								value += v ;
							break;
						default:
							if(value.length==1&&value=='0')
								value = v;
							else if(value.length<8)
								value += v;
							else{
								alert("金额位数过多！");
							}
							break;
					}	
					$(ele).val(value);
				}
				function e() { try { s(eval(document.getElementById('res').value)) } catch(e) { s('Error') } }
				
				function minus(ele){
					if(value != '0')
						$(ele).val(value.substr(0,value.length-1));
					value=$(ele).val();
					if(value.length == 0)
						$(ele).val("0");
					value = $(ele).val();
				}

			},
			replace: true
		};
	});
})