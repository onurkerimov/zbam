export default class Zbam {
  constructor(options) {
    // If any option is provided, apply it
    if (options) {
      let self = this;
      Object.keys(options).forEach((key) => {
        self[key] = options[key];
      });
    }

    if (this.startDraggingAfter === undefined) this.startDraggingAfter = 0; //ms
    if (this.dragStartCondition === undefined)
      this.dragStartCondition = () => true;
    if (this.settings === undefined) this.settings = {};
    if (this.dragStart === undefined) this.dragStart = () => true;
    if (this.dragMove === undefined) this.dragMove = () => true;
    if (this.dragEnd === undefined) this.dragEnd = () => true;

    this.startDraggingTimeout = null;

    this._dragStart = dragStart.bind(this);
    this._dragMove = dragMove.bind(this);
    this._dragEnd = dragEnd.bind(this);

    // Initialize listeners
    // Optimized for mobile and touch devices
    window.addEventListener("mousedown", this._dragStart, this.settings);
    window.addEventListener("touchstart", this._dragStart, this.settings);
    window.addEventListener("mousemove", this._dragMove, this.settings);
    window.addEventListener("touchmove", this._dragMove, this.settings);
    window.addEventListener("mouseup", this._dragEnd, this.settings);
    window.addEventListener("touchend", this._dragEnd, this.settings);

    this.dragFlag = false;
  }

  destroy() {
    // Destroy the listeners
    window.removeEventListener("mousedown", this._dragStart, this.settings);
    window.removeEventListener("touchstart", this._dragStart, this.settings);
    window.removeEventListener("mousemove", this._dragMove, this.settings);
    window.removeEventListener("touchmove", this._dragMove, this.settings);
    window.removeEventListener("mouseup", this._dragEnd, this.settings);
    window.removeEventListener("touchend", this._dragEnd, this.settings);
  }
}

function dragStart(e) {
  if (this.dragStartCondition(e)) {
    if (this.startDraggingAfter === 0) {
      this.dragFlag = true;
    } else {
      this.startDraggingTimeout = setTimeout(() => {
        this.dragFlag = true;
        this.startDraggingTimeout = null;
      }, this.startDraggingAfter);
    }

    this.dragStart(e);
  }
}

function dragMove(e) {
  if (this.dragFlag) {
    this.dragMove(e);
  }
}

function dragEnd(e) {
  if (this.startDraggingTimeout) {
    clearTimeout(this.startDraggingTimeout);
    this.startDraggingTimeout = null;
  }
  if (this.dragFlag) {
    this.dragEnd(e);
    this.dragFlag = false;
  }
}
