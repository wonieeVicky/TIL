import { BaseComponent, Component } from '../component.js';

// Composable 다른 녀석과 조합할 수 있음을 의미함
export interface Composable {
  addChild(child: Component): void;
}

class PageItemComponent
  extends BaseComponent<HTMLLIElement>
  implements Composable
{
  constructor() {
    super(`<li class="page-item">
            <section class="page-item__body"></section>
            <div class="page-item__controls">
              <button class="close">&times;</button>
            </div>
          </li>`);
  }
  addChild(child: Component) {
    const container = this.element.querySelector(
      '.page-item__body'
    )! as HTMLElement;
    child.attachTo(container);
  }
}

/**
 * PageComponent
 * - PageComponent는 HTMLUListElement를 상속받아 만들어진 커스텀 엘리먼트이다.
 * - PageComponent는 생성자를 통해 생성된 HTMLUListElement를 가지고 있다.
 * - addChild 메서드는 section을 받아서 PageItemComponent를 생성하고, section을 PageItemComponent에 붙인다.
 */
export class PageComponent
  extends BaseComponent<HTMLUListElement>
  implements Composable
{
  constructor() {
    super('<ul class="page"></ul>');
  }

  addChild(section: Component) {
    const item = new PageItemComponent(); // PageItemComponent를 생성
    item.addChild(section);
    item.attachTo(this.element, 'beforeend'); // 마지막에 붙인다.
  }
}
