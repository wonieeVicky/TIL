import { Component } from './components/component.js';
import { InputDialog } from './components/dialog/dialog.js';
import { ImageDialogComponent } from './components/dialog/item/image.js';
import { ImageComponent } from './components/page/item/image.js';
import { NoteComponent } from './components/page/item/note.js';
import { TodoComponent } from './components/page/item/todo.js';
import { VideoComponent } from './components/page/item/video.js';
import {
  Composable,
  PageComponent,
  PageItemComponent
} from './components/page/page.js';

class App {
  private readonly page: Component & Composable;
  constructor(appRoot: HTMLElement) {
    this.page = new PageComponent(PageItemComponent);
    this.page.attachTo(appRoot);

    const image = new ImageComponent(
      'Image Title',
      'https://picsum.photos/600/300'
    );
    this.page.addChild(image);

    const video = new VideoComponent(
      'Video Title',
      'https://www.youtube.com/watch?v=HfaIcB4Ogxk'
    );
    video.attachTo(appRoot, 'beforeend');
    this.page.addChild(video);

    const note = new NoteComponent('Note Title', 'This is a simple note');
    this.page.addChild(note);

    const todo = new TodoComponent('Todo Title', 'This is a simple todo item');
    this.page.addChild(todo);

    const imageBtn = document.querySelector('#new-image')! as HTMLButtonElement;

    imageBtn.addEventListener('click', () => {
      const dialog = new InputDialog();
      const image = new ImageDialogComponent();
      dialog.addChild(image);
      dialog.setOnCloseListener(() => {
        dialog.removeFrom(document.body);
      });
      dialog.setOnSubmitListener(() => {
        const { title, url } = image.getValues();
        const imageComponent = new ImageComponent(title, url);
        this.page.addChild(imageComponent);
        dialog.removeFrom(document.body);
      });
      dialog.attachTo(document.body);
    });
  }
}

new App(document.querySelector('.document')! as HTMLElement);
