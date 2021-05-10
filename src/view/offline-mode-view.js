import AbstractViewElement from './abstract-view-element.js';

export default class OfflineModeView extends AbstractViewElement {

  constructor() {
    super();
  }

  getTemplate() {
    return `<div class="page-body__offline-mode-warning  offline-mode-warning">
                <span class="offline-mode-warning__sign">WARNING!</span>
                <span class="offline-mode-warning__sign">Network is unreachable!</span>
                <span class="offline-mode-warning__sign">Offline mode is activated!</span>
            </div>`;
  }
}
