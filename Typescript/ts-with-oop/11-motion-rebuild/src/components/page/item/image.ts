﻿import { BaseComponent } from './../../base.js';

/**
 * ImageComponent
 */
export class ImageComponent extends BaseComponent {
  constructor(readonly title: string, readonly url: string) {
    super(`
      <section class="image">
        <div class="image__holder">
          <img class="image__thumbnail" />
        </div>
        <p class="image__title"></p>
      </section>`);

    const imageElement = this.element.querySelector(
      '.image__thumbnail'
    )! as HTMLImageElement;
    imageElement.src = url;
    imageElement.alt = title;

    const titleElement = this.element.querySelector(
      '.image__title'
    )! as HTMLParagraphElement;
    titleElement.textContent = title;
  }

  attachTo(parent: HTMLElement, position: InsertPosition = 'afterbegin') {
    super.attachTo(parent, position);
  }
}
