import { BaseComponent } from '../component.js';

/**
 * PageComponent
 * - PageComponent는 HTMLUListElement를 상속받아 만들어진 커스텀 엘리먼트이다.
 * - PageComponent는 생성자를 통해 생성된 HTMLUListElement를 가지고 있다.
 * - attachTo 메서드는 BaseComponent를 상속받아 구현된 메서드이다.
 */
export class PageComponent extends BaseComponent<HTMLUListElement> {
  constructor() {
    super('<ul class="page">This is PageComponent</ul>');
  }
}
