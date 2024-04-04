export interface Component {
  // element를 interface에 추가하지 않는 이유 ?
  // - element는 BaseComponent 클래스 내부에서만 사용되기 때문.
  // - 외부에서 사용할 필요가 없으므로 알 필요가 없다.
  attachTo(parent: HTMLElement, position?: InsertPosition): void;
  removeFrom(parent: HTMLElement): void;
  attach(component: Component, position?: InsertPosition): void;
  registerEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any
  ): void;
}

/**
 * BaseComponent 기본 클래스
 * - Encapsulation: HTML 생성을 캡슐화
 */

// T는 HTMLElement를 상속받는 타입이어야 한다.
export class BaseComponent<T extends HTMLElement> implements Component {
  protected readonly element: T;

  constructor(htmlString: string) {
    const template = document.createElement('template');
    template.innerHTML = htmlString;
    this.element = template.content.firstElementChild! as T;
  }

  attachTo(parent: HTMLElement, position: InsertPosition = 'afterbegin') {
    parent.insertAdjacentElement(position, this.element);
  }

  removeFrom(parent: HTMLElement) {
    if (parent !== this.element.parentElement) {
      throw new Error('Parent mismatch!');
    }
    parent.removeChild(this.element); // parent에서 element를 지운다.
  }

  attach(component: Component, position?: InsertPosition) {
    component.attachTo(this.element, position);
  }

  // The same signature as the HTMLElement.addEventListener method
  registerEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any
  ): void {
    this.element.addEventListener(type, listener);
  }
}
