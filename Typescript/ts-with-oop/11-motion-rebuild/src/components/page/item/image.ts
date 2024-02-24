/**
 * ImageComponent
 */
export class ImageComponent {
  private element: HTMLElement;

  constructor(readonly title: string, readonly url: string) {
    const template = document.createElement('template');
    template.innerHTML = `
      <section class="image">
        <div class="image__holder">
          <img class="image__thumbnail" />
        </div>
        <p class="image__title"></p>
      </section>`;

    // template.innerHTML로 데이터를 바로 주입하지 않고 필요한 부분만 아래처럼 업데이트 해준다.
    this.element = template.content.firstElementChild! as HTMLElement;
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
    parent.insertAdjacentElement(position, this.element);
  }
}
