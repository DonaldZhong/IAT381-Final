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
