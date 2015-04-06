'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('app', [
  'ngResource',
  'ui.router', 
  'ngAnimate',
  'ui.bootstrap',
  'app.services',
  'app.routes',
  'app.controllers',
  'app.directives',
  'lbServices',
  'datatables',
  'chartjs-directive',
  'stockTool'
]);
var appServices = angular.module('app.services', []);
var appRoutes = angular.module('app.routes', []);
var appControllers = angular.module('app.controllers', []);
var appDirectives = angular.module('app.directives', []);

app.run(
  [          '$rootScope', '$state', '$stateParams', 'User',
    function ($rootScope,   $state,   $stateParams,   User) {

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$isLogin = User.isAuthenticated();
    }
  ]
);

// 失去登录状态跳转到login登录之后再跳回原来页面
app.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push(function($rootScope, $q, $location) {
    return {
      responseError: function(rejection) {
        if (rejection.status == 401) {
          $location.nextAfterLogin = $location.path();
          $location.path('/login');
          $rootScope.$isLogin = false;
        }
        if (rejection.status == 500) {
          $rootScope.bug = rejection.data.error;
          $location.nextAfterError = $location.path();
          $location.path('/error500');
        }

        return $q.reject(rejection);
      }
    };
  });
}]);




