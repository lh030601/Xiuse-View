define(
	[
		'angular',
		'tripledes',
		'modeEcb',
		'ConfigApi'
	],
	function(angluar, tripledes,modeEcb,ConfigApi) {
		angluar.module('Common',[])
		.factory('$Common', ['$state',function($state) {
			return {
				/*加密DES函数(数据传输的秘钥加密)*/
				EncryptByDES:function (message) {
					if(ConfigApi.Common.Key == ""){
						$.ajax({type :"Get",url :ConfigApi.BackEnd.Ip+ConfigApi.BackEnd.Key,async : false,
						 success : function(response){
						 	if (response.Info == "1")
								ConfigApi.Common.Key=response.Data;
						}});
					}
		            var keyHex = CryptoJS.enc.Utf8.parse(ConfigApi.Common.Key);
		            var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
		                mode: CryptoJS.mode.ECB,
		                padding: CryptoJS.pad.Pkcs7
		            });
		            return encrypted.toString();
		      },
		      /*加密DES函数(本地加密数据)*/
				EncryptByDES_Client:function (message) {
					if(ConfigApi.Common.KeyClient == ""){
						$.ajax({type :"Get",url :ConfigApi.BackEnd.Ip+ConfigApi.BackEnd_.KeyClient,async : false,
						 success : function(response){
						 	if (response.Info == "1")
								ConfigApi.Common.KeyClient=response.Data;
						}});
					}
					
		            var keyHex = CryptoJS.enc.Utf8.parse(ConfigApi.Common.KeyClient);
		            var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
		                mode: CryptoJS.mode.ECB,
		                padding: CryptoJS.pad.Pkcs7
		            });
		            return encrypted.toString();
		      },
		      /*解密DES函数(本地解密数据)*/
				DecryptByDES_Client:function (message) {
					if(ConfigApi.Common.KeyClient == ""){
						$.ajax({type :"Get",url :ConfigApi.BackEnd.Ip+ConfigApi.BackEnd_.KeyClient,async : false,
						 success : function(response){
						 	if (response.Info == "1")
								ConfigApi.Common.KeyClient=response.Data;
						}});
					}
					 var keyHex = CryptoJS.enc.Utf8.parse(ConfigApi.Common.KeyClient);
		            var decrypted = CryptoJS.DES.decrypt({
		                ciphertext: CryptoJS.enc.Base64.parse(message)
		            }, keyHex, {
		                mode: CryptoJS.mode.ECB,
		                padding: CryptoJS.pad.Pkcs7
		            });
		            return decrypted.toString(CryptoJS.enc.Utf8);
		      },
		      /*随机生成n位的随机数*/
				RndNum:function (n){
				  var rnd="";
				  for(var i=0;i<n;i++)
				     rnd+=Math.floor(Math.random()*10);
				  return rnd;
				},
				/*数字签名*/
				Signature:function( timeStamp,  nonce, staffId,  token){
					var signature = "";
					var signStr = timeStamp + nonce + staffId + token;
					var b=signStr.split("");       //分割字符串a为数组b
				    b.sort();              //数组b升序排序（系统自带的方法）
				    signStr=b.join("");        //把数组b每个元素连接成字符串c
					return CryptoJS.MD5(signStr).toString().toUpperCase();
				},
				/*请求的头部信息*/
				Header:function(n){
					if( sessionStorage.Token != undefined&&sessionStorage.Token != 'undefined')
						ConfigApi.Common.Token = JSON.parse(sessionStorage.Token);
					var signature = "";
					var timeStamp = new Date().getTime();
					var nonce ="";
					 for(var i=0;i<n;i++)
				     nonce+=Math.floor(Math.random()*10);
					var signStr = timeStamp + nonce + ConfigApi.Common.Token.StaffId + ConfigApi.Common.Token.SignToken;
					var b=signStr.split("");       //分割字符串a为数组b
				    b.sort();              //数组b升序排序（系统自带的方法）
				    signStr=b.join("");        //把数组b每个元素连接成字符串c
					signature= CryptoJS.MD5(signStr).toString().toUpperCase();
					var header={"staffid":ConfigApi.Common.Token.StaffId,"timestamp":timeStamp,"nonce":nonce,signature:signature};
					return header;
				},
				/*处理错误请求*/
				DealError:function(code){
					if(code == undefined)
				   		return;
				   	else if(code == 200)
				   		return;
				   	else{
				   		ConfigApi.Common.Token = "";
				   		$state.go('login',{returnUrl:""});
				   	}
				},
				/*深拷贝*/
				deepCopy:function(source) { 
				    var result={};
				    for (var key in source) {
				        result[key] = typeof source[key]==='object'?deepCopy(source[key]): source[key];
				     } 
				   return result; 
				},
				Clone:function(item){
					if (!item) { return item; } // null, undefined values check  
				    var types = [ Number, String, Boolean ],   
				        result;  
				    // normalizing primitives if someone did new String('aaa'), or new Number('444');     
				    //一些通过new方式建立的东东可能会类型发生变化，我们在这里要做一下正常化处理  
				    //比如new String('aaa'), or new Number('444')  
				    types.forEach(function(type) {  
				        if (item instanceof type) {  
				            result = type( item );  
				        }  
				    });  
				    if (typeof result == "undefined") {  
				        if (Object.prototype.toString.call( item ) === "[object Array]") {  
				            result = [];  
				            item.forEach(function(child, index, array) {   
				                result[index] = clone( child );  
				            });  
				        } else if (typeof item == "object") {  
				            // testign that this is DOM  
				            //如果是dom对象，那么用自带的cloneNode处理  
				            if (item.nodeType && typeof item.cloneNode == "function") {  
				                var result = item.cloneNode( true );      
				            } else if (!item.prototype) { // check that this is a literal  
				                // it is an object literal        
				            //如果是个对象迭代的话，我们可以用for in 迭代来赋值  
				                result = {};  
				                for (var i in item) {  
				                    result[i] = clone( item[i] );  
				                }  
				            } else {  
				                // depending what you would like here,  
				                // just keep the reference, or create new object  
				                //这里解决的是带构造函数的情况，这里要看你想怎么复制了，深得话，去掉那个false && ，浅的话，维持原有的引用，                  
				                //但是我不建议你去new一个构造函数来进行深复制，具体原因下面会解释  
				                if (false && item.constructor) {  
				                    // would not advice to do that, reason? Read below  
				                //朕不建议你去new它的构造函数  
				                    result = new item.constructor();  
				                } else {  
				                    result = item;  
				                }  
				            }  
				        } else {  
				            result = item;  
				        }  
				    }  
				    return result;  
				},
				GetFilterObj:function(jsonObj,key,value){
					var obj = null;
	
					$.each(jsonObj, function(index,item) {
						if(item[key] == value)
						{
								obj = item;
						}
					});
					return obj;
				},
				GetFilterList:function(jsonObj,key,value){
					var obj = [];
					$.each(jsonObj, function(index,item) {
						if(item[key] == value)
							{
								obj = item;
								obj.push(item);
							}
					});
					return obj;
				}
			}
		}]);
		

	}
)
