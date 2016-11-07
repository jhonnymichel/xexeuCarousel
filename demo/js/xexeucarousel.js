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
        return self.getSpacingProportions(containerHeight, $(value).height());
      });
      var horizontal = $.map(elements, function(value, index) {
        return self.getSpacingProportions(containerWidth, $(value).width());
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
  var XexeuCarousel = {

    bootstrap: function(options, mainElement) {
      var self = this;

      self.baseHeight = options.baseHeight;
      self.baseWidth = options.baseWidth;
      self.timeCounter = options.autoChange ?
        new TimeCounter(self.rightButtonClickHandler) :
        false;
      self.resizeImages = options.resizeImages;
      self.buttonsStyle = options.buttonsStyle;
      self.transitionStyle = options.transitionStyle;

      self.mainElement = $(mainElement);
      self.isTransitioning = false;
      self.elements = self.mainElement.children("img");

      self.imagesBoundaries = methods.getImagesBounds(self.elements);
      self.mainElementMeasures = {
          width  : self.mainElement.innerWidth(),
          height : self.baseHeight == "smaller" ?
            self.imagesBoundaries.height.smaller :
            self.imagesBoundaries.height.taller
      };

      if(self.resizeImages) {
        self.mainElementMeasures['maxWidth'] = self.imagesBoundaries.width.wider;
        self.mainElementMeasures['height']   = 'inherit';
      } else {
        self.mainElementMeasures['maxWidth'] = self.baseWidth == "smaller" ?
        self.imagesBoundaries.width.smaller :
        self.imagesBoundaries.width.wider;
      }

      self.widthForOffset = self.mainElementMeasures.width > self.mainElementMeasures.maxWidth ?
                           self.mainElementMeasures.maxWidth :
                           self.mainElementMeasures.width;
      self.slidesOffsets = methods.getOffsets((self.widthForOffset), self.mainElementMeasures.height, self.elements);

      methods.instanceButtons(self.mainElement, self.rightButtonClickHandler.bind(self), self.leftButtonClickHandler.bind(self), self.buttonsStyle);
      //$(window).bind('resize', self.onResizeHandler.bind(self));
      self.initialize();

      if (self.resizeImages) {
        //self.onResizeHandler();
      }
      console.log("bootstrap done");
    },

    initialize: function() {

      var self = this;
      console.log(self);

      var mainCss = {
          position     : 'relative',
          'text-align' : 'center',
          overflow     : 'hidden',
          width        : 'inherit'
      }

      if (!self.resizeImages) {
        mainCss['max-width'] = String(self.mainElementMeasures.maxWidth) + 'px';
        mainCss['height']    = String(self.mainElementMeasures.height) + 'px';
      }

      self.mainElement.css(mainCss);

      //slides breaks here.
      methods.setImagesCss({
        resizeImages: self.resizeImages,
        horizontalOffset: self.slidesOffsets.horizontalOffset,
        verticalOffset:self.slidesOffsets.verticalOffset,
        elements: self.elements
      });

      self.elements.hide();
      self.currentElement = 0;
      $(self.elements[0]).show();
      self.mainElement.data('selected', String(0));

      console.log("initialization done. slide offsets: ", self.slidesOffsets);
    },

    leftButtonClickHandler: function() {
      var self = this;

      if (self.isTransitioning) {
        return;
      }
      self.isTransitioning = true;

      var centerValue = self.slidesOffsets.horizontalOffset[self.currentElement];
      var leavingElement = $(self.elements[self.currentElement--]);
      var leavingFinalPosition = $(leavingElement).width() + centerValue ;
      leavingElement.animate({
        left: '+='+String(leavingFinalPosition+"px")},
        300,
        function() {
          self.isTransitioning = false;
          leavingElement.hide();
        });//completed});

      var numOfSlides = self.elements.length;
      if (self.currentElement < 0) {
          self.currentElement = self.elements.length - 1;
      }

      var entryingInitialPosition = -($(self.elements[self.currentElement]).width()) + centerValue;
      var entryingfinalPosition = entryingInitialPosition*-1 + self.slidesOffsets.horizontalOffset[self.currentElement];

      $(self.mainElement).data('selected', String(self.currentElement));
      $(self.elements[self.currentElement])
        .show()
        .css({
          'left':String(entryingInitialPosition+'px')
        })
        .animate({
          left: '+='+String(entryingfinalPosition)
        },
        300,
        function(){
          self.isTransitioning = false;
        });//completed});
    },

    rightButtonClickHandler: function() {
      var self = this;

      if (self.isTransitioning) {
        return;
      }
      self.isTransitioning = true;

      var centerValue = self.slidesOffsets.horizontalOffset[self.currentElement];
      var leavingElement = $(self.elements[self.currentElement++]);
      var leavingFinalPosition = -($(leavingElement).width() + centerValue);
      leavingElement.animate({
        left: '+='+String(leavingFinalPosition+"px")},
        300,
        function() {
          self.isTransitioning = false;
          leavingElement.hide();
        });//completed});

      var numOfSlides = self.elements.length;
      if (self.currentElement >= numOfSlides) {
          self.currentElement = 0;
      }
      var entryingInitialPosition = ($(leavingElement).width() + centerValue);
      var entryingfinalPosition = entryingInitialPosition*-1 + self.slidesOffsets.horizontalOffset[self.currentElement];

      $(self.mainElement).data('selected', String(self.currentElement));
      $(self.elements[self.currentElement])
        .show()
        .css({
          'left':String(entryingInitialPosition+'px')
        })
        .animate({
          left: '+='+String(entryingfinalPosition)
        },
        300,
        function(){
          self.isTransitioning = false;
        });//completed});
    },

    onResizeHandler: function() {
      var self = this;

      self.imagesBoundaries = methods.getImagesBounds(self.elements);
      var mainElementMeasures = {
        width:  $(self.mainElement).innerWidth(),
        height: self.baseHeight == "smaller" ? self.imagesBoundaries.height.smaller : self.imagesBoundaries.height.taller
      }

      if(!self.resizeImages) {
        mainElementMeasures['maxWidth'] == "smaller" ?
        self.imagesBoundaries.width.smaller :
        self.imagesBoundaries.width.wider;
      }

      self.slidesOffsets = methods.getOffsets(self.mainElementMeasures.width, self.mainElementMeasures.height, self.elements);
      var mainCss = {
          position    : 'relative',
          'text-align': 'center',
          overflow    : 'hidden',
          height      : String(self.mainElementMeasures.height) + 'px',
          width       : 'inherit',
      }
      if (!self.resizeImages) {
        mainCss['max-width'] = String(self.mainElementMeasures.maxWidth) + 'px';
      }
      $(self.mainElement).css(mainCss);

      methods.setImagesCss({
        resizeImages   : self.resizeImages,
        verticalOffset : self.slidesOffsets.verticalOffset,
        elements       : self.elements
      });

      var elementsCss = {
        'left' : String(self.slidesOffsets.horizontalOffset[self.currentElement])+'px',
      };

      $(self.elements[self.currentElement]).css(elementsCss);
    }
  }

  $.fn.xexeuCarousel = function(options) {
    var opts = $.extend( {}, $.fn.xexeuCarousel.options, options );
    return this.each(function() {

       var carousel = Object.create(XexeuCarousel);
       carousel.bootstrap(opts, this);

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
  }

}(jQuery));
