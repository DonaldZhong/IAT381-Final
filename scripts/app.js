'use strict';

/**
 * @ngdoc overview
 * @name 381FinalApp
 * @description
 * # 381FinalApp
 *
 * Main module of the application.
 */

 console.log('app.js');

var APP = angular
  .module('381FinalApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'uiGmapgoogle-maps',
    'ngMaterial',
    'hmTouchEvents',
    'ngTouch'
  ]);
  
  APP.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/trucks', {
        templateUrl: 'views/trucks.html',
        controller: 'TrucksCtrl'
      })
      .when('/map', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl'
      });
  });

  APP.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('red');
  });


APP.controller('MainCtrl', function ($scope, $location, $timeout, $mdBottomSheet) {
    

    $scope.openBottomSheet = function($event) {
      $scope.alert = '';
      $mdBottomSheet.show({
        templateUrl: 'views/sheetTemplate.html',
        controller: 'GridBottomSheetCtrl',
        targetEvent: $event
      }).then(function(clickedItem) {
        $scope.alert = clickedItem.name + ' clicked!';
          $location.path (clickedItem.urlPath);

    });
  };
});

APP.controller('GridBottomSheetCtrl', function($scope, $mdBottomSheet) {
    $scope.items = [
      {name: 'Home',    icon: 'images/home.png', urlPath:'/'},
      {name: 'Map',     icon: 'test',      urlPath: '/map'},
      {name: 'Trucks',  icon: 'test',      urlPath:'/trucks'},
      {name: 'About',   icon: 'test',      urlPath:'/about'},
    ];

    $scope.listItemClick = function($index) {
      var clickedItem = $scope.items[$index];
      console.log(clickedItem);
      $mdBottomSheet.hide(clickedItem);
    };
 });

