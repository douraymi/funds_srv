'use strict'
var moment = require('moment');
var request = require("request");
var j = request.jar();
request = request.defaults({jar:j});

var jquery = require('jquery');
var env = require('jsdom').env;

var uds = require('underscore');

var tools = require('./tools');
/* ---- state
200	成功
401	无权限
500	访问错误
*/
var ES = ' <sumiApi< ';

function sumi(){}

//login to sumi
sumi.login = function(username, pwd, cb){
	var ER={};
	var url = 'https://account.fund123.cn/login/login/Login.aspx';
	var fd = {
		username 	: username
		,pwd			: pwd
	};
	var lState;
	request.post({url:url, formData: fd}, function(err, rep, body){
		if (err){
			err.message+=" (1) login"+ES;
			return cb(err); // 可能sumi服务器问题
		}
		
		//用户名密码对了set-cookie会有username 在j中
		var jvalue = j._jar.store.idx['fund123.cn']['/'].su.value;
		if(!jvalue.match(username)){
			ER.status=401;
			ER.message=" (loginFailed:"+fd.username+"/"+fd.pwd+") login"+ES;
			return cb(ER);
		}

		return cb(null);
	});
}
sumi.fetch = function(username, pwd, bgDate, cb){
	var ER={};
	var self = this;
	var url = 'http://my.fund123.cn/MyStat/ReturnStatHistory.aspx';
	var fd = {
				pid 				: 'RealPartition'
				,sid 				: 0
				,startDate 	: ''
				,endDate 		: ''
	};
	/* --- 时间说明
		当前的前一天为endDate 因为当天数据不全不能获取
		bgDate从已存数据中取最后一个日期
		再次获取从upToDate+1开始
	*/
	fd.startDate 	= moment(bgDate).add(1, 'days').format('YYYY-MM-DD');
	fd.endDate 		= moment().subtract(1, 'days').format('YYYY-MM-DD');
	var diff = moment(fd.endDate).diff(moment(fd.startDate), 'days');
	// -1是当天 无数据，0是第二天，0及以上才需要
	if(diff < -1){
		ER.status=500;
		ER.message=" (beginDate不正确，建议reset数据) fetch"+ES;
		return cb(ER);
	}else if(diff == -1){
		return cb(null,null);
	}

	self.login(username, pwd, function(err){
		if(err){
			err.message+=" (1) fetch"+ES;
			return cb(err);
		}

		request.post({url:url, formData: fd},function(err, rep, body){
			if(err){
				err.message+=" (2) fetch"+ES;
				return cb(err);
			}

			if(uds.isEmpty(body) ){
				ER.status=500;
				ER.message=" (不知名原因body空，看log) fetch"+ES;
				console.log("body: ", body);
				return cb(ER);
			}

			//用户名密码对了set-cookie会有username 在j中
			var jvalue = j._jar.store.idx['fund123.cn']['/'].su.value;
			if(!jvalue.match(username)){
				ER.status=401;
				ER.message=" (j失效了) fetch"+ES;
				return cb(ER);
			}

			parse(body, function(err, fData){		//body, fData ASC
				if (err){
					err.message+=" (3) fetch"+ES;
					return cb(err);
				}

				return cb(null, fData);
			});
		});
	});
}
sumi.workFakeBJ = function(lastFBJ, history, fakeBJSet, cb){
	var ER={};
	if(lastFBJ){
		Lastday = lastFBJ;
	}else{
		var zeroArray = tools.initSizeArray(0, fakeBJSet.length);
		var Lastday = {
			"date" 					: moment(history[0].date).subtract(1, 'days').format('YYYY-MM-DD'),
			"shiZhi" 				: 0,
			"fakeYingKui"		: 0,
			"fakeYKCost" 		: 0,
			"leiJiBenJin"		: 0,
			"leiJiShuHui"		: 0,
			"ziJinChengBen" : zeroArray,
			"fakeBenJin" 		: zeroArray
		};		
	}

	if(uds.isEmpty(history) ){
		ER.status=500;
		ER.message=" (history无数据传输过来) workFakeBJ"+ES;
		return cb(ER);
	}

	if( moment(Lastday.date).diff(moment(history[0].date), 'days') >= 0 ){
		ER.status=500;
		ER.message=" (history数据与fakeBJ数据不匹配,建议reset) workFakeBJ"+ES;
		return cb(ER);
	}

	var Today, tempday;
	var FakeBJ = [];

	for (var i = 0; i < history.length; i++) {
		Today = history[i];
		tempday = {
			"date" 					: Today.date,
			"shiZhi" 				: Today.sz,
			"fakeYingKui"		: tools.toFixFloat( Today.ljshyk - Lastday.fakeYKCost, 2),
			"fakeYKCost" 		: Lastday.fakeYKCost,
			"leiJiBenJin" 	: Today.ljbj,
			"leiJiShuHui" 	: tools.toFixFloat( Today.ljbj + Today.ljshyk - Today.sz, 2),
			"fakeBenJin"		: [],
			"ziJinChengBen"	: []
		};

		//计算相差天数 用以作为每天资金成本的计算相乘单位
		var lxdays = moment(Today.date).diff(moment(Lastday.date), 'days');
		//检查是否赎回
		var newShuHui = tempday.leiJiShuHui - Lastday.leiJiShuHui;

		//计算fakeShuHui
		if(newShuHui > 0){
			if(newShuHui - (Today.ljshyk - Lastday.fakeYKCost) >= 0 ){
				tempday.fakeYKCost = Today.ljshyk;
			}else{
				tempday.fakeYKCost += newShuHui;
				tempday.fakeYKCost = tools.toFixFloat( tempday.fakeYKCost, 2);
			}
		}

		//计算fakeChengBen
		for (var j = 0; j < fakeBJSet.length; j++) {

			if(newShuHui > 0){
				//赎回处理 判断出有新的赎回
				var tempChengBen = Lastday.ziJinChengBen[j] - newShuHui;
				if(tempChengBen > 0){
					//资金成本尚有余额
					tempday.fakeBenJin[j] = Lastday.fakeBenJin[j] + (Today.ljbj - Lastday.leiJiBenJin);
					tempday.fakeBenJin[j] = tools.toFixFloat( tempday.fakeBenJin[j], 2);

					tempday.ziJinChengBen[j] = tempChengBen + (tempday.fakeBenJin[j] * fakeBJSet[j] * lxdays);
					tempday.ziJinChengBen[j] = tools.toFixFloat( tempday.ziJinChengBen[j], 2);
				}else{
					//进行本金扣减 -tempChengBen就是正数 多余的非扣资金成本金额进行本金的折算
					tempday.fakeBenJin[j] = Lastday.fakeBenJin[j] - (-tempChengBen) + (Today.ljbj - Lastday.leiJiBenJin);
					tempday.fakeBenJin[j] = tools.toFixFloat( tempday.fakeBenJin[j], 2);

					tempday.ziJinChengBen[j] = 0 + (tempday.fakeBenJin[j] * fakeBJSet[j] * lxdays);
					tempday.ziJinChengBen[j] = tools.toFixFloat( tempday.ziJinChengBen[j], 2);
				}

			}else{
				//一般处理
				tempday.fakeBenJin[j] = Lastday.fakeBenJin[j] + (Today.ljbj - Lastday.leiJiBenJin);
				tempday.fakeBenJin[j] = tools.toFixFloat( tempday.fakeBenJin[j], 2);

				tempday.ziJinChengBen[j] = Lastday.ziJinChengBen[j] + (tempday.fakeBenJin[j] * fakeBJSet[j] * lxdays);
				tempday.ziJinChengBen[j] = tools.toFixFloat( tempday.ziJinChengBen[j], 2);
			}

		};

		Lastday = tempday;
		FakeBJ[i] = tempday;		//FakeBJ ASC
	};

	cb(null, FakeBJ);
}

