export class ViewElement {
  constructor() {
    this.containerSelector = '';
    this.markup = '';
    this.placeToInsert = 'beforeEnd';
  }

  set markup(murkup) {
    this.markup_ = murkup;
  }

  get markup() {
    return this.markup_;
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
      this.container.insertAdjacentHTML(this.placeToInsert, this.markup);
    }
  }
}
