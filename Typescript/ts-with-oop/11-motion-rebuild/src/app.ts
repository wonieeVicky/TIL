import { Component } from './components/component.js';
import { InputDialog } from './components/dialog/dialog.js';
import { MediaSectionInput } from './components/dialog/input/media-input.js';
import { ImageComponent } from './components/page/item/image.js';
// import { NoteComponent } from './components/page/item/note.js';
// import { TodoComponent } from './components/page/item/todo.js';
// import { VideoComponent } from './components/page/item/video.js';
import {
  Composable,
  PageComponent,
  PageItemComponent
} from './components/page/page.js';

class App {
  private readonly page: Component & Composable;

  constructor(appRoot: HTMLElement, dialogRoot: HTMLElement) {
    this.page = new PageComponent(PageItemComponent);
    this.page.attachTo(appRoot);

    const imageBtn = document.querySelector('#new-image')! as HTMLButtonElement;
    imageBtn.addEventListener('click', () => {
      const dialog = new InputDialog();
      const inputSection = new MediaSectionInput();
      dialog.addChild(inputSection);
      dialog.attachTo(dialogRoot);

      dialog.setOnCloseListener(() => {
        dialog.removeFrom(dialogRoot);
      });
      dialog.setOnSubmitListener(() => {
        const imageComponent = new ImageComponent(
          inputSection.title,
          inputSection.url
        );
        this.page.addChild(imageComponent);
        dialog.removeFrom(dialogRoot);
      });
    });
  }
}

new App(document.querySelector('.document')! as HTMLElement, document.body);
