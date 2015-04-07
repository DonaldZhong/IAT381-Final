'use strict';

/**
 * @ngdoc function
 * @name 381FinalApp.controller:TrucksCtrl
 * @description
 * # TrucksCtrl
 * Controller of the 381FinalApp
 */
APP.controller('TrucksCtrl', function ($scope, $location, $mdBottomSheet) {

    
$(document).unbind().ready(function() {
    function close_accordion_section() {
        $('.accordion .accordion-section-title').removeClass('active');
        $('.accordion .accordion-section-content').slideUp(300).removeClass('open');
        console.log("close accordion is firing")
    }

    $('.accordion-section-title').click(function(e) {
        // Grab current anchor value
        var currentAttrValue = $(this).attr('href');
 
        if($(e.target).is('.active')) {
            close_accordion_section();
            console.log("if is firing");

        } else {

            close_accordion_section();
            $(this).addClass('active');
            $('.accordion ' + currentAttrValue).slideDown(500).addClass('open'); 
            console.log("else is firing");
            // Add active class to section title
        }
 
        e.preventDefault();
    });
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


$(".liked").on("click", function() {
    $(this).removeClass("fail");
    $(this).addClass("pre-animation");
    var heart = $(this);

    var $feedBackbox = $('.feedBack-popup'); 
    $feedBackbox.css({
    'margin-top' : -$feedBackbox.outerHeight()/2
        });
        getFeedBackBox();


    function getFeedBackBox() {
        $('.feedBack-box').addClass('ison'); 
    }

    function closeFeedBackBox () {

    }
  
    if ($(heart).hasClass("favourite")) {
        $(this).removeClass("pre-animation");
        $(this).removeClass("favourite");
    }

    else {
        $(".pre-animation").one("transitionend", function(){
            $(this).removeClass("pre-animation");
            $(this).addClass("waiting");
            setTimeout( function() {
                $(".liked").one("animationiteration webkitAnimationIteration", function(){
                    $(heart).removeClass("waiting");

                    if ($("#fail").is(":checked")) {
                        $(heart).addClass("fail");
                    }
                    else {
                        $(heart).toggleClass("favourite");
                    }
                });
            }, responseTime(450, 1000));
        });
    }
});

function responseTime(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}



  });
