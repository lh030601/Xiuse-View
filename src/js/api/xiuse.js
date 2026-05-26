define(
	[
		'angular',
		'ConfigApi'
	],
	function(angluar, ConfigApi) {
		xiuse = angluar.module('xiuse',[]);
		/*在请求头中添加timespan（时间戳），nonce（随机数），staffId（用户Id），signature（签名参数）　*/
	    /*验证用户传入的header*/
		
		xiuse.factory('$xiuse', ['$http', '$Common','$q','$state',function($http, $Common,$q,$state) {
			return {
				/*获取当前秘钥*/
				KeyClient: function() {
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd_.KeyClient,
						contentType: 'application/json; charset=UTF-8',
						method: 'GET',
						headers: $Common.Header(8),
						data: {},
						params:{}
					}).success(function(response) {
						if(response.Info == 1)
							ConfigApi.Common.KeyClient=response.Data;	
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
					});
					return defer.promise;
				
				},
				/*获取当前秘钥*/
				Key: function() {
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.Key,
						contentType: 'application/json; charset=UTF-8',
						method: 'GET',
						headers: $Common.Header(8),
						data: {},
						params:{}
					}).success(function(response) {
						if(response.Info == 1)
							ConfigApi.Common.Key=response.Data;	
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
					});
					return defer.promise;
				
				},
				/*登录系统*/
				Login: function(userName,psw) {
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.Login,
						contentType: 'application/json; charset=UTF-8',
						method: 'POST',
						headers: $Common.Header(8),
						data: {'UserNameDS':userName,'PassWordDS':psw},
						params:{}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
						$Common.DealError(code);/*处理错误请求*/
					});
					return defer.promise;
				
				},
				/*添加会员*/
				AddMember: function(Type,Cell,Email,CardNum,Name,None,NoneCheck,Rid) {
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.AddMembers,
						contentType: 'application/json; charset=UTF-8',
						method: 'POST',
						headers: $Common.Header(8),
						data: {'MemberClassifyId':Type,'MemberCell':Cell,'MemberEmail':Email,'MemberCardNo':CardNum,'MemberName':Name,'MemberPassword':None,'NoneCheck':NoneCheck,'RestaurantId':Rid},
						params:{}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
						$Common.DealError(code);/*处理错误请求*/
					});
					return defer.promise;
				
				},
				//修改会员密码
				SetMPassword:function(mid,pwd,Rid) {
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.SetMPassword,
						contentType: 'application/json; charset=UTF-8',
						method: 'POST',
						headers: $Common.Header(8),
						data: {'MemberId':mid,'MemberPassword':pwd,'RestaurantId':Rid},
						params:{}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
						$Common.DealError(code);/*处理错误请求*/
					});
					return defer.promise;
				
				},
				//修改会员信息
				EditMember:function(mid,Type,Cell,Email,Name,Rid) {
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.EditMembers,
						contentType: 'application/json; charset=UTF-8',
						method: 'POST',
						headers: $Common.Header(8),
						data: {'MemberId':mid,'MemberClassifyId':Type,'MemberCell':Cell,'MemberEmail':Email,'MemberName':Name,'RestaurantId':Rid},
						params:{}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
						$Common.DealError(code);/*处理错误请求*/
					});
					return defer.promise;
				
				},
				/*获取随机会员卡号*/
				GetCardId:function(){
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.GetMemberCardId,
						contentType: 'application/json; charset=UTF-8',
						method: 'GET',
						headers: $Common.Header(8),
						data: {},
						params:{}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
						$Common.DealError(code);/*处理错误请求*/
					});
					return defer.promise;
				},
				//新建会员类型
				AddMemberType: function(Name,Did,Remark,Rid) {
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.AddMemberType,
						contentType: 'application/json; charset=UTF-8',
						method: 'POST',
						headers: $Common.Header(8),
						data: {'ClassifyName':Name,'DiscountId':Did,'ClassRemark':Remark,'RestaurantId':Rid},
						params:{}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
						$Common.DealError(code);/*处理错误请求*/
					});
					return defer.promise;
				
				},
				//编辑会员类型
				EditMemberType:function(Mtid,Name,Did,Remark,Rid) {
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.EditMembersType,
						contentType: 'application/json; charset=UTF-8',
						method: 'POST',
						headers: $Common.Header(8),
						data: {'MemberClassifyId':Mtid,'ClassifyName':Name,'DiscountId':Did,'ClassRemark':Remark,'RestaurantId':Rid},
						params:{}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
						$Common.DealError(code);/*处理错误请求*/
					});
					return defer.promise;
				
				},
				//删除会员类型
				DeleteMemberType:function(Mtid,Rid) {
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.DeleteMembersType,
						contentType: 'application/json; charset=UTF-8',
						method: 'POST',
						headers: $Common.Header(8),
						data: {'MemberClassifyId':Mtid,'RestaurantId':Rid},
						params:{}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
						$Common.DealError(code);/*处理错误请求*/
					});
					return defer.promise;
				
				},
				/*获取所有会员信息*/
				GetMembers:function(RestaurtId){
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.Members,
						contentType: 'application/json; charset=UTF-8',
						method: 'GET',
						headers: $Common.Header(8),
						data: {},
						params:{'RestaurantId':RestaurtId}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
						$Common.DealError(code);/*处理错误请求*/
					});
					return defer.promise;
				},
				//修改会员状态
				SetMemberState:function(mid,mst) {
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.MemberState,
						contentType: 'application/json; charset=UTF-8',
						method: 'POST',
						headers: $Common.Header(8),
						data: {'MemberId':mid,'MemberState':mst},
						params:{}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
						$Common.DealError(code);/*处理错误请求*/
					});
					return defer.promise;
				
				},
				
			 //会员充值
			 AddReCharge:function(mid,cid,rtype,money) {
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.AddReCharge,
						contentType: 'application/json; charset=UTF-8',
						method: 'POST',
						headers: $Common.Header(8),
						data: {'MemberId':mid,'MemberCardNo':cid,'RechargeType':rtype,'RechargeAmount':money},
						params:{}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
						$Common.DealError(code);/*处理错误请求*/
					});
					return defer.promise;
				
				},
				/*获取所有消费记录*/
				GetConsume:function(RestaurtId){
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.Consume,
						contentType: 'application/json; charset=UTF-8',
						method: 'GET',
						headers: $Common.Header(8),
						data: {},
						params:{'RestaurantId':RestaurtId}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
						$Common.DealError(code);/*处理错误请求*/
					});
					return defer.promise;
				},
				/*获取所有充值记录*/
				GetRecharge:function(RestaurtId){
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.Recharge,
						contentType: 'application/json; charset=UTF-8',
						method: 'GET',
						headers: $Common.Header(8),
						data: {},
						params:{'RestaurantId':RestaurtId}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
						$Common.DealError(code);/*处理错误请求*/
					});
					return defer.promise;
				},
				/*获取所有返现记录*/
				GetRebates:function(RestaurtId){
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.Rebates,
						contentType: 'application/json; charset=UTF-8',
						method: 'GET',
						headers: $Common.Header(8),
						data: {},
						params:{'RestaurantId':RestaurtId}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
						$Common.DealError(code);/*处理错误请求*/
					});
					return defer.promise;
				},
				/*获取所有会员类型*/
				GetMembersType:function(RestaurtId){
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.MembersType,
						contentType: 'application/json; charset=UTF-8',
						method: 'GET',
						headers: $Common.Header(8),
						data: {},
						params:{'RestaurantId':RestaurtId}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
						$Common.DealError(code);/*处理错误请求*/
					});
					return defer.promise;
				},
				//获取所有的折扣信息
				GetDiscount:function(RestaurtId){
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.Discount,
						contentType: 'application/json; charset=UTF-8',
						method: 'GET',
						headers: $Common.Header(8),
						data: {},
						params:{'RestaurantId':RestaurtId}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
						$Common.DealError(code);/*处理错误请求*/
					});
					return defer.promise;
				},
 				//创建新折扣
				Adddiscount:function(discountde) {
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.Adddiscount,
						contentType: 'application/json; charset=UTF-8',
						method: 'POST',
						headers: $Common.Header(8),
						data: discountde,
						params:{}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
						$Common.DealError(code);/*处理错误请求*/
					});
					return defer.promise;
				
				},
				//修改折扣
				Editdiscount:function(discountde) {
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.Editdiscount,
						contentType: 'application/json; charset=UTF-8',
						method: 'POST',
						headers: $Common.Header(8),
						data: discountde,
						params:{}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
						$Common.DealError(code);/*处理错误请求*/
					});
					return defer.promise;
				
				},
				//删除折扣
				Deletediscount:function(discountde) {
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.Deletediscount,
						contentType: 'application/json; charset=UTF-8',
						method: 'POST',
						headers: $Common.Header(8),
						data: discountde,
						params:{}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
						$Common.DealError(code);/*处理错误请求*/
					});
					return defer.promise;
				
				},
				//获取菜品类别
				GetMenuClassify:function(RestaurtId){
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.MenuClassify,
						contentType: 'application/json; charset=UTF-8',
						method: 'GET',
						headers: $Common.Header(8),
						data: {},
						params:{'RestaurantId':RestaurtId}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
						$Common.DealError(code);/*处理错误请求*/
					});
					return defer.promise;
				},
				//添加菜品种类
				AddMenuClassify:function(classinfo,cno,net,name,rid) {
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.AddMenuClassify,
						contentType: 'application/json; charset=UTF-8',
						method: 'POST',
						headers: $Common.Header(8),
						data: {'ClassifyInstruction':classinfo,'ClassifyNo':cno,'ClassifyNet':net,'ClassifyTag':name,'RestaurantId':rid},
						params:{}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
						$Common.DealError(code);/*处理错误请求*/
					});
					return defer.promise;
				
				},
				//修改菜品种类
				EditMenuClassify:function(classify) {
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.EditMenuClassify,
						contentType: 'application/json; charset=UTF-8',
						method: 'POST',
						headers: $Common.Header(8),
						data: classify,
						params:{}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
						$Common.DealError(code);/*处理错误请求*/
					});
					return defer.promise;
				
				},
				//删除菜品种类
				DeleteMenuClassify:function(classify) {
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.DeleteMenuClassify,
						contentType: 'application/json; charset=UTF-8',
						method: 'POST',
						headers: $Common.Header(8),
						data: classify,
						params:{}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
						$Common.DealError(code);/*处理错误请求*/
					});
					return defer.promise;
				
				},
				//获取各种类菜品
				GetAllMenus:function(RestaurtId,ClassifyId){
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.AllMenus,
						contentType: 'application/json; charset=UTF-8',
						method: 'GET',
						headers: $Common.Header(8),
						data: {},
						params:{'RestaurantId':RestaurtId,'MenuClassifyId':ClassifyId}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
						$Common.DealError(code);/*处理错误请求*/
					});
					return defer.promise;
				},
				//添加从菜品
				AddMenus:function(menusdetail) {
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.AddMenus,
						contentType: 'application/json; charset=UTF-8',
						method: 'POST',
						headers: $Common.Header(8),
						data: menusdetail,
						params:{}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
						$Common.DealError(code);/*处理错误请求*/
					});
					return defer.promise;
				},
				//编辑菜品
				Editmenus:function(menusdetail) {
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.Editmenus,
						contentType: 'application/json; charset=UTF-8',
						method: 'POST',
						headers: $Common.Header(8),
						data: menusdetail,
						params:{}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
						$Common.DealError(code);/*处理错误请求*/
					});
					return defer.promise;
				},
				//删除菜品
				Deletemenus:function(menusdetail) {
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.Deletemenus,
						contentType: 'application/json; charset=UTF-8',
						method: 'POST',
						headers: $Common.Header(8),
						data: menusdetail,
						params:{}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
						$Common.DealError(code);/*处理错误请求*/
					});
					return defer.promise;
				},
				//设置-获取餐桌状态
				setGetDesks:function(RestaurtId){
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.GetDesks,
						contentType: 'application/json; charset=UTF-8',
						method: 'GET',
						headers: $Common.Header(8),
						data: {},
						params:{'RestaurantId':RestaurtId}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
						$Common.DealError(code);/*处理错误请求*/
					});
					return defer.promise;
				},
				//设置-添加餐桌
				AddDesks:function(desk) {
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.AddDesks,
						contentType: 'application/json; charset=UTF-8',
						method: 'POST',
						headers: $Common.Header(8),
						data: desk,
						params:{}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
						$Common.DealError(code);/*处理错误请求*/
					});
					return defer.promise;
				},
				//编辑餐桌
				EditDesks:function(desk) {
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.EditDesks,
						contentType: 'application/json; charset=UTF-8',
						method: 'POST',
						headers: $Common.Header(8),
						data: desk,
						params:{}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
						$Common.DealError(code);/*处理错误请求*/
					});
					return defer.promise;
				},
					//删除餐桌
				DeleteDesks:function(deskID) {
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.DeleteDesks,
						contentType: 'application/json; charset=UTF-8',
						method: 'POST',
						headers: $Common.Header(8),
						data:{'DeskId':deskID},
						params:{}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
						$Common.DealError(code);/*处理错误请求*/
					});
					return defer.promise;
				},
				//获取员工信息
				GetEmployee:function(RestaurtId){
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.GetEmployee,
						contentType: 'application/json; charset=UTF-8',
						method: 'GET',
						headers: $Common.Header(8),
						data: {},
						params:{'RestaurantId':RestaurtId}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
						$Common.DealError(code);/*处理错误请求*/
					});
					return defer.promise;
				},
				//增添新员工
				AddEmployee:function(employee) {
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.AddEmployee,
						contentType: 'application/json; charset=UTF-8',
						method: 'POST',
						headers: $Common.Header(8),
						data: employee,
						params:{}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
						$Common.DealError(code);/*处理错误请求*/
					});
					return defer.promise;
				},
				//修改员工信息
				EditEmployee:function(employee) {
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.EditEmployee,
						contentType: 'application/json; charset=UTF-8',
						method: 'POST',
						headers: $Common.Header(8),
						data: employee,
						params:{}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
						$Common.DealError(code);/*处理错误请求*/
					});
					return defer.promise;
				},
				//删除员工、改变状态
				 DeleteEmployee:function(empid,empstate) {
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.DeleteEmployee,
						contentType: 'application/json; charset=UTF-8',
						method: 'POST',
						headers: $Common.Header(8),
						data:{'UserId':empid,'DelTag':empstate},
						params:{}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
						$Common.DealError(code);/*处理错误请求*/
					});
					return defer.promise;
				},
				/*获取所有店铺的餐桌状态*/
				GetDeskes:function(RestaurtId){
					var defer = $q.defer(); /*使当前请求为异步请求，发出请求之后会返回一个promis，执行下一个请求*/
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.Desks,
						contentType: 'application/json; charset=UTF-8',
						method: 'GET',
						headers: $Common.Header(8),
						data: {},
						params:{'RestaurantId':RestaurtId}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
						$Common.DealError(code);/*处理错误请求*/
					});
					return defer.promise;
				},
				/*获取店铺的所有餐单*/
				GetMenus:function(RestaurtId)
				{
					var defer = $q.defer(); 
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.Menus,
						contentType: 'application/json; charset=UTF-8',
						method: 'GET',
						headers: $Common.Header(8),
						data: {},
						params:{'RestaurantId':RestaurtId}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						$Common.DealError(code);/*处理错误请求*/
						defer.resolve(code);
					});
					return defer.promise;
				},
				/*获取当前用户信息*/
				GetMyUser:function()
				{
					var defer = $q.defer(); 
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.User,
						contentType: 'application/json; charset=UTF-8',
						method: 'GET',
						headers: $Common.Header(8),
						data: {},
						params:{'id':ConfigApi.Common.Token.StaffId}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						$Common.DealError(code);/*处理错误请求*/
						defer.resolve(code);
					});
					return defer.promise;
				},
				/*获取当前餐厅的信息*/
				GetMyRestaurant:function(RestaurtId)
				{
					var defer = $q.defer(); 
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.Restaurant,
						contentType: 'application/json; charset=UTF-8',
						method: 'GET',
						headers: $Common.Header(8),
						data: {},
						params:{'RestaurantId':RestaurtId}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						$Common.DealError(code);/*处理错误请求*/
						defer.resolve(code);
					});
					return defer.promise;
				},
				/*下单订单*/
				AddOrderBill:function(order){
					var defer = $q.defer(); 
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.AddOrderBill,
						contentType: 'application/json; charset=UTF-8',
						method: 'Post',
						headers: $Common.Header(8),
						data: order,
						params:{}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						$Common.DealError(code);/*处理错误请求*/
						defer.resolve(code);
					});
					return defer.promise;
				},
				/*获取当日营业额*/
				DailyTurnover:function(RestaurtId)
				{
					var defer = $q.defer(); 
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.DailyTurnover,
						contentType: 'application/json; charset=UTF-8',
						method: 'GET',
						headers: $Common.Header(8),
						data: {},
						params:{'RestaurantId':RestaurtId}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						$Common.DealError(code);/*处理错误请求*/
						defer.resolve(code);
					});
					return defer.promise;
				},
				//获取当日热门菜品
				  DailyHotMenus:function(RestaurtId)
				{
					var defer = $q.defer(); 
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.DailyHotMenus,
						contentType: 'application/json; charset=UTF-8',
						method: 'GET',
						headers: $Common.Header(8),
						data: {},
						params:{'RestaurantId':RestaurtId}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						$Common.DealError(code);/*处理错误请求*/
						defer.resolve(code);
					});
					return defer.promise;
				},
				/*当日账单*/
				DailyBillsss:function(RestaurtId)
				{
					var defer = $q.defer(); 
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.DailyBillsss,
						contentType: 'application/json; charset=UTF-8',
						method: 'GET',
						headers: $Common.Header(8),
						data: {},
						params:{'RestaurantId':RestaurtId}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						$Common.DealError(code);/*处理错误请求*/
						defer.resolve(code);
					});
					return defer.promise;
				},
				/*营业额下载*/
				 TurnoverExcel:function(BeginTime,EndTime,RestaurtId)
				{
					var defer = $q.defer(); 
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.TurnoverExcel,
						contentType: 'application/json; charset=UTF-8',
						method: 'GET',
						headers: $Common.Header(8),
						data: {},
						responseType:'blob', 
						params:{'BeginTime':BeginTime,'EndTime':EndTime,'RestaurantId':RestaurtId}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						$Common.DealError(code);/*处理错误请求*/
						defer.resolve(code);
					});
					return defer.promise;
				},
				/*营业额邮件*/
				TurnoverEmail:function(BeginTime,EndTime,RestaurtId)
				{
					var defer = $q.defer(); 
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.TurnoverEmail,
						contentType: 'application/json; charset=UTF-8',
						method: 'GET',
						headers: $Common.Header(8),
						data: {},
						responseType:'blob', 
						params:{'BeginTime':BeginTime,'EndTime':EndTime,'RestaurantId':RestaurtId}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						$Common.DealError(code);/*处理错误请求*/
						defer.resolve(code);
					});
					return defer.promise;
				},
				//退单
				BackOrder:function(order){
					var defer = $q.defer(); 
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.BackOrder,
						contentType: 'application/json; charset=UTF-8',
						method: 'Post',
						headers: $Common.Header(8),
						data: order,
						params:{}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						$Common.DealError(code);/*处理错误请求*/
						defer.resolve(code);
					});
					return defer.promise;
				},
				//运营分析
				OperAnalysis:function(RestaurtId,BeginDate,EndDate)
				{
					var defer = $q.defer(); 
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.OperAnalysis,
						contentType: 'application/json; charset=UTF-8',
						method: 'GET',
						headers: $Common.Header(8),
						data: {},
						params:{'RestaurantId':RestaurtId,'beginDT':BeginDate,'EndDT':EndDate}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						$Common.DealError(code);/*处理错误请求*/
						defer.resolve(code);
					});
					return defer.promise;
				},
				//营业额数据图示数据来源
				TurnoverCharts:function(RestaurtId,BeginDate,EndDate)
				{
					var defer = $q.defer(); 
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.TurnoverCharts,
						contentType: 'application/json; charset=UTF-8',
						method: 'GET',
						headers: $Common.Header(8),
						data: {},
						params:{'RestaurantId':RestaurtId,'beginDT':BeginDate,'EndDT':EndDate}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						$Common.DealError(code);/*处理错误请求*/
						defer.resolve(code);
					});
					return defer.promise;
				},
				//下单情况详情图示数据来源
				 OrderCharts:function(RestaurtId,BeginDate,EndDate)
				{
					var defer = $q.defer(); 
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.OrderCharts,
						contentType: 'application/json; charset=UTF-8',
						method: 'GET',
						headers: $Common.Header(8),
						data: {},
						params:{'RestaurantId':RestaurtId,'beginDT':BeginDate,'EndDT':EndDate}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						$Common.DealError(code);/*处理错误请求*/
						defer.resolve(code);
					});
					return defer.promise;
				},
				//翻台数据
				 RepeatTable:function(RestaurtId,BeginDate,EndDate)
				{
					var defer = $q.defer(); 
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.RepeatTable,
						contentType: 'application/json; charset=UTF-8',
						method: 'GET',
						headers: $Common.Header(8),
						data: {},
						params:{'RestaurantId':RestaurtId,'beginDT':BeginDate,'EndDT':EndDate}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						$Common.DealError(code);/*处理错误请求*/
						defer.resolve(code);
					});
					return defer.promise;
				},
				//设置翻台时间段
				SetRepeatTime:function(settimepart){
					var defer = $q.defer(); 
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.SetRepeatTime,
						contentType: 'application/json; charset=UTF-8',
						method: 'Post',
						headers: $Common.Header(8),
						data: settimepart,
						params:{}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						$Common.DealError(code);/*处理错误请求*/
						defer.resolve(code);
					});
					return defer.promise;
				},
				/*分析表格*/
				AnalysisTable:function(paramsdetail,URL1)
				{
					var defer = $q.defer(); 
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.AnalysisTable+URL1,
						contentType: 'application/json; charset=UTF-8',
						method: 'GET',
						headers: $Common.Header(8),
						data: {},
						params:paramsdetail
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						$Common.DealError(code);/*处理错误请求*/
						defer.resolve(code);
					});
					return defer.promise;
				},
				/*获取当前餐桌的未清台的订单，详细菜品*/
				DeskOrder:function(DeskId){
					var defer = $q.defer(); 
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.DeskOrder,
						contentType: 'application/json; charset=UTF-8',
						method: 'GET',
						headers: $Common.Header(8),
						data: {},
						params:{"DeskId":DeskId}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						$Common.DealError(code);/*处理错误请求*/
						defer.resolve(code);
					});
					return defer.promise;
				},
				/*获取当前餐桌的未清台的订单，没有详细菜品*/
				DeskOrderSin:function(DeskId){
					var defer = $q.defer(); 
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.DeskOrderSin,
						contentType: 'application/json; charset=UTF-8',
						method: 'GET',
						headers: $Common.Header(8),
						data: {},
						params:{"DeskId":DeskId}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						$Common.DealError(code);/*处理错误请求*/
						defer.resolve(code);
					});
					return defer.promise;
				},
				/*获取订单的详细信息*/
				OrderDetail:function(OrderId){
					var defer = $q.defer(); 
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.OrderDetail,
						contentType: 'application/json; charset=UTF-8',
						method: 'GET',
						headers: $Common.Header(8),
						data: {},
						params:{"OrderId":OrderId}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						$Common.DealError(code);/*处理错误请求*/
						defer.resolve(code);
					});
					return defer.promise;
				},
				/*更新菜单的上菜信息*/
				UpdateMenuServing:function(Menu){
					var defer = $q.defer(); 
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.UpdateMenuServing,
						contentType: 'application/json; charset=UTF-8',
						method: 'Post',
						headers: $Common.Header(8),
						data: Menu,
						params:{}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						$Common.DealError(code);/*处理错误请求*/
						defer.resolve(code);
					});
					return defer.promise;
				},
				/*清台*/
				CleanDesk:function(DeskId){
					var defer = $q.defer(); 
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd_.ClearDesk,
						contentType: 'application/json; charset=UTF-8',
						method: 'POST',
						headers: $Common.Header(8),//
						data: {"DeskId":DeskId},
						params:{}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						$Common.DealError(code);/*处理错误请求*/
						defer.resolve(code);
					});
					return defer.promise;
				},
				/*清台(清理餐厅的所有餐桌)*/
				CleanRestaurantDesk:function(RestaurantId){
					var defer = $q.defer(); 
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd_.CleanRestaurantDesk,
						contentType: 'application/json; charset=UTF-8',
						method: 'POST',
						headers: $Common.Header(8),//
						data: {"RestaurantId":RestaurantId},
						params:{}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						$Common.DealError(code);/*处理错误请求*/
						defer.resolve(code);
					});
					return defer.promise;
				},
				/*获取今日完成的账单*/
				DailyBills:function(DeskId){
					var defer = $q.defer(); 
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd_.DailyBills,
						contentType: 'application/json; charset=UTF-8',
						method: 'Get',
						headers: $Common.Header(8),
						data: {},
						params:{"deskId":DeskId}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						$Common.DealError(code);/*处理错误请求*/
						defer.resolve(code);
					});
					return defer.promise;
				},
				/*转换餐桌*/
				SwitchDesk:function(OrderId,OldDeskId,NewDeskId){
					var defer = $q.defer(); 
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd_.SwitchDesk,
						contentType: 'application/json; charset=UTF-8',
						method: 'POST',
						headers: $Common.Header(8),
						data: {"orderId":OrderId,"oldTableId":OldDeskId,"newTableId":NewDeskId},
						params:{}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						$Common.DealError(code);/*处理错误请求*/
						defer.resolve(code);
					});
					return defer.promise;
				},
				/*订单添加菜品*/
				AddOrderMenus:function(Menus){
					var defer = $q.defer(); 
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd_.AddOrderMenus,
						contentType: 'application/json; charset=UTF-8',
						method: 'Post',
						headers: $Common.Header(8),
						data: Menus,
						params:{}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						$Common.DealError(code);/*处理错误请求*/
						defer.resolve(code);
					});
					return defer.promise;
				},
				/*获取餐厅的服务员*/
			GetWorker:function(RestaurantId){
				var defer = $q.defer(); 
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd_.Worker,
						contentType: 'application/json; charset=UTF-8',
						method: 'Get',
						headers: $Common.Header(8),
						data: {},
						params:{'restaurantId':RestaurantId}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						$Common.DealError(code);/*处理错误请求*/
						defer.resolve(code);
					});
					return defer.promise;
				},
			/*获取获取整单折扣信息*/
			EntireDiscount:function(RestaurantId){
				var defer = $q.defer(); 
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd_.EntireDiscount,
						contentType: 'application/json; charset=UTF-8',
						method: 'Get',
						headers: $Common.Header(8),
						data: {},
						params:{'RestaurantId':RestaurantId}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						$Common.DealError(code);/*处理错误请求*/
						defer.resolve(code);
					});
					return defer.promise;
				},
			/*获取单品折扣信息*/
			SingleDiscount:function(RestaurantId,MenuId){
				var defer = $q.defer(); 
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd_.SingleDiscount,
						contentType: 'application/json; charset=UTF-8',
						method: 'Get',
						headers: $Common.Header(8),
						data: {},
						params:{'RestaurantId':RestaurantId,'MenuId':MenuId}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						$Common.DealError(code);/*处理错误请求*/
						defer.resolve(code);
					});
					return defer.promise;
				},
				/*验证整单折扣信息*/
			TellDiscount:function(TellUser){
				var defer = $q.defer(); 
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd_.TellDiscount,
						contentType: 'application/json; charset=UTF-8',
						method: 'POST',
						headers: $Common.Header(8),
						data: TellUser,
						params:{}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						$Common.DealError(code);/*处理错误请求*/
						defer.resolve(code);
					});
					return defer.promise;
				},
				/*获取店铺的管理员信息*/
				MangeUser:function(RestaurantId){
				var defer = $q.defer(); 
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd_.MangeUser,
						contentType: 'application/json; charset=UTF-8',
						method: 'Get',
						headers: $Common.Header(8),
						data: {},
						params:{'RestaurantId':RestaurantId}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						$Common.DealError(code);/*处理错误请求*/
						defer.resolve(code);
					});
					return defer.promise;
				},
				/*获取当前餐桌的未付款的订单*/
				DefaultOrderBill:function(DeskId){
				var defer = $q.defer(); 
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd_.DefaultOrderBill,
						contentType: 'application/json; charset=UTF-8',
						method: 'Get',
						headers: $Common.Header(8),
						data: {},
						params:{'DeskId':DeskId}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						$Common.DealError(code);/*处理错误请求*/
						defer.resolve(code);
					});
					return defer.promise;
				},
				CheckoutOrderBill:function(Bill){
				var defer = $q.defer(); 
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd_.CheckoutOrderBill,
						contentType: 'application/json; charset=UTF-8',
						method: 'Post',
						headers: $Common.Header(8),
						data: Bill,
						params:{}
					}).success(function(response) {
						$Common.DealError(response.StatusCode);/*处理错误请求*/
						defer.resolve(response);
					}).error(function(e, code) {
						$Common.DealError(code);/*处理错误请求*/
						defer.resolve(code);
					});
					return defer.promise;
				},
				/*验证用户是否登录*/
				AuthenticatedUser:function(Token){
				var defer = $q.defer(); 
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd_.AuthenticatedUser,
						contentType: 'application/json; charset=UTF-8',
						method: 'Post',
						headers: $Common.Header(8),
						data: Token,
						params:{}
					}).success(function(response) {
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
					});
					return defer.promise;
				},
				/*获取餐桌的状态*/
				DeskState:function(DeskId){
				var defer = $q.defer(); 
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd_.DeskState,
						contentType: 'application/json; charset=UTF-8',
						method: 'Get',
						headers: $Common.Header(8),
						data: {},
						params:{"DeskId":DeskId}
					}).success(function(response) {
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
					});
					return defer.promise;
				},
				/*查询会员(会员支付)*/
				GetMember:function(exp,RestanrantId){
				var defer = $q.defer(); 
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd_.GetMember,
						contentType: 'application/json; charset=UTF-8',
						method: 'Get',
						headers: $Common.Header(8),
						data: {},
						params:{"exp":exp,"RestanrantId":RestanrantId}
					}).success(function(response) {
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
					});
					return defer.promise;
				},
				/*验证会员信息*/
				AuthMemberPass:function(Member){
				var defer = $q.defer(); 
					$http({
						url: ConfigApi.BackEnd.Ip+ConfigApi.BackEnd_.AuthMemberPass,
						contentType: 'application/json; charset=UTF-8',
						method: 'POST',
						headers: $Common.Header(8),
						data: Member,
						params:{}
					}).success(function(response) {
						defer.resolve(response);
					}).error(function(e, code) {
						defer.resolve(code);
					});
					return defer.promise;
				}
			}
		}]);
		

	}
)
