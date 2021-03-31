/**
 *  HorizontalScroll
 *  Scrolls content in an overflowed element horizontally via wheel and drag on non touch devices
 *  Author: Ian Yong @ https://github.com/iantomarcello
 *  Version: 191116
 */
class HorizontalScroll {
    element;
    sensitivity;
    dragState;
    dragStartPos;
    dragMouseDownPos;
    dragMouseMovePos;
    constructor(element, sensitivity = 1) {
        // NOTE: touch ignores sensitivity.
        this.sensitivity = sensitivity;
        if (!element) {
            console.warn(`'element' not in DOM.`);
            return null;
        }
        else {
            this.element = element;
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
        });
    }
    interactDown(ev) {
        this.dragState = true;
        if (ev instanceof MouseEvent) {
            this.dragMouseDownPos = ev.clientX;
        }
        if (ev instanceof TouchEvent) {
            this.dragMouseDownPos = ev.touches[0].clientX;
        }
        this.dragStartPos = this.element.scrollLeft;
        this.dispatchEvent('held');
    }
    interactUp(ev) {
        this.dragState = false;
        this.dispatchEvent('release');
    }
    interactMove(ev) {
        if (this.dragState) {
            if (ev instanceof MouseEvent) {
                this.dragMouseMovePos = ev.clientX;
            }
            if (ev instanceof TouchEvent) {
                this.dragMouseMovePos = ev.touches[0].clientX;
            }
            if (!ev.type.includes('touch')) {
                this.element.scrollLeft = this.dragStartPos + this.dragMouseDownPos - this.dragMouseMovePos;
            }
            this.dragMouseMovePos > this.dragMouseDownPos ? this.dispatchEvent('scrollright') : this.dispatchEvent('scrollleft');
        }
    }
    async slide(n, sensitivity = this.sensitivity) {
        let multiplier = sensitivity ?? this.sensitivity;
        if (n !== 0) {
            let width = this.element.children[0].clientWidth;
            let delta = width * n * multiplier;
            this.element.scrollLeft += delta;
        }
        else {
            console.warn(`'slide' must be a non-zero value.`);
        }
    }
    dispatchEvent(message) {
        this.element.dispatchEvent(new CustomEvent('HorizontalScroll', {
            bubbles: true,
            detail: { message },
        }));
    }
}
