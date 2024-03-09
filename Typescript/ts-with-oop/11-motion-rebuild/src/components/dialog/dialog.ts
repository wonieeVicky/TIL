import { BaseComponent, Component } from '../../components/component.js';
import { Composable } from '../page/page';

type OnCloseListener = () => void;
type OnSubmitListener = () => void;

export class InputDialog
  extends BaseComponent<HTMLElement>
  implements Composable
{
  private closeListener?: OnCloseListener;
  private submitListener?: OnSubmitListener;

  constructor() {
    super(`<section class="dialog">
            <div class="dialog__container">
              <button class="close">&times;</button>
              <div id="dialog__body"></div>
              <button class="dialog__submit">ADD</button>
            </div>
          </section>`);
    const closeBtn = this.element.querySelector('.close')! as HTMLElement;

    // 버튼을 다른 곳에서 활용할 경우 addEventListener를 사용하는 것이 좋다.
    closeBtn.onclick = () => {
      this.closeListener && this.closeListener();
    };
    const submitBtn = this.element.querySelector(
      '.dialog__submit'
    )! as HTMLElement;
    submitBtn.onclick = () => {
      this.submitListener && this.submitListener();
    };
  }

  setOnCloseListener(listener: OnCloseListener): void {
    this.closeListener = listener;
  }
  setOnSubmitListener(listener: OnSubmitListener): void {
    this.submitListener = listener;
  }

  addChild(child: Component): void {
    const body = this.element.querySelector('#dialog__body')! as HTMLElement;
    child.attachTo(body);
  }
}
