/**
 *  HorizontalScroll
 *  Scrolls content in an overflowed element horizontally via wheel and drag on non touch devices
 *  Author: Ian Yong @ https://github.com/iantomarcello
 *  Version: 1.0
 */

class HorizontalScroll {
  constructor(query) {
    this.query = query;
    this.element = document.querySelector(this.query);

    if (!this.element) {
      return console.warn(`"${this.query}" not in DOM.`);
    }

    /// drag
    this.dragState = false;
    this.dragStartPos = 0;

    this.element.onmousedown = ev => {
      this.dragState = true;
      this.dragMouseDownPos = ev.clientX;
      this.dragStartPos = this.element.scrollLeft;
      if (this.isListening) this.listen("dragging");
    }

    this.element.onmousemove = ev => {
      if (this.dragState) {
        this.dragMouseMovePos = ev.clientX;
        this.element.scrollLeft = this.dragStartPos + this.dragMouseDownPos - this.dragMouseMovePos;
      }
    }

    window.onmouseup = () => {
      this.dragState = false;
    }

    /// scroll
    this.element.onwheel = ev => {
      let sensitivity = 1;
      let delta = ev.deltaY;
      let pos = this.element.scrollLeft;
      this.element.scrollLeft = pos + delta * sensitivity;
    }
  }
}
