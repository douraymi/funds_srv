//! stockTool.js
//! version : 0.0.1
//! authors : douraymi
//! license : MIT
//! girafeee.com

(function (undefined) {

	var stockTool,
			stockAngular,
			globalScope = typeof global !== 'undefined' ? global : this,
			oldGlobalStock,
			hasOwnProperty = Object.prototype.hasOwnProperty;

	// check for moment.js
	if(moment){
		// loaded in script (Angular)
	}else if(moment=require('moment')){
		// nodejs way
	}else{
		throw('need moment.js!');
		return;
	}

  // check for nodeJS
  hasModule = (typeof module !== 'undefined' && module && module.exports);
  if(hasModule){
    var request = require('request');
    var httpRequest = function(url, cb, xparms){
      request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
        	data["xparms"] = xparms;
          return cb(null, body);
        }else{
          console.log("error <<request <<stockTool ");
          return cb(error);
        }
      })
    };
	  stock = stockTools(httpRequest);
  }

  // check for angularJS
  hasAngular = (typeof angular !== 'undefined' && angular);
  if(hasAngular){
  	stockAngular = function(){
	  	angular.module('stockTool', []).service('stockTool', ['$http', function($http){
	  		var httpRequest = function(url, cb, xparms){
			  	$http.jsonp(url)
			  	.success(function(data, status, headers, config) {
			  		data["xparms"] = xparms;
		        cb(null, data);
			    })
			    .error(function(data, status, headers, config) {
            console.log('hreq con:', config);
			    	console.log("error httpRequest <<$http << angular <<stockTool ");
			    	cb("error url: "+url);
			    });

	  		};

        // var httpRequest2 = function(url, cb){
        //   $http.get(url)
        //   .success(function(data, status, headers, config) {

        //     cb(null, data);
        //   })
        //   .error(function(data, status, headers, config) {

        //     console.log("error httpRequest2 <<$http << angular <<stockTool ");
        //     cb("error url: "+url);
        //   });

        // }

        // return stockTools(httpRequest)(httpRequest2, 2);
	  		return stockTools(httpRequest);
	  	}]);

  	}
  }

// function
	function track(days, tarckSetting){
		if(!isObject(days) || !isArray(tarckSetting) ) throw("NO DATA<< track << stockTools");
		var rt = [];
		// var big = small = {
		// 	'date'   : '',
		// 	'price'  : 0
		// }
		for(var k in days){
			var data = {
        'id'          : days[k].id,
				'stockName' 	: days[k].stockName,
				'stockCode' 	: days[k].stockCode,
				'startDate' 	: days[k].startDate,
				'beginPrice' 	: days[k].beginPrice,
				'isEnd' 			: days[k].isEnd
			}
      var big = {};
      var small = {};
			big.price = days[k].beginPrice;
      small.price = days[k].beginPrice;
			big.date = days[k].startDate;
      small.date = days[k].startDate;

      // var set = tarckSetting.sort(sortNumber);
			var set = tarckSetting.sort(sortNumber).concat();
			var set_low = set.shift();

			if(days[k] && days[k].daysData){
				for (var i = 0; i < days[k].daysData.length; i++) {
          var d = days[k].daysData;
          // console.log('d[i][0]:', d[i][0]);
					if( parseFloat(d[i][5], 2) < small.price){
						small.price = parseFloat(d[i][5], 2);
						small.date = d[i][0];
					}

					if( parseFloat(d[i][6], 2) > big.price){
						big.price = parseFloat(d[i][6], 2);
						big.date = d[i][0];
					}

					if(set_low == i){
						data[set_low+'bp'] = toFixFloat( 100*(big.price - data['beginPrice'])/data['beginPrice'], 1) + '%';
						data[set_low+'bdd'] = moment(big.date, "YYYY-MM-DD").format("YYMMDD");
						data[set_low+'bd'] = moment(big.date, "YYYY-MM-DD").diff(moment(data.startDate, "YYYY-MM-DD"), 'days') + 'st';
						data[set_low+'sp'] = toFixFloat( 100*(small.price - data['beginPrice'])/data['beginPrice'], 1) + '%';
						data[set_low+'sdd'] = moment(small.date, "YYYY-MM-DD").format("YYMMDD");
						data[set_low+'sd'] = moment(small.date, "YYYY-MM-DD").diff(moment(data.startDate, "YYYY-MM-DD"), 'days') + 'st';

						if(set_low = set.shift()){

							continue;
						}else{
							data['isEnd'] = true;
							break;
						}
					}	
				}

			}

      if(set_low){
        set.unshift(set_low);
      }
      for(var seti=0; seti<set.length; ++seti){
        data[set[seti]+'bp'] = toFixFloat( 100*(big.price - data['beginPrice'])/data['beginPrice'], 1) + '%';
        data[set[seti]+'bdd'] = moment(big.date, "YYYY-MM-DD").format("YYMMDD");
        data[set[seti]+'bd'] = moment(big.date, "YYYY-MM-DD").diff(moment(data.startDate, "YYYY-MM-DD"), 'days') + 'st';
        data[set[seti]+'sp'] = toFixFloat( 100*(small.price - data['beginPrice'])/data['beginPrice'], 1) + '%';
        data[set[seti]+'sdd'] = moment(small.date, "YYYY-MM-DD").format("YYMMDD");
        data[set[seti]+'sd'] = moment(small.date, "YYYY-MM-DD").diff(moment(data.startDate, "YYYY-MM-DD"), 'days') + 'st';
      }
      rt[days[k].key] = data;
		}

		return rt;
	}

