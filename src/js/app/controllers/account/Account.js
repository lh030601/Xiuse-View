define(['ctrl/module'], function(controllers) {
	'use strict';
	controllers.controller('accountsCtrl', function($scope, $location, $xiuse, $Common, $state, $stateParams, $filter, $rootScope) {
		/*获取是否添加订单的菜品,为null,重新创建订单.不为null,订单号.*/
		var OrderId = null;/*当前订单*/
		var CurrentDesk = null;/*当前餐桌*/
		var User = null;/*当前用户*/
		var CurrentType = 0,LastCurrentType=0;/*选择支付类型*/
		var CheckOutState = false;
		$scope.PayTable = false;/*会员内容*/
		Init(); /*初始化页面*/
		$('#account_desk_modal').on('hidden.bs.modal', function(e) {
			$(this).removeData("bs.modal");
		})
		$('#modalDiscount').on('hidden.bs.modal', function(e) {
			$scope.PaySelect(LastCurrentType);
		})
		/*切换餐桌*/
		$rootScope.AccountSwitchDesk = function() {
				Init();
			}
		/*设置当前付款金额*/
		$rootScope.SetAccount = function(account){
			switch(CurrentType){
				case 0:{
				    $scope.Bill.Cash = account;
					CutBill();
				    break;
				}
				case 1:{
					 $scope.Bill.BankCard = account;
					 CutBill();
				    break;
				}
				case 2:{
					 $scope.Bill.WeiXin = account;
					 CutBill();
				    break;
				}
				case 3:{
					 if($scope.Member.MemberEnabledPassWord == 1&&!$scope.Member.Pass)
					 {
					 	$('#MemberPass').modal({keyboard: false,show: true});
					 	$scope.AccountModel.reset();
					 }
					 else if($scope.Member.MemberEnabledPassWord == 0||$scope.Member.Pass)
					 	{
					 		if(account<=$scope.Bill.AccountsPayable &&$scope.Member.MemberAmount >=account)
					 			$scope.Bill.MembersCard = account;
					 		else if($scope.Member.MemberAmount >=account&&account>$scope.Bill.AccountsPayable)
					 		{
					 			$scope.Bill.MembersCard = $scope.Bill.AccountsPayable;
					 			$scope.AccountModel.resetValue($scope.Bill.AccountsPayable);
					 			alert("超过会员账户支付金额超过应付款金额！");
					 		}
					 		else if($scope.Member.MemberAmount <account){
					 			$scope.Bill.MembersCard = $scope.Member.MemberAmount>$scope.Bill.AccountsPayable?$scope.Bill.AccountsPayable:$scope.Member.MemberAmount;
					 			$scope.AccountModel.resetValue($scope.Bill.MembersCard);
					 			alert("超过会员账户的总金额！");
					 		}
					 	}
					 
					 CutBill();
				    break;
				}
				case 4:{
					 $scope.Bill.Alipay = account;
					 CutBill();
				    break;
				}
				default:
				{
					break;
				}
			}
			
		}
		/*切换餐桌*/
		$scope.PopDesk_modal = function() {
				$rootScope.obj = {
					"State": 2
				}; /*指引弹出选择控制函数*/
				$('#account_desk_modal').modal({
					keyboard: false,
					show: true
				});
			}
			/*服务员*/
		$scope.PopSerive = function() {

				$xiuse.GetWorker(User.RestaurantId).then(function(response) {
					$scope.Waiter = response;
					$('#waiter').modal({
						keyboard: false,
						show: true
					});
				});

			}
			/*结账的备注*/
		$scope.PopRemak = function() {
				$('#addRemark').modal({
					keyboard: false,
					show: true
				});
			}
			/*打印单据*/
		$scope.PopPrint = function() {
				$('#printContent').modal({
					keyboard: false,
					show: true
				});
			}
			/*关闭服务员弹出模态*/
		$scope.CloseSerive = function(obj) {
				$('#waiter').modal("hide");
			}
			/*弹出折扣、小费、抹零才、初始化整单折扣的信息的窗口*/
		$scope.AddDiscount = function() {
			LastCurrentType = CurrentType;
			if(CurrentType < 5)
				$scope.PaySelect(100);
			$scope.WipeModel.reset();
			$scope.TipModel.reset();
			$scope.discountValidate = false;
			$scope.Psw = "";
			$xiuse.MangeUser(User.RestaurantId).then(function(response){
				if(response.Info == 1)
					$scope.ManageUser = response.Data;
				$('#modalDiscount').modal({
					keyboard: false,
					show: true
				});
			});
			

		}
		/*切换当前默认的付款方式*/
		$scope.PaySelect = function(type){
			if(type == 3){
				
				if($scope.Bill.MembersCard ==0){
					$scope.MemberExp ="";
					$scope.Member = null;
					$scope.PayTable = false;
				}
				$('#Member').modal({
					keyboard: true,
					show: true
				});
				
			}
				
			CurrentType = type;
		}
		$('#Member').on('shown.bs.modal', function () {$('#Member input').focus();});
		$('#MemberPass').on('shown.bs.modal', function () {$('#MemberPass input').focus();});
		/*搜索支付会员*/
		$scope.LookMember = function(info){
			if(info == undefined||info == null||info == "")
				{alert("请输入手机号或会员卡号");return;}
			$scope.Bill.MembersCard = 0;
			$xiuse.GetMember(info,User.RestaurantId).then(function(response){
				if(response.Info == 1){
					$scope.Member = response.Data;
					$scope.PayTable = true;
					$scope.Member.Pass = false;
				}
				else{
					$scope.PayTable = false;
					alert("没有此会员！");
				}
					
			});
		}
		/*查询会员回车按钮*/
		 $scope.LookMemberEvent = function(e,Info) {
	        var keycode = window.event?e.keyCode:e.which;
	        if(keycode==13){
	        	if($scope.Member == undefined||$scope.Member == null)
	           		$scope.LookMember(Info);
	           	else
	           		$scope.PayMember();
	        }
    	}
    
		/*支付按钮*/
		$scope.PayMember = function(){
			if($scope.Member == undefined||$scope.Member == null)
				{
					alert("没有获取会员信息");
					$scope.PayTable = false;
					return;
				}
			if($scope.Member.MemberEnabledPassWord == 1&&!$scope.Member.Pass){
				$('#MemberPass').modal({keyboard: false,show: true});
				
			}
			else{
				
				$('#MemberPayInfo').modal({keyboard: false,show: true});
				$('#Member').modal('hide');
			}
		}
		
		/*检查会员密码*/
		$scope.CheckMemberPass = function(pws){
			if($scope.Member == undefined||$scope.Member == null)
				{
					alert("没有获取会员信息");
					return;
				}
			if($scope.memberPass == undefined||$scope.memberPass == null||$scope.memberPass == ""){
				alert("请输入密码！");
				return;
			}
			$scope.Member.MemberPassword = $Common.EncryptByDES($scope.memberPass);
			$xiuse.AuthMemberPass($scope.Member).then(function(response){
				if(response.Info == 1)
					{
						$('#MemberPayInfo').modal({keyboard: false,show: true});
						$('#Member').modal('hide');
						$('#MemberPass').modal('hide');
						$scope.Member.Pass = true;
					}
				else{
					$scope.Member.Pass = false;
					alert("密码错误！");
					return;
				}
			});
		}
		/*确认密码的回车事件*/
		$scope.CheckMemberPassEvent = function(e,pws) {
	        var keycode = window.event?e.keyCode:e.which;
	        if(keycode==13){
	           $scope.CheckMemberPass(pws);
	        }
    	}
		/*确认会员卡支付*/
		$scope.MemberPay = function(){
			if($scope.Member.MemberAmount > $scope.Bill.AccountsPayable)
				$scope.Bill.MembersCard = $scope.Bill.AccountsPayable;
			else
				$scope.Bill.MembersCard = $scope.Member.MemberAmount;
			CutBill();
			$('#MemberPayInfo').modal('hide')
		}
		
		$scope.MemberPayEvent = function(e) {
	        var keycode = window.event?e.keyCode:e.which;
	        if(keycode==13){
	           $scope.MemberPay();
	        }
    	}
		/*计算整单折扣优惠的金额*/
		$scope.CalcDiscount = function(Bill){
			var discountValue = 0.00;
			if(Bill.EntireDiscount==null)
				discountValue = 0;
			else if(Bill.EntireDiscount.DiscountType == 1){
				discountValue = Bill.EntireDiscount.DiscountContent
			}
			else if(Bill.EntireDiscount.DiscountType == 0&&Bill.EntireDiscount.DiscountContent<100){
				discountValue = Bill.EntireDiscount.DiscountContent*0.01*(Bill.Total-Bill.SingleConcessions);
			}
			else
			 	discountValue = 0;
			/*discountValue = discountValue.toFixed(2);*/
			$scope.Bill.Concessions = discountValue;
			return discountValue;
		}
		/*小费*/
		$scope.AddTip = function(){
			$scope.Bill.Tip = $scope.TipAccountValue;
			SumBill();
			CutBill();
			$scope.PaySelect(LastCurrentType);
		}
		$scope.AUTOTip = function(){
			if($scope.Bill.Change <= 0)
			return;
			$scope.Bill.Tip = 0;
			SumBill();
			CutBill();
			$scope.Bill.Tip = $scope.Bill.Change;
			SumBill();
			CutBill();
			
		}
		$scope.RemoveTip = function(){
			$scope.Bill.Tip = 0;
			SumBill();
			CutBill();
		}
		/*抹零*/
		$scope.Wipe = function(){
			$scope.Bill.SameChange =  $scope.WipeAccountValue;
			SumBill();
			CutBill();
			$scope.PaySelect(LastCurrentType);
		}
		$scope.AUTOWipe = function(){
			
			$scope.Bill.SameChange = 0;
			SumBill();
			CutBill();
			$scope.Bill.SameChange =  $scope.Bill.AccountsPayable-parseInt($scope.Bill.AccountsPayable);
			SumBill();
			CutBill();
			
		}
		$scope.RemoveWip = function(){
			$scope.Bill.SameChange = 0;
			SumBill();
			CutBill();
		}
		/*添加整单折扣*/
		$scope.AddOrderEntireDiscount = function(obj){
			
			if(obj.DiscountVerification == 0){
				$scope.crruentDiscout = obj;
				$scope.discountValidate = true;
			}
			else{
				$('#modalDiscount').modal("hide");
				$scope.discountValidate = false;
				$scope.Bill.EntireDiscount = obj;
				SumBill();
				CutBill();
			}
		}
		$scope.RemoveEntireDiscount = function(){
			$scope.Bill.EntireDiscount = null;
			SumBill();
			CutBill();
		}
		/*整单折扣密码   取消按钮*/
		$scope.CancelDiscount = function(){
			$scope.discountValidate = false;
			$scope.Bill.EntireDiscount =  null;
			SumBill();
			CutBill();
		}
		/*整单折扣的密码确认按钮*/
		$scope.ConfrimDicount = function(obj){
			var tellUser ={};
			tellUser.UserName = $Common.EncryptByDES($scope.selectedManageUser.UserName);
			tellUser.PassWord = $Common.EncryptByDES($scope.Psw);
			tellUser.RestaurantId = User.RestaurantId;
			$scope.Bill.TellUser = tellUser;
			$xiuse.TellDiscount(tellUser).then(function(response){
				if(response.Info == 1)
					$scope.Bill.EntireDiscount = obj;
				else
					alert(response.Data);
				SumBill();
				CutBill();
			});
		}
		/*添加所有的单品折扣*/
		$scope.AddAllSingleDiscount = function(){
			$.each($scope.OrderDetail.Menus, function(index,item) {
				$xiuse.SingleDiscount(User.RestaurantId,item.MenuId).then(function(response){
					if(response.Info == "1")
						item.SingleDiscount = response.Data;
					else
						item.SingleDiscount = null;
				});
			});
		}
		/*激活单品的折扣*/
		$scope.ActiveDsState = function(order){
			
			if(order.DisState==undefined||order.DisState==null)
				order.DisState = true;
			else
				order.DisState = !order.DisState;
			SumBill();
			CutBill();
		}
		/*计算单品折扣后的价格*/
		$scope.SingleDsPrice = function(item){
			var price = 0.00;
			if(!SingleUse(item))
				price = item.MenuPrice;
			else{
				if(item.MenuDiscount.DiscountType==0&&item.MenuDiscount.DiscountType<100)
					price = item.MenuPrice*(1-item.MenuDiscount.DiscountContent*0.01);
				else if(item.MenuPrice > item.MenuDiscount.DiscountContent)
					price = item.MenuPrice - item.MenuDiscount.DiscountContent;
				else
					price = item.MenuPrice;
			}
			return price;
			
		}
		/*是否存在单品折扣*/
		$scope.IsDiscount = function(ds){
			if(ds == null || ds==undefined)
				return false;
			else
				return true;
		}
		/*是否激活单品折扣*/
		$scope.DisState = function(state){
			if(state==undefined||state==null)
				return false;
			else
				return state;
		}
		/*完成结账信息*/
		$scope.Checkout = function(){
			if(!CheckOutState)
				return;
			$scope.Bill.Member = $scope.Member;
			$scope.Bill.OrderReMark = $scope.Remark;
			$scope.Bill.OrderReMark = $scope.Remark;
			$scope.Bill.ServiceUserId = $scope.selectedName.UserId;
			$scope.Bill.Menus = [];
			$scope.Bill.OrderId = $scope.OrderDetail.Order.OrderId;
			$.each($scope.OrderDetail.Ordermenu,function(index,item){
				var tmp ={};
				tmp.DisState = item.DisState;
				tmp.OrderMenuId = item.OrderMenuId;
				$scope.Bill.Menus.push(tmp);
			});
			$xiuse.CheckoutOrderBill($scope.Bill).then(function(response){
				if(response.Info == 1){
					$state.go("tpls.orderAfter",{OrderId:null},{reload: true});
				}
			});
			
		}
		/*切换付款方式*/
		$('#account_pay_type .pay_bottom payType').click(function(){
			$('#account_pay_type .pay_bottom payType').removeClass('active');
			$(this).addClass('active');
			$scope.AccountModel.reset();/*重置计算器*/
		});
		/*初始化页面*/
		function Init() {
			try {
				OrderId = $stateParams.OrderId;
				CurrentDesk = JSON.parse(sessionStorage.currentDesk);
				User = JSON.parse($Common.DecryptByDES_Client(sessionStorage.User));
				$scope.CurrentDesk = CurrentDesk;
				$scope.Bill = new Object();
				$scope.Bill.Change = 0;
				$scope.Bill.CurrentPay = 0;
				$scope.Bill.Total = 0;
				$scope.Bill.Concessions = 0.00;/*整单折扣金额*/
				$scope.Bill.SingleConcessions = 0.00;/*单品折扣金额*/
				 $scope.Bill.Cash = 0;
				 $scope.Bill.BankCard = 0;
				 $scope.Bill.WeiXin = 0;
				 $scope.Bill.MembersCard = 0;
				 $scope.Bill.Alipay = 0;
				 $scope.Bill.Menus = [];
				 $scope.Bill.Tip =0.00;
				 $scope.Bill.SameChange=0.00;
				 $scope.Bill.EntireDiscount = null;
			} catch(err) {
				$state.go("tpls.desk",{TabName:null},{reload: true}); /*订单为空,跳转到餐桌的页面*/
				return;
			}
			GetEntireDiscount();/*初始化整单折扣*/
			$scope.selectedName = User;
			/*初始化订单*/
			if(OrderId == undefined || OrderId == null || OrderId == "") {
				$xiuse.DefaultOrderBill(CurrentDesk.DeskId).then(function(response) {
					if(response.Info == 1){
						$scope.OrderDetail = GetNormalOrder(response.Data);
						SumBill();
						CutBill();
					}
					else{
						alert("没有结账信息！");
						$state.go("tpls.desk",{TabName:null},{reload: true}); /*订单为空,跳转到餐桌的页面*/
						return;
					}
				});
			} else
				GetOrderDetail(OrderId); /*获取订单详情*/
			 
		}
		
		$scope.ShowTip = function($event){
			$($event.target).tooltip('show');	
		}
		$scope.HideTip = function($event){
			$($event.target).tooltip('hide');	
		}
		/*获取订单的详细*/
		function GetOrderDetail(OrderId) {
			$xiuse.OrderDetail(OrderId).then(function(response) {
				$scope.OrderDetail = GetNormalOrder(response);
				SumBill();
				CutBill();
			});
		}
		/*结账计算
		账单总金额*/
		function SumBill(){
			var total=0.00,SingleConcessions=0.00;
			
			$.each($scope.OrderDetail.Ordermenu,function(index, item){
				total +=item.MenuPrice*item.MenuNum;
				SingleConcessions += (parseFloat(item.MenuPrice) - $scope.SingleDsPrice(item))*item.MenuNum;
			});
			total = total.toFixed(2);
			$scope.Bill.Total = total;
			$scope.Bill.SingleConcessions = SingleConcessions;
			$scope.CalcDiscount($scope.Bill);/*计算整单折扣的*/
			$scope.Bill.AccountsPayable = parseFloat($scope.Bill.Total) - parseFloat($scope.Bill.Concessions) 
			-SingleConcessions - parseFloat($scope.Bill.SameChange) + parseFloat($scope.Bill.Tip);
		}
		/*是否使用单品折扣*/
		function SingleUse(orderMenu){
			if(orderMenu.MenuDiscount == null||orderMenu.MenuDiscount==undefined||(orderMenu.DisState==undefined||orderMenu.DisState==null||!orderMenu.DisState))
				return false;
			else
				return true;
		}
		
		/*找零*/
		function CutBill(){
			$scope.Bill.CurrentPay =  parseFloat($scope.Bill.Cash)+ parseFloat($scope.Bill.BankCard)+ parseFloat($scope.Bill.WeiXin)+ 
						parseFloat($scope.Bill.MembersCard)+parseFloat($scope.Bill.Alipay);
			$scope.Bill.Change = parseFloat($scope.Bill.CurrentPay) - parseFloat($scope.Bill.AccountsPayable);
			if($scope.Bill.Change >=0){
				$('#account_list .cash-out>span').removeClass('disabled');
				CheckOutState = true;
			}
			else{
				$('#account_list .cash-out>span').addClass('disabled');
				CheckOutState = false;
			}
				
		}
		/*获取店铺的折扣*/
		function GetEntireDiscount()
		{
			
			$xiuse.EntireDiscount(User.RestaurantId).then(function(response){
				if(response.Info == "1")
					$scope.EntireDiscount = response.Data;
				else
					alert(response.Data);
			});
		}
		/*获取店铺的折扣*/
		function GetSingleDiscount(MenuId)
		{
			$xiuse.EntireDiscount(User.RestaurantId,MenuId).then(function(response){
				
			});
		}
		//过滤退菜的菜品
		function GetNormalOrder(Order)
		{
			var menus = [];
			$.each(Order.Ordermenu, function(index,item) {
				if(item.MenuServing!=2)
					menus.push(item);
			});
			Order.Ordermenu = menus;
			return Order;
		}
	});
})