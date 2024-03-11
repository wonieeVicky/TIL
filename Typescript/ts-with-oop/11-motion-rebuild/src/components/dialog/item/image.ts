import { BaseComponent } from '../../component.js';

/**
 * ImageDialogComponent
 */
export class ImageDialogComponent extends BaseComponent<HTMLElement> {
  constructor() {
    super(`
      <section class="image">
        <label>Title</label>
        <input name="title" />
        <label>URL</label>
        <input name="url" />
      </section>`);
  }
  getValues() {
    const titleElement = this.element.querySelector(
      'input[name="title"]'
    )! as HTMLInputElement;
    const urlElement = this.element.querySelector(
      'input[name="url"]'
    )! as HTMLInputElement;

    return { title: titleElement.value, url: urlElement.value };
  }
}
