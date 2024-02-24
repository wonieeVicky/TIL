import { BaseComponent } from './../base.js';

/**
 * PageComponent
 * - PageComponent는 HTMLUListElement를 상속받아 만들어진 커스텀 엘리먼트이다.
 * - PageComponent는 생성자를 통해 생성된 HTMLUListElement를 가지고 있다.
 * - attachTo 메서드를 통해 부모 엘리먼트에 자신의 엘리먼트를 추가할 수 있다.
 */
export class PageComponent extends BaseComponent {
  constructor() {
    super('<ul class="page">This is PageComponent</ul>');
  }

  attachTo(parent: HTMLElement, position: InsertPosition = 'afterbegin') {
    super.attachTo(parent, position);
  }
}
