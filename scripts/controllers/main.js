'use strict';

/**
 * @ngdoc function
 * @name 381FinalApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the 381FinalApp
 */
angular.module('381FinalApp', ['ngMaterial'])
  .controller('MainCtrl', function ($scope, $timeout, $mdBottomSheet) {
  	$scope.openBottomSheet = function($event) {
  		$scope.alert = '';
  		$mdBottomSheet.show({
  			templateUrl: 'views/sheetTemplate.html',
  			controller: 'GridBottomSheetCtrl',
  			targetEvent: $event
  		}).then(function(clickedItem) {
  			$scope.alert = clickedItem.name + 'clicked!';
  		});
	};
})
  
  .controller('GridBottomSheetCtrl', function($scope, $mdBottomSheet) {
	  $scope.items = [
  		{name: 'Home',    icon: 'images/i1.png', urlPath:'#/main'},
  		{name: 'Map',     icon: 'test', 		 urlPath: '#map'},
  		{name: 'Trucks',  icon: 'test', 		 urlPath:'#trucks'},
  		{name: 'About',   icon: 'test',			 urlPath:'#/about'},
  	];

  	$scope.listItemClick = function($index) {
  		var clickedItem = $scope.items[$index];
  		$mdBottomSheet.hide(clickedItem);
	  };
 });

