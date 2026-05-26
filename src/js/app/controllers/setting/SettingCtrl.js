define(['ctrl/module','ConfigApi'], function(controllers,ConfigApi) {
	'use strict';
	controllers.controller('settingCtrl', function($state,$location) {
	
	var url1="tpls.setting.memberSetting";
	var url2=window.location.hash;
	url2=url2.replace("#/","");
	var reg=/\//g;
	url2=url2.replace(reg,".");
	var url3=url2.substring(0,13);
   if(url3!="tpls.setting."){
   	$state.go(url1);
   	url2="";
   }
   else {
   	if(url1!=url2){
   	$state.go(url2); 
   	url2="";
   }
   else{
   	$state.go(url1);
   	url2="";
   }
   }
   var newurl=window.location.hash;
   newurl=newurl.replace("#/tpls/setting/","");
   $('a[href="#'+newurl+'"]').parents(".launcher").addClass("active");	
	//alert(url2);
	});	
});
