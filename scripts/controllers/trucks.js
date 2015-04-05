'use strict';

/**
 * @ngdoc function
 * @name 381FinalApp.controller:TrucksCtrl
 * @description
 * # TrucksCtrl
 * Controller of the 381FinalApp
 */
APP.controller('TrucksCtrl', function ($scope) {
$(document).ready(function() {
    function close_accordion_section() {
        $('.accordion .accordion-section-title').removeClass('active');
        $('.accordion .accordion-section-content').slideUp(300).removeClass('open');
    }

    $('.accordion-section-title').click(function(e) {
        // Grab current anchor value
        var currentAttrValue = $(this).attr('href');
 
        if($(e.target).is(!'.active')) {
            close_accordion_section();
        }else {
            close_accordion_section();
        
            // Add active class to section title
            $(this).addClass('active');

            // Open up the hidden content panel
            $('.accordion ' + currentAttrValue).slideDown(500).addClass('open'); 

        }
 
        e.preventDefault();
    });
});

  });
