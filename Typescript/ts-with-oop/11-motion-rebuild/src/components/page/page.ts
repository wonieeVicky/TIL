import { BaseComponent, Component } from '../component.js';

// Composable 다른 녀석과 조합할 수 있음을 의미함
export interface Composable {
  addChild(child: Component): void;
}

type OnCloseListener = () => void;

interface SectionContainer extends Component, Composable {
  setOnCloseListener(listener: OnCloseListener): void;
}

// 다른 모드의 pageItemcomponent가 생성된다면?
// export class DarkModePageItemComponent extends BaseComponent<HTMLLIElement> implements SectionContainer { ... }

export class PageItemComponent
  extends BaseComponent<HTMLLIElement>
  implements SectionContainer
{
  private closeListener?: OnCloseListener | undefined;
  constructor() {
    super(`<li class="page-item">
            <section class="page-item__body"></section>
            <div class="page-item__controls">
              <button class="close">&times;</button>
            </div>
          </li>`);
    const closeBtn = this.element.querySelector('.close')! as HTMLButtonElement;
    closeBtn.onclick = () => {
      this.closeListener && this.closeListener();
    };
  }
  addChild(child: Component) {
    const container = this.element.querySelector(
      '.page-item__body'
    )! as HTMLElement;
    child.attachTo(container);
  }
  // listener를 외부에서 전달받아 실행시킴 (PageComponent에서 전달받음)
  setOnCloseListener(listener: OnCloseListener) {
    this.closeListener = listener;
  }
}

/**
 * PageComponent
 * - PageComponent는 HTMLUListElement를 상속받아 만들어진 커스텀 엘리먼트이다.
 * - PageComponent는 생성자를 통해 생성된 HTMLUListElement를 가지고 있다.
 * - addChild 메서드는 section을 받아서 PageItemComponent를 생성하고, section을 PageItemComponent에 붙인다.
 */

type SectionContainerConstructor = {
  new (): SectionContainer;
};

export class PageComponent
  extends BaseComponent<HTMLUListElement>
  implements Composable
{
  constructor(private pageItemConstructor: SectionContainerConstructor) {
    super('<ul class="page"></ul>');
  }

  addChild(section: Component) {
    // PageComponent는 PageItemComponent만 생성. PageComponent를 재사용하면서 원하는 컴포넌트를 생성하도록 리팩토링
    const item = new this.pageItemConstructor();
    item.addChild(section);
    item.attachTo(this.element, 'beforeend'); // 마지막에 붙인다.
    item.setOnCloseListener(() => item.removeFrom(this.element));
  }
}
