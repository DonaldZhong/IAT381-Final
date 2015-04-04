'use strict';

/**
 * @ngdoc function
 * @name 381FinalApp.controller:MapCtrl
 * @description
 * # MapCtrl
 * Controller of the 381FinalApp
 */
 APP.controller('MapCtrl', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
	       position.coords.longitude)

       	$scope.click2 = function ($event) {
 		$scope.map.setCenter(pos);
 		map.setZoom(13);
 	} 	
  })
};


 	var downTownVan = new google.maps.LatLng(49.2827, -123.1207);

 	var marker;
 	var map;

    $scope.$on('mapInitialized', function(evt, evtMap) {
      map = evtMap;
    });

 	$scope.click = function ($event) {
 		$scope.map.setCenter(downTownVan);
 		map.setZoom(13);
 	}

	$scope.showMarkers = function() {
        for (var key in $scope.map.markers) {
          $scope.map.markers[key].setMap($scope.map);
        };
      };

	$scope.hideMarkers = function() {
        for (var key in $scope.map.markers) {
          $scope.map.markers[key].setMap(null);
        };
      };


     $http.get('data.json').success(function(data) {
         $scope.varTrucks = data;
         console.log($scope.varTrucks[1].name);
     });




      // var aussie = new google.maps.LatLng(49.284782, -123.114800);
      // var pigg = new google.maps.LatLng(49.283316, -123.119119);
      // var Feastro = new google.maps.LatLng(49.288503, -123.119013);
      // var Reef = new google.maps.LatLng(49.288382, -123.118983);
      // var Culver = new google.maps.LatLng(49.287938, -123.119797);
      // var Grilled = new google.maps.LatLng(49.283138, -123.119103);
      // var Japadog = new google.maps.LatLng(49.282219, -123.124425);
      // var Community = new google.maps.LatLng(49.266061, -123.100598);
      // var Fresh = new google.maps.LatLng(49.287157, -123.117155);
      // var Yolks = new google.maps.LatLng(49.286721, -123.118320);





    // var iterator=0;
    // $scope.addMarker = function() {
    //   for (var i=0; i<$scope.foodTruckLatLng.length; i++) {
    //     $timeout(function() {
    //       // add a marker this way does not sync. marker with <marker> tag
    //       new google.maps.Marker({
    //         position: $scope.foodTruckLatLng[iterator++],
    //         map: $scope.map,
    //         animation: google.maps.Animation.DROP
    //       });
    //     }, i * 200);
    //   }
    // }


     // $scope.map = {
     //     center: {
     //         latitude: 49.2827,
     //         longitude: -123.1207
     //     },

     //     zoom: 13
     // };

     // $scope.markers = [];
     // var idCount = 0;

     // $http.get('data.json').success(function(data) {
     //     $scope.varTrucks = data;


     //     angular.forEach(data, function(item) {
     //         var marker = {
     //             id: item.id,
    
     //             coords: {
     //                 latitude: item.latitude,
     //                 longitude: item.longitude
     //             },
     //             options: {
     //             	// labelContent: $scope.truckName + "<br>" + $scope.truckHours + "<br>" + $scope.truckLocation
     //             }
     //         };

     //         $scope.truckID = item.id;
     //         $scope.truckName = item.name;
     //         $scope.truckHours = item.hours;
     //         $scope.truckLocation = item.location;

     //         $scope.windowOptions = {
     //             visible: false,
     //             content: $scope.truckName + "<br>" + $scope.truckHours + "<br>" + $scope.truckLocation
     //         };

     //         $scope.markers.push(marker);
     //         idCount++;
             

     //     });

     //     $scope.onClick = function() {

     //         $scope.windowOptions.visible = !$scope.windowOptions.visible;
     //     };

     //     $scope.closeClick = function() {
     //         $scope.windowOptions.visible = false;
     //     };

     //     console.log($scope.varTrucks[0]);
     // });
 }]);
