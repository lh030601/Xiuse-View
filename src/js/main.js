(function(win){
	var config ={
		baseUrl:'src/js/',
		paths:{
			angular:'lib/angular/angular-1.2.10',
			angularroute:'lib/angular/angular-route',
			angularanimate:'lib/angular/angular-animate.min',
			couchpotato:'lib/angular/angular-couch-potato',
			uirouter:'lib/angular/angular-ui-router.min',
			jquery:'lib/jquery/jquery.min',
			jqueryCookie:'lib/jquery/jquery-cookie.min',
			bootstrap:'lib/bootstrap/js/bootstrap.min',
			datetimepicker:'lib/bootstrap/js/datetimepicker.min',
			nicescroll:'lib/jquery/jquery.nicescroll.min',
			eacharts:'lib/echarts/echarts',
			icheck:'lib/icheck/icheck',
			JsonCheck:'lib/JsonCheck',
			tripledes:'lib/cryptoJS/rollups/tripledes',
			modeEcb:'lib/cryptoJS/components/mode-ecb',
			MD5:'lib/cryptoJS/components/md5-min',
			
			order:'js/app/order',
			ctrl:'app/controllers',
			directives:'app/directives',
			ConfigApi:'ConfigApi',
			xiuse:'api/xiuse',
			Common:'api/Common'
		},
		shim:{
			angular:{
				exports:'angular'
			},
			angulerroute:{
				deps:['angular']
			},
			uirouter:{
				deps:['angular']
			},
			angularanimate:{
				deps:['angular']
			},
			jquery:{
				
			},
			jqueryCookie:{
				deps:['jquery'],
				exports: 'jquery-cookie'
			},
			bootstrap:{
				deps:['jquery']
			},
			datetimepicker:{
				deps:['jquery']
			},
			nicescroll:{
				deps:['jquery']
			},
			eacharts:{
				deps:['jquery']
			},
			icheck:{
				deps:['bootstrap']
			},
			JsonCheck:{
				deps:['jquery']
			},
			tripledes:{
				deps:['jquery']
			},
			modeEcb:{
				deps:['jquery','tripledes']
			},
			MD5:{
				deps:['jquery']
			},
			Common:{
				exports:'Common'
			},
			xiuse:{
				exports:"xiuse"
			},
			ConfigApi:{
				exports:"ConfigApi"
			},
			order:{
				deps:['jquery'],
				exports:"$"
			},
			deps: ['loader'],
			urlArgs: "bust=" + (new Date()).getTime()
		}
	};
	
	require.config(config);
	require(['loader']);
	/*
	require(['du','su','aplugin','bplugin','angular'],function(a,stringUtil){
		a.toString();
		stringUtil.toUpperCase();
		var ap = require('aplugin');
		var bp = require('bplugin');
		ap.toString();
		bp.toString();
	});*/
})(window)


