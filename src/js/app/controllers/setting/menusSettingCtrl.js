define(['ctrl/module', 'ConfigApi'], function(controllers, ConfigApi) {
	'use strict';
	controllers.controller('menussettingCtrl', function($scope, $state, $xiuse, $location, $filter,$Common) {
		var url1 = window.location.hash;
		$('li[href="' + url1 + '"]').click(function() {
			$(this).addClass("active");
			$(this).siblings().removeClass("active");
		});
		var currentRestaurant = JSON.parse($Common.DecryptByDES_Client(sessionStorage.User)).RestaurantId;
		//获取菜品类别信息
		getMenuClassify("");
		function getMenuClassify(id) {
			$scope.menuClassify = [];
			$xiuse.GetMenuClassify(currentRestaurant).then(function(response) {
				if(id == "" || id == undefined) {
					if(response.Table.length > 0) {
						/*var tmp = response.Table.filter((p) => {
							return p.ClassifyNo == 1;
						});*/
						var tmp = $Common.GetFilterObj(response.Table,'ClassifyNo',1);
						$scope.cid = tmp.ClassifyId;
						getAllMenu(currentRestaurant, tmp.ClassifyId);
					}
				} else
					$scope.cid = id;
				$scope.menuClassify = response.Table;

			});
		}

		function getAllMenu(rid, cid) {
			$scope.cid = cid;
			$xiuse.GetAllMenus(rid, cid).then(function(response) {
				$scope.menu = response;
				console.log($scope.menu);
				if($scope.menu == "null"||$scope.menu == "") {
					$('#menudetail').children('ul').hide();
					if($('#menudetail').children('p').length == 0) {
						var test1 = "<p class=\"wa_message\">此分类还未添加菜品，点击添加菜品进行添加!</p>";
						$('#menudetail').append(test1);
					}
				} 
				else {
					$('#menudetail').children('p').remove();
					$('#menudetail').children('ul').show();
				}

			});
		}
		$scope.getallmenu = function(cid) {
			getAllMenu(currentRestaurant, cid);
		}

		//菜品设置
		//添加菜品种类模态
		$scope.addclass = function() {
			$scope.classify = [];
			$scope.menuTitle = "添加菜品分类";
			$('#modalMenusClassify').modal('show');
			$('#menuorder').hide();
			$('.deletebtn').hide();
			$('.savebtn').hide();
			$scope.classify.ClassifyNet = "1";
			$('.creatbtn').show();
			//$('input[name="MenusClassNone"]').prop("checked", true);
		};
		//创建新菜品种类
		$scope.creatmenuclass = function() {
			var classifyno = $('#menuclass li').length + 1;
			console.log($scope.classify);
			//var name=$('#MenusClassName').val();
			//var net = $('#ClassNone').is(":checked");
			$xiuse.AddMenuClassify($scope.classify.ClassifyInstruction, classifyno, $scope.classify.ClassifyNet, $scope.classify.ClassifyTag, currentRestaurant)
				.then(function(response) {
					$('#modalMenusClassify').modal('hide');
					getMenuClassify();

				});
		}

		//修改菜品种类模态
		$scope.editmenuclass = function(classify) {
			$scope.classify =$Common.deepCopy(classify) ;
			$scope.menuTitle = "编辑菜品分类";
			$('#modalMenusClassify').modal('show');
			$('#menuorder').show();
			$('.deletebtn').show();
			$('.savebtn').show();
			$('.creatbtn').hide();
		};
		//修改菜品种类保存
		$scope.savemenuclass = function(classify) {
			classify.RestaurantId = currentRestaurant;
			//console.log($scope.classify.ClassifyNet);

			$xiuse.EditMenuClassify(classify)
				.then(function(response) {
					$('#modalMenusClassify').modal('hide');
					getMenuClassify(classify.ClassifyId);
				});
		}
		//删除菜品种类
		$scope.deleteclass = function(classify) {
			classify.RestaurantId = currentRestaurant;
			//console.log(classify);
			if(confirm('您确定要删除菜品种类“' + classify.ClassifyTag + '”吗？')) {
				$xiuse.DeleteMenuClassify(classify)
					.then(function(response) {
						$('#modalMenusClassify').modal('hide');
						getMenuClassify("");
					});
			}
		}
		//添加菜品模态
		$scope.addMenus = function() {
			$scope.menudetail = new Object();
			$scope.editflag = false;
			$scope.menuTag=[];
			$scope.objUrl=null;
			$scope.tags="";
			$scope.menudtitle = "添加菜品";
			$('#modalMenusSetting').modal('show');
			$('#modtab a:first').tab('show');
			$scope.menudetail.SaleState = "0";
			$(".upLoad").css("background-image","url("+$scope.objUrl+")");

		}
		//上传图片预览
		$("#uploadimg").on("change", function() {
			//console.log(this.files[0]);
			$scope.objUrl = getObjectURL(this.files[0]) ; //获取图片的路径，该路径不是图片在本地的路径
            if ($scope.objUrl) {
            	$(".upLoad").css("background-image","url("+$scope.objUrl+")");//将图片路径存入src中，显示出图片
                       }
		});
		function getObjectURL(file) {
			var url = null;
			if(window.createObjectURL != undefined) { // basic
				url = window.createObjectURL(file);
			} else if(window.URL != undefined) { // mozilla(firefox)
				url = window.URL.createObjectURL(file);
			} else if(window.webkitURL != undefined) { // webkit or chrome
				url = window.webkitURL.createObjectURL(file);
			}
			return url;
		}
        //添加标签
        //去重复
        function tagcheck(arry,tag){
        	var tagflag=0;
        	for(var i=0;i<arry.length;i++){
        		if(arry[i]==tag)
        		{tagflag=1;
        		break;
        		}
        	}
        	if(tagflag==0)
        	arry.push(tag);
        }
        //添加标签
        $scope.addtags = function(tags){
        	if(tags==""||tags== undefined){
        	}
        	else{
        		tagcheck($scope.menuTag,tags);
        	}
        }
        //删除标签
        $scope.delecttags= function($index){
        $scope.menuTag.splice($index,1);
        }
		//保存创建菜品
		$scope.mcreat = function(menudetail, cid) {
			menudetail.ClassifyId = cid;
			menudetail.RestaurantId = currentRestaurant;
			menudetail.MenuTag=$scope.menuTag.join();
			menudetail.MenuImage=$scope.objUrl;
           if(menudetail.MenuName==""||menudetail.MenuName==undefined){
				alert("菜品名称为必填项，请返回填写！");
			}
			else
			{
				if($('#menudetail').children('p').length > 0){
					menudetail.MenuNo=1;
				}
				else{
						menudetail.MenuNo=$('#menudetail').children('ul').children('li').length+1;
				}
				console.log(menudetail);
				 	$xiuse.AddMenus(menudetail).then(function(response) {
							$('#modalMenusSetting').modal('hide');
							 getAllMenu(currentRestaurant,$scope.cid);
						});
					
			}
		}
		//编辑菜品模态
		$scope.editmenu=function(menudetail){
			$scope.editflag = true;
			$scope.tags="";
			$scope.menudtitle = "编辑菜品";
			$('#modalMenusSetting').modal('show');
			$('#modtab a:first').tab('show');
			if(menudetail.MenuTag!=""){
			$scope.menuTag=menudetail.MenuTag.split(",");
			}
			else{
				$scope.menuTag=[];
			}
			$scope.objUrl=menudetail.MenuImage;
			$(".upLoad").css("background-image","url("+$scope.objUrl+")");
			$scope.menudetail=$Common.deepCopy(menudetail);
			//console.log($scope.menudetail);
		}
		$scope.medit=function(menudetail){
			menudetail.MenuTag=$scope.menuTag.join();
			menudetail.MenuImage=$scope.objUrl;
				$xiuse.Editmenus(menudetail).then(function(response) {
					$('#modalMenusSetting').modal('hide');
					getAllMenu(currentRestaurant,$scope.cid);
					console.log(menudetail);
				});
			//console.log(menudetail);
		}
		$scope.mdelete = function(menudetail) {
			//console.log(classify);
			if(confirm('您确定要删除菜品种类“' + menudetail.MenuName + '”吗？')) {
				$xiuse.Deletemenus(menudetail)
					.then(function(response) {
						$('#modalMenusSetting').modal('hide');
						getAllMenu(currentRestaurant,$scope.cid);
					});
			}
		}
		
	});
});
