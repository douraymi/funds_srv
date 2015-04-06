'use strict';

appServices.service('stockTrack', ['stockTool', 'User', 'Stock', 'StockTrack', function(stockTool, User, Stock, StockTrack){

	var listFun = {};
	listFun.add = function(userId, postData, suc, fal){
		if(!fal){fal = null}
		postData.type = "track";
		User.stocks.create({'id': userId}, postData, suc, fal);
	}

	listFun.del = function(userId, stockId, suc, fal){
		if(!fal){fal = null}
		if(window.confirm("确定删除吗")){
			Stock.stockTracks.destroyAll({'id':stockId}, function(sucv){
				User.stocks.destroyById({'id':userId, 'fk':stockId}, suc, fal);
			}, function(failv){
				throw("error Stock.stockTracks.destroyAll << listFun.del << services");
			});	
		}
	}

	listFun.get = function(userId, filter, suc, fal){
		if(!fal){fal = null}
		// return User.stocks({'id':userId, 'filter':filter}, suc, fal);
		// return User.stocks({'id':userId, 'filter':filter}, function(v, h){
		// 	suc(v);
		// }, fal);
		filter.where = {};
		filter.where.ownerId = userId;
		return Stock.getList(null, filter, function(v){
			// console.log(v);
			suc(v);
		}, fal);
	}

	listFun.updateSort = function(stockId, suc, fal){
		var filter = {};
		filter.where = {'id': stockId};
		var postData = {
			sortTime : Date()
		}
		Stock.update(filter, postData, suc, fal);
	}

	// listFun.count = User.stocks.count({'id':User.getCurrentId()});

	var detail = {};

	// detail.test = function(postData, suc){
	// 	stockTool.getStockPnN(postData, suc);
	// }
	// detail.fix = function(stockId){
	// 	Stock.stockTracks({'id': stockId}, function(v2){
	// 		var temp = {};
	// 		for (var i = 0; i < v2.length; i++) {
	// 			temp[v2[i].stockCode] = v2[i];
	// 			// console.log(v2);
	// 			stockTool.getStockPnN(v2[i], function(data){
	// 				if(!data){throw("error stockTool.getStockPnN")}

	// 				// console.log(data);
	// 				// console.log(temp[data.stockCode]);
	// 				temp[data.stockCode].stockName = data.name;
	// 				temp[data.stockCode].$save(function(v){
	// 					console.log("succcccc", v);
	// 				},function(v){
	// 					console.log("failllll", v);
	// 				});

	// 			})
					
	// 		};
	// 	})
	// }

	detail.add = function(stockId, postData, suc, fal){
		if(!fal){fal = null}

		var filter = {
			where: {
				and: [
					{stockCode : postData.stockCode},
					{startDate : postData.startDate}
				]
			}
		}
		// console.log('filter:', filter);
		Stock.stockTracks({'id': stockId, 'filter':filter}, function(val){
				// console.log(val);
			if(!val[0]){
				stockTool.getStockPnN(postData, function(data){
					if(!data){throw("error stockTool.getStockPnN")}

					var p2 = postData;
					p2.stockName = data.name;
					p2.isEnd = false;
					if(!p2.beginPrice){
						p2.beginPrice = data.price;
					}
					Stock.stockTracks.create({'id':stockId}, p2, suc, fal);

				});

			}else{
				window.confirm(val[0].stockCode+' '+val[0].stockName+' '+val[0].startDate+" 有重复项");
			}
		});
		
	}

	detail.del = function(stockId, stockTrackId, suc, fal){
		if(!fal){fal = null}
		if(window.confirm("确定删除吗")){
			Stock.stockTracks.destroyById({'id':stockId, 'fk':stockTrackId}, suc, fal);	
		}
	}

	detail.get = function(trackListId, filter, suc, fal){
		if(!fal){fal = null}
		// filter.where = {};
		// filter.where.ownerId = trackListId;
		// {'id': trackListId, 'filter':filter}

		Stock.findById({'id': trackListId}, function(v1){
			Stock.stockTracks({'id': trackListId, 'filter':filter}, function(v2){
				// console.log("v2:", v2);
				// StockTrack.getList(filter, function(v2){
				stockTool.trackFromSohu(v2, v1.tarckSetting, function(err, v){
					if(err){console.log('services.js >> stockTool.trackFromSohu: ', err)}
					// console.log("v:", v);
					StockTrack.count({'where':{'ownerId': trackListId}}, function(count1){
						// console.log("filter1:", filter);
						StockTrack.count({'where':{'ownerId': trackListId}}, function(count2){
							var ret = {};
							ret.data = v;
							ret.recordsFiltered = count1.count;
							ret.recordsTotal = count2.count;

							// console.log("ret:", ret);
							suc(ret);
						},function(err2){console.log("err2:", err2)});
					},function(err1){console.log("err1:", err1)});
				})
			// stockTool.trackFromSohu(v2, v1.tarckSetting, suc);

			}, function(failv){
				console.log('services.js >> Stock.stockTracks: ', failv);
			})

		}, function(failv){
			console.log('services.js >> Stock.findById: ', failv);
		});
	}

	// detail.count = function(trackListId){
	// 	return Stock.stockTracks.count({'id':trackListId});
	// }

	var rt = {
		List : listFun,
		Detail : detail
	}

	return rt;
}])