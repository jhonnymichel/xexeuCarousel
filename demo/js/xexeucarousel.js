(function ($) {

$.fn.xexeuCarousel = function() {

        var buttonsStyle = {
            color: "color: white",
            positionLeft: "position: absolute; top: 50%; left: 10px; transform: translateY(-50%);",
            positionRight: "position: absolute; top: 50%; right: 10px; transform: translateY(-50%);"
        };

        var transitionStyle = {
            type: 'swipe',
            swipe: 'left:'//fade or swipe
        }

        function getSpacingProportions(container, element) {
            console.log(element);
            if (container == element) return 0;
            var proportion = (container - element) * 0.5;
            return proportion;
        }

        function getOffsets(containerWidth, containerHeight, elements) {
          var vertical = $.map(elements, function(value, index) {
            return getSpacingProportions(containerHeight, $(value).height());
          });
          var horizontal = $.map(elements, function(value, index) {
            return getSpacingProportions(containerWidth, $(value).width());
          });
          return {
            verticalOffset: vertical,
            horizontalOffset: horizontal
          };
        }

        function instanceButtons(mainElement, rightHandler, leftHandler) {

            var buttonLeft = $("<button class='xexeu-carousel-btn' type='button' style=' "+buttonsStyle.positionLeft+" '><i class='fa fa-chevron-left' style=' "+buttonsStyle.color+" '></i></button>");
            var buttonRight =  $("<button class='xexeu-carousel-btn' type='button' style=' "+buttonsStyle.positionRight+" '><i class='fa fa-chevron-right' style=' "+buttonsStyle.color+" '></i></button>");

            $(mainElement).append(buttonLeft);
            $(mainElement).append(buttonRight);

            $(buttonLeft.bind('click', leftHandler));
            $(buttonRight.bind('click', rightHandler));
        }

        function initialize(mainElement, elements, mainWidth, mainHeight, horizontalOffset, verticalOffset) {

            var mainCss = {
                'position':'relative',
                'text-align':'center',
                'overflow':'hidden',
                'height':String(mainHeight) + 'px',
                'width':'inherit'
            }
            $(mainElement).css(mainCss);
            $.each(elements, function(index, value) {
              var elementsCss = {
                'position':'absolute',
                'top':String(verticalOffset[index])+'px',
                'left':String(horizontalOffset[index])+'px'
              };
              $(value).hide().css(elementsCss);
            });
            $(elements[0]).show();
            $(mainElement).data('selected', String(0));
        }

        this.each(function() {

           var currentElement = 0;
           var mainElement = $(this);
           var isTransitioning = false;
           var elements = mainElement.children("img");
           var tallerImageHeight = $(elements[0]).height();;
           for (var i = 0; i<elements.length; i++) {

               var currentImageHeight = $(elements[i]).innerHeight();
               if ( currentImageHeight > tallerImageHeight ) {
                   tallerImageHeight = currentImageHeight;
               }
           }
           var mainElementMeasures = {
               width:  $(mainElement).innerWidth(),
               height: tallerImageHeight
           }
           var slidesOffsets = getOffsets(mainElementMeasures.width, mainElementMeasures.height, elements);
           function leftButtonClickHandler() {

               if (isTransitioning) {
                 return;
               }
               isTransitioning = true;

               var centerValue = slidesOffsets.horizontalOffset[currentElement];
               var leavingElement = $(elements[currentElement--]);
               var leavingFinalPosition = $(leavingElement).width() + centerValue ;
               leavingElement.animate({
                 left: '+='+String(leavingFinalPosition+"px")},
                 300,
                 function() {
                   isTransitioning = false;
                   leavingElement.hide();
                 });//completed});

               var numOfSlides = elements.length;
               if (currentElement < 0) {
                   currentElement = elements.length - 1;
               }

               var entryingInitialPosition = -($(elements[currentElement]).width()) + centerValue;
               var entryingfinalPosition = entryingInitialPosition*-1 + slidesOffsets.horizontalOffset[currentElement];

               $(mainElement).data('selected', String(currentElement));
               $(elements[currentElement])
                .show()
                .css({
                  'left':String(entryingInitialPosition+'px')
                })
                .animate({
                  left: '+='+String(entryingfinalPosition)
                  },
                  300,
                  function(){
                    isTransitioning = false;
                  });//completed});
           }

           function rightButtonClickHandler() {

             if (isTransitioning) {
               return;
             }
             isTransitioning = true;

             var centerValue = slidesOffsets.horizontalOffset[currentElement];
             var leavingElement = $(elements[currentElement++]);
             var leavingFinalPosition = -($(leavingElement).width() + centerValue);
             leavingElement.animate({
               left: '+='+String(leavingFinalPosition+"px")},
               300,
               function() {
                 isTransitioning = false;
                 leavingElement.hide();
               });//completed});

             var numOfSlides = elements.length;
             if (currentElement >= numOfSlides) {
                 currentElement = 0;
             }
             var entryingInitialPosition = ($(leavingElement).width() + centerValue);
             var entryingfinalPosition = entryingInitialPosition*-1 + slidesOffsets.horizontalOffset[currentElement];

             $(mainElement).data('selected', String(currentElement));
             $(elements[currentElement])
              .show()
              .css({
                'left':String(entryingInitialPosition+'px')
              })
              .animate({
                left: '+='+String(entryingfinalPosition)
                },
                300,
                function(){
                  isTransitioning = false;
                });//completed});

           }

           instanceButtons(mainElement, rightButtonClickHandler, leftButtonClickHandler);
           initialize(mainElement, elements, mainElementMeasures.width, mainElementMeasures.height, slidesOffsets.horizontalOffset, slidesOffsets.verticalOffset);

           function onResizeHandler() {
               console.log("resized");
               var tallerImageHeight = $(elements[0]).height();;
               for (var i = 0; i<elements.length; i++) {

                   var currentImageHeight = $(elements[i]).innerHeight();
                   if ( currentImageHeight > tallerImageHeight ) {
                       tallerImageHeight = currentImageHeight;
                   }
               }
               var mainElementMeasures = {
                   width:  $(mainElement).innerWidth(),
                   height: tallerImageHeight
               }
               var slidesOffsets = getOffsets(mainElementMeasures.width, mainElementMeasures.height, elements);

               var elementsCss = {
                'left':String(slidesOffsets.horizontalOffset[currentElement])+'px'
               }
               var mainCss = {
                 'height': String(mainElementMeasures.height) + 'px',
               }
               $(mainElement).css(mainCss)
               $(elements[currentElement]).css(elementsCss);
           }
           $(window).bind('resize', onResizeHandler);
        });
    }

}(jQuery));
