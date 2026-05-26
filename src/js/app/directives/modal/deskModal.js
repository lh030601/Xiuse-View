define(['directives/module'], function(directives) {
	'use strict';
	directives.directive('deskModal', ['$Common','$xiuse',function($Common,$xiuse) {
		return {
			scope: {
				datamodal:"@",
				deskState:"@",
				getMyText:"=",
				filterModel: '='
            },
			restrict: 'EAC',
			templateUrl: "tpls/Modal/Tables.html",
			transclude: true,
			controller: function($scope,$rootScope) {
				
			},
			link:function(scope,$rootScope,$filter){ 
				if(sessionStorage.myDesks != undefined&&sessionStorage.myDesks != 'undefined'){
					if(scope.deskState=="*"||scope.deskState == undefined)
						scope.desks = JSON.parse(sessionStorage.myDesks);
					else
						/*scope.desks = JSON.parse(sessionStorage.myDesks).filter((p)=>{return p.DeskState==scope.deskState;});*/
						scope.desks = $Common.GetFilterObj(JSON.parse(sessionStorage.myDesks),'DeskState',scope.deskState);
				}
				else{
					$xiuse.GetDeskes(JSON.parse($Common.DecryptByDES_Client(sessionStorage.User)).RestaurantId).then(function(response){
						if(scope.deskState=="*"||scope.deskState == undefined)
							scope.desks = response.Table;
						else
						/*scope.desks = response.Table.filter((p)=>{return p.DeskState==scope.deskState;});*/
						scope.desks = $Common.GetFilterObj(response.Table,'DeskState',scope.deskState);
					sessionStorage.myDesks = JSON.stringify(response.Table);
				});
				}
				
				scope.a = function(DeskId){
					/*sessionStorage.currentDesk = JSON.stringify(scope.desks.filter((p)=>{return p.DeskId==DeskId;})[0]);*/
					sessionStorage.currentDesk = JSON.stringify($Common.GetFilterObj(scope.desks,'DeskId',DeskId));
					switch(scope.$root.obj.State){
						case 0:
						{
							scope.$root.SwitchModalDesk(DeskId);
							break;
						}
						case 1:
						{
							scope.$root.SwitchTarget();
							break;
						}
						case 2:
						{
							scope.$root.AccountSwitchDesk()
							break;
						}
						default:
							break;
					}
				}
			},
			replace: true
		};
	}]);
})