﻿import { BaseComponent } from '../../component.js';

/**
 * TodoComponent
 */
export class TodoComponent extends BaseComponent<HTMLElement> {
  constructor(readonly title: string, readonly todo: string) {
    super(`
      <section class="todo">
        <h2 class="todo__title"></h2>
        <input type="checkbox" class="todo__checkbox">
      </section>`);

    const titleElement = this.element.querySelector(
      '.todo__title'
    )! as HTMLHeadingElement;
    titleElement.textContent = title;

    const bodyElement = this.element.querySelector(
      '.todo__checkbox'
    )! as HTMLInputElement;
    bodyElement.insertAdjacentText('afterend', todo);
  }
}