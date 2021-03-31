# Horizontal Scroll
A helper function/class that adds horizontal scrolling capabilities to a horizontal
overflowing container.

## Getting started
Add the function to your document.
```html
<script src="HorizontalScroll.js">
```
Next, wrap your scrolling contents in a container. <br>
It is important that your container is overflowing in x axis.
```html
<style>
  body {
    margin: 0;
  }

  #container {
    width: 100%;
    height: 100%;
    padding: 15px;
    display: flex;
    overflow-x: auto; /* I am important! */
    box-sizing: border-box;
  }

  span {
    font-size: 15rem; 
  }
</style>
<div id="container">
  <!-- the slides -->
  <div><span>1</span></div>
  <div><span>2</span></div>
  <div><span>3</span></div>
  <div><span>4</span></div>
  <div><span>5</span></div>
</div>
```
Then, all you need to do is to initiate the function.
```html
<script>
  const container = document.getElementById('container');
  const scroller = new HorizontalScroll(container);
</script>
```
The container is now scrollable by mousewheel, mouse drag and touch slides.


The constructor also takes in a second parameter, which is the `sensitivity`, 
which affects how much slides per mouse wheel tick.


## Methods
### **slide** ( n: number, sensitivity: number ) : void
Slides the scroller left or right programmatically by `n` slides. <br>
`n` must be a non-zero interger to have an effect. Positive `n` slides to 
the left, and vice-versa. <br>
`sensitivity` is a multiplier for the scrolling, by default set to the sensitivity property of the class, which is, by default 1. <br>


## Events
The function dispatches bubbling events from the container. <br>
Here's how to listen to event based on above example.
```js
container.addEventListener('HorizontalScroll', ev => {
  console.log(ev.detail.message);
});
```
You can then do some conditioning statements to listen to specific things 
happening.

| Event Message | Notes |
| --- | --- |
| `wheeldown` | fires when mouse wheel ticks down. |
| `wheelup` | fires when mouse wheel ticks up. |
| `held` | fires when mouse down held when dragging, or when touch starts. |
| `release` | fires when mouse up or touch ends. |
| `scrollright` | fires when slides are scrolling right. |
| `scrollleft` | fires when slides are scrolling left. |

## Extra
1. Its not necessary for the `container` element to be in  `overflow-x: auto`, 
using the `hidden` value works as well should you want to remove the scroll bar.
2. `slide` method is generally used with buttons to slide the contents.
3. To make things looks nicer, you could use `scroll-behaviour` and `scroll-snap`:
```css
#container {
  /* other rules */
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
}

.slide {
  /* other rules */
  scroll-snap-align: center;
}
```