// stockTools
  var stockTools = function(httpRequest, hreqSwitch){
    if(!hreqSwitch || hreqSwitch == 0 || hreqSwitch == 1){
  	  stockTools.hreq = httpRequest;
    }else if(hreqSwitch == 2){
      stockTools.hreq2 = httpRequest;
    }
  	return stockTools;
  }

  stockTools.getStockPnN = function(postData, cb){
    var urlBase = 'http://api.money.126.net/data/feed/';
    if(postData.stockCode.charAt(0) == 6){
      var stockCode = '0'+postData.stockCode;
      var url = urlBase+stockCode+'?callback=JSON_CALLBACK';
    }else{
      var stockCode = '1'+postData.stockCode;
      var url = urlBase+stockCode+'?callback=JSON_CALLBACK';
    }

    // console.log("url1:", url);
    stockTools.hreq(url, function(err, data){
      if(err){
        console.log("error << stockSohu <<stockTool ");
        throw(err);
      }
      // console.log(data);
      if(data){
        var rtd = {};
        rtd.name = data[stockCode].name;
        rtd.price = data[stockCode].price;	//如果获取数据是在当天则采用 以后考虑用平均法 high low

        //for fix
        rtd.stockCode = postData.stockCode;

        var isToday = moment().diff(moment(postData.startDate, "YYYY-MM-DD"), 'days');
        // console.log('isToday:', isToday);
        if(isToday > 0){
          var urlBase2 = 'http://q.stock.sohu.com/hisHq?stat=1&order=A&period=d&callback=JSON_CALLBACK&rt=jsonp&code=cn_';
          // var url2 = urlBase2+postData.stockCode+'&start='+postData.startDate+'&end='+postData.startDate;  //应该用moment() 处理从以前的周末或者非交易日时的添加
          var url2 = urlBase2+postData.stockCode+'&start='+postData.startDate+'&end='+today();
          stockTools.hreq(url2, function(err2, data2){
            if(err2){
              console.log("error2 << stockSohu <<stockTool ");
              throw(err2);
            }
            // console.log(data);
            if(data2[0] && data2[0].hq){
              var price = toFixFloat( (parseFloat(data2[0].hq[0][5])+parseFloat(data2[0].hq[0][6]))/2, 2);
              rtd.price = price;
            }
            cb(rtd);


          })

        }else{
          cb(rtd);
        }

      }else{
        throw("no data");
      }
    })

  }


  // 'http://q.stock.sohu.com/hisHq?code=cn_300228&start=20130930&end=20131231&stat=1&order=D&period=d&callback=JSON_CALLBACK&rt=jsonp'
  stockTools.trackFromSohu = function(stockObj_s, tarckSetting, cb){
  	var codeList = isArray(stockObj_s) ? stockObj_s:[stockObj_s];
  	var sohuData = {};

  	// order: A时间升序 D时间倒序
  	var urlBase = 'http://q.stock.sohu.com/hisHq?stat=1&order=A&period=d&callback=JSON_CALLBACK&rt=jsonp&code=cn_';
    var rtt = codeList.length;
    var endDate = today();
    for(var key=0; key<codeList.length; ++key){
      // sohuData[codeList[key].stockCode] = codeList[key];
    	// sohuData[codeList[key].stockCode].key = key;
    	sohuData[codeList[key].stockCode+codeList[key].startDate] = codeList[key];
    	sohuData[codeList[key].stockCode+codeList[key].startDate].key = key;
     	var url = urlBase+codeList[key].stockCode+'&start='+codeList[key].startDate+'&end='+endDate;
      // console.log('Url: ', url);
      // console.log('sohuData:', sohuData);

      var xparms = codeList[key];
     	stockTools.hreq(url, function(err, data){
       	if(err){
	        console.log("error << stockSohu <<stockTool ");
	        return cb(err);
       	}

       	//在异步中key不准，不能用来做判断
        // console.log('data: ', data);
        if(data[0]){
        	// console.log('data', data);
        	// var tmpDayString = data[0].stat[1].substr(0,10);	//第二个参数是获取长度 moment(tmpDayString).format("YYYYMMDD")  // data[0].code.substring(3)
       	  sohuData[data.xparms.stockCode+data.xparms.startDate].daysData = data[0].hq;
        }else{
          // 如果没有data[0]的情况这里不用处理，在track的逻辑中使用了默认值，for循环会空
        }

       	rtt--;
       	if( rtt == 0 ){
       		// console.log('sohuData:', sohuData);
       		var returnData = track(sohuData, tarckSetting);
          return cb(null, returnData);
       	}

     	}, xparms);
    }

  }


  /************************************
      Helper
  ************************************/
	function toFixFloat(number,fractionDigits){
		var rt = Math.round(number*Math.pow(10,fractionDigits))/Math.pow(10,fractionDigits);
		return rt;   
	}

  function today(){
   //  Date.prototype.format = function(format){ 
   //    var o = { 
   //      "M+" : this.getMonth()+1, //month 
   //      "d+" : this.getDate(), //day 
   //      "h+" : this.getHours(), //hour 
   //      "m+" : this.getMinutes(), //minute 
   //      "s+" : this.getSeconds(), //second 
   //      "q+" : Math.floor((this.getMonth()+3)/3), //quarter 
   //      "S" : this.getMilliseconds() //millisecond 
   //    } 

   //    if(/(y+)/.test(format)) { 
   //      format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
   //    } 

   //    for(var k in o) { 
   //      if(new RegExp("("+ k +")").test(format)) { 
   //        format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
   //      } 
   //    } 
   //    return format; 
   //  } 

  	// var date = new Date();
   //  return date.format("yyyyMMdd");
   return moment().format('YYYYMMDD');
  }

  function sortNumber(a, b){
		return a - b;
	}

  if(!Array.isArray){
  	function isArray(obj) {
  		return Object.prototype.toString.call(obj) === '[object Array]'; 
  	} 
  }

  function isObject(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  function hasOwnProp(a, b) {
    return hasOwnProperty.call(a, b);
  }

  function extend(a, b) {
    for (var i in b) {
      if (hasOwnProp(b, i)) {
        a[i] = b[i];
      }
    }

    if (hasOwnProp(b, 'toString')) {
      a.toString = b.toString;
    }

    if (hasOwnProp(b, 'valueOf')) {
      a.valueOf = b.valueOf;
    }

    return a;
  }

  function deprecate(msg, fn) {
    var firstTime = true;
    return extend(function () {
      if (firstTime) {
        printMsg(msg);
        firstTime = false;
      }
      return fn.apply(this, arguments);
    }, fn);
  }

  function makeGlobal(shouldDeprecate) {
    /*global ender:false */
    if (typeof ender !== 'undefined') {
      return;
    }
    oldGlobalStock = globalScope.stockTool;
    if (shouldDeprecate) {
      globalScope.stockTool = deprecate(
              'Accessing stockTool through the global scope is ' +
              'deprecated, and will be removed in an upcoming ' +
              'release.',
              stockTool);
    } else {
      globalScope.stockTool = stockTool;
    }
  }

  /************************************
      Exposing App
  ************************************/

  // CommonJS module is defined
  if (hasModule) {
    module.exports = stockTool;
  } else if (typeof define === 'function' && define.amd) {
  	httpRequest = typeof request !== 'undefined' ? request : null;
    define('stockTool', function (require, exports, module) {
      if (module.config && module.config() && module.config().noGlobal === true) {
        // release the global variable
        globalScope.stockTool = oldGlobalStock;
      }

      if(!hasAngular){
      	return stockTool;
      }else{
      	stockAngular();
      }

    });
    makeGlobal(true);

  } else if(hasAngular){
  	stockAngular();
  } else {
    makeGlobal();
  }
}).call(this);