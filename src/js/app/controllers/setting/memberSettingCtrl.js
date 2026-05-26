define(['ctrl/module', 'ConfigApi'], function(controllers, ConfigApi) {
	'use strict';
	controllers.controller('membersettingCtrl', function($Common,$scope, $xiuse, $state, $location) {
		var url1 = window.location.hash;
		$('li[href="' + url1 + '"]').click(function() {
			$(this).addClass("active");
			$(this).siblings().removeClass("active");
		});
		$("#memberOpreate").show();
		$scope.mCard = function() {
			$("#memberCard").show();
			$("#memberType").hide();
		}
		$scope.mType = function() {
			$("#memberCard").hide();
			$("#memberType").show();
		}
		$scope.memberOpreate = function() {
			$("#memberOpreate").show();
			$("#consumption").hide();
			$("#rechargeRecord").hide();
			$("#backMoneyRecord").hide();
		}
		$scope.consumption = function() {
			$("#memberOpreate").hide();
			$("#consumption").show();
			$("#rechargeRecord").hide();
			$("#backMoneyRecord").hide();
		}
		$scope.rechargeRecord = function() {
			$("#memberOpreate").hide();
			$("#consumption").hide();
			$("#rechargeRecord").show();
			$("#backMoneyRecord").hide();
		}
		$scope.backMoneyRecord = function() {
			$("#memberOpreate").hide();
			$("#consumption").hide();
			$("#rechargeRecord").hide();
			$("#backMoneyRecord").show();
		}
		var currentRestaurant = JSON.parse($Common.DecryptByDES_Client(sessionStorage.User)).RestaurantId;
		GetMembers();
		//获取会员信息
		function GetMembers() {
			$xiuse.GetMembers(currentRestaurant).then(function(response) {
				$scope.members = response.Table;
				if($scope.members == "null") {
					$('#memberOpreate').children('ul').remove();
					var test1 = "<p class=\"wa_message\">暂无会员信息!</p>";
					$('#memberOpreate').append(test1);
				}
			});
		}
		//启用或禁用会员
		$scope.enabled = function(memberid, memberstate) {
				if(memberstate == 1) { //禁用会员
					if(confirm("您确定要禁用此会员吗？") == true) {
						memberstate = 0;
					}
				} else { //启用会员
					if(confirm("您确定要启用此会员吗？") == true) {
						memberstate = 1;
					}
				}
				$xiuse.SetMemberState(memberid, memberstate)
					.then(function(response) {
						GetMembers();
						//console.log("success");
					})
			}
			//会员充值模态框
		$scope.AddRecharge = function(memberId, memberCardNo, memberAmount) {
				$('#modalCardTopOn').modal({
					show: true,
					backdrop: 'static',
					keyboard: false
				});
				$('#CardAccountTopOn').val("");
				$scope.membercardn = memberCardNo;
				$scope.membera = memberAmount;
				$scope.memberid = memberId;
			}
			//会员充值
		
		$scope.rechargebtn = function(memberid, memberCardNo) {
				var money = $('#CardAccountTopOn').val();
				var rctype = $('#CardTopOnType').val();
				$xiuse.AddReCharge(memberid, memberCardNo, rctype, money)
					.then(function(response) {
						$('#modalCardTopOn').modal('hide');
						$('#CardAccountTopOn').val("");
						GetMembers();
						Getrecharge();
						//if(response.Info == 1)

					});
			}
			//获取消费信息
		$xiuse.GetConsume(currentRestaurant).then(function(response) {
			$scope.consume = response;
			if($scope.consume == "null") {
				$('#consumption').children('ul').remove();
				var test1 = "<p class=\"wa_message\">7天内没有任何消费记录!</p>";
				$('#consumption').append(test1);
			}
		});
		//获取充值信息
		Getrecharge();
		function Getrecharge(){	
		$xiuse.GetRecharge(currentRestaurant).then(function(response) {
			$scope.recharge = response;
			if($scope.recharge == "null") {
				$('#rechargeRecord').children('ul').remove();
				var test1 = "<p class=\"wa_message\">7天内没有任何充值记录!</p>";
				$('#rechargeRecord').append(test1);
			}
		});
		}
		//获取返现信息
		$xiuse.GetRebates(currentRestaurant).then(function(response) {
			$scope.rebates = response;
			if($scope.rebates == "null") {
				$('#backMoneyRecord').children('ul').remove();
				var test1 = "<p class=\"wa_message\">7天内没有任何返现记录!</p>";
				$('#backMoneyRecord').append(test1);
			}
		});
		//获取会员类型
		GetMembersType();
		function GetMembersType(){
		$xiuse.GetMembersType(currentRestaurant).then(function(response) {
			$scope.membersType = response;
			$scope.memberCardType = new Object();
			for(var x in $scope.membersType) {
				$scope.memberCardType[x] = {
					'id': $scope.membersType[x].MemberClassifyId,
					'name': $scope.membersType[x].ClassifyName
				};
			}
			if($scope.memberType == "null") {
				$('#memberType').children('ul').remove();
				var test1 = "<p class=\"wa_message\">暂无任何会员类型!</p>";
				$('#memberType').append(test1);
			}
		});
		}
		//会员设置模态
		//添加会员
		$('#memberSetting .tools .toolbar a.btn[name="addMember"]').click(function() {
			$('#modalMember .modal-header h4.modal-title').html("添加会员");
			$('#MemberClassCardNum').removeAttr('disabled');
			$('#MemberClassCardNum').parent().find('button').removeAttr('disabled');
			$('#MemberClassNone').parents('.form-group').show();
			$('#savemember').show();
			$('#editsavemember').hide();
			$('#MemberClassCell').val("");
			$('#MemberClassEmail').val("");
			$('#MemberClassCardNum').val("");
			$('#MemberClassName').val("");
			$('#MemberClassNone').val("");
			$('#MemberClassType option:first').prop("selected", 'selected');
			$('.delete').hide();
			$('#MemberClassNoneCheck').prop("checked", true);
			$('#modalMember').modal({
				show: true,
				backdrop: 'static',
				keyboard: false
			});
		});
		//添加会员创建
		$scope.savemember = function() {
				var Type = $('#MemberClassType').val();
				var Cell = $('#MemberClassCell').val();
				var Email = $('#MemberClassEmail').val();
				var CardNum = $('#MemberClassCardNum').val();
				var Name = $('#MemberClassName').val();
				var None = $('#MemberClassNone').val();
				var NoneCheck = $('#MemberClassNoneCheck').is(":checked");
				/*if (Cell=="")
				{
					$('#MemberClassCell').addClass("error_message_border");
				}
				else{
					if(CardNum==""){
						
					}
				}*/
				
		$xiuse.Key().then(function(response) {
			ConfigApi.Common.Key=response.Data;	
			console.log(ConfigApi.Common.Key);
		});
				$xiuse.AddMember(Type, Cell, Email, CardNum, Name, $Common.EncryptByDES(None), NoneCheck, currentRestaurant)
					.then(function(response) {
						$('#modalMember').modal('hide');
						GetMembers();
						//if(response.Info == 1)

					});
			}
			//获取随机会员卡号
		$scope.getMemberId = function() {
				$xiuse.GetCardId().then(function(response) {
					$scope.memberCardId = response.Data;
					$('#MemberClassCardNum').val($scope.memberCardId);
				});
			}
		//编辑会员
		$scope.editmember = function(Mid, Name, CardNo, ClassifyId, Email, Cell) {
				$('#modalMember .modal-header h4.modal-title').html("编辑会员");
				$('#MemberClassCardNum').attr('disabled', 'disabled');
				$('#MemberClassCardNum').parent().find('button').attr('disabled', 'disabled');
				$('#MemberClassNone').parents('.form-group').hide();
				$('#savemember').hide();
				$('#editsavemember').show();
				$('#modalMember').modal('show');
				$('#MemberClassType').val(ClassifyId);
				$('#MemberClassCell').val(Cell);
				$('#MemberClassEmail').val(Email);
				$('#MemberClassCardNum').val(CardNo);
				$('#MemberClassName').val(Name);
				$('.delete').show();
				$scope.mid = Mid;
			}
			//编辑会员保存
		$scope.editsavemember = function() {
				var Type = $('#MemberClassType').val();
				var Cell = $('#MemberClassCell').val();
				var Email = $('#MemberClassEmail').val();
				var Name = $('#MemberClassName').val();
				$xiuse.EditMember($scope.mid, Type, Cell, Email, Name, currentRestaurant)
					.then(function(response) {
						$('#modalMember').modal('hide');
						GetMembers();
						//if(response.Info == 1)

					});
			}
			//删除会员
		$scope.deletemember = function() {
				var mstate = 2;
				if(confirm("您确定要删除此会员吗？") == true) {
					$xiuse.SetMemberState($scope.mid, mstate)
						.then(function(response) {
							$('#modalMember').modal('hide');
							GetMembers();
							//console.log("success");
						})
				}
			}
			//添加会员类型
			//获取折扣类型
		$xiuse.GetDiscount(currentRestaurant).then(function(response) {
			$scope.discount = response;
			if($scope.discount == "null") {
				var $p=$('#MemberTypeDiscount').parent('div');
				$('#MemberTypeDiscount').remove();
				var test1 = "<p class=\"wa_message\">目前暂无折扣信息，可前往折扣设置添加!</p>";
				 $p.append(test1);
			}
		});
		//添加会员类型模态
		$('#memberSetting .tools .toolbar a.btn[name="addMemberType"]').click(function() {
			$('#modalMemberType .modal-header h4.modal-title').html("添加会员类型");
			$('#modalMemberType').modal({
				show: true,
				backdrop: 'static',
				keyboard: false
			});
			$('#MemberTypeName').val("");
			$('#MemberTypeRemark').val("");
			$('#editsavemembertype').hide();
				$("#savemembertype").show();
			$('#MemberTypeDiscount option:first').prop("selected", 'selected');
		});
		//添加会员类型创建
		$scope.savemtype= function(){
			var mtypename=$('#MemberTypeName').val();
			var mtyperemark=$('#MemberTypeRemark').val();
			var mtypediscountid=$('#MemberTypeDiscount').val();	
			//alert(mtypediscountid);
		$xiuse.AddMemberType(mtypename,mtypediscountid,mtyperemark,currentRestaurant)
					.then(function(response) {
						$('#modalMemberType').modal('hide');
						GetMembersType();
						//if(response.Info == 1)

					});
		}
		
			//编辑会员类型
				$scope.mtedit=function(name,id,remark,mtid){
				$('#modalMemberType .modal-header h4.modal-title').html("编辑会员类型");
				$('#modalMemberType').modal({show: true,
				backdrop: 'static',
				keyboard: false});
				$("#savemembertype").hide();
				$('#editsavemembertype').show();
				$('#MemberTypeName').val(name);
			    $('#MemberTypeRemark').val(remark);
			    $('#MemberTypeDiscount').val(id);	
			    $scope.mtid=mtid;
			};
			//保存修改
			$scope.editsavemtype=function(){
			var mtypename=$('#MemberTypeName').val();
			var mtyperemark=$('#MemberTypeRemark').val();
			var mtypediscountid=$('#MemberTypeDiscount').val();	
			$xiuse.EditMemberType($scope.mtid,mtypename,mtypediscountid,mtyperemark,currentRestaurant)
					.then(function(response) {
						$('#modalMemberType').modal('hide');
						GetMembersType();
						GetMembers();
					});
			
			}
			//删除会员类型
			$scope.mtdelete=function(name,id,membernum){
				if(membernum==0)
				{
					if(confirm('您确定要删除会员类型“'+name+'”吗？'))
				{
						$xiuse.DeleteMemberType(id,currentRestaurant).then(function(response) {
						GetMembersType();

					});
				}
				}
				else
				{
					alert('当前会员类型“'+name+'”共有'+membernum+'个会员，不可删除！');
				}
			}
			//会员设置密码
			$scope.setpassword=function(mid){
				$('#modalMemberPassword .modal-header h4.modal-title').html("密码设置");
				$('#modalMemberPassword').modal('show');
				$('.errormessage').hide();
				$('#MemberNewPassword').val("");
				$('#MemberConfirmPassword').val("");
				$scope.mid1=mid;
			};
			$scope.passwordsave=function(){
				var npassword=$('#MemberNewPassword').val();
				var cpassword=$('#MemberConfirmPassword').val();
				if(npassword==""||cpassword==""){
					var text1='<i class="fa fa-warning "></i>密码不少于XX位（暂不能为空）！';
					$('.errormessage').show();
					$('.errormessage').children('label').html(text1);
				}
				else
				{ 
					if(npassword!=cpassword)
					{
					var text2='<i class="fa fa-warning "></i>两次输入密码不一致！';
					$('.errormessage').show();
					$('.errormessage').children('label').html(text2);
					}
					else{
						$('.errormessage').hide();				
		$xiuse.Key().then(function(response) {
			ConfigApi.Common.Key=response.Data;	
			console.log(ConfigApi.Common.Key);
		});
						$xiuse.SetMPassword($scope.mid1,$Common.EncryptByDES(npassword),currentRestaurant).then(function(response) {
							$('#modalMemberPassword').modal('hide');
							GetMembers();
						});
					}
				}
			}
			//会员推荐
			/*$('#memberOpreate .CardList .CardItem button[name="recommend"]').click(function(){
				alert("会员推荐");
			});*/
	});
});