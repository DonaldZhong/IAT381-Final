'use strict';

/**
 * @ngdoc function
 * @name 381FinalApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the 381FinalApp
 */
angular.module('381FinalApp')
  .controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {
		$scope.map = { 
			center: { 
				latitude: 49.2827, 
				longitude: -123.1207 
			}, 

			zoom: 13 };

		$scope.markers = [];
		var idCount = 0;

		$http.get('data.json').success(function(data) {
			$scope.trucks = data;

			 angular.forEach(data, function(object) { 
			 	var marker = {
			 		id: idCount, 
			 		coords: {
			 			latitude: object.latitude, 
			 			longitude: object.longitude
			 		}};
				$scope.markers.push(marker);
				idCount++;
				$scope.windowOptions = { visible: false };
					$scope.onClick = function() {
					$scope.windowOptions.visible = !$scope.windowOptions.visible;
		};
		$scope.closeClick = function() {
			$scope.windowOptions.visible = false;
		};


			});
		});





  }]);
