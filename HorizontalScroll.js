/**
 *  HorizontalScroll
 *  Scrolls content in an overflowed element horizontally via wheel and drag on non touch devices
 *  Author: Ian Yong @ https://github.com/iantomarcello
 *  Version: 191116
 */

class HorizontalScroll {
  constructor(query, sensitivity, listening = false) {
    this.query = query;
    this.sensitivity = sensitivity;
    this.listening = listening;
    this.element = document.querySelector(this.query);

    if (!this.element) {
      return console.warn(`"${this.query}" not in DOM.`);
    }

    /// drag states
    this.dragState = false;
    this.dragStartPos = 0;

    this.element.addEventListener("mousedown", ev => this.down(ev));
    this.element.addEventListener("mousemove", ev => this.move(ev));
    window.addEventListener("mouseup", ev => this.up(ev));

    this.element.addEventListener("touchstart", ev => this.down(ev));
    this.element.addEventListener("touchmove", ev => this.move(ev));
    window.addEventListener("touchend", ev => this.up(ev));

    /// scroll
    this.element.addEventListener("wheel", ev => {
      let delta = ev.deltaY;
      let pos = this.element.scrollLeft;
      this.element.scrollLeft = pos + delta * this.sensitivity;
      if (this.listening) {
        delta > 0 ? this.listen(ev, "wheeldown") : this.listen(ev, "wheelup");
      }
    })
  }

  down(ev) {
    this.dragState = true;
    this.dragMouseDownPos = ev.clientX || ev.touches[0].clientX;
    this.dragStartPos = this.element.scrollLeft;
    if (this.listening) this.listen(ev, "held");
  }

  up(ev) {
    this.dragState = false;
    if (this.listening) this.listen(ev, "release");
  }

  move(ev) {
    if (this.dragState) {
      this.dragMouseMovePos = ev.clientX || ev.touches[0].clientX;
      if (!ev.type.includes("touch")) {
        this.element.scrollLeft = this.dragStartPos + this.dragMouseDownPos - this.dragMouseMovePos;
      }
      if (this.listening) {
        this.dragMouseMovePos > this.dragMouseDownPos ? this.listen(ev, "scrollright") : this.listen(ev, "scrollleft");
      }
    }
  }

  listen(ev, message) {
    return null;
  }
}
