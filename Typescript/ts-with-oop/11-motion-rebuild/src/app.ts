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

    this.page.addChild(
      new ImageComponent('Image Title', 'https://picsum.photos/800/400')
    );
    this.page.addChild(
      new VideoComponent(
        'Video Title',
        'https://www.youtube.com/watch?v=2b57fyasALY&t=22s'
      )
    );
    this.page.addChild(new NoteComponent('Note Title', 'Note Body'));
    this.page.addChild(new TodoComponent('Todo Title', 'TypeScript 공부하기'));
    this.page.addChild(
      new ImageComponent('Image Title', 'https://picsum.photos/800/400')
    );
    this.page.addChild(
      new VideoComponent(
        'Video Title',
        'https://www.youtube.com/watch?v=SUm2mJBaiEo'
      )
    );
    this.page.addChild(
      new TodoComponent('Todo Title', '사이드 프로젝트 해보기')
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
