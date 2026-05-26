define(['ctrl/module', 'ConfigApi'], function(controllers, ConfigApi) {
	'use strict';
	controllers.controller('discountsettingCtrl', function($scope, $xiuse, $state, $location,$Common) {
		var url1 = window.location.hash;
		$('li[href="' + url1 + '"]').click(function() {
			$(this).addClass("active");
			$(this).siblings().removeClass("active");
		});
		var currentRestaurant = JSON.parse($Common.DecryptByDES_Client(sessionStorage.User)).RestaurantId;
		getDiscount();
		//获取折扣信息
		function getDiscount() {
			$xiuse.GetDiscount(currentRestaurant).then(function(response) {
				$scope.discount = response;
				//$scope.discount= "null";
				if($scope.discount == "null"||$scope.discount == "") {
					$('#discountmessage').hide();
					if($('.tools').children('p').length == 0) {
					var test1 = "<p class=\"wa_message\">该餐厅暂时没有任何折扣信息，可点击折扣或消费进行添加!</p>";
					$('.tools').append(test1);
					}

				}
				else {
					$('.tools').children('p').remove();
					$('#discountmessage').show();
				}
			});
		}
		//获取菜品类别信息
		function getMenuClassify() {
			$xiuse.GetMenuClassify(currentRestaurant).then(function(response) {
				$scope.menuClassify = response.Table;
			});
		}
		//获取菜品
		function getAllMenu(rid, cid) {
			$xiuse.GetAllMenus(rid, cid).then(function(response) {
				$scope.menu = response;
                if($scope.menu == "") {
					$scope.choosemenu = "--请选择分类--";
						$scope.onemenu="0";
				} 
				else{
					$scope.choosemenu = "选择全部";
						$scope.onemenu="0";
				}
			});
		}
		var chom=[];
		var chom1=[];
		//折扣或小费设置
		//创建折扣模态
		$scope.creatdis = function() {
			$('#modalDiscountSetting').modal(
				{	show: true,
				backdrop: 'static',
				keyboard: false}
			);
			$scope.discounttitle = "新建折扣或小费";
			$scope.editflag = false;
			$scope.discountde = new Object();
			$scope.discountde.DiscountType = "0";
			$scope.displaceholder = "例如，打九折输入10，表明账单减免10%";
			$scope.discountde.DiscountSection = "0";
			$scope.discountde.DiscountState = "1";
			$scope.discountde.DiscountVerification = "0";
			$scope.discountde.DiscountMenus = "-1";
			chom=[];

		}
		$scope.changetype = function() {
			if($('input[name="DiscountType"]:checked').val() == "1") {
				$scope.displaceholder = "例如：输入 10，表明账单减免10元";
			} else {
				$scope.displaceholder = "例如：打九折输入10，表明账单减免10%";
			}
		}
		//新建折扣-部分菜品
		
		/*$scope.changedm = function() {
		    
		}*/
		//关闭新建折扣-部分菜品模态框
			   $scope.closemodal= function(){
			   	$('#modalDiscountSetting').modal('show');
			   	$('#modalDiscountMenus').modal('hide');
			   	if(!$scope.editflag)
			{
				$scope.discounttitle = "新建折扣或小费";
			}
			else
			{
				$scope.discounttitle = "编辑折扣或小费";
			}
			   	 	//console.log(chom);
			   }
		//打开折扣-部分菜品模态框
		$scope.discountms= function(){
				$('#modalDiscountMenus').modal({	show: true,
				backdrop: 'static',
				keyboard: false});
			$('#modalDiscountSetting').modal('hide');
			if(!$scope.editflag)
			{
				$scope.discounttitle = "新建折扣或小费——部分菜品";
			$scope.menuTag=chom;	
			}
			else
			{
				$scope.discounttitle = "编辑折扣或小费——部分菜品";
				$scope.menuTag=chom1;
			}
			
			$scope.choosemenu = "--请选择分类--";
			$scope.onemenu="0";
			$scope.onemenuc="0";
			getMenuClassify();
			$('select[name="classify"]').change(function() {
				$scope.cid = $(this).children('option:selected').val(); 
			if($scope.cid == 0) {
				$scope.choosemenu = "--请选择分类--";
			}
				getAllMenu(currentRestaurant, $scope.cid);
				
			}); 
			//$scope.menuTag=chom;
		/*	$('#modalDiscountMenus').modal({	
				show: true,
				backdrop: 'static',
				keyboard: false});
			$('#modalDiscountSetting').modal('hide');
			$scope.discounttitle = "新建折扣或小费——部分菜品";
				$scope.menuTag=[];
			   	var a=$scope.chom;
			   	$scope.menuTag=a;*/
			
		}
		//添加菜品
		//添加函数
		function addm(mtag,idname){
			var tagflag=0;
        	for(var i=0;i<mtag.length;i++){
        		if(mtag[i].id==idname.id)
        		{tagflag=1;
        		break;
        		}
        	}
        	if(tagflag==0)
			mtag.push(idname);
		}
		//添加菜品
			$scope.addmemus = function(onemenu){
				if(onemenu!=0){
					$scope.menuidname=new Object();
					$scope.menuidname.id=onemenu;
					$scope.menuidname.name=$('option[value="'+onemenu+'"]').html();
					addm($scope.menuTag,$scope.menuidname);
					//console.log($scope.menuTag);
				}
				else{
					//添加全部
					 $('select[name="menudetail"] option').each(function(){ //遍历全部option
                         var meid = $(this).val(); //获取option的内容
                         var mename=$(this).html();
                         $scope.menuidname=new Object();
                         if(meid!=0) //如果不是“全部”
                        {
                        	$scope.menuidname.id=meid; //添加到数组中
                        	$scope.menuidname.name=mename;
                        	addm($scope.menuTag,$scope.menuidname);
                        }
    });
				}
			}
			//删除选中菜品
			  $scope.delectmtag= function($index){
        $scope.menuTag.splice($index,1);
      }
			  //保存选择
			    $scope.savechmenu= function(menuTag){
			    $('#modalDiscountSetting').modal('show');
			   	$('#modalDiscountMenus').modal('hide');
			   	$scope.discounttitle = "新建折扣或小费";
			   	chom=menuTag;
			   	//console.log(chom);
			   	$scope.chomid=[];
			   	for(var i=0;i<chom.length;i++){
			   		$scope.chomid.push(chom[i].id);
			   	}
			   	$scope.chomid=$scope.chomid.join();
			   //	console.log($scope.chomid);
			    }
		//创建新折扣保存	  
		 $scope.creatdiscount= function(discountde){
		 	 if(discountde.DiscountName==""||discountde.DiscountName==undefined){
				alert("折扣名称为必填项，请返回填写！");
			}
		 	 else{
		 	 	if(discountde.DiscountContent==""||discountde.DiscountContent==undefined){
		 	 		alert("折扣金额为必填项，请返回填写！");
		 	 	}
		 	 	else
		 	 	{
		 	 		if(discountde.DiscountMenus!="-1")
		 	 		{
		 	 			discountde.DiscountMenus=$scope.chomid;
		 	 		}
		 	 		discountde.RestaurantId=currentRestaurant;
		 	 		//console.log(discountde);
		 	 	}
		 	 }
		 	$xiuse.Adddiscount(discountde)
				.then(function(response) {
					$('#modalDiscountSetting').modal('hide');
					getDiscount();
				    chom=[];

				});
		 }
		 //修改折扣模态框
		$scope.editdiscount=function(discountde){
			$('#modalDiscountSetting').modal({	
				show: true,
				backdrop: 'static',
				keyboard: false});
					$scope.discounttitle = "编辑折扣或小费";
					$scope.editflag = true;
				$scope.temp=new Object();
				chom1=[];
		//	console.log(chom);
			if(discountde.DiscountMenus!="-1"){
				for(var i=0;i<discountde.MenusDetail.length;i++){
					$scope.temp.id=discountde.MenusDetail[i].MenuId;
					$scope.temp.name=discountde.MenusDetail[i].MenuName;
					chom1.push($Common.deepCopy($scope.temp));
				}
				$scope.menuTag=chom1;	
				discountde.DiscountMenus="0";
			}
			//var temp=discountde.MenusDetail;
			//discountde.MenusDetail="";
			//console.log(aaa);
			$scope.discountde=deepCopy(discountde);
			//discountde.MenusDetail=temp;
			//console.log(discountde);
			
		}
		function deepCopy(source) { 
				    var result={};
				    for (var key in source) {
				        result[key] = typeof source[key]==='object'?deepCopy(source[key]): source[key];
				     } 
				   return result; 
				}
			
		//修改扣保存	  
		 $scope.editdiscountsave= function(discountde){
		 	 if(discountde.DiscountName==""||discountde.DiscountName==undefined){
				alert("折扣名称为必填项，请返回填写！");
			}
		 	 else{
		 	 	if(discountde.DiscountContent==""||discountde.DiscountContent==undefined){
		 	 		alert("折扣金额为必填项，请返回填写！");
		 	 	}
		 	 	else
		 	 	{
		 	 		if(discountde.DiscountMenus!="-1")
		 	 		{
		 	 			discountde.DiscountMenus=$scope.chomid;
		 	 		}
		 	 		discountde.RestaurantId=currentRestaurant;
		 	 		//console.log(discountde);
		 	 	}
		 	 }
		 	$xiuse.Editdiscount(discountde)
				.then(function(response) {
					$('#modalDiscountSetting').modal('hide');
					getDiscount();

				});
		 }
	//删除折扣
	$scope.deletediscount= function(discountde){
		if(confirm('您确定要删除折扣种类“' + discountde.DiscountName + '”吗？')) {
			discountde.DiscountState=2;
		//	console.log(discountde);
	      $xiuse.Deletediscount(discountde).then(function(response) {
						$('#modalDiscountSetting').modal('hide');
						getDiscount();
					});
			}
		
		
	}
	});
	
});
