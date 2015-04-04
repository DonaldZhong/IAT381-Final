'use strict';

/**
 * @ngdoc overview
 * @name 381FinalApp
 * @description
 * # 381FinalApp
 *
 * Main module of the application.
 */

var APP = angular
  .module('381FinalApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngMap',
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

  APP.config(function($mdIconProvider) {
    $mdIconProvider
      .icon('home', 'images/home.svg', 64)
      .icon('map', 'images/map.svg', 64)
      .icon('truck', 'images/truck.svg', 64)
      .icon('about', 'images/about.svg', 64)
  });

  APP.run(function($http, $templateCache) {
    var urls = [
      'images/home.svg',
      'images/map.svg',
      'images/truck.svg',
      'images/about.svg'
    ];


    angular.forEach(urls, function(url) {
      $http.get(url, {cache: $templateCache});
    });
  });


APP.controller('MainCtrl', function ($scope, $location, $timeout, $mdBottomSheet) {
    $scope.openBottomSheet = function($event) {
      $mdBottomSheet.show({
        templateUrl: 'views/sheetTemplate.html',
        controller: 'GridBottomSheetCtrl',
        targetEvent: $event
      }).then(function(clickedItem) {
          $location.path (clickedItem.urlPath);

    });
  };
});

APP.controller('GridBottomSheetCtrl', function($scope, $mdBottomSheet) {
    $scope.items = [
      {name: 'Home',    icon: 'home',       urlPath:'/'},
      {name: 'Map',     icon: 'map',        urlPath: '/map'},
      {name: 'Trucks',  icon: 'truck',      urlPath:'/trucks'},
      {name: 'About',   icon: 'about',      urlPath:'/about'},
    ];


    $scope.listItemClick = function($index) {
      var clickedItem = $scope.items[$index];
      $mdBottomSheet.hide(clickedItem);
      
    };
 });

