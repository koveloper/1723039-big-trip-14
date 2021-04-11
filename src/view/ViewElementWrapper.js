import RenderUnit from '../RenderUnit.js';

export default class ViewElementWrapper {

  constructor(containerSelector = '', viewElement, renderPostion) {
    this._containerSelector = containerSelector;
    this._viewElement = viewElement;
    this._renderPostion = renderPostion;
  }

  get viewElement() {
    return this._viewElement;
  }

  toggle(newWrapper) {
    document.querySelector(this._containerSelector).replaceChild(newWrapper.viewElement.element, this.viewElement.element);
  }

  render() {
    if(!this._viewElement || !this._containerSelector) {
      return;
    }
    RenderUnit.renderElement(document.querySelector(this._containerSelector), this._viewElement.element, this._renderPostion);
  }
}
