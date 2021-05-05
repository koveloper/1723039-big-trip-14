import AbstractViewElement from './abstract-view-element.js';
import {createDefaultChart} from './stats-charts.js';
import {TimeUtils} from '../utils/time.js';

export default class StatisticsView extends AbstractViewElement {

  constructor() {
    super();
  }

  createMoneyChart(labelDataObject = {}) {
    createDefaultChart({
      ctx: this.getElement().querySelector('.statistics__chart--money'),
      formatter: (val) => `€ ${val}`,
      title: 'MONEY',
      labels: Object.keys(labelDataObject),
      data: Object.values(labelDataObject),
    });
  }

  createTypeChart(labelDataObject = {}) {
    createDefaultChart({
      ctx: this.getElement().querySelector('.statistics__chart--transport'),
      formatter: (val) => `${val}x`,
      title: 'TYPE',
      labels: Object.keys(labelDataObject),
      data: Object.values(labelDataObject),
    });
  }

  createTimeChart(labelDataObject = {}) {
    createDefaultChart({
      ctx: this.getElement().querySelector('.statistics__chart--time'),
      formatter: (val) => val ? TimeUtils.getDiff(0, val) : 0,
      title: 'TIME-SPEND',
      labels: Object.keys(labelDataObject),
      data: Object.values(labelDataObject),
    });
  }


  getTemplate() {
    return `<section class="statistics">
          <h2 class="visually-hidden">Trip statistics</h2>

          <div class="statistics__item statistics__item--money">
            <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--transport">
            <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--time-spend">
            <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
          </div>
        </section>`;
  }
}
