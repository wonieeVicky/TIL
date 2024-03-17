import { Component } from './components/component.js';
import {
  InputDialog,
  MediaData,
  TextData
} from './components/dialog/dialog.js';
import { MediaSectionInput } from './components/dialog/input/media-input.js';
import { ImageComponent } from './components/page/item/image.js';
import { VideoComponent } from './components/page/item/video.js';
import { NoteComponent } from './components/page/item/note.js';
import { TodoComponent } from './components/page/item/todo.js';
import {
  Composable,
  PageComponent,
  PageItemComponent
} from './components/page/page.js';
import { TextSectionInput } from './components/dialog/input/text-input.js';

type InputComponentConstructor<T = (MediaData | TextData) & Component> = {
  new (): T;
};

class App {
  private readonly page: Component & Composable;

  constructor(appRoot: HTMLElement, private dialogRoot: HTMLElement) {
    this.page = new PageComponent(PageItemComponent);
    this.page.attachTo(appRoot);

    this.bindElementToDialog(
      '#new-image',
      MediaSectionInput,
      (input) => new ImageComponent(input.title, input.url)
    );
    this.bindElementToDialog(
      '#new-video',
      MediaSectionInput,
      (input) => new VideoComponent(input.title, input.url)
    );
    this.bindElementToDialog(
      '#new-note',
      TextSectionInput,
      (input) => new NoteComponent(input.title, input.body)
    );
    this.bindElementToDialog(
      '#new-todo',
      TextSectionInput,
      (input) => new TodoComponent(input.title, input.body)
    );
  }

  private bindElementToDialog<T extends (MediaData | TextData) & Component>(
    selector: string,
    InputComponent: InputComponentConstructor<T>,
    makeSection: (input: T) => Component
  ) {
    const element = document.querySelector(selector)! as HTMLButtonElement;
    element.addEventListener('click', () => {
      const dialog = new InputDialog();
      const input = new InputComponent();
      dialog.addChild(input);
      dialog.attachTo(this.dialogRoot);

      dialog.setOnCloseListener(() => {
        dialog.removeFrom(this.dialogRoot);
      });
      dialog.setOnSubmitListener(() => {
        const imageComponent = makeSection(input);
        this.page.addChild(imageComponent);
        dialog.removeFrom(this.dialogRoot);
      });
    });
  }
}

new App(document.querySelector('.document')! as HTMLElement, document.body);
