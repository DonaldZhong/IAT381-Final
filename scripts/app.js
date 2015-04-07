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
      .when('/favourite', {
        templateUrl: 'views/favourite.html',
        controller: 'FavouriteCtrl'
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
      .icon('favourite', 'images/favourite.svg', 64)
  });

  APP.run(function($http, $templateCache) {
    var urls = [
      'images/home.svg',
      'images/map.svg',
      'images/truck.svg',
      'images/favourite.svg'
    ];


    angular.forEach(urls, function(url) {
      $http.get(url, {cache: $templateCache});
    });
  });


APP.controller('MainCtrl', function ($scope, $location, $timeout, $mdBottomSheet) {
    $scope.openBottomSheet = function($event) {
      if(!$event.bubbles) {return};
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
      {name: 'Faves',   icon: 'favourite',  urlPath:'/favourite'},
    ];


    $scope.listItemClick = function($index) {
      var clickedItem = $scope.items[$index];
      $mdBottomSheet.hide(clickedItem);
      
    };
 });

APP.controller('splashCtrl', function($scope, $location, $mdBottomSheet) {
        $scope.openBottomSheet = function($event) {
            $mdBottomSheet.show({
                templateUrl: 'views/sheetTemplate.html',
                controller: 'GridBottomSheetCtrl',
                targetEvent: $event
            }).then(function(clickedItem) {
                $location.path(clickedItem.urlPath);

            });
        };



      var swipeShow = document.getElementById('swipeShow');
      // swipeShow.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });

      // create a simple instance
      // by default, it only adds horizontal recognizers
      var options = { preventDefault: false };
      var mc = new Hammer(swipeShow, options);

      mc.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });

      // listen to events...
      mc.on("swipeup", function(ev) {
         $scope.openBottomSheet();
          console.log(ev);
      });

    $(document).ready(function() {
        if ($(".splash").is(":visible")) {
            $(".wrapper").css({
                "opacity": "0"
            });
        }
        $(".splash-arrow").bind().click(function($event) {
            $(".splash").slideUp("800", function() {
                $(".wrapper").delay(100).animate({
                    "opacity": "1.0"
                }, 800);
            });
        });
    });

    /*
    $(window).scroll(function() {
      var windTop = $(window).scrollTop();
      var splashHeight = $(".splash").height();
      
      if(windTop>(100)){
         $(window).off("scroll");
          $(".splash").slideUp("800", function() {
           $("html, body").animate({"scrollTop":"0px"},100);
         });
         $(".wrapper").animate({"opacity":"1.0"},800);
      } 
      else {
      
      }  
    });
    */ 
     function splashClick($event) {
     $(".splash").slideUp("800", function() {
         $(".wrapper").delay(100).animate({
             "opacity": "1.0"
         }, 800);
         console.log("splashClick function fired")
     });
 };


    $(window).scroll(function() {
        $(window).off("scroll");
        $(".splash").slideUp("800", function() {
            $("html, body").animate({
                "scrollTop": "0px"
            }, 100);
            $(".wrapper").delay(100).animate({
                "opacity": "1.0"
            }, 800);
        });
    });





});
