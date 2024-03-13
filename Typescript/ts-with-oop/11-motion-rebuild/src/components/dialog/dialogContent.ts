import { BaseComponent } from '../component.js';

/**
 * ImageDialogComponent
 */
type ContentType = 'image' | 'video' | 'note' | 'todo';
export class InputDialogContent extends BaseComponent<HTMLElement> {
  private type: ContentType;
  constructor(type: ContentType) {
    super(
      `<section class="${type}">
      <div>
      <label>Title</label>
      <input type="text" name="title" />
      </div>
      ${
        type === 'image' || type === 'video'
          ? `<div>
        <label>URL</label>
        <input type="text" name="url" />
        </div>`
          : `<div>
        <label>Body</label>
        <input type="text" name="body" />
        </div>`
      }
      </section>`
    );
    this.type = type;
  }
  getValues() {
    const titleElement = this.element.querySelector(
      'input[name="title"]'
    )! as HTMLInputElement;
    const contentElement = this.element.querySelector(
      `input[name="${
        this.type === 'image' || this.type === 'video' ? 'url' : 'body'
      }"]`
    )! as HTMLInputElement;

    return { title: titleElement.value, value: contentElement.value };
  }
}
