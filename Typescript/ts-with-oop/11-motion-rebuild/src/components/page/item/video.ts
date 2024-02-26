import { BaseComponent } from '../../component.js';

function generateEmbedUrl(url: string) {
  if (url.includes('/embed/')) {
    return url;
  }
  const videoId = url.split('v=')[1];
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  return embedUrl;
}

/**
 * VideoComponent
 */
export class VideoComponent extends BaseComponent<HTMLElement> {
  constructor(readonly title: string, readonly url: string) {
    super(`
      <section class="video">
        <div class="video__player">
          <iframe class="video__iframe"></iframe>
        </div>
        <h3 class="video__title"></h3>
      </section>`);

    const videoElement = this.element.querySelector(
      '.video__iframe'
    )! as HTMLIFrameElement;
    videoElement.src = generateEmbedUrl(url);

    const titleElement = this.element.querySelector(
      '.video__title'
    )! as HTMLHeadingElement;
    titleElement.textContent = title;
  }
}
