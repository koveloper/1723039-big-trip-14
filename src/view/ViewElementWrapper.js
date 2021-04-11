import RenderUnit from '../RenderUnit.js';

export default class ViewElementWrapper {

  constructor(containerSelector = '', viewElements = [], renderPostion) {
    this._containerSelector = containerSelector;
    this._viewElements = viewElements;
    this._renderPostion = renderPostion;
  }

  get elements() {
    return Array.isArray(this._viewElements) ? this._viewElements : [this._viewElements];
  }

  render() {
    if(!this._viewElements || !this._containerSelector) {
      return;
    }
    for(const ve of this.elements) {
      RenderUnit.renderElement(document.querySelector(this._containerSelector), ve.element, this._renderPostion);
    }
  }
}
