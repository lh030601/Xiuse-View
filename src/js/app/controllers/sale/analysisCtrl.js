define(['ctrl/module', 'ConfigApi', 'eacharts'], function(controllers, ConfigApi) {
	'use strict';
	controllers.controller('analysisCtrl', function($scope, $xiuse, $state, $location, $Common) {
		var currentRestaurant = JSON.parse($Common.DecryptByDES_Client(sessionStorage.User)).RestaurantId;

		function deepCopy(source) {
			var result = {};
			for(var key in source) {
				result[key] = typeof source[key] === 'object' ? deepCopy(source[key]) : source[key];
			}
			return result;
		}
		//时间
		$scope.todaydate = new Date();
		$scope.tomorrowdaydate = new Date();
		$scope.yesterdaydate = new Date($scope.todaydate - 24 * 60 * 60 * 1000); //前一天
		$scope.tomorrowdaydate = new Date($scope.tomorrowdaydate.setDate($scope.tomorrowdaydate.getDate() + 1)); //后一天
		$scope.lastweekdate = new Date($scope.todaydate - 6 * 24 * 3600 * 1000); //7天前日期
		$scope.lastweekdateend = new Date($scope.todaydate - 7 * 24 * 3600 * 1000); //前七天的前一天
		$scope.lastweekdatestart = new Date($scope.todaydate - 13 * 24 * 3600 * 1000); //前七天的前七天
		$scope.lastmonthdate = new Date($scope.todaydate - 29 * 24 * 3600 * 1000); //30天前日期
		$scope.yesterdaydate1 = fodate($scope.yesterdaydate);
		$scope.lastsevendaydate1 = fodate($scope.lastweekdatestart) + "至</br>" + fodate($scope.lastweekdateend);
		$scope.week = getweek($scope.todaydate);
		$scope.lastweek = getweek($scope.lastweekdate);
		$scope.lastmonthweek = getweek($scope.lastmonthdate);
		$scope.Starttime = [];
		$scope.Endtime = [];
		$scope.searchcondition="";
		
		//初始化
		$scope.paramsdetail = new Object();
		$scope.pageurl="";
		//获取星期几
		function getweek(date1) {
			var a = date1.getDay();
			var week = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
			return week[a];
		}
		//日期格式化
		function fodate(date1) {
			var d = date1.getDate();
			var m = date1.getMonth() + 1;
			var y = date1.getFullYear();
			var fdate = y + "年" + m + "月" + d + "日";
			return fdate;
		}
		//日期格式化扩展
		Date.prototype.Format = function(fmt) { //author: meizz 
			var o = {
				"M+": this.getMonth() + 1, //月份 
				"d+": this.getDate(), //日 
				"h+": this.getHours(), //小时 
				"m+": this.getMinutes(), //分 
				"s+": this.getSeconds(), //秒 
				"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
				"S": this.getMilliseconds() //毫秒 
			};
			if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
			for(var k in o)
				if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			return fmt;
		}
		//获取数据
		//1、当天数据
		$xiuse.OperAnalysis(currentRestaurant, $scope.todaydate.Format("yyyy-MM-dd"), $scope.tomorrowdaydate.Format("yyyy-MM-dd"))
			.then(function(response) {
				$scope.todayAnalysis = response.Data;
				$scope.MyPopularMenuflag = true;
				$scope.MyPoorMenuflag = true;
				if($scope.todayAnalysis.MyPopularMenu == "null" || $scope.todayAnalysis.MyPopularMenu == "" || $scope.todayAnalysis.MyPopularMenu == undefined) {
					$scope.MyPopularMenuflag = false;
				}
				if($scope.todayAnalysis.MyChargeCause == "null" || $scope.todayAnalysis.MyChargeCause == "" || $scope.todayAnalysis.MyChargeCause == undefined) {
					$('#Backchart').append("<p>目前没有退单记录！</p>");
				} else {
					var backChart; //当天退单原因图
					backChart = echarts.init(document.getElementById('Backchart'), 'red');
					backChart.setOption(chart_03($scope.todayAnalysis.MyChargeCause));
				}
				if($scope.todayAnalysis.MyPoorMenu == "null" || $scope.todayAnalysis.MyPoorMenu == "" || $scope.todayAnalysis.MyPoorMenu == undefined) {
					$scope.MyPoorMenuflag = false;
				}
				//总体营业tooltips
				$('#oneday').find('label[name="state"]').tooltip({
					placement: "bottom",
					html: true,
					title: statetips($scope.todayAnalysis.MyTurnover.AddAccount, $scope.todayAnalysis.MyOrderDetail.AddOrder, $scope.todayAnalysis.MyChargeBack.BackOrderContrast)
				});
				$scope.setStyletitle('#oneday');
				changetableoneday();
			});
		//1天翻台数据
		function changetableoneday() {
			$xiuse.RepeatTable(currentRestaurant, $scope.todaydate.Format("yyyy-MM-dd"), $scope.tomorrowdaydate.Format("yyyy-MM-dd"))
				.then(function(response) {
					$scope.todaychtable = response.Data;
					for(var x in $scope.todaychtable) {
						$scope.foodtques($scope.todaychtable[x], "#oneday");
					} //console.log($scope.todaychtable);
				});
		}
		//2、7天数据
		$xiuse.OperAnalysis(currentRestaurant, $scope.lastweekdate.Format("yyyy-MM-dd"), $scope.tomorrowdaydate.Format("yyyy-MM-dd"))
			.then(function(response) {
				$scope.sevendaysAnalysis = response.Data;
				$scope.sevenMyPopularMenuflag = true;
				$scope.sevenMyPoorMenuflag = true;
				if($scope.sevendaysAnalysis.MyPopularMenu == "null" || $scope.sevendaysAnalysis.MyPopularMenu == "" || $scope.sevendaysAnalysis.MyPopularMenu == undefined) {
					$scope.sevenMyPopularMenuflag = false;
				}
				if($scope.sevendaysAnalysis.MyChargeCause == "null" || $scope.sevendaysAnalysis.MyChargeCause == "" || $scope.sevendaysAnalysis.MyChargeCause == undefined) {
					$('#sevenBackchart').append("<p>目前没有退单记录！</p>");
				} else {
					var sevenbackChart; //当天退单原因图
					sevenbackChart = echarts.init(document.getElementById('sevenBackchart'), 'red');
					sevenbackChart.setOption(chart_03($scope.sevendaysAnalysis.MyChargeCause));
				}
				if($scope.sevendaysAnalysis.MyPoorMenu == "null" || $scope.sevendaysAnalysis.MyPoorMenu == "" || $scope.sevendaysAnalysis.MyPoorMenu == undefined) {
					$scope.sevenMyPoorMenuflag = false;
				}
				$('#sevendays').find('label[name="state"]').tooltip({
					placement: "bottom",
					html: true,
					title: statetips($scope.sevendaysAnalysis.MyTurnover.AddAccount, $scope.sevendaysAnalysis.MyOrderDetail.AddOrder, $scope.sevendaysAnalysis.MyChargeBack.BackOrderContrast)
				});
				
				//$scope.setStyletitle('#sevendays');
				changetablesevendays();
			});
		//7天翻台
		function changetablesevendays() {
			$xiuse.RepeatTable(currentRestaurant, $scope.todaydate.Format("yyyy-MM-dd"), $scope.lastweekdate.Format("yyyy-MM-dd"))
				.then(function(response) {
					$scope.sevenchtable = response.Data;
					for(var x in $scope.sevenchtable) {
						$scope.foodtques($scope.sevenchtable[x], "#sevendays");
					} //console.log($scope.todaychtable);
				});
		}
		$('.maintab').find('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
				// 获取已激活的标签页的名称
				var activeTab = $(e.target).parent('li').val();
				if(activeTab==1){
					$scope.setStyletitle('#sevendays');
				}
				else if(activeTab==0){
					$scope.setStyletitle('#oneday');
				}
				else if(activeTab==2){
					$scope.setStyletitle('#amonth');
				}
		});
		//营业额或订单数增加
		$scope.up = "增加<span class='sverygoodstate'></span>";
		//营业额或订单数减少
		$scope.down = "下降<span class='sbadstate'></span>";
		//退单增加
		$scope.bup = "增加<span  class='sbadstate'></span>";
		//退单减少
		$scope.bdown = "下降<span class='sverygoodstate'></span>";
		//保持不变
		$scope.nochange = "没有变化<span class='fa fa-meh-o'></span>";

		function statetips(sta1, sta2, sta3) {
			var state1 = [];
			var state2 = [];
			var state3 = [];
			if(sta1 > 0) {
				state1 = $scope.up;
			} else {
				if(sta1 < 0) {
					state1 = $scope.down;
				} else {
					state1 = $scope.nochange
				}
			}
			if(sta2 > 0) {
				state2 = $scope.up;
			} else {
				if(sta2 < 0) {
					state2 = $scope.down;
				} else {
					state2 = $scope.nochange
				}
			}
			if(sta3 < 0) {
				state3 = $scope.bdown;
			} else {
				if(sta3 > 0) {
					state3 = $scope.bup;
				} else {
					state3 = $scope.nochange
				}
			}
			var turstate = "<p class='tooltips'>餐厅总体营业额<span>" + state1 + "</span></p>" +
				"<p class='tooltips'>餐厅总体下单数<span>" + state2 + "</span></p>" +
				"<p class='tooltips'>餐厅总体退单数<span>" + state3 + "</span></p>";
			return turstate;
		}
		$('#oneday').find('i[name="yesterday"]').tooltip({
			placement: "bottom",
			html: true,
			title: $scope.yesterdaydate1
		});
		$('#sevendays').find('i[name="yesterday"]').tooltip({
			placement: "bottom",
			html: true,
			title: $scope.lastsevendaydate1
		});
		$('#oneday').find('i[name="eachperson"]').tooltip({
			placement: "bottom",
			html: true,
			title: "<p>下单后选择输入用餐人数,</br>即可计算人均消费</p>"
		});
		$('#sevendays').find('i[name="eachperson"]').tooltip({
			placement: "bottom",
			html: true,
			title: "<p>下单后选择输入用餐人数,</br>即可计算人均消费</p>"
		});
		//总体运营情况class
		$scope.setStyle1 = function(args1, args2, args3) {
			if(args3 <= 0 && args1 > 0 && args2 > 0) {
				return 'verygoodstate';
			} else {
				if(args1 < 0 && args2 < 0 && args3 > 0)
					return 'badstate';
				else
					return 'goodstate';
			}
		};
		$scope.setStyletitle = function(args1) {
			var $stateaa = $(args1);
			if($stateaa.find('label[name="state"]').hasClass('verygoodstate')) {
				if($stateaa.find('label[name="state"]').children('span').length==0){
					$stateaa.find('label[name="state"]').append("<span>餐厅运营:优秀</span>")
				}
			} else {
				if($stateaa.find('label[name="state"]').hasClass('badstate')) {
					if($stateaa.find('label[name="state"]').children('span').length==0){
							$stateaa.find('label[name="state"]').append("<span>餐厅运营:不佳</span>");
					}
				} else {
					if($stateaa.find('label[name="state"]').children('span').length==0){
					$stateaa.find('label[name="state"]').append("<span>餐厅运营:良好</span>");
					}
				}
			}
		}
		//单项运营情况
		$scope.setStyle = function(args) {
			if(args > 0) return 'rocket';
			else if(args < 0)
				return 'anchor';
			else if(args == 0)
				return 'shuttle';
		};
		$scope.setfaStyle = function(args) {
			if(args > 0) return 'fa-rocket';
			else if(args < 0)
				return 'fa-anchor';
			else if(args == 0)
				return 'fa-space-shuttle';
		};
		$scope.setfaStyle1 = function(args) {
			if(args > 0) return 'fa-long-arrow-up';
			else if(args < 0)
				return 'fa-long-arrow-down';
			else if(args == 0)
				return 'fa-long-arrow-right';
		};
		//状态选择
		$scope.whichstate = function(state) {
			if(state > 0) {
				return "增加";
			} else {
				if(state == 0) {
					return "持平";
				} else {
					return "减少";
				}
			}
		}
		//下载运营记录
		$("#oneday").find('.download').click(function(){
			downloadrecord($scope.yesterdaydate.Format("yyyy-MM-dd hh:mm:ss"),$scope.todaydate.Format("yyyy-MM-dd hh:mm:ss"));
		});
		$("#sevendays").find('.download').click(function(){
			downloadrecord($scope.lastweekdate.Format("yyyy-MM-dd hh:mm:ss"),$scope.todaydate.Format("yyyy-MM-dd hh:mm:ss"));
		});
		$("#amonth").find('.download').click(function(){
			downloadrecord($scope.lastmonthdate.Format("yyyy-MM-dd hh:mm:ss"),$scope.todaydate.Format("yyyy-MM-dd hh:mm:ss"));
		});
		//运营记录函数
		function downloadrecord(date1,date2){
			$xiuse.TurnoverExcel(date1,date2,currentRestaurant).then(function(response) {
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
		
		//七天营业额详情
		$('label[name="seventurdetail"]').click(function() {
			$scope.chartssettitle = "营业额统计";
			$scope.$apply();
			var sevenTurLinechart; //七天营业额折线图
			sevenTurLinechart = echarts.init(document.getElementById('sevendaysCharts'), 'macarons');
			$xiuse.TurnoverCharts(currentRestaurant, $scope.lastweekdate.Format("yyyy-MM-dd"), $scope.tomorrowdaydate.Format("yyyy-MM-dd"))
				.then(function(response) {
					var thisweek = response.Data.NowObj;
					thisweek.sort(function(a, b) { //按日期排序 
						var s = a.DetailsTime.toLowerCase();
						var t = b.DetailsTime.toLowerCase();
						if(s < t) return -1;
						if(s > t) return 1;
					});
					var lastweek = response.Data.OldObj;
					lastweek.sort(function(a, b) { //按日期排序 
						var s = a.DetailsTime.toLowerCase();
						var t = b.DetailsTime.toLowerCase();
						if(s < t) return -1;
						if(s > t) return 1;
					});
					var thisweekdata = [];
					var lastweekdata = [];
					var weekday = [];
					for(var i = 0; i < thisweek.length; i++) {
						thisweekdata[i] = thisweek[i].DetailsAccount;
						lastweekdata[i] = lastweek[i].DetailsAccount;
						weekday[i] = getweek(new Date(thisweek[i].DetailsTime));
					}
					sevenTurLinechart.setOption(chart_04(weekday, thisweekdata, lastweekdata,'营业额（￥）'));
				});
			var monthTurLinechart; //30天营业额折线图
			monthTurLinechart = echarts.init(document.getElementById('monthCharts'), 'macarons');
			$xiuse.TurnoverCharts(currentRestaurant, $scope.lastmonthdate.Format("yyyy-MM-dd"), $scope.tomorrowdaydate.Format("yyyy-MM-dd"))
				.then(function(response) {
					var thismonth = response.Data.NowObj;
					thismonth.sort(function(a, b) { //按日期排序 
						var s = a.DetailsTime.toLowerCase();
						var t = b.DetailsTime.toLowerCase();
						if(s < t) return -1;
						if(s > t) return 1;
					});
					var thismonthdata = [];
					var monthday = [];
					for(var i = 0; i < thismonth.length; i++) {
						thismonthdata[i] = thismonth[i].DetailsAccount;
						monthday[i] = (new Date(thismonth[i].DetailsTime)).Format("MM/dd");
					}
					monthTurLinechart.setOption(chart_05(monthday, thismonthdata,'营业额（￥）'));
				});
			$('#sevendaysCharts').addClass('in active');
			$('#monthCharts').removeClass('in active');
			$('li[name="monthtab"]').removeClass('active');
			$('li[name="seventab"]').addClass('active');
			$('#modalDetailCharts').modal('show');
			//alert("aaa");
		})
		//七天最受欢迎的菜品
		$('label[name="sevenfavouritefooddetail"]').click(function() {
			$scope.tablessettitle = "最受欢迎餐品分析";
			$scope.pageurl="";
			$scope.itemsperpage=8;
			$scope.pageurl="PopularMenuDetail";
			//初始化
			$scope.paramsdetail = new Object();
			$scope.paramsdetail.RestaurantId = currentRestaurant;
			$scope.paramsdetail.beginDT = $scope.lastweekdate.Format("yyyy-MM-dd");
			$scope.paramsdetail.EndDT = $scope.tomorrowdaydate.Format("yyyy-MM-dd");
			$scope.paramsdetail.popular = "1";
			$scope.paramsdetail.CurrentPage = 1;
			$scope.paramsdetail.TotalItem = "-1";
			$scope.popularflag = true;
			$scope.popularpoor = true;
			$scope.$apply();
			$('#sevendaysTables').addClass('in active');
			$('#monthTables').removeClass('in active');
			$('li[name="monthtabletab"]').removeClass('active');
			$('li[name="seventabletab"]').addClass('active');
			$('#modalDetailTables').modal('show');
				$('#modalDetailTables').find('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
				// 获取已激活的标签页的名称
				var activeTab = $(e.target).parent('li').val();
				// 获取前一个激活的标签页的名称
				if(activeTab == 0&&$scope.popularflag == true) {
					$scope.paramsdetail.beginDT = $scope.lastmonthdate.Format("yyyy-MM-dd");
					$scope.paramsdetail.EndDT = $scope.tomorrowdaydate.Format("yyyy-MM-dd");
					$scope.paramsdetail.popular = "1";
					$scope.paramsdetail.CurrentPage = 1;
					$scope.paramsdetail.TotalItem = "-1";
					$scope.$apply();
				} else if(activeTab == 1&&$scope.popularflag == true) {
					$scope.paramsdetail.beginDT = $scope.lastweekdate.Format("yyyy-MM-dd");
					$scope.paramsdetail.EndDT = $scope.tomorrowdaydate.Format("yyyy-MM-dd");
					$scope.paramsdetail.popular = "1";
					$scope.paramsdetail.CurrentPage = 1;
					$scope.paramsdetail.TotalItem = "-1";
					$scope.$apply();
				}
			});

		});

		//七天低销的菜品
		$('label[name="sevenbadfooddetail"]').click(function() {
			$scope.tablessettitle = "低销菜品餐品分析";
			$scope.pageurl="";
			$scope.itemsperpage=8;
			$scope.pageurl="PopularMenuDetail";
			//初始化
			$scope.paramsdetail = new Object();
			$scope.paramsdetail.RestaurantId = currentRestaurant;
			$scope.paramsdetail.beginDT = $scope.lastweekdate.Format("yyyy-MM-dd");
			$scope.paramsdetail.EndDT = $scope.tomorrowdaydate.Format("yyyy-MM-dd");
			$scope.paramsdetail.popular = "0";
			$scope.paramsdetail.CurrentPage = 1;
			$scope.paramsdetail.TotalItem = "-1";
			$scope.popularflag = false;
			$scope.popularpoor = true;
			$scope.$apply();
			$('#sevendaysTables').addClass('in active');
			$('#monthTables').removeClass('in active');
			$('li[name="monthtabletab"]').removeClass('active');
			$('li[name="seventabletab"]').addClass('active');
			$('#modalDetailTables').modal('show');
			$('#modalDetailTables').find('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
				// 获取已激活的标签页的名称
				var activeTab = $(e.target).parent('li').val();
				// 获取前一个激活的标签页的名称
				if(activeTab == 0&&$scope.popularflag ==false) {
					$scope.paramsdetail.beginDT = $scope.lastmonthdate.Format("yyyy-MM-dd");
					$scope.paramsdetail.EndDT = $scope.tomorrowdaydate.Format("yyyy-MM-dd");
					$scope.paramsdetail.popular = "0";
					$scope.paramsdetail.CurrentPage = 1;
					$scope.paramsdetail.TotalItem = "-1";
					$scope.$apply();
				} else if(activeTab == 1&&$scope.popularflag ==false){
					$scope.paramsdetail.beginDT = $scope.lastweekdate.Format("yyyy-MM-dd");
					$scope.paramsdetail.EndDT = $scope.tomorrowdaydate.Format("yyyy-MM-dd");
					$scope.paramsdetail.popular = "0";
					$scope.paramsdetail.CurrentPage = 1;
					$scope.paramsdetail.TotalItem = "-1";
					$scope.$apply();
				}
			});
		});
		//七天下单详情
		$('label[name="sevenorderdetail"]').click(function() {
			$scope.chartssettitle = "下单情况统计分析";
			$scope.$apply();
			var sevenOrderLinechart; //七天下单情况折线图
			sevenOrderLinechart = echarts.init(document.getElementById('sevendaysCharts'), 'macarons');
			$xiuse.OrderCharts(currentRestaurant, $scope.lastweekdate.Format("yyyy-MM-dd"), $scope.tomorrowdaydate.Format("yyyy-MM-dd"))
				.then(function(response) {
					var thisweek = response.Data.NowObj;
					thisweek.sort(function(a, b) { //按日期排序 
						var s = a.DetailsTime.toLowerCase();
						var t = b.DetailsTime.toLowerCase();
						if(s < t) return -1;
						if(s > t) return 1;
					});
					var lastweek = response.Data.OldObj;
					lastweek.sort(function(a, b) { //按日期排序 
						var s = a.DetailsTime.toLowerCase();
						var t = b.DetailsTime.toLowerCase();
						if(s < t) return -1;
						if(s > t) return 1;
					});
					var thisweekdata = [];
					var lastweekdata = [];
					var weekday = [];
					for(var i = 0; i < thisweek.length; i++) {
						thisweekdata[i] = thisweek[i].DetailsAccount;
						lastweekdata[i] = lastweek[i].DetailsAccount;
						weekday[i] = getweek(new Date(thisweek[i].DetailsTime));
					}
					sevenOrderLinechart.setOption(chart_04(weekday, thisweekdata, lastweekdata,'下单数（个）'));
				});
            var monthOrderLinechart; //30天营业额折线图
			monthOrderLinechart = echarts.init(document.getElementById('monthCharts'), 'macarons');
			$xiuse.OrderCharts(currentRestaurant, $scope.lastmonthdate.Format("yyyy-MM-dd"), $scope.tomorrowdaydate.Format("yyyy-MM-dd"))
				.then(function(response) {
					var thismonth = response.Data.NowObj;
					thismonth.sort(function(a, b) { //按日期排序 
						var s = a.DetailsTime.toLowerCase();
						var t = b.DetailsTime.toLowerCase();
						if(s < t) return -1;
						if(s > t) return 1;
					});
					var thismonthdata = [];
					var monthday = [];
					for(var i = 0; i < thismonth.length; i++) {
						thismonthdata[i] = thismonth[i].DetailsAccount;
						monthday[i] = (new Date(thismonth[i].DetailsTime)).Format("MM/dd");
					}
					monthOrderLinechart.setOption(chart_05(monthday, thismonthdata,'下单数（个）'));
				});
			$('#sevendaysCharts').addClass('in active');
			$('#monthCharts').removeClass('in active');
			$('li[name="monthtab"]').removeClass('active');
			$('li[name="seventab"]').addClass('active');
			$('#modalDetailCharts').modal('show');
		})

		//七天会员详情
		$('label[name="sevenmemberdetail"]').click(function() {
			$scope.tablessettitle= "会员详细记录";
			$scope.pageurl="";
			$scope.itemsperpage=5;
			$scope.pageurl="MemberRecordDetails";
			$scope.paramsdetail = new Object();
			$scope.paramsdetail.Condition="";
			$scope.paramsdetail.RestaurantId = currentRestaurant;
			$scope.paramsdetail.beginDT = $scope.lastweekdate.Format("yyyy-MM-dd");
			$scope.paramsdetail.EndDT = $scope.tomorrowdaydate.Format("yyyy-MM-dd");
			$scope.paramsdetail.CurrentPage = 1;
			$scope.paramsdetail.popular = "0";
			$scope.paramsdetail.TotalItem = "-1";
			if($scope.searchcondition!=""){
				$scope.paramsdetail.Condition=$scope.searchcondition;
			}
			$scope.Searchcondicton=function(condition){
				$scope.paramsdetail.Condition=$scope.searchcondition;
				$scope.itemsperpage=5;
				$scope.paramsdetail.CurrentPage = 1;
			};
			$scope.$apply();
			$('#membersevendaysTables').addClass('in active');
			$('#membermonthTables').removeClass('in active');
			$('li[name="memmonthtab"]').removeClass('active');
			$('li[name="memseventab"]').addClass('active');
			$('#modalmemberDetailTables').modal('show');
			$('#modalmemberDetailTables').find('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
				// 获取已激活的标签页的名称
				var activeTab = $(e.target).parent('li').val();
				// 获取前一个激活的标签页的名称
				if(activeTab == 0) {
					$scope.paramsdetail.beginDT = $scope.lastmonthdate.Format("yyyy-MM-dd");
					$scope.paramsdetail.EndDT = $scope.tomorrowdaydate.Format("yyyy-MM-dd");
					$scope.paramsdetail.popular = "0";
					$scope.paramsdetail.CurrentPage = 1;
					$scope.paramsdetail.TotalItem = "-1";
					$scope.paramsdetail.Condition="";
					$scope.$apply();
				} 
				else if(activeTab == 1) {
					$scope.paramsdetail.beginDT = $scope.lastweekdate.Format("yyyy-MM-dd");
					$scope.paramsdetail.EndDT = $scope.tomorrowdaydate.Format("yyyy-MM-dd");
					$scope.paramsdetail.popular = "0";
					$scope.paramsdetail.CurrentPage = 1;
					$scope.paramsdetail.TotalItem = "-1";
					$scope.paramsdetail.Condition="";
					$scope.$apply();
				}
			});	
		});
        $scope.searchconbtn=function(condition){
        	console.log(condition);
        }
		$scope.foodtques = function(chtable, idname) {
			//console.log(chtable);
			var time1 = '<p><span>' + chtable.DinerType + '</span>:<span>' + chtable.BeginTime +
				"~" + chtable.EndTime +
				'</span><span class="edittime" data-name="' + chtable.DinerType + '">修改</span></p>';
			//$scope.$apply();
			//$(idname).find('span[name="' + chtable.DinerType + '"]').tooltip('destroy'); 					
			$(idname).find('span[name="' + chtable.DinerType + '"]').tooltip({
				placement: "bottom",
				trigger: 'click manual',
				html: true,
				title: time1
			}).on("mouseenter", function() {
				$(this).click(function(event) {
					event.stopPropagation();
				});
				$(this).parents("tr").siblings("tr").find(".tooltip").tooltip("hide");
			}).click(function() {
				$(idname).find('span[data-name="' + chtable.DinerType + '"]').off("click").on("click", function() {
					$scope.edittime(chtable.DinerType, chtable.BeginTime, chtable.EndTime);
				});
			});
		}
		//更改时间模态
		$scope.edittime = function(timepart, Starttime, Endtime) {
			$scope.timesettitle = '修改"' + timepart + '"时间段';
			//console.log(Starttime.hours);
			var Starttimehours = Starttime.substr(0, 2);
			var Starttimeminutes = Starttime.substr(3, 2);
			var Endtimehours = Endtime.substr(0, 2);
			var Endtimeminutes = Endtime.substr(3, 2);
			$scope.Starttime.hours = Starttimehours;
			$scope.Starttime.minutes = Starttimeminutes;
			$scope.Endtime.hours = Endtimehours;
			$scope.Endtime.minutes = Endtimeminutes;
			$scope.$apply();
			$('#modalTimeSetting').modal('show');
		}
		//小时输入判断
		$scope.checkhours = function(hours) {
			if(hours > 24 || hours < 0 || hours == "" || hours == undefined || isNaN(hours)) {
				return true;
			} else {
				return false;
			}
		}
		//分钟输入判断
		$scope.checkminutes = function(minutes) {
			if(minutes > 59 || minutes < 0 || minutes == "" || minutes == undefined || isNaN(minutes)) {
				return true;
			} else {
				return false;
			}
		}

		function settimeformat(time) {
			if(time >= 0 && time < 10 && time.length < 2) {
				return 0 + time;
			} else {
				return time;
			}
		}

		function setDinerType(timepart) {
			switch(timepart) {
				case '早餐':
					return 0;
					break;
				case '午餐':
					return 1;
					break;
				case '晚餐':
					return 2;
					break;
				case '夜宵':
					return 3;
					break;
			}
		}
		//更改时间段保存
		$scope.Savetime = function(Starttime, Endtime) {
			//开始时间大于终止时间时怎么办？？
			var timepart = $scope.timesettitle.substr(3, 2);
			if(!$('#modalTimeSetting').find('span[class="errormessage"]').is(':visible')) {
				Starttime.hours = settimeformat(Starttime.hours);
				Starttime.minutes = settimeformat(Starttime.minutes);
				Endtime.hours = settimeformat(Endtime.hours);
				Endtime.minutes = settimeformat(Endtime.minutes);
				var setparttime = new Object();
				setparttime.RepeatTimeType = setDinerType(timepart);
				setparttime.DinerType = timepart;
				setparttime.BeginTime = Starttime.hours + ":" + Starttime.minutes;
				setparttime.EndTime = Endtime.hours + ":" + Endtime.minutes;
				setparttime.RestaurantId = currentRestaurant;
				$xiuse.SetRepeatTime(setparttime).then(function(response) {
					$('#modalTimeSetting').modal('hide');
					changetableoneday();
					changetablesevendays();

				});
			}
		}
		$(document).click(function() {
			$('.tooltip').remove();
		});
		$(document).ready(function() {
			changetableoneday();
			changetablesevendays();
		});
		//退单原因占比图
		function chart_03(backorder) {
			var backChart_option = {
				tooltip: {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				legend: {
					x: 'center',
					y: 'top',
					data: (function() {
						var res = [];
						var len = backorder.length;
						while(len--) {
							res.push(
								backorder[len].BackOrderCause);
						}
						return res;
					})(),
				},
				calculable: true,
				series: [{
					name: '访问来源',
					type: 'pie',
					radius: ['60%', '90%'],
					itemStyle: {
						normal: {
							label: {
								show: false
							},
							labelLine: {
								show: false
							}
						},
						emphasis: {
							label: {
								show: true,
								position: 'center',
								textStyle: {
									fontSize: '20',
									fontWeight: 'bold'
								}
							}
						}
					},
					data: (function() {
						var res = [];
						var len = backorder.length;
						while(len--) {
							res.push({
								name: backorder[len].BackOrderCause,
								value: backorder[len].BackOrderNum
							});
						}
						return res;
					})(),
				}]
			};
			return backChart_option;
			//backChart.setOption(backChart_option);
		}
		//7天折线图
		function chart_04(week, data1, data2,data3) {
			var lineCharts_option = {
				tooltip: {
					trigger: 'axis'
				},
				legend: {
					data: ['最近7天', '前7天']
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				toolbox: {
					feature: {
						saveAsImage: {}
					}
				},
				xAxis: {
					type: 'category',
					boundaryGap: false,
					name: '日期',
					data: week
				},
				yAxis: {
					type: 'value',
					name: data3
				},
				series: [{
						name: '最近7天',
						type: 'line',
						stack: '总量',
						data: data1
					},
					{
						name: '前7天',
						type: 'line',
						stack: '总量',
						data: data2
					},
				]
			};
			return lineCharts_option;
		}
		//30天折线图
		function chart_05(date1, data1,data3) {
			var lineCharts_option = {
				tooltip: {
					trigger: 'axis'
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				toolbox: {
					feature: {
						saveAsImage: {}
					}
				},
				xAxis: {
					type: 'category',
					boundaryGap: false,
					name: '日期',
					data: date1,
					axisLabel: {
						//X轴刻度配置
						interval: 3 //0：表示全部显示不间隔；auto:表示自动根据刻度个数和宽度自动设置间隔个数
					}
				},
				yAxis: {
					type: 'value',
					name: data3
				},
				series: [{
					name: '营业额',
					type: 'line',
					stack: '总量',
					data: data1
				}]
			};
			return lineCharts_option;
		}
	});
});