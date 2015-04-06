var sumiApi = require('../etc/sumiApi');
var tools = require('../etc/tools');
var moment = require('moment');
var uds = require('underscore');

var ES = ' <sumi< ';

module.exports = function(Sumi) {
	//hooks

	Sumi.afterRemote('sync', function(ctx, thi, next){
		if(thi.status=='ok'){
			Sumi.app.wmi(ctx.req, function(err, user){
				if (err){
					err.message+=" (1) set"+ES;
					return cb(err);
				}

				user.sumi( function(err, sumi){
					if (err){
						err.message+=" (2) set"+ES;
						return cb(err);
					}

					sumi.updataDate = tools.YMD();
					sumi.save();
				});
			});
		}
		next();
	});

	// remoteMethod

	/**
	* 设置sumi setting
	* 如果没有则新建 如果有则修改
	* 直接从cookie中获取用户，不依赖于提交过来的参数
	*/
	Sumi.set = function (data, req, cb) {
		var ER={};
		sumiApi.login(data.sumiUser, data.sumiLogPass, function(err){
			if(err){
				err.message+=" (preerr:"+err.status+") set"+ES;
				err.status+=1000;
				return cb(err);
			}
			
			Sumi.app.wmi(req, function(err, user){
				if (err){
					err.message+=" (1) set"+ES;
					return cb(err);
				}

				user.sumi( function(err, sumi){
					if (err){
						err.message+=" (2) set"+ES;
						return cb(err);
					}

					var resetORrework = 'ok';
					if (!sumi){
						user.sumi.create(data, function(err, newset){
							if (err){
								err.message+=" (3) set"+ES;
								return cb(err);
							}
							
							resetORrework = 'needreset';
							return cb(null, resetORrework);
						});
					}else{
						if (data.sumiUser != sumi.sumiUser || tools.YMD(data.beginDate) != tools.YMD(sumi.beginDate) ) {
							resetORrework = 'needreset';
						} else if( !tools.arrayEq(data.fakeBJSet, sumi.fakeBJSet) ){
							resetORrework = 'needrework';
						};
						tools.setModelVal(data, sumi);
						sumi.save();
						return cb(null, resetORrework);
					}
				});
			});	
		});
	}
	Sumi.remoteMethod('set', {
				accepts:[
					{arg: 'data', type:'object', http: {source: 'body'}},
					{arg: 'req', type:'object', http: {source: 'req'} }
				],
				returns:[
					{arg: 'status', type:'string'}
				],
				http:{path: '/set', verb: 'post'}
	});

	Sumi.sync = function(req, cb){
		var ER={};
		Sumi.app.wmi(req, function(err, user){
			if (err){
				err.message+=" (1) sync"+ES;
				return cb(err);
			}

			user.sumi( function(err, sumi){
				if (err){
					err.message+=" (2) sync"+ES;
					return cb(err);
				}
				if(tools.YMD(sumi.updataDate)==tools.YMD()){return cb(null, 'ok');}
				sumi.sumiHistorys({order: 'date DESC', limit: 1}, function(err, sumiHs){
					if (err){
						err.message+=" (3) sync"+ES;
						return cb(err);
					}

					sumi.sumiFakeBJs({order: 'date DESC', limit: 1}, function(err, sumiFBJs){
						if (err){
							err.message+=" (4) sync"+ES;
							return cb(err);
						}

						if ( tools.YMD(sumiHs[0].date) != tools.YMD(sumiFBJs[0].date) ){
							ER.status=1001;
							ER.message=" (need rework or reset) sync"+ES;
							return cb(ER);
						}

						sumiApi.fetch(sumi.sumiUser, sumi.sumiLogPass, tools.YMD(sumiHs[0].date), 
							function(err, hisData){
								if(err){
									err.message+=" (5 preerr:"+err.status+") sync"+ES;
									err.status+=1000;
									return cb(err);
								}

								if(uds.isEmpty(hisData) ){
									return cb(null, 'ok');
								}

								sumiApi.workFakeBJ(sumiFBJs[0], hisData, sumi.fakeBJSet,
									function(err, FBJData){
										if(err){
											err.message+=" (6 preerr:"+err.status+") sync"+ES;
											err.status+=1000;
											return cb(err);
										}

										sumi.sumiHistorys.create(hisData, function(err){
											if(err){
												err.message+=" (7) sync"+ES;
												return cb(err);
											}
										});

										sumi.sumiFakeBJs.create(FBJData, function(err){
											if(err){
												err.message+=" (8) sync"+ES;
												return cb(err);
											}

											return cb(null, "ok");
										});
									}
								);
							}
						);
					});
				});
			});
		});
	}
	Sumi.remoteMethod('sync', {
				accepts:[
					{arg: 'req', type:'object', http: {source: 'req'} }
				],
				returns:[
					{arg: 'status', type:'string'}
				],
				http:{path: '/sync', verb: 'get'}
	});

	Sumi.reset = function(req, cb){
		var ER={};
		Sumi.app.wmi(req, function(err, user){
			if (err){
				err.message+=" (1) reset"+ES;
				return cb(err);
			}

			user.sumi( function(err, sumi){
				if (err){
					err.message+=" (2) reset"+ES;
					return cb(err);
				}

				sumi.sumiHistorys.destroyAll({}, function(err){
					if (err){
						err.message+=" (3) reset"+ES;
						return cb(err);
					}

					sumi.sumiFakeBJs.destroyAll({}, function(err){
						if (err){
							err.message+=" (4) reset"+ES;
							return cb(err);
						}

						sumiApi.fetch(sumi.sumiUser, sumi.sumiLogPass, tools.YMD(sumi.beginDate), 
							function(err, hisData){		//hisData ASC
								if(err){
									err.message+=" (5 preerr:"+err.status+") reset"+ES;
									err.status+=1000;
									return cb(err);
								}

								sumiApi.workFakeBJ(null, hisData, sumi.fakeBJSet,
									function(err, FBJData){
										if(err){
											err.message+=" (6 preerr:"+err.status+") reset"+ES;
											err.status+=1000;
											return cb(err);
										}

										sumi.sumiHistorys.create(hisData, function(err){
											if(err){
												err.message+=" (7) reset"+ES;
												return cb(err);
											}
										});

										sumi.sumiFakeBJs.create(FBJData, function(err){
											if(err){
												err.message+=" (8) reset"+ES;
												return cb(err);
											}

											return cb(null, "ok");
										});
									}
								);
							}
						);
					});
				});
			});
		});
	}
	Sumi.remoteMethod('reset', {
				accepts:[
					{arg: 'req', type:'object', http: {source: 'req'} }
				],
				returns:[
					{arg: 'status', type:'string'}
				],
				http:{path: '/reset', verb: 'get'}
	});

	Sumi.rework = function(req, cb){
		var ER={};
		Sumi.app.wmi(req, function(err, user){
			if (err){
				err.message+=" (1) rework"+ES;
				return cb(err);
			}

			user.sumi( function(err, sumi){
				if (err){
					err.message+=" (2) rework"+ES;
					return cb(err);
				}

				sumi.sumiFakeBJs.destroyAll({}, function(err){
					if (err){
						err.message+=" (3) rework"+ES;
						return cb(err);
					}

					sumi.sumiHistorys({order: 'date ASC'}, function(err, sumiHs){
						if (err){
							err.message+=" (4) rework"+ES;
							return cb(err);
						}

						sumiApi.workFakeBJ(null, sumiHs, sumi.fakeBJSet,
							function(err, FBJData){
								if(err){
									err.message+=" (5 preerr:"+err.status+") reset"+ES;
									err.status+=1000;
									return cb(err);
								}

								sumi.sumiFakeBJs.create(FBJData, function(err){
									if(err){
										err.message+=" (6) rework"+ES;
										return cb(err);
									}

									return cb(null, "ok");
								});
							}
						);
					});
				});
			});
		});
	}
	Sumi.remoteMethod('rework', {
				accepts:[
					{arg: 'req', type:'object', http: {source: 'req'} }
				],
				returns:[
					{arg: 'status', type:'string'}
				],
				http:{path: '/rework', verb: 'get'}
	});

	Sumi.getFBJ = function(parm, req, cb){
		var ER={};
		if (!parm.beginDate && !parm.endDate) return cb(erStr + "no parm");
		var wh = {
			and : [{date:{gte: parm.beginDate}},{date:{lte: parm.endDate}}]
		}
		// console.log(wh);
		Sumi.app.wmi(req, function(err, user){
			if (err){
				err.message+=" (1) getFBJ"+ES;
				return cb(err);
			}

			user.sumi( function(err, sumi){
				if (err){
					err.message+=" (2) getFBJ"+ES;
					return cb(err);
				}

				sumi.sumiFakeBJs({where: wh, order: 'date ASC'}, function(err, sumiFBJs){
					if (err){
						err.message+=" (3) getFBJ"+ES;
						return cb(err);
					}

					var dataTmp = [];
					for (var i = sumiFBJs.length - 1; i >= 0; ) {
						dataTmp.unshift(sumiFBJs[i]);
						i -= parm.jump;
						if(i < 0) return cb(null, dataTmp, sumi.fakeBJSet);
					};

				});
			});
		});
	}
	Sumi.remoteMethod('getFBJ', {
				accepts:[
					{arg: 'parm', type:'object', http: {source: 'body'}},
					{arg: 'req', type:'object', http: {source: 'req'} }
				],
				returns:[
					{arg: 'sumiFBJs', type:'object'},
					{arg: 'fakeBJSet', type:'array'}
				],
				http:{path: '/getFBJ', verb: 'post'}
	});

//------------dev
	Sumi.des = function (msg, cb) {
		console.log("in");
		Sumi.destroyAll();
		cb(null, "del funs");
	}
	Sumi.remoteMethod('des', {
				accepts:[{arg: 'msg', type:'string'}],
				returns:[
					{arg: 'ok', type:'string'}
				],
				http:{path: '/des', verb: 'get'}
	});


};

