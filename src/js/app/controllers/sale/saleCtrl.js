define(['ctrl/module', 'ConfigApi', 'eacharts', 'datetimepicker'], function(controllers, ConfigApi) {
	'use strict';
	controllers.controller('saleCtrl', function($scope, $xiuse, $state, $location, $Common) {
		var currentRestaurant = JSON.parse($Common.DecryptByDES_Client(sessionStorage.User)).RestaurantId;

		function deepCopy(source) {
			var result = {};
			for(var key in source) {
				result[key] = typeof source[key] === 'object' ? deepCopy(source[key]) : source[key];
			}
			return result;
		}
		var myChart;
		myChart = echarts.init(document.getElementById('chartTest'), 'macarons');
		myChart.showLoading({
			text: '正在努力的读取数据中...'
		});
		var menusale;
		var flag=false;
		var menusale_option;
		// chart_01(data1,data2);
		//  chart_02(data3);
		$xiuse.DailyTurnover(currentRestaurant).then(function(response) {
			$scope.turnover = response;
			myChart.hideLoading();
			//$scope.turnover="";
			if($scope.turnover == "null" || $scope.turnover == "") {
				$('#chartTest').hide();
				if($('#day_turnover').children('p').length == 0) {
					var test1 = "</br><p class=\"wa_message\">当前暂时没有营业数据！</p>";
					$('#day_turnover').append(test1);
				}

			} else {
				var data1 = [];
				var data2 = [];
				$scope.turnover.forEach(function(v) {
					data1.push(v.Account);
				});
				$scope.turnover.forEach(function(v) {
					data2.push(v.MenusCount);
				});
				chart_01(data1, data2);
			}
		});
		$xiuse.DailyHotMenus(currentRestaurant).then(function(response) {
			$scope.hotmenus = response;
			var data3 = [];
			var data4 = [];
			$scope.hotmenus.forEach(function(v) {
				data3.push(v.MenuName);
			});
			$scope.hotmenus.forEach(function(v) {
				data4.push(v.AllNum);
			});

			chart_02(data3, data4);
			//console.log(data3);
		});
		getDailyBills();
		function getDailyBills(){
		$xiuse.DailyBillsss(currentRestaurant).then(function(response) {
			$scope.todaybills = response;
			//$scope.todaybills = "null";
			//console.log($scope.todaybills);
			if($scope.todaybills == "null" || $scope.todaybills == "") {
				$('#day_bill').children('ul').hide();
				$scope.totalAccount = 0;
				if($('#day_bill').children('p').length == 0) {
					var test1 = "</br><p class=\"wa_message\">当前暂时没有营业数据！</p>";
					$('#day_bill').append(test1);
				}
			} else {
			for(var i in $scope.todaybills){
			if($scope.todaybills[i].OrderState==2){
					$scope.todaybills[i].allback = true;//全部退单
				}
				else{
					$scope.todaybills[i].allback = false; 
				}
				}
				$scope.totalAccount = 0;
				for(var i = 0; i < $scope.todaybills.length; i++) {
					$scope.totalAccount = $scope.todaybills[i].AccountsPayable + $scope.totalAccount;
				}
			}
		});
		}
		//打印设置模态
		$scope.printset = function() {
			$('#modalPrintSet').modal('show');
			$scope.ptype = [{
					"name": "对账单",
					"type": 0
				},
				{
					"name": "收款单",
					"type": 1
				},
				{
					"name": "传菜单",
					"type": 0
				},
				{
					"name": "出品单",
					"type": 1
				},
				{
					"name": "退菜单",
					"type": 0
				},
				{
					"name": "标签单",
					"type": 1
				},
				{
					"name": "退款单",
					"type": 0
				},
			]
			//	console.log(ptype);
		}
		$scope.Printset = function() {
			$('#modalPrintSet').modal('show');
		}
		//
		$scope.changecheck = function(name) {
			if($('span[name="' + name + '"]').hasClass('printchecked')) {
				$('span[name="' + name + '"]').removeClass('printchecked');
			} else {
				$('span[name="' + name + '"]').addClass('printchecked');
			}
		}
		//获取菜单详情
		function getOrder(OrderId){
			$xiuse.OrderDetail(OrderId).then(function(response) {
				$scope.orderm = response.Ordermenu;
				var orderstate=response.Order.OrderState;
				if(orderstate==2){
					$scope.Bills.allback=true;
				}
				else
				{
					$scope.Bills.allback=false;
				}
				for(var i in $scope.orderm) {
					$scope.orderm[i].dNum = 0;//退几个菜
					$scope.orderm[i].flag=false;//退菜选中flag
					if($scope.orderm[i].MenuServing==2){
						$scope.orderm[i].menuback = true; //退菜
					}
					else{
						$scope.orderm[i].menuback = false; //退菜
					}
				}
				//$scope.orderm.mored=false;//多个菜品选择框
			});	
		}
		//退单模态
		$scope.chargeback = function(bills) {
			$scope.desktitle = "账单号：" + bills.OrderId;
			$scope.Bills = deepCopy(bills);
			$scope.reason="";
				$('input[name="otherreason"]').addClass("cannot");
				$('input[name="otherreason"]').prop("readonly",true);
				$('input[name="chooseall"]').prop("checked",false);
			$(".billsmessage").show();
			$(".billbtn").show();
			//$scope.menuback = false; //退菜
			$scope.menuch = false; //选择框
			$scope.chooseall=false;
			$('#modalChargeBack').modal('show');
			getOrder(bills.OrderId);
						
		}
		//退单button
		$scope.mbackbtn = function() {
			$scope.menuch = true;
			$scope.breason = 0;
			//$scope.breason = "售罄";
			$(".billsmessage").hide();
			$(".billbtn").hide();
		}
		
		$scope.choreason=function(breason){
			if(breason==0||breason==1){
				
				$('input[name="otherreason"]').addClass("cannot");
				$('input[name="otherreason"]').prop("readonly",true);
			}
			else
			{
				$scope.reason="";
				$('input[name="otherreason"]').removeClass("cannot");
				$('input[name="otherreason"]').prop("readonly",false);
			}
		};
		//退单全选
		$scope.chall= function(){
			//console.log(chooseall);
			if($('input[name="chooseall"]').is(":checked")){//全选选中
				flag=true;
				for(var i in $scope.orderm) {
					$scope.orderm[i].dNum = $scope.orderm[i].MenuNum;
					$scope.orderm[i].flag=true;
				    if($scope.orderm[i].dNum>1){
				    	$scope.orderm[i].mored = true;
				    }
				    else
				    {
				    	$scope.orderm[i].mored = false;
				    }
					$('input[name="' + $scope.orderm[i].MenuName + '"]').prop("checked",true);
				}
				
			}
			else{
				flag=false;
				for(var i in $scope.orderm) {
					$scope.orderm[i].dNum = 0;
					$scope.orderm[i].mored = false;
					$scope.orderm[i].flag=false;
					$('input[name="' + $scope.orderm[i].MenuName + '"]').prop("checked",false);
				}
				
			}
			//console.log(chooseall);
	}
		//判断是否全选
		function checkallchoose(object1){
			var count=object1.length;
			var count1=0;
			for(var i in object1){
				if(object1[i].flag==true){
					count1++;
				}	
			}
			if(count1==count){
				return 0;
			}
			else
			{
				if(count1==0){
					return 1;
				}
				else{
					return 2;
				}
				
			}
		}
		//多菜品退菜checkbox
		$scope.chmored = function(x) {
			x.mored=false;
			var numb=x.MenuNum;
			console.log($scope.orderm);
			 flag = $('input[name="' + x.MenuName + '"]').is(":checked");
			 
			//console.log($('input[name="'+name+'"]').is(":checked"));
			if(numb > 1 && flag == true) {//多菜品出现选择框
				x.mored = true;
				x.flag=true;
				x.dNum = numb;
				$('button[name="' + x.MenuName + 'mbtn"]').removeClass("btndisable");
				$('button[name="' + x.MenuName + 'pbtn"]').addClass("btndisable");
			} 
			else {//一个菜品选中、一个菜品没选中、多个菜品没选中
				if(flag == true){
				x.dNum = 1;	
				x.flag=true;
			    x.mored = false;	
				}
				else
				{
					x.dNum = 0;	
					x.flag=false;
					x.mored = false;	
				}
				
			}
			 if(checkallchoose($scope.orderm)==0){//全选
			 	$('input[name="chooseall"]').prop("checked",true);
			 }
			 else{//非全选
			 	$('input[name="chooseall"]').prop("checked",false);
			 }
		}
		$scope.PMinus = function(x) {
			var numb=x.MenuNum;
			if(x.dNum <= 1) {
				x.dNum = 1;
				$('button[name="' + x.MenuName + 'mbtn"]').addClass("btndisable");
			} else {
				x.dNum = x.dNum - 1;
				$('button[name="' + x.MenuName + 'pbtn"]').removeClass("btndisable");
				if(x.dNum == 1) {
					$('button[name="' +x.MenuName + 'mbtn"]').addClass("btndisable");
				} else {
					$('button[name="' + x.MenuName + 'mbtn"]').removeClass("btndisable");
				}
			}
		}
		$scope.PPlus = function(x) {
			var numb=x.MenuNum;
			if(x.dNum >= numb) {
				$('button[name="' + x.MenuName + 'pbtn"]').addClass("btndisable");
				$('button[name="' + x.MenuName + 'mbtn"]').removeClass("btndisable");
				x.dNum = numb;
			} else {
				x.dNum = x.dNum + 1;
				$('button[name="' + x.MenuName + 'mbtn"]').removeClass("btndisable");
				if(x.dNum == numb) {
					$('button[name="' + x.MenuName + 'pbtn"]').addClass("btndisable");
				} else {
					$('button[name="' + x.MenuName + 'pbtn"]').removeClass("btndisable");
				}
			}
		}
		//取消退单
		$scope.clearback= function(){
			for(var i in $scope.orderm) {
					$scope.orderm[i].dNum = 0;
					$scope.orderm[i].mored = false;
					$scope.orderm[i].flag=false;
					$('input[name="' + $scope.orderm[i].MenuName + '"]').prop("checked",false);
				}
			flag=false;
			$scope.menuch = false; //退菜
			//$scope.breason = "售罄";
			$scope.breason = 0;
			$(".billsmessage").show();
			$(".billbtn").show();
		}
		//确认退单
		$scope.saveback = function(orderm) {
			var nulflag=true;
			for(var i in orderm){
			if(orderm[i].dNum!=0){
				nulflag=false;//有选中项
				break;
			}
			}
			if(nulflag==true){//没有选中的菜品，默认退全单
			if(confirm("没有选择拟退菜品，点击“确认”默认退全单，否则点击“取消”返回选择") == true){
			$('input[name="chooseall"]').prop("checked",true);
			$scope.chall();
					}
			}
			var tmp ={};
			tmp.BackMenus = orderm;
			tmp.OrderId = orderm[0].OrderId;
			if($scope.breason==0||$scope.breason==1){//0:售罄;1:误点;其他
				tmp.Remark=$scope.breason;
			}
			else{
				tmp.Remark=$scope.reason;
			}
	    $xiuse.BackOrder(tmp).then(function(response) {
			$scope.menuch = false; //退菜
			//$scope.breason = "售罄";
			$scope.breason = "0";
			console.log(tmp);
			$(".billsmessage").show();
			$(".billbtn").show();
			getOrder(tmp.OrderId);
				getDailyBills();
				});
		}
		//日历插件
        $scope.turnovertips ="可以发送邮件!";
		$('#turnover_begin').datetimepicker({
			format: 'yyyy-mm-dd hh:ii',
			todayBtn: true,
			//language:'zh-CN'
		});
		$('#turnover_end').datetimepicker({
			format: 'yyyy-mm-dd hh:ii',
			todayBtn: true,
			//language:'zh-CN'
		});
		function changetime(ttime){
			var arr = ttime.split("-");
			 var str = arr.join("");
			 arr=str.split(" ");
			  str = arr.join("");
			  arr=str.split(":");
              str = arr.join("");
              return str;
		}
		$scope.downloadturnover = function(turnovertime){
			if(changetime(turnovertime.end)-changetime(turnovertime.begin)<0)
			{
				 $scope.turnovertips ="开始时间必须在结束时间之前!";
			}
            else{
            	$scope.turnovertips ="可以发送邮件!";
		$xiuse.TurnoverExcel(turnovertime.begin,turnovertime.end,currentRestaurant).then(function(response) {
			var file = new Blob([response], {type: 'application/xls'}); // 使用Blob将PDF Stream 转换为file
		  	var fileURL = URL.createObjectURL(file);
			var a = document.createElement('a'); 
		  	a.href = fileURL; 
		  	a.target = '_blank'; 
		  	a.download = 'Sale.xls';   
		  	document.body.appendChild(a);   
		   	a.click();
		});
            }
		}
		//
		$scope.turnoveremail= function(turnovertime){
			if(changetime(turnovertime.end)-changetime(turnovertime.begin)<0)
			{
				 $scope.turnovertips ="开始时间必须在结束时间之前!";
			}
            else{
            	$scope.turnovertips ="可以发送邮件!";
		$xiuse. TurnoverEmail(turnovertime.begin,turnovertime.end,currentRestaurant).then(function(response) {
		});
            }
		}
		//图标函数
		function chart_01(data1, data2) {
			var myChart_option = {
				title: {
					text: '当日营业额',
					subtext: '营业额（元）'
				},
				tooltip: {
					trigger: 'axis'
				},
				legend: {
					data: ['账单金额', '菜品数量']
				},
				toolbox: {
					show: true,
					feature: {
						mark: {
							show: true
						},
						dataView: {
							show: false,
							readOnly: true
						},
						magicType: {
							show: true,
							type: ['line', 'bar']
						},
						restore: {
							show: true
						},
						saveAsImage: {
							show: true
						}
					}
				},
				calculable: true,
				xAxis: [{
					type: 'category',
					data: ['0时', '1时', '2时', '3时', '4时', '5时', '6时', '7时', '8时', '9时', '10时', '11时', '12时',
						'13时', '14时', '15时', '16时', '17时', '18时', '19时', '20时', '21时', '22时', '23时'
					]
				}],
				yAxis: [{
					type: 'value'
				}],
				series: [{
						name: '账单金额',
						type: 'bar',
						data: data1,
						markPoint: {
							data: [{
									type: 'max',
									name: '营业额最大'
								},
								{
									type: 'min',
									name: '营业额最小'
								}
							]
						},
						markLine: {
							data: [{
								type: 'average',
								name: '营业额平均值'
							}]
						}
					},
					{
						name: '菜品数量',
						type: 'bar',
						data: data2,
						markPoint: {
							data: [{
									type: 'max',
									name: '菜品数量最多'
								},
								{
									type: 'min',
									name: '菜品数量最少'
								}
							]
						},
						markLine: {
							data: [{
								type: 'average',
								name: '菜品数量平均值'
							}]
						}
					}
				]
			};
			myChart.setOption(myChart_option);
			//$(window).resize(myChart.resize);
		}

		function chart_02(data1, data2) {
			menusale = echarts.init(document.getElementById('menusale'), 'macarons');
			var menusale_option = {
				title: {
					text: '当日最热门的菜品',
					subtext: '来源于今日销售',
					x: 'center'
				},
				tooltip: {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				legend: {
					orient: 'vertical',
					x: 'left',
					data: data1,
				},
				toolbox: {
					show: true,
					feature: {
						mark: {
							show: true
						},
						dataView: {
							show: false,
							readOnly: false
						},
						magicType: {
							show: true,
							type: ['pie', 'funnel'],
							option: {
								funnel: {
									x: '25%',
									width: '50%',
									funnelAlign: 'left',
									max: 1548
								}
							}
						},
						restore: {
							show: true
						},
						saveAsImage: {
							show: true
						}
					}
				},
				calculable: true,
				series: [{
					name: '热门菜品',
					type: 'pie',
					radius: '55%',
					center: ['50%', '60%'],
					data: (function() {
						var res = [];
						var len = data1.length;
						while(len--) {
							res.push({
								name: data1[len],
								value: data2[len]
							});
						}
						return res;
					})(),
				}]
			};
			menusale.setOption(menusale_option);
			//$(window).resize(menusale.resize);
		}
	});
});