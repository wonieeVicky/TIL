import { BaseComponent } from '../../component.js';

/**
 * VideoComponent
 */
export class VideoComponent extends BaseComponent<HTMLElement> {
  constructor(readonly title: string, readonly url: string) {
    super(`
      <section class="video">
        <div class="video__holder">
          <iframe class="video__thumbnail" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
        <p class="video__title"></p>
      </section>`);

    const videoElement = this.element.querySelector(
      '.video__thumbnail'
    )! as HTMLIFrameElement;
    videoElement.src = url;

    const titleElement = this.element.querySelector(
      '.video__title'
    )! as HTMLParagraphElement;
    titleElement.textContent = title;
  }
}
