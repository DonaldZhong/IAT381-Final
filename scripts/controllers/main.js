'use strict';

/**
 * @ngdoc function
 * @name 381FinalApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the 381FinalApp
 */
angular.module('381FinalApp')
  .controller('MainCtrl', function ($scope) {
		$scope.map = { center: { latitude: 49.2827, longitude: -123.1207 }, zoom: 13 };
		//aussie pie guy
		$scope.marker = { id: 0, coords: { latitude: 49.284782, longitude: -123.114800}};

		$scope.windowOptions = { visible: false };
		$scope.onClick = function() {
			$scope.windowOptions.visible = !$scope.windowOptions.visible;
		};

		$scope.closeClick = function() {
			$scope.windowOptions.visible = false;
		};

  });
