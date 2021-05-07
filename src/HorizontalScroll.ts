/**
 *  HorizontalScroll
 *  Scrolls content in an overflowed element horizontally via wheel and drag on non touch devices
 *  Author: Ian Yong @ https://github.com/iantomarcello
 *  Version: 210507
 */

class HorizontalScroll {
  /** Element that the events responds to, typically parent to `slides`. */
  element: HTMLElement;
  /** Element that contains the slides. */
  slides: HTMLElement;
  /** How much slides per tick of scroll wheel. Ignored when touch. */
  sensitivity: number;
  dragState: boolean;
  dragStartPos: number;
  dragMouseDownPos: number;
  dragMouseMovePos: number;

  /**
   * @param {HTMLElement} element 
   * @param {number} sensitivity 
   */
  constructor(element: HTMLElement, sensitivity: number = 1, slides: null) {
    // NOTE: touch ignores sensitivity.
    this.sensitivity = sensitivity;

    if (!element) {
      console.warn(`'element' not in DOM.`);
      return null; 
    } else {
      this.element = element;

      if ( !slides ) {
        this.slides = element;
      } else {
        this.slides = slides;
      }
    }

    /// drag states
    this.dragState = false;
    this.dragStartPos = 0;

    this.element.addEventListener('mousedown', ev => this.interactDown(ev));
    this.element.addEventListener('mousemove', ev => this.interactMove(ev));
    window.addEventListener('mouseup', ev => this.interactUp(ev));

    this.element.addEventListener('touchstart', ev => this.interactDown(ev));
    this.element.addEventListener('touchmove', ev => this.interactMove(ev));
    window.addEventListener('touchend', ev => this.interactUp(ev));

    /// scroll on wheel
    this.element.addEventListener('wheel', ev => {
      let delta = ev.deltaY > 0 ? 1 : -1;
      this.slide(delta);
      delta > 0 ? this.dispatchEvent('wheeldown') : this.dispatchEvent('wheelup');
    })
  }

  /**
   * Sets a new HTMLElement as the slides container.
   * @param newSlides The new slide container
   */

  setSlides(newSlides: HTMLElement) {
    if ( newSlides instanceof HTMLElement ) {
      this.slides = newSlides;
    } else {
      console.error(`'element' is not instances of HTMLELement`);
    }
  }

  private interactDown(ev: Event) {
    this.dragState = true;
    if ( ev instanceof MouseEvent ) {
      this.dragMouseDownPos = ev.clientX;
    }
    // TODO: TouchEvent not defined in FF desktop
    if ( ev instanceof TouchEvent ) {
      this.dragMouseDownPos = ev.touches[0].clientX;
    }
    this.dragStartPos = this.element.scrollLeft;
    this.dispatchEvent('held');
  }

  private interactUp(ev: Event) {
    this.dragState = false;
    this.dispatchEvent('release');
  }

  private interactMove(ev: Event) {
    if (this.dragState) {
      if ( ev instanceof MouseEvent ) {
        this.dragMouseMovePos = ev.clientX;
      }
      if ( ev instanceof TouchEvent ) {
        this.dragMouseMovePos = ev.touches[0].clientX;
      }
      if (!ev.type.includes('touch')) {
        this.element.scrollLeft = this.dragStartPos + this.dragMouseDownPos - this.dragMouseMovePos;
      }
      this.dragMouseMovePos > this.dragMouseDownPos ? this.dispatchEvent('scrollright') : this.dispatchEvent('scrollleft');
    }
  }

  public async slide(n : number, sensitivity : number = this.sensitivity) {
    let multiplier = sensitivity ?? this.sensitivity;
    if ( n !== 0 ) {
      let width = this.slides.children[0].clientWidth;
      let delta = width * n * multiplier;
      this.element.scrollLeft += delta;
    } else {
      console.warn(`'slide' must be a non-zero value.`);
    }
  }

  private dispatchEvent(message: string) {
    this.element.dispatchEvent(
      new CustomEvent('HorizontalScroll',
        {
          bubbles: true,
          detail: {message},
        }
      )
    );
  }
}
