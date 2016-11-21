## Dependencies
 jQuery.
 Fontsawesome (I plan on removing this ofc).

## Markup:
So far, it only supports images inside the main container. Of course I plan on changing that later.
  ```html
  <div id="xexeuContainer">
    <img src="images/example1.png">
    <img src="images/example1.png">
    <img src="images/example1.png">
  </div>
  ```

#Customization

## Controlls

###Arrows

  You just need apply the code below in your code.

  ```html
  <div class="xexeu-carousel-btn" data-controll="arrows">
    <button id="leftArrow">Left</button>
    <button id="rightArrow">Right</button>
  </div>
  ```

  _You can add classes but don't change these classes and ids above_.

  Use ``data-controll=""`` to indicate which kind of controll you wanna use.
  In this moment just support _arrows_.

  **Full Code**
  ```html
  <div class="carousel-container" data-controll="arrows">
    <img src="img/3.jpg" alt="" />
    <img src="img/2.jpg" alt="" />
    <img src="img/1.png" alt="" />
  </div>
  <div class="xexeu-carousel-btn">
    <button id="leftArrow">Left</button>
    <button id="rightArrow">Right</button>
  </div>
  ```

###Style arrows

  Exist two methods to styleze your arrow button:

  ####First

    Just add a class or id in the xexeu-carousel-btn container and stylezer as you want.

  ####Second

    You can pass a parameter in the xexeuCarousel function that is a object with the
    ``styleButton`` property which receive two properties _active_ and _styleze_.

    ``active`` property is to indicate the status from arrow's style.
    ``styleze`` property is to input the css in the buttons.

  ```javascript
  $('#xexeuContainer').xexeuCarousel({
    styleButton:{
      active  : true,
      styleze : "background-color:pink;border:0px;"
    }
  });
  ```

  _For now, in the second method, only can pass style for the both arrows at the same time_



## Initialization:
```javascript
$('#xexeuContainer').xexeuCarousel();
```

#Demo
[Link](/demo)
