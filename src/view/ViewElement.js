export default class ViewElement {
  constructor() {
    this._template = '';
    this.containerSelector = '';
    this.placeToInsert = 'beforeEnd';
  }

  set template(value) {
    this._template = value;
  }

  get template() {
    return this._template;
  }

  set containerSelector(containerSelector) {
    this.containerSelector_ = containerSelector;
  }

  get containerSelector() {
    return this.containerSelector_;
  }

  get container() {
    return this.containerSelector_ ? document.querySelector(this.containerSelector_) : null;
  }

  set placeToInsert(placeToInsert) {
    this.placeToInsert_ = placeToInsert;
  }

  get placeToInsert() {
    return this.placeToInsert_;
  }

  render() {
    if (this.container) {
      this.container.insertAdjacentHTML(this.placeToInsert, this.template);
    }
  }
}
