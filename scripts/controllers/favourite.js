'use strict';

/**
 * @ngdoc function
 * @name 381FinalApp.controller:FavouriteCtrl
 * @description
 * # FavouriteCtrl
 * Controller of the 381FinalApp
 */
APP.controller('FavouriteCtrl', function ($scope, $location, $mdBottomSheet) {
	console.log("favourites ctrl page");

      var swipeShow = document.getElementById('swipeShow');

      var options = { preventDefault: false };
      var mc = new Hammer(swipeShow, options);

      mc.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });

      // listen to events...
      mc.on("swipeup", function(ev) {
         $scope.openBottomSheet();
          console.log(ev);
      });
        $scope.openBottomSheet = function($event) {
            $mdBottomSheet.show({
                templateUrl: 'views/sheetTemplate.html',
                controller: 'GridBottomSheetCtrl',
                targetEvent: $event
            }).then(function(clickedItem) {
                $location.path(clickedItem.urlPath);

            });
        };

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


  });
