export class ViewElement {
  constructor(markup = '') {
    this.markup_ = markup;
  }

  get markup() {
    return this.markup_;
  }
}
