(function ($) {

  function TimeCounter(callback, interval) {
    var self            = this;
    var interval        = typeof interval === "undefined" ? 3000 : interval;
    var currentInterval = interval;

    this.start          = function() {
      self.deltaTime = Date.now();
      setTimeout(afterTimeout, currentInterval);
    }

    function afterTimeout() {
      if (callback) {
        callback();
      }

      self.deltaTime   = Date.now() - self.deltaTime;
      currentInterval += interval - self.deltaTime;
      self.start();
    }
  }

  var methods = {

    getSpacingProportions: function(container, element) {
        if (container == element) return 0;
        var proportion = (container - element) * 0.5;
        return proportion;
    },

    getOffsets: function(containerWidth, containerHeight, elements) {
      var self = this;
      var vertical = $.map(elements, function(value, index) {
        console.log(self.getSpacingProportions.bind(self)(containerHeight, $(value).height()))
        return self.getSpacingProportions.bind(self)(containerHeight, $(value).height());
      });
      var horizontal = $.map(elements, function(value, index) {
        return self.getSpacingProportions.bind(self)(containerWidth, $(value).width());
      });
      return {
        verticalOffset: vertical,
        horizontalOffset: horizontal
      };
    },

    setImagesCss: function(props) {
      var elements = props.elements;
      var style = {
        'position':'absolute',
      };

      if (props.resizeImages === true) {
        style['width'] = "100%";
        style['height'] = "auto";
      }

      $.each(elements, function(index, value) {
        if (props.horizontalOffset) {
          style['left'] = String(props.horizontalOffset[index])+'px';
        }
        if (props.verticalOffset) {
          style['top'] = String(props.verticalOffset[index])+'px';
        }
        $(value).css(style);
      });

    },

    getImagesBounds: function(elements) {

      var tallerImageHeight = $(elements[0]).height();
      var smallerImageHeight = $(elements[0]).height();
      var widerImageWidth = $(elements[0]).width();
      var smallerImageWidth = $(elements[0]).width();

      for (var i = 0; i<elements.length; i++) {

        var currentImageHeight = $(elements[i]).innerHeight();
        if ( currentImageHeight > tallerImageHeight ) {
          tallerImageHeight = currentImageHeight;
        }
        if ( currentImageHeight < smallerImageHeight ) {
          smallerImageHeight = currentImageHeight;
        }

        var currentImageWidth = $(elements[i]).innerWidth();
        if ( currentImageWidth > widerImageWidth ) {
          widerImageWidth = currentImageWidth;
        }
        if ( currentImageWidth < smallerImageWidth ) {
          smallerImageWidth = currentImageWidth;
        }
      }
      return {
        width: {

          wider: widerImageWidth,
          smaller: smallerImageWidth

        },
        height: {

          taller: tallerImageHeight,
          smaller: smallerImageHeight

        }
      }

    },
    instanceButtons: function(mainElement, rightHandler, leftHandler, buttonsStyle) {

        var buttonLeft = $("<button class='xexeu-carousel-btn' type='button' style=' "+buttonsStyle.positionLeft+" '><i class='fa fa-chevron-left' style=' "+buttonsStyle.color+" '></i></button>");
        var buttonRight =  $("<button class='xexeu-carousel-btn' type='button' style=' "+buttonsStyle.positionRight+" '><i class='fa fa-chevron-right' style=' "+buttonsStyle.color+" '></i></button>");

        $(mainElement).append(buttonLeft);
        $(mainElement).append(buttonRight);

        $(buttonLeft).bind('click', leftHandler);
        $(buttonRight).bind('click', rightHandler);
    }
  }

  $.fn.xexeuCarousel = function() {

    var buttonsStyle = {
      color         : "color: white",
      positionLeft  : "position: absolute; top: 50%; left: 10px; transform: translateY(-50%);",
      positionRight : "position: absolute; top: 50%; right: 10px; transform: translateY(-50%);"
    };

    var transitionStyle = {
      type  : 'swipe',
      swipe : 'left:'//fade or swipe
    }

    function initialize(mainElement, elements, mainWidth, mainHeight, horizontalOffset, verticalOffset, resizeImages) {

      var mainCss = {
          position     : 'relative',
          'text-align' : 'center',
          overflow     : 'hidden',
          width        : 'inherit'
      }

      if (!resizeImages) {
        mainCss['max-width'] = String(mainWidth) + 'px';
        mainCss['height']    = String(mainHeight) + 'px';
      }

      $(mainElement).css(mainCss);

      methods.setImagesCss({
        resizeImages: resizeImages,
        horizontalOffset: horizontalOffset,
        verticalOffset: verticalOffset,
        elements: elements
      });

      $(elements).hide();
      $(elements[0]).show();
      $(mainElement).data('selected', String(0));;
    }

    this.each(function() {
      var baseHeight       = "smaller"; // "taller"
      var baseWidth        = "smaller"; // "wider"
      var timeCounter      = new TimeCounter(rightButtonClickHandler, 3400);
      var resizeImages     = true;
      var currentElement   = 0;
      var mainElement      = $(this);
      var isTransitioning  = false;
      var elements         = mainElement.children("img");
      var imagesBoundaries = methods.getImagesBounds(elements);

      timeCounter.start();

      var mainElementMeasures = {
          width  : $(mainElement).innerWidth(),
          height : baseHeight == "smaller" ? imagesBoundaries.height.smaller : imagesBoundaries.height.taller
      };

      if(resizeImages) {
        mainElementMeasures['maxWidth'] = imagesBoundaries.width.wider;
        mainElementMeasures['height']   = 'inherit';
      } else {
        mainElementMeasures['maxWidth'] = baseWidth == "smaller" ?
        imagesBoundaries.width.smaller :
        imagesBoundaries.width.wider;
      }

      var widthForOffset = mainElementMeasures.width > mainElementMeasures.maxWidth ?
                           mainElementMeasures.maxWidth :
                           mainElementMeasures.width;
      var slidesOffsets = methods.getOffsets((widthForOffset), mainElementMeasures.height, elements);
      //console.log(typeof $(elements), typeoff $(elements[0]), typeof elements, typeof elements[0]);

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

      methods.instanceButtons(mainElement, rightButtonClickHandler, leftButtonClickHandler, buttonsStyle);
      //initialize(mainElement, elements, mainElementMeasures.maxWidth, mainElementMeasures.height, slidesOffsets.horizontalOffset, slidesOffsets.verticalOffset, resizeImages);
      console.log("initialization done. slide offsets: ", slidesOffsets)
      if (resizeImages) {
      //  onResizeHandler();
      }

      function onResizeHandler() {

        imagesBoundaries = methods.getImagesBounds(elements);
        var mainElementMeasures = {
          width:  $(mainElement).innerWidth(),
          height: baseHeight == "smaller" ? imagesBoundaries.height.smaller : imagesBoundaries.height.taller
        }

        if(!resizeImages) {
          mainElementMeasures['maxWidth'] == "smaller" ?
          imagesBoundaries.width.smaller :
          imagesBoundaries.width.wider;
        }

        slidesOffsets = methods.getOffsets(mainElementMeasures.width, mainElementMeasures.height, elements);

        var mainCss = {
            position    : 'relative',
            'text-align': 'center',
            overflow    : 'hidden',
            height      : String(mainElementMeasures.height) + 'px',
            width       : 'inherit',
        }
        if (!resizeImages) {
          mainCss['max-width'] = String(mainElementMeasures.maxWidth) + 'px';
        }
        $(mainElement).css(mainCss);

        methods.setImagesCss({
          resizeImages   : resizeImages,
          verticalOffset : slidesOffsets.verticalOffset,
          elements       : elements
        });

        var elementsCss = {
          'left' : String(slidesOffsets.horizontalOffset[currentElement])+'px',
        };

        $(elements[currentElement]).css(elementsCss);
      }

      $(window).bind('resize', onResizeHandler);
    });
  }

  /*$.fn.xexeuCarousel = function(options) {
    var opts = $.extend( {}, $.fn.xexeuCarousel.options, options );
    return this.each(function() {

       var carousel = Object.create(XexeuCarousel);
       carousel.initialize(opts, this);

    });
  }

  $.fn.xexeuCarousel.options = {
    buttonsStyle: {
      color: "color: white; height: 100px; ",
      positionLeft: "position: absolute; top: 50%; left: 10px; transform: translateY(-50%);",
      positionRight: "position: absolute; top: 50%; right: 10px; transform: translateY(-50%);"
    },
    transitionStyle: {
        type: 'swipe',
        swipe: 'left:'//fade or swipe
    },
    baseHeight: "smaller", //"taller"
    baseWidth: "smaller", //"wider"
    autoChange: true, //false
    resizeImages: true, //false
  }*/

}(jQuery));
