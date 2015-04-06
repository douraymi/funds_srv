'use strict';

appControllers
.controller('Error500Ctrl', ['$scope', '$location', function($scope, $location){
  var next = $location.nextAfterError || '/';
  $location.nextAfterLogin = null;
  $scope.goBack = function(){
    $location.path(next);
  }
}])
.controller('SignCtrl', ['$scope','User','$location', function($scope, User, $location) {
  $scope.credentials = {
    "realm": null,
    "username": null,
    "credentials": null,
    "challenges": null,
    "email": null,
    "emailVerified": null,
    "verificationToken": null,
    "status": null,
    "created": null,
    "lastUpdated": null
  };
  $scope.signInAction = function(){
    User.create($scope.credentials, function(val, resHeader){
      $location.path('/signNeedVerify');
    }, function(errResponse){
      console.log("errRes:", errResponse);
    });
  };

}])
.controller('LoginCtrl', ['$rootScope', '$scope','User','$location', function($rootScope, $scope, User, $location) {
  $scope.credentials = {};
  $scope.credentials.email = "lzd@sz-kingray.com";
  $scope.credentials.password = "lzd";
  $scope.rememberMe = true;
  $scope.loginAction = function(){
    User.login({include:'user', rememberMe:$scope.rememberMe}, $scope.credentials, function(res, resHeader){
      $rootScope.$isLogin = User.isAuthenticated();
      if($location.nextAfterLogin == '/login'){
        $location.nextAfterLogin = '/';
      }
      var next = $location.nextAfterLogin || '/';
      $location.nextAfterLogin = null;
      $location.path(next);
    }, function(errResponse){
      console.log(">> LoginCtrl loginAction error:", errResponse);
    });
  };

}])
// sumi
.controller('SumiSettingCtrl', ['$scope', 'User', 'Sumi', '$location', function($scope, User, Sumi, $location){
  $scope.sumiSet = function(){
    Sumi.set(null, $scope.sumiSetting, function(res, resHeader){
      if (res.status == 'needreset') {
        Sumi.reset(function(res, resHeader){
          if(res.status=='ok'){console.log("reset ok");}
          $location.path('/sumi/chart');
        });
      } else if(res.status == 'needrework'){
        Sumi.rework(function(res, resHeader){
          if(res.status=='ok'){console.log("rework ok");}
          $location.path('/sumi/chart');
        });
      };
    }, function(errRes){
      console.log("sumi set fal", errRes);
    });
  }

  User.sumi({"id":User.getCurrentId()}, function(sumiData){
  	if(sumiData.fakeBJSet){
	    $scope.sumiSetting = {
	      "sumiUser": sumiData.sumiUser,
	      "sumiLogPass": sumiData.sumiLogPass,
	      "beginDate": moment(sumiData.beginDate).format('YYYY-MM-DD'),
	      "fakeBJSet": sumiData.fakeBJSet
	    }
  		
  	}else{
	    $scope.sumiSetting = {};
	    $scope.sumiSetting.beginDate = "2014-01-01";
	    $scope.sumiSetting.fakeBJSet = new Array(3);
  		
  	}
  });

}])
.controller('SumiChartCtrl', ['$scope', 'User', 'Sumi', function($scope, User, Sumi) {
  var today = new Date();
  $scope.doChartData = {
    beginDate : moment(today).subtract(60, 'days').format('YYYY-MM-DD'),
    endDate   : moment(today).format('YYYY-MM-DD'),
    jump      : 3
  }

  $scope.myChartHide = 1;
  
  $scope.doChart = function(){
    Sumi.sync(null, function(res, resHeader){
      if(res.status=='ok'){
        Sumi.getFBJ(null, $scope.doChartData, function(FBJs){
          
          var Fd = FBJs.sumiFBJs;
          var Fs = FBJs.fakeBJSet;

          var cData = {};
          cData.labels = [];
          cData.datasets = [];
          // 0 ï¼šçŽ°å¸‚å€?
          cData.datasets[0] = {
            data              : [],
            fillColor         : "rgba(255,48,48,0.5)",
            strokeColor       : "rgba(255,48,48,1)",
            pointColor        : "rgba(255,48,48,1)",
            pointStrokeColor  : "#FF3030"
          };

          for(var key in Fs){
            key = parseInt(key);
            var clr = Math.floor(Math.random()*255);
            cData.datasets[key+1] = {
              data              : [],
              fillColor         : "rgba(48,"+clr+",48,0.3)",
              strokeColor       : "rgba(48,"+clr+",48,0.5)",
              pointColor        : "rgba(48,"+clr+",48,0.5)",
              pointStrokeColor  : "rgba(48,"+clr+",48)"
            };      
          }
          for(var key in Fd){
            key = parseInt(key);
            cData.labels.push(Fd[key].date);
            cData.datasets[0].data.push( Fd[key].shiZhi );
            for(var k2 in Fs){
              k2 = parseInt(k2);
              var data_temp = Fd[key].fakeBenJin[k2] + Fd[key].ziJinChengBen[k2];
              data_temp = Math.round(data_temp*100)/100;
              cData.datasets[k2+1].data.push( data_temp );
              // console.log('fi:',Fd[key].fakeBenJin[k2],'se:',Fd[key].ziJinChengBen[k2], 'tm:',data_temp);
            }
          }

          $scope.myChart = {};
          $scope.myChart.data = cData;

          $scope.myChartHide = 0;
          // $scope.myChart.instruction = [
          //   {name:"çŽ°å¸‚å€?, color: "#FF3030"},
          //   {name:"çŽ°å¾ªçŽ¯æœ¬é‡‘ï¼‹çŽ°èµ„é‡‘æ€»æˆæœ?, color: "#1E90FF"},
          //   {name:"çŽ°èµ„é‡‘æ€»æˆæœ?, color: "#FFA500"}
          //   ];
          // $scope.$apply();


        }, function(err){
          console.log("1 err: ", err.data.error);
        });

      }
    }, function(errRes){
      console.log("err: ", errRes);
    });
  }

}])
.controller('SumiChartCtrl2', ['$scope', 'User', 'Sumi', function($scope, User, Sumi) {
  var today = new Date();
  $scope.doChartData = {
    beginDate : moment(today).subtract(60, 'days').format('YYYY-MM-DD'),
    endDate   : moment(today).format('YYYY-MM-DD'),
    jump      : 3
  }

  $scope.myChartHide = 1;
  
  $scope.doChart = function(){
    Sumi.sync(null, function(res, resHeader){
      if(res.status=='ok'){
        Sumi.getFBJ(null, $scope.doChartData, function(FBJs){
          
          var Fd = FBJs.sumiFBJs;
          var Fs = FBJs.fakeBJSet;

          var cData = {};
          cData.labels = [];
          cData.datasets = [];
          // 0 ï¼šçŽ°å¸‚å€?
          cData.datasets[0] = {
            data              : [],
            fillColor         : "rgba(255,48,48,0.5)",
            strokeColor       : "rgba(255,48,48,1)",
            pointColor        : "rgba(255,48,48,1)",
            pointStrokeColor  : "#FF3030"
          };

          for(var key in Fs){
            key = parseInt(key);
            var clr = Math.floor(Math.random()*255);
            cData.datasets[key+1] = {
              data              : [],
              fillColor         : "rgba(48,"+clr+",48,0.3)",
              strokeColor       : "rgba(48,"+clr+",48,0.5)",
              pointColor        : "rgba(48,"+clr+",48,0.5)",
              pointStrokeColor  : "rgba(48,"+clr+",48)"
            };      
          }
          for(var key in Fd){
            key = parseInt(key);
            cData.labels.push(Fd[key].date);
            cData.datasets[0].data.push( Fd[key].fakeYingKui );
            for(var k2 in Fs){
              k2 = parseInt(k2);
              cData.datasets[k2+1].data.push( Fd[key].ziJinChengBen[k2] );
            }
          }

          $scope.myChart = {};
          $scope.myChart.data = cData;

          $scope.myChartHide = 0;

        }, function(err){
          console.log("1 err: ", err.data.error);
        });

      }
    }, function(errRes){
      console.log("err: ", errRes);
    });
  }

}])
//stock
.controller('StockCtrl', ['$scope', 'stockTool', function($scope, stockTool){

}])
.controller('StockTrackListCtrl', ['$scope', '$modal', 'stockTrack', 'DTOptionsBuilder', 'DTColumnBuilder', '$resource','$compile', 'User',
  function($scope, $modal, stockTrack, DTOptionsBuilder, DTColumnBuilder, $resource,$compile, User){

  $scope.showAdd = function(){
    var modalInstance = $modal.open({
      templateUrl : 'view/stock/stockTrackListAModal.html',
      controller : 'StockTrackListAdd',
      size : ''
    })

    modalInstance.result.then(function(){
    	$scope.dtOptions.reloadData();
    },function(){
    	console.log('f7cking fail');
    });
  }

  $scope.del = function(stockId){
    stockTrack.List.del(User.getCurrentId(), stockId, function(sucv){
      console.log("åˆ é™¤æˆåŠŸ: ", sucv);
      $scope.dtOptions.reloadData();
    });
  };

  $scope.dtOptions = DTOptionsBuilder
                      // .fromSource('http://120.24.54.6:26667/zapiz/stocks')
                      .newOptions()
                      .withDataProp('data')
                      .withPaginationType('full_numbers')
                      .withColReorder()
                      .withColVis()
                      .withDisplayLength(5)
                      .withOption('serverSide', true)
                      .withOption('bProcessing', true)
                      // .withOption('bStateSave', true)
                      // .withOption('iDeferLoading', countFun())  //应该找错方向了
                      // .withOption('fnRecordsTotal', countFun)
                      // .withOption('recordsTotal', [4, 4])  //好像也无效
             					// .fromFnPromise(function () {
								     //    return $resource('data.json').query().$promise;
									    // })
                      .withFnServerData(dtFn)
                      .withOption('createdRow', function(row, data, dataIndex) {
						            // Recompiling so we can bind Angular directive to the DT
						            $compile(angular.element(row).contents())($scope);
				        			});
  function dtFn(sSource, aoData, fnCallback, oSettings){

    var filter = {'limit':oSettings._iDisplayLength, 'offset':oSettings._iDisplayStart,  'order': 'sortTime DESC'};
    oSettings.jqXHR = stockTrack.List.get(User.getCurrentId(), filter, fnCallback);

    // console.log('sSource: ', sSource);
    // console.log('aoData: ', aoData);
    // console.log('fnCallback: ', fnCallback);
    // console.log('oSettings: ', oSettings);
  }
  var renderA = function(data, type, full, meta) {
    $scope.renewTime = function(xid){
      stockTrack.List.updateSort(xid, function(a){
        // console.log('a:',a);
      });
    }
    return  '<span ng-click="renewTime(\''+full.id+'\')"><a href="#stock/'+full.id+'">'+ data +'</a></span>';
  }
  $scope.dtColumns = [
    DTColumnBuilder.newColumn('id').withTitle('id').renderWith(renderA),
    DTColumnBuilder.newColumn('type').withTitle('type').renderWith(renderA),
    DTColumnBuilder.newColumn('groupName').withTitle('groupName').renderWith(renderA),
    DTColumnBuilder.newColumn('id').withTitle('操作').renderWith(function(data, type, full, meta) {
    	return '<span class="glyphicon glyphicon-remove-sign" ng-click="del(\''+data+'\')" ></span>';
    })
  ];

}])
.controller('StockTrackListAdd', ['$scope', 'stockTrack', '$state', '$modalInstance', 'User', function($scope, stockTrack, $state, $modalInstance, User){

  $scope.groupName = '';
  $scope.iptts = '';

  $scope.add = function(){
    var postData = {
      'groupName' : $scope.groupName,
      // 'tarckSetting' : [$scope.iptts1, $scope.iptts2, $scope.iptts3, $scope.iptts4, $scope.iptts5]
      'tarckSetting' : $scope.iptts.split(" ")
    }

    stockTrack.List.add(User.getCurrentId(), postData, function(v){
      $state.go('stock.trackDetail', { trackListId: v.id });
      $modalInstance.close();
      console.log("suucc: ", v);
    }, function(r){
      console.log("faall: ", r);
    });
  }
}])
.controller('StockTrackDetailCtrl', ['$scope', '$stateParams', '$modal', 'DTOptionsBuilder', 'DTColumnBuilder', 'stockTrack', 'tarckSetting', '$compile',function($scope, $stateParams, $modal, DTOptionsBuilder, DTColumnBuilder, stockTrack, tarckSetting, $compile){

	// var pod = {
	// 	stockCode : '000001',
	// 	startDate : '20150125'
	// }
	// stockTrack.Detail.test(pod, function(dtest){
	// 	console.log('test: ', dtest);
	// });
	// 回补股票名字 已经ok了
	// stockTrack.Detail.fix($stateParams.trackListId);

  $scope.groupName = tarckSetting.groupName;
  $scope.trackListId = $stateParams.trackListId;
  $scope.showAdd = function(){
    var modalInstance = $modal.open({
      templateUrl : 'view/stock/stockTrackDetailAModal.html',
      controller : 'StockTrackDetailAdd',
      size : '',
      resolve: {
        trackListId: function () {
          return $scope.trackListId;
        }
      }
    })

    modalInstance.result.then(function(){
    	$scope.dtOptions.reloadData();
    },function(){
    	console.log('f7cking fail');
    });
  }

  $scope.del = function(stockTrackId){
  	console.log("dfdf");
    stockTrack.Detail.del($scope.trackListId, stockTrackId, function(sucv){
      console.log("åˆ é™¤æˆåŠŸ: ", sucv);
      $scope.dtOptions.reloadData();
    });
  };

  $scope.dtOptions = DTOptionsBuilder
                      // .fromSource('http://120.24.54.6:26667/zapiz/stocks')
                      .newOptions()
                      .withDataProp('data')
                      .withPaginationType('full_numbers')
                      .withColReorder()
                      .withColVis()
                      .withDisplayLength(5)
                      .withOption('serverSide', true)
                      .withOption('bProcessing', true)
                      // .withBootstrap()
                      .withFnServerData(dtFn)
                      .withOption('createdRow', function(row, data, dataIndex) {
						            // Recompiling so we can bind Angular directive to the DT
						            $compile(angular.element(row).contents())($scope);
							        });

  function dtFn(sSource, aoData, fnCallback, oSettings){

    var filter = {'limit':oSettings._iDisplayLength, 'offset':oSettings._iDisplayStart, 'order':'startDate'};
    oSettings.jqXHR = stockTrack.Detail.get($scope.trackListId, filter, fnCallback);

    // console.log('sSource: ', sSource);
    // console.log('aoData: ', aoData);
    // console.log('fnCallback: ', fnCallback);
    // console.log('oSettings: ', oSettings);
  }

  $scope.dtColumns = [
    DTColumnBuilder.newColumn('startDate').withTitle('开始时间'),
    DTColumnBuilder.newColumn('stockName').withTitle('股票名称'),
    DTColumnBuilder.newColumn('stockCode').withTitle('股票代码').renderWith(function(data, type, full, meta){
    	return '<a target="_blank" href="http://stock.quote.stockstar.com/'+data+'.shtml">'+data+'</a>';
    }),
    DTColumnBuilder.newColumn('beginPrice').withTitle('初价')
  ];
  var set = tarckSetting.tarckSetting.sort(function(a,b){return a - b}).concat();

  var getRend = function(setValue){
		return function(data, type, full, meta) {
        var corlorbp,corlorsp;
  		 // console.log(data);
     //   console.log(full);

  		// var shiftSet = set.shift();
  		var bd = setValue+'bd';
  		var bdd = setValue+'bdd';
  		var bp = setValue+'bp';
  		var sd = setValue+'sd';
  		var sdd = setValue+'sdd';
  		var sp = setValue+'sp';
  		
  		// console.log(bd);
  		// return bd;
      var bpInt = parseInt(full[bp]);
      var spInt = parseInt(full[sp]);


      if(bpInt > 0){
          corlorbp = "red";
      }else if(bpInt < 0 ){
        corlorbp = "green";
      }else if(bpInt == 0){
        corlorbp = "transparent";
      }

      if(spInt > 0){
          corlorsp = "red";
      }else if(spInt < 0 ){
        corlorsp = "green";
      }else if(spInt == 0){
        corlorsp = "transparent";
      }
  		return '<table class="table-bordered"><tr class="'+ corlorbp+'"><td><abbr title="'+full[bdd]+'">'+full[bd]+'</abbr></td><td>'+full[bp]+'</td></tr><tr class="'+ corlorsp+'"><td><abbr title="'+full[sdd]+'">'+full[sd]+'</abbr></td><td>'+full[sp]+'</td></tr></table>';
  	}
  }

  for(var iset=0; iset<set.length; iset++){
  	    $scope.dtColumns.push(DTColumnBuilder.newColumn('').withTitle(set[iset]+'交易日').renderWith(getRend(set[iset])) );
  }

  $scope.dtColumns.push(
    DTColumnBuilder.newColumn('isEnd').withTitle('结束')
      .renderWith(function(data, type, full, meta) {
        if(data){
          return '<span class="glyphicon glyphicon-ok-sign"></span>';
        }else{
          return '<span class="glyphicon glyphicon-forward"></span>';
        }
      })
  );
  $scope.dtColumns.push(
  	DTColumnBuilder.newColumn('id').withTitle('操作').renderWith(function(data, type, full, meta) {
    	return '<span class="glyphicon glyphicon-remove-sign" ng-click="del(\''+data+'\')" ></span>';
    })
  );

  // console.log('AAA:', $scope.dtColumns);

}])
.controller('StockTrackDetailAdd', ['$scope', '$rootScope', '$state', '$modalInstance', 'stockTrack', 'trackListId', function($scope, $rootScope, $state, $modalInstance, stockTrack, trackListId){

	$scope.startDate = $rootScope.startDate||moment().format("YYYYMMDD");
  $scope.add = function(){
    var postData = {
      'stockCode'   : $scope.stockCode,
      'startDate'   : $scope.startDate||moment().format("YYYYMMDD"),
      'beginPrice'  : $scope.nowPrice||null
    }
    
    $rootScope.startDate = $scope.startDate;
    // $scope.trackListId = trackListId;
    // console.log('2 $scope.trackListId: ', trackListId);
    stockTrack.Detail.add(trackListId, postData, function(v){
      $state.go('stock.trackDetail', { trackListId: trackListId });
      $modalInstance.close();
      console.log("suucc: ", v);
    }, function(r){
      console.log("faall: ", r);
    });
  }
}])