// ------- tools funs
function parse (html, cb) {
	var ER={};
	if(uds.isEmpty(html) ){
		ER.status=500;
		ER.message=" (html参数缺少) parse"+ES;
		return cb(ER);
	}

	var fData = [];
	var format = [
		'date'			//日期
		,'tjx'			//统计项
		,'ljbj'			//累计本金
		,'ljshyk'		//累计赎回盈亏
		,'ljshykl'	//累计赎回盈亏率
		,'cccb'			//持仓成本
		,'ccyk'			//持仓盈亏
		,'ccykl'		//持仓盈亏率
		,'sz'				//市值
		,'dryk'			//当日盈亏
		,'drsyl'		//当日收益率
	];
	env(html, function(err, window){
		if(err){
			err.message+=" (1) parse"+ES;
			return cb(err);
		}

		var $ = jquery(window);
		$(".bb").each(function(index){
			var fData_one = {};
			$(this).children("td").each(function(index){
				if(index<2){
					fData_one[format[index]] = $(this).text().trim();
				}else{
					fData_one[format[index]] = parseFloat(($(this).text().trim()).replace(/[^\d\.-]/g, ""));
				}
			});
			//过滤当日收益为0的数据，无数据、当天数据、第一笔数据都会被过滤掉
			if(fData_one.drsyl != 0){ fData.push(fData_one); }

		});
		cb(null, fData);
	});
}


module.exports = sumi;

