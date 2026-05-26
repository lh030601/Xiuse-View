define(['directives/module'], function(directives) {
	'use strict';
	directives.directive("analysisTable", ['$http', '$xiuse', function($http, $xiuse) {
		return {
			scope: {
				totalItem: "@totalItem",
				currentPage: "@currentPage",
				itemsPerpage: "=",
				pageUrl: "=",
				keyWord: "@searchcondition",
				paramsDetail: "=",
				filterModel: '='
			},
			restrict: "EA",
			replace: true,
			transclude: true,
			template: '<div class="fenye">\
												<div class="leftpart">\
													<span> 共 <b>{{totalItem}}</b> 条记录，每页 <b>{{itemsPerpage}}</b> 条</span>\
												</div>\
												<ul class="op">\
													<li class="tablefirstbtn" ng-click="setChange(1)">首页</li>\
													<li class="tabletopbtn"  ng-click="setChange(currentPage=currentPage-1)">上一页</li>\
													<li class="xifenye btndisable" id="xifenye" ng-click="PagesD()">\
														<span id="xiye">{{currentPage}}</span>/<span id="mo">{{pageNumber}}</span>\
													</li>\
													<li class="tabledownbtn" ng-click="setChange(currentPage=currentPage+1)">下一页</a>\
													</li>\
													<li class="tablelastbtn" ng-click="setChange(pageNumber)">末页</li>\
												</ul>\
											</div>',

			link: function(scope, element, attrs) {
				scope.maxsize = Math.max(attrs.maxSize, 5);
				scope.pages = [];
				scope.currentPage = 1;
				scope.curr = scope.currentPage;
				scope.resPages = [];
				scope.align = attrs.align;
				scope.pageUrl = attrs.pageUrl;
				scope.paramsDetail.CurrentPage = 1;
				scope.itemsPerpage = attrs.itemsPerpage;
				scope.keyWord = "";
				scope.$watch('paramsDetail', function(newVal, oldVal) {
					if(newVal == oldVal || JSON.stringify(newVal) == "{}") {} else {
						scope.change(newVal.CurrentPage);
					}
					//console.log(newVal); //每次你在controller里修改了userInfo，这里都会打印
				}, true);
				//点击切换分页
				scope.change = function(page) {
					scope.$parent.lists = [];
					scope.paramsset = scope.paramsDetail;
					scope.paramsset.CurrentPage = page;
					scope.paramsset.CountPage = scope.itemsPerpage;
					$xiuse.AnalysisTable(scope.paramsset, scope.pageUrl).then(function(response) {
						scope.resdetail = response.Data;
						scope.totalItem = scope.resdetail.TotalItem;
						scope.pageNumber = Math.ceil(scope.totalItem / parseInt(scope.itemsPerpage));
						for(var i = 1; i <= scope.pageNumber; i++) {
							scope.resPages.push(i);
						};
						scope.$parent.ifnullflag = true;
						scope.pages = scope.resPages.slice((scope.currentPage - 1), scope.maxsize);
						if(scope.totalItem < scope.itemsPerpage) {
							scope.itemsPerpage = scope.totalItem;
						}
						if(scope.pages == 1 || scope.pages == 0) {
							$('.tablefirstbtn').addClass('btndisable');
							$('.tabletopbtn').addClass('btndisable');
							$('.tabledownbtn').addClass('btndisable');
							$('.tablelastbtn').addClass('btndisable');
							if(scope.pages == 0) {
								scope.pages = 1;
								scope.$parent.ifnullflag = false;
								scope.pageNumber = 1;
							}
						}
						if(scope.totalItem == 0) {
							scope.pages = 1;
							scope.$parent.ifnullflag = false;
							scope.pageNumber = 1;
						}
						if(scope.totalItem==scope.itemsPerpage){
							$('.tablefirstbtn').addClass('btndisable');
							$('.tabletopbtn').addClass('btndisable');
							$('.tabledownbtn').addClass('btndisable');
							$('.tablelastbtn').addClass('btndisable');
						}
						scope.$parent.lists = scope.resdetail.Data;
						scope.$parent.pageIndex = (scope.currentPage - 1) * scope.itemsPerpage;
					});
					scope.currentPage = page;
					if(page == 1) {
						$('.tablefirstbtn').addClass('btndisable');
						$('.tabletopbtn').addClass('btndisable');
						$('.tabledownbtn').removeClass('btndisable');
						$('.tablelastbtn').removeClass('btndisable');
					} else {
						if(page == scope.pageNumber) {
							$('.tablefirstbtn').removeClass('btndisable');
							$('.tabletopbtn').removeClass('btndisable');
							$('.tabledownbtn').addClass('btndisable');
							$('.tablelastbtn').addClass('btndisable');
						} else {
							$('.tablefirstbtn').removeClass('btndisable');
							$('.tabletopbtn').removeClass('btndisable');
							$('.tabledownbtn').removeClass('btndisable');
							$('.tablelastbtn').removeClass('btndisable');
						}
					}
				}
				scope.setChange = function(page) {
					if(page <= 0) {
						scope.currentPage = page + 1;
					} else if(page > scope.pageNumber) {
						scope.currentPage = page - 1;
					} else {
						scope.change(page);
					}
				}
			}

		};
	}]);
})