export default class RenderUnit {

  static getRenderPostions() {
    return {
      AFTERBEGIN: 'afterbegin',
      BEFOREEND: 'beforeend',
    };
  }

  static renderElement(container, element, place = RenderUnit.getRenderPostions().BEFOREEND) {
    switch (place) {
      case RenderUnit.getRenderPostions().AFTERBEGIN:
        container.prepend(element);
        break;
      case RenderUnit.getRenderPostions().BEFOREEND:
        container.append(element);
        break;
    }
  }
}
