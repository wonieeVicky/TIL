import { BaseComponent } from '../../component.js';

/**
 * TodoComponent
 */
export class TodoComponent extends BaseComponent<HTMLElement> {
  constructor(readonly title: string, readonly body: string) {
    super(`
      <section class="todo">
        <h2 class="todo__title"></h2>
        <p class="todo__body"></p>
      </section>`);

    const titleElement = this.element.querySelector(
      '.todo__title'
    )! as HTMLHeadingElement;
    titleElement.textContent = title;

    const bodyElement = this.element.querySelector(
      '.todo__body'
    )! as HTMLParagraphElement;
    bodyElement.textContent = body;
  }
}
