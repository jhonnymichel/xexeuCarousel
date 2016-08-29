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
            
            //console.log(container, element);
            if (container == element) return 0;            
            var proportion = (container - element) * 0.5;            
            return proportion;
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
            };
            
            var elementsCss = {
                'position':'absolute', 
                'top':String(verticalOffset) + 'px', 
                'left':String(horizontalOffset)+'px'
            }
            $(mainElement).css(mainCss);
            $(elements).hide().css(elementsCss);
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
           var slidesOffsets = {
               verticalOffset: getSpacingProportions(mainElementMeasures.height, $(elements).height()),
               horizontalOffset: getSpacingProportions(mainElementMeasures.width, $(elements).width())
           }  
           function leftButtonClickHandler() {
              var centerValue = slidesOffsets.horizontalOffset;
              if (isTransitioning) return;
              isTransitioning = true;
              var containreWidth = mainElementMeasures.width;
              //console.log(containreWidth);
              var leavingElement = $(elements[currentElement--]);
              leavingElement.animate({left: '+='+String(containreWidth)}, 300, function(){isTransitioning = false; leavingElement.hide();});//completed});
              var numOfSlides = elements.length;
              if (currentElement < 0) {
                  currentElement = numOfSlides - 1;
              }                 
              $(mainElement).data('selected', String(currentElement));                              
              $(elements[currentElement]).show().css({'left':String(-containreWidth + centerValue+'px')}).animate({left: '+='+String(containreWidth)}, 300, function(){isTransitioning = false;});//completed});
           }
            
           function rightButtonClickHandler() {
              var centerValue = slidesOffsets.horizontalOffset;
               if (isTransitioning) {
                   //console.log("vai retornar");
                   return;
               }
              isTransitioning = true;
               var containreWidth = mainElementMeasures.width;
              //console.log("deu certo");                
              var numOfSlides = elements.length;  
              var leavingElement = $(elements[currentElement++]);
              leavingElement.animate({left: '-='+String(containreWidth)}, 300, function(){isTransitioning = false; leavingElement.hide()});//completed});
              if (currentElement >= numOfSlides) {
                  currentElement = 0;
              }               
              $(mainElement).data('selected', String(currentElement));
              $(elements[currentElement]).show().css({'left':String(containreWidth+centerValue)+'px'}).animate({left: '-='+String(containreWidth)}, 300, function(){isTransitioning = false;});//completed});
           }
           
           instanceButtons(mainElement, rightButtonClickHandler, leftButtonClickHandler);
           initialize(mainElement, elements, mainElementMeasures.width, mainElementMeasures.height, slidesOffsets.horizontalOffset, slidesOffsets.verticalOffset);            
           
           function onResizeHandler() {
               
               mainElementMeasures.width = $(mainElement).innerWidth(),
               slidesOffsets = {
                   verticalOffset: getSpacingProportions(mainElementMeasures.height, $(elements).height()),
                   horizontalOffset: getSpacingProportions(mainElementMeasures.width, $(elements).width())
               }  
               var elementsCss = {
                'left':String(slidesOffsets.horizontalOffset)+'px'
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