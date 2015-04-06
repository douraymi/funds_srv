'use strict'
var moment = require('moment');

function tools(){}
tools.initSizeArray = function(initVal, length){
	var newArray = [];
	for (var i = 0; i < length; i++) {
		newArray[i] = initVal;
	};
	return newArray;
}

tools.setModelVal = function(val, des){
	if(val === {} || val === null || des === {} || des === null) return false;
	for (var key in val) {
		des[key] = val[key];
	};
}

tools.YMD = function(date){
	if (date === null) date = moment();
	return moment(date).format('YYYY-MM-DD');
}

tools.arrayEq = function(ary1, ary2){
	if(ary1.length != ary2.length ) return false;
	for(var key in ary1){
		if(ary1[key] != ary2[key]) return false;
	}
	return true;
}

tools.toFixFloat = function(number,fractionDigits){
	var rt = Math.round(number*Math.pow(10,fractionDigits))/Math.pow(10,fractionDigits);
	return rt;   
}

module.exports = tools;