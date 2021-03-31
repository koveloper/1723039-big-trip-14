export class ViewElement {
  constructor(containerSelector, markup = '', placeToInsert = 'beforeEnd') {
    this.containerSelector_ = containerSelector;
    this.markup_ = markup;
    this.placeToInsert_ = placeToInsert;
  }

  get markup() {
    return this.markup_;
  }

  get container() {
    return this.containerSelector_ ? document.querySelector(this.containerSelector_) : null;
  }

  render() {
    if (this.container) {
      this.container.insertAdjacentHTML(this.placeToInsert_, this.markup);
    }
  }
}
