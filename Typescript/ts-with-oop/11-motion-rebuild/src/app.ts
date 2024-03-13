import { Component } from './components/component.js';
import { InputDialog } from './components/dialog/dialog.js';
import { InputDialogContent } from './components/dialog/dialogContent.js';
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

    const imageBtn = document.querySelector('#new-image')! as HTMLButtonElement;
    imageBtn.addEventListener('click', () => {
      const dialog = new InputDialog();
      const image = new InputDialogContent('image');
      dialog.addChild(image);
      dialog.setOnCloseListener(() => dialog.removeFrom(document.body));
      dialog.setOnSubmitListener(() => {
        const { title, value } = image.getValues();
        const imageComponent = new ImageComponent(title, value);
        this.page.addChild(imageComponent);
        dialog.removeFrom(document.body);
      });
      dialog.attachTo(document.body);
    });

    const videoBtn = document.querySelector('#new-video')! as HTMLButtonElement;
    videoBtn.addEventListener('click', () => {
      const dialog = new InputDialog();
      const video = new InputDialogContent('video');
      dialog.addChild(video);
      dialog.setOnCloseListener(() => dialog.removeFrom(document.body));
      dialog.setOnSubmitListener(() => {
        const { title, value } = video.getValues();
        const videoComponent = new VideoComponent(title, value);
        this.page.addChild(videoComponent);
        dialog.removeFrom(document.body);
      });
      dialog.attachTo(document.body);
    });

    const noteBtn = document.querySelector('#new-note')! as HTMLButtonElement;
    noteBtn.addEventListener('click', () => {
      const dialog = new InputDialog();
      const note = new InputDialogContent('note');
      dialog.addChild(note);
      dialog.setOnCloseListener(() => dialog.removeFrom(document.body));
      dialog.setOnSubmitListener(() => {
        const { title, value } = note.getValues();
        const videoComponent = new NoteComponent(title, value);
        this.page.addChild(videoComponent);
        dialog.removeFrom(document.body);
      });
      dialog.attachTo(document.body);
    });

    const todoBtn = document.querySelector('#new-todo')! as HTMLButtonElement;
    todoBtn.addEventListener('click', () => {
      const dialog = new InputDialog();
      const todo = new InputDialogContent('todo');
      dialog.addChild(todo);
      dialog.setOnCloseListener(() => dialog.removeFrom(document.body));
      dialog.setOnSubmitListener(() => {
        const { title, value } = todo.getValues();
        const videoComponent = new TodoComponent(title, value);
        this.page.addChild(videoComponent);
        dialog.removeFrom(document.body);
      });
      dialog.attachTo(document.body);
    });
  }
}

new App(document.querySelector('.document')! as HTMLElement);
