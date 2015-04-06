'use strict';

/**
 * @ngdoc function
 * @name 381FinalApp.controller:TrucksCtrl
 * @description
 * # TrucksCtrl
 * Controller of the 381FinalApp
 */
APP.controller('TrucksCtrl', function ($scope) {
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

  });
