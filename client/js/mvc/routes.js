'use strict';

//ui-route
appRoutes.config(
  [          '$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {

      // redirect
      $urlRouterProvider
        .when('/fund', '/sumi')
        .otherwise('/');

      // State
      $stateProvider
        // home
        .state("home", {
          url: "/",
          templateUrl: "view/home.html",
          controller: ['$scope','User','$location', '$state',
            function($scope, User, $location, $state){
                if(!User.isAuthenticated()){
                // $state.go("login");
              }else{
                console.log("yesIn",User.getCurrentId());

              }
            }]
        })
        //about
        .state('about', {
          url: '/about',
          templateProvider: ['$timeout',
            function (        $timeout) {
              return $timeout(function () {
                return '<p class="lead">About</p>';
              }, 100);
            }]
        })
    }
  ]
);

appRoutes.config(
  ['$stateProvider', function ($stateProvider) {
  	$stateProvider
    .state('error500', {
      url: "/error500",
      templateUrl: "view/error500.html",
      controller: 'Error500Ctrl'
    })
  	.state('sign', {
  		url: "/sign",
  		templateUrl: "view/sign.html",
  		controller: 'SignCtrl'
  	})
    .state('signNeedVerify', {
      url: "/signNeedVerify",
      templateUrl: "view/signNeedVerify.html"
    })
    .state('login', {
      url: "/login",
      templateUrl: "view/login.html",
      controller: 'LoginCtrl'
    })
    //sumi
    .state('sumi', {
      url: "/sumi",
      templateUrl: "view/sumi/sumi.html"
    })
    .state('sumi.setting', {
      url: "/setting",
      templateUrl: "view/sumi/sumiSetting.html",
      controller: 'SumiSettingCtrl'
    })
    .state('sumi.chart', {
      url: "/chart",
      templateUrl: "view/sumi/sumiChart.html",
      controller: 'SumiChartCtrl'
    })
    .state('sumi.chart2', {
      url: "/chart2",
      templateUrl: "view/sumi/sumiChart2.html",
      controller: 'SumiChartCtrl2'
    })
    //stock
    .state('stock', {
      url: "/stock",
      templateUrl: "view/stock/stock.html",
      controller: 'StockCtrl'
    })
    .state('stock.trackList', {
      url: "/trackList",
      templateUrl: "view/stock/stockTrackList.html",
      controller: 'StockTrackListCtrl'
    })
    .state('stock.trackDetail', {
      url: '/:trackListId',
      templateUrl: "view/stock/stockTrackDetail.html",
      controller: 'StockTrackDetailCtrl',
      resolve: {
            tarckSetting: ['$stateParams', 'Stock',
              function( $stateParams, Stock){

                  return Stock.findById({'id': $stateParams.trackListId}).$promise.then(function(res){
                  	
                    // return res.tarckSetting;
                    return res;
                  });
              }]
          }
    })

}]);

