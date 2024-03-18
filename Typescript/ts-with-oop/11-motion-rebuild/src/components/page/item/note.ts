import { BaseComponent } from '../../component.js';

/**
 * NoteComponent
 */
export class NoteComponent extends BaseComponent<HTMLElement> {
  constructor(readonly title: string, readonly body: string) {
    super(`
      <section class="note">
        <h2 class="page-item__title note__title"></h2>
        <p class="note__body"></p>
      </section>`);

    const titleElement = this.element.querySelector(
      '.note__title'
    )! as HTMLHeadingElement;
    titleElement.textContent = title;

    const bodyElement = this.element.querySelector(
      '.note__body'
    )! as HTMLParagraphElement;
    bodyElement.textContent = body;
  }
}
