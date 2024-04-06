## 모션 프로젝트에 드래그 앤 드롭 기능 구현

### 시작하기 전에

[HTML 드래그 앤 드롭 API - Web API | MDN](https://developer.mozilla.org/ko/docs/Web/API/HTML_Drag_and_Drop_API)

- 먼저 공식문서 여러 개를 훑어본다.
- html drag and drop example codepen 등으로 검색해서 예시 코드를 훑어본다.

### 기본 드래그 이벤트 듣기

PageItemComponent에서 각 DragStart, DragEnd, DragEnter, DragLeave Observer 이벤트를 구현
이동하는 아이템 컴포넌트 자체가 움직임을 시작, 종료, 진입, 떠남 등을 알아야 하기 때문

`src/components/page/page.ts`

```tsx
export class PageItemComponent
  extends BaseComponent<HTMLElement>
  implements SectionContainer
{
  private closeListener?: OnCloseListener;

  constructor() {
    // draggable 옵션 활성화
    super(`<li draggable="true" class="page-item">
            <section class="page-item__body"></section>
            <div class="page-item__controls">
              <button class="close">&times;</button>
            </div>
          </li>`);
    // ..

    // dragstart 이벤트에 별도 onDragStart 이벤트 적용
    this.element.addEventListener('dragstart', (event: DragEvent) => {
      this.onDragStart(event);
    });
    // dragend 이벤트에 별도 onDragEnd 이벤트 적용
    this.element.addEventListener('dragend', (event: DragEvent) => {
      this.onDragEnd(event);
    });
  }
  // onDragStart 이벤트 정의
  onDragStart(event: DragEvent) {
    console.log('dragstart', event);
  }
  // onDragEnd 이벤트 정의
  onDragEnd(event: DragEvent) {
    console.log('dragend', event);
  }

  // ..
}
```

DragOver와 Drop 이벤트는 그 상위인 PageComponent에서 관리한다.
카드가 정확히 어디 상위에 위치해있고, 어떤 위치에서 Drop 처리되었는지는 PageComponent에서 관리

```tsx
export class PageComponent
  extends BaseComponent<HTMLUListElement>
  implements Composable
{
  constructor(private pageItemConstructor: SectionContainerConstructor) {
    super('<ul class="page"></ul>');
    // dragover 이벤트에 별도 onDragOver 이벤트 적용
    this.element.addEventListener('dragover', (event: DragEvent) => {
      this.onDragOver(event);
    });
    // drop 이벤트에 별도 onDrop 이벤트 적용
    this.element.addEventListener('drop', (event: DragEvent) => {
      this.onDrop(event);
    });
  }
  // onDragOver 이벤트 정의
  onDragOver(event: DragEvent) {
    event.preventDefault();
    console.log('onDragOver');
  }
  // onDrop 이벤트 정의
  onDrop(event: DragEvent) {
    event.preventDefault();
    console.log('onDrop');
  }

  addChild(section: Component) {
    // ..
  }
}
```

### drag & drop 기본 이벤트 구현

최대한 성능에 무리가 가지 않는 방법으로, 복잡하지 않은 방법으로 이벤트를 구현한다. (onDragOver 등을 사용 x)

페이지에 드래그가 되고 있는 주체(dragging)와 어디로 지나가고 있는지 어디에서 드래그가 발생하고 있는지(dragover)를 체크해야 한다.

PageComponent에서 어떤 요소에서 드래그가 되고 있고, 어디에 위치해야 하는지 알고 있으면 된다.

`src/components/page/page.ts`

```tsx
/* 드래그 상태를 4가지 타입으로 정의 */
type DragState = 'start' | 'stop' | 'enter' | 'leave';

/* OnDragStateListener 타입 추가 - Component를 상속받는 제네릭 T 타입 지정 */
type OnDragStateListener<T extends Component> = (
  target: T,
  state: DragState
) => void;

export class PageItemComponent
  extends BaseComponent<HTMLElement>
  implements SectionContainer
{
  private closeListener?: OnCloseListener;
  /* dragStateListener 정의 추가 */
  private dragStateListener?: OnDragStateListener<PageItemComponent>;

  constructor() {
    // ..

    this.element.addEventListener('dragstart', (event: DragEvent) => {
      this.onDragStart(event);
    });
    this.element.addEventListener('dragend', (event: DragEvent) => {
      this.onDragEnd(event);
    });
    // dragenter 이벤트에 별도 onDragEnter 이벤트 적용
    this.element.addEventListener('dragenter', (event: DragEvent) => {
      this.onDragEnter(event);
    });
    // dragleave 이벤트에 별도 onDragLeave 이벤트 적용
    this.element.addEventListener('dragleave', (event: DragEvent) => {
      this.onDragLeave(event);
    });
  }

  onDragStart(_: DragEvent) {
    this.notifyDragObservers('start');
  }
  onDragEnd(_: DragEvent) {
    this.notifyDragObservers('stop');
  }
  onDragEnter(_: DragEvent) {
    this.notifyDragObservers('enter');
  }
  onDragLeave(_: DragEvent) {
    this.notifyDragObservers('leave');
  }

  /* drag 상태를 알려주기 위한 observer 이벤트 추가 - 하나의 함수로 관리함 */
  notifyDragObservers(state: DragState) {
    // dragStateListener를 실행
    this.dragStateListener && this.dragStateListener(this, state);
  }

  // ..
  // drag state를 알려주는 리스너 이벤트 생성
  setOnDragStateListener(listener: OnDragStateListener<PageItemComponent>) {
    this.dragStateListener = listener;
  }
}
```

이제 PageComponent에서 이벤트를 등록해본다.

```tsx
interface SectionContainer extends Component, Composable {
  setOnCloseListener(listener: OnCloseListener): void;
  setOnDragStateListener(listener: OnDragStateListener<SectionContainer>): void;
}

export class PageComponent extends BaseComponent<HTMLUListElement> implements Composable {
  constructor(private pageItemConstructor: SectionContainerConstructor) {
    // ..
  }
  // ..

  addChild(section: Component) {
    const item = new this.pageItemConstructor();
    item.addChild(section);
    item.attachTo(this.element, 'beforeend'); // 마지막에 붙인다.
    item.setOnCloseListener(() => {
      item.removeFrom(this.element);
    });
    item.setOnDragStateListener((target: SectionContainer, state: DragState) => {
        console.log(target, state); // PageItemComponent, start, enter, leave..
    );
  }

}
```

위와 같이 카드 이동에 따라 PageComponent에서 실제 움직이는 target과 state를 확인할 수 있음

### 버그 처리하기

PageItemComponent는 자기 자신이 드래그가 되거나 또는 드래그 되는 컴포넌트가 들어오거나 나가면 setOnDragStateListener에 등록된 이벤트에 현재 상태를 알려주도록 만들었다.

부모 컴포넌트인 PageComponent는 addChild 로 pageItemContructor를 신규로 생성할 때마다 setOnDragStateListener로 리스너를 등록할 수 있는 구조로 만들었다.

이제 위에서 console.log을 지우고 각 state에 맞는 행위를 코드로 구현만 하면 된다.

`src/components/page/page.ts`

```tsx
export class PageComponent extends BaseComponent<HTMLUListElement> implements Composable {
	/*
	 * 특정 drag가 발생하거나 drag 아이템이 올라오게 되면
	 * PageComponent에서 이를 기억했다가 drop이라는 이벤트가 발생하면 위치를 변경해주려고 함.
	 * 상태를 간직하기 위한 dropTarget, dragTarget 변수 선언
	 */
  private dropTarget?: SectionContainer;
  private dragTarget?: SectionContainer;

  // ..

  onDragOver(event: DragEvent) {
    event.preventDefault();
    console.log('onDragOver');
  }
  onDrop(event: DragEvent) {
    event.preventDefault();
    console.log('onDrop');
    // 여기에서 위치를 바꿔준다.
  }

  addChild(section: Component) {
    const item = new this.pageItemConstructor();
    item.addChild(section);
    item.attachTo(this.element, 'beforeend'); // 마지막에 붙인다.
    item.setOnCloseListener(() => {
      item.removeFrom(this.element);
    });
    item.setOnDragStateListener((target: SectionContainer, state: DragState) => {
        switch (state) {
          // update dragTarget
          case 'start':
            this.dragTarget = target;
            break;
          // update dragTarget
          case 'stop':
            this.dragTarget = undefined;
            break;
          // update dropTarget
          case 'enter':
            this.dropTarget = target;
            break;
          // update dropTarget
          case 'leave':
            this.dropTarget = undefined;
            break;
          default:
            throw new Error(`unsupported state: ${state}`);
        }
    );
  }

}
```

가장 먼저 위와 같이 switch 문으로 state를 분류해둔 뒤, 특정 이벤트에 대한 상태를 기억하기 위해 private으로 선언한 변수를 onDrop 이벤트가 체크해서 위치를 바꿔주도록 설계했다.

onDrop의 이벤트를 구현해보면 아래와 같다.

```tsx
export class PageComponent extends BaseComponent<HTMLUListElement> implements Composable {
  private dropTarget?: SectionContainer;
  private dragTarget?: SectionContainer;

  // ..
  onDrop(event: DragEvent) {
    event.preventDefault();
    console.log('onDrop');
    // 여기에서 위치를 바꿔준다.
    if (!this.dropTarget) {
      return;
    }

    if (this.dragTarget && this.dragTarget !== this.dropTarget) {
	    // dragTarget을 현재 페이지에서 삭제
      this.dragTarget.removeFrom(this.element);
      // dropTarget에 dragTarget을 attach - Component 클래스에 attach 함수 추가
      this.dropTarget.attach(this.dragTarget, 'beforebegin');
    }
  }

  addChild(section: Component) {
    // ..
    item.setOnDragStateListener((target: SectionContainer, state: DragState) => {
        switch (state) {
          // update dragTarget
          case 'start':
            this.dragTarget = target;
            break;
          // update dragTarget
          case 'stop':
            this.dragTarget = undefined;
            break;
          // update dropTarget
          case 'enter':
            this.dropTarget = target;
            break;
          // update dropTarget
          case 'leave':
            this.dropTarget = undefined;
            break;
          default:
            throw new Error(`unsupported state: ${state}`);
        }
    );
  }
}
```

`src/components/component.ts`

```tsx
export interface Component {
  attachTo(parent: HTMLElement, position?: InsertPosition): void;
  removeFrom(parent: HTMLElement): void;
  // attach 추가
  attach(component: Component, position?: InsertPosition): void;
}

export class BaseComponent<T extends HTMLElement> implements Component {
  protected readonly element: T;

  // ..

  attach(component: Component, position?: InsertPosition) {
    component.attachTo(this.element, position);
  }
}
```

위 코드를 실제 적용해보니 문제가 하나 발생하고 있다. PageItem 의 모든 내부 자식 요소에도 이벤트가 발생해서 enter, leave 이벤트가 계속 발생. 이를 개선하기 위해서는 다양한 방법이 있는데 이번에 할 방법은 아래와 같다.

컴포넌트 드래그를 시작하자마자 컴포넌트에 포인트 이벤트를 삭제하는 방법이다.
이를 위해서는 children이라는 private 변수를 추가로 선언해야 한다.

```tsx
export class PageComponent extends BaseComponent<HTMLUListElement> implements Composable {
	// Set은 중복 데이터를 가질 수 없는 자료 구조
	private children = new Set<SectionContainer>();
  private dropTarget?: SectionContainer;
  private dragTarget?: SectionContainer;

  addChild(section: Component) {
    // ..
    item.setOnCloseListener(() => {
      item.removeFrom(this.element);
      this.children.delete(item); // 추가된 item을 삭제
    });
    this.children.add(item); // item이 무엇이 추가되었는지 알 수 있도록 추가

    item.setOnDragStateListener((target: SectionContainer, state: DragState) => {
        switch (state) {
          case 'start':
            this.dragTarget = target;
            this.updateSections('mute'); // add
            break;
          case 'stop':
            this.dragTarget = undefined;
            this.updateSections('unmute'); // add
            break;
          case 'enter':
            this.dropTarget = target;
            break;
          case 'leave':
            this.dropTarget = undefined;
            break;
          default:
            throw new Error(`unsupported state: ${state}`);
        }
    );
  }

  private updateSections(state: 'mute' | 'unmute') {
    this.children.forEach((section: SectionContainer) => {
      section.muteChildren(state); // PageItemComponent 이벤트 추가
    });
  }
}
```

```tsx
interface SectionContainer extends Component, Composable {
  // ..
  muteChildren(state: 'mute' | 'unmute'): void;
}

export class PageItemComponent
  extends BaseComponent<HTMLLIElement>
  implements SectionContainer
{
  // ..

  muteChildren(state: 'mute' | 'unmute'): void {
    if (state === 'mute') {
      this.element.classList.add('mute-children'); // 포인터 이벤트 mute
    } else {
      this.element.classList.remove('mute-children'); // 포인터 이벤트 활성화
    }
  }
}
```

`style/style.css`

```css
/* -- Drag and Drop -- */
.mute-children * {
  pointer-events: none;
}
```

![](../img/240329-1.gif)

위와 같이 드래그 시작 시 하위요소들에 mute-children 이벤트가 동작하도록 처리함

### 위치 바꾸기

위에서 아래로의 이동은 구현되었으나 아래에서 위로 이동은 구현되지 않음. 위치 이동을 최적화해보자

target.y < drop.y ⇒ afterend, target.y > drop.y ⇒ beforebegin

`src/components/page/page.ts`

```tsx
interface SectionContainer extends Component, Composable {
  // ..
  getBoudingRect(): DOMRect; // add
}

export class PageItemComponent
  extends BaseComponent<HTMLLIElement>
  implements SectionContainer
{
  // ..
  getBoudingRect(): DOMRect {
    return this.element.getBoundingClientRect();
  }
}

export class PageComponent
  extends BaseComponent<HTMLUListElement>
  implements Composable
{
  // ..
  onDrop(event: DragEvent) {
    event.preventDefault();
    console.log('onDrop');
    // 위치를 바꿔준다.
    if (!this.dropTarget) {
      return;
    }

    if (this.dragTarget && this.dragTarget !== this.dropTarget) {
      // 드래그 앤 드랍 위치 설정을 위한 dropY, srcElement 변수 추가
      const dropY = event.clientY; // drop 시점의 y 위치
      const srcElement = this.dragTarget.getBoudingRect(); // 기존 엘리먼트의 위치

      this.dragTarget.removeFrom(this.element);
      this.dropTarget.attach(
        this.dragTarget,
        dropY < srcElement.y ? 'beforebegin' : 'afterend' // update!
      );
    }
  }
  // ..
}
```

### Decorators

JavaScript의 Mixin과 비슷함.
기존 함수나 클래스를 다양한 형태로 재활용할 수 있는 방법(dynamic composition)

```tsx
function Log(
  _: any,
  name: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const newDescriptor = {
    ...descriptor,
    value: function (...args: any[]): any {
      console.log(`Calling ${name} with arguments.`);
      console.dir(args);
      const result = descriptor.value.apply(this, args);
      console.log(`Result:`);
      console.dir(result);
      return result;
    }
  };

  return newDescriptor;
}
```

이런 함수가 있다고 할 때 위 함수를 데코레이터로 아래와 같이 사용할 수 있음
(물론 tsconfig.json 내 `"experimentalDecorators": true` 로 변경해야 함)

```tsx
class Calculator {
  @Log
  add(x: number, y: number) {
    return x + y;
  }
}

const calculator = new Calculator();
console.log(calculator.add(2, 3));

// Calling add with arguments:
// [1, 2]
// Result:
// 3

// 3
```

위와 같이 Calculator 내에 @Log를 추가한 뒤 ts-node로 실행하면 Log 함수가 적절히 실행되는 것을 확인할 수 있다. 이처럼 데코레이터를 이용하면 기존의 클래스나 함수를 한 단계 감싸는, 꾸며줄 수 있는 Wrapper Class를 만들 수 있음. 이를 앵귤러에서는 데코레이터를 대부분의 영역에서 활용하고 있음

### @Decorators Motion에 적용해보기

데코레이터를 Motion 코드에 적용해보자. 어떤 부분을 개선할 수 있을까

`src/components/page/page.ts`

```tsx
export class PageItemComponent
  extends BaseComponent<HTMLLIElement>
  implements SectionContainer
{
  private closeListener?: OnCloseListener | undefined;
  private dragStateListener?: OnDragStateListener<PageItemComponent>;
  constructor() {
    super(`<li draggable="true" class="page-item">
            <section class="page-item__body"></section>
            <div class="page-item__controls">
              <button class="close">&times;</button>
            </div>
          </li>`);
    const closeBtn = this.element.querySelector('.close')! as HTMLButtonElement;
    closeBtn.onclick = () => {
      this.closeListener && this.closeListener();
    };

    // drag and drop
    // this.element.addEventListener('dragstart', (event: DragEvent) => {
    //   this.onDragStart(event);
    // });
    // this.element.addEventListener('dragend', (event: DragEvent) => {
    //   this.onDragEnd(event);
    // });
    // this.element.addEventListener('dragenter', (event: DragEvent) => {
    //   this.onDragEnter(event);
    // });
    // this.element.addEventListener('dragleave', (event: DragEvent) => {
    //   this.onDragLeave(event);
    // });
  }

  // ..
}
```

위 주석한 dragstart, dragend, dragenter, dragleave 함수를 @EnableDragging, @EnableHover로 정의해서 클래스를 감싸주도록 구현하면 어떨까? 바로 아래와 같이 말이다.

```tsx
import { Component } from './../components/component';

/**
 * Set of callbacks that a draggable component must implement to get notified when dragging starts and stops
 */
export interface Draggable {
  // Item reacts when dragging has started
  onDragStart(event: DragEvent): void;
  // Item reacts when the dragging has finished
  onDragEnd(event: DragEvent): void;
}

type GConstructor<T = {}> = new (...args: any[]) => T;
type DraggableClass = GConstructor<Component & Draggable>;

export function EnableDragging<TBase extends DraggableClass>(Base: TBase) {
  return class DraggableItem extends Base {
    constructor(...args: any[]) {
      super(...args);
      this.registerEventListener('dragstart', (event: DragEvent) => {
        this.onDragStart(event);
      });
      this.registerEventListener('dragend', (event: DragEvent) => {
        this.onDragEnd(event);
      });
    }
  };
}

/**
 * Set of callbacks that an item that listens for drag hover needs to implement to get notified
 */
export interface Hoverable {
  // Notify when dragged item enters the area
  onDragEnter(event: DragEvent): void;
  // Notify when dragged item leaves the area
  onDragLeave(event: DragEvent): void;
}

type DragHoverClass = GConstructor<Component & Hoverable>;

export function EnableHover<TBase extends DragHoverClass>(Base: TBase) {
  return class DragHoverArea extends Base {
    constructor(...args: any[]) {
      super(...args);
      this.registerEventListener('dragenter', (event: DragEvent) => {
        event.preventDefault();
        this.onDragEnter(event);
      });
      this.registerEventListener('dragleave', (event: DragEvent) => {
        this.onDragLeave(event);
      });
    }
  };
}
```

위 `EnableDragging`, `EnableHover`는 각각 `DraggableClass`, `DragHoverClass` 타입을 상속받는다.
위 `registerEventListener`을 데코레이터에서 적용 후 상속시켜주려면 `Component` 인터페이스 내부에서 해당 이벤트가 선언되어야 함. 따라서 `BaseComponent`도 아래와 같이 수정한다.

`src/components/component.ts`

```tsx
export interface Component {
  // ...
  registerEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any
  ): void;
}

export class BaseComponent<T extends HTMLElement> implements Component {
  // ..

  // The same signature as the HTMLElement.addEventListener method
  registerEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any
  ): void {
    this.element.addEventListener(type, listener);
  }
}
```

위와 같이 수정하면 아래와 같이 PageItemComponent를 데코레이터로 적용하여 간단히 구현할 수 있다.

`src/components/page/page.ts`

```tsx
// @Decorator 추가
@EnableDragging
@EnableHover
export class PageItemComponent
  extends BaseComponent<HTMLLIElement>
  implements SectionContainer
{
  private closeListener?: OnCloseListener | undefined;
  private dragStateListener?: OnDragStateListener<PageItemComponent>;
  constructor() {
    super(`<li draggable="true" class="page-item">
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

  // ..
}
```

그렇다면 PageComponent의 dragover, drop 이벤트도 줄일 수 있을 것 같다.

```tsx
import { Component } from './../components/component';

/**
 * Set of callbacks that a component needs to implement to receive drops of dragged items
 */
export interface Droppable {
  // Method that takes care of what happens when a draggable item is hovered over the host widget
  onDragOver(event: DragEvent): void;
  //   Method that handles the dropping of a draggable item
  onDrop(event: DragEvent): void;
}

type DropTargetClass = GConstructor<Component & Droppable>;

export function EnableDrop<TBase extends DropTargetClass>(Base: TBase) {
  return class DropArea extends Base {
    constructor(...args: any[]) {
      super(...args);
      this.registerEventListener('dragover', (event: DragEvent) => {
        event.preventDefault();
        this.onDragOver(event);
      });
      this.registerEventListener('drop', (event: DragEvent) => {
        event.preventDefault();
        this.onDrop(event);
      });
    }
  };
}
```

`src/components/page/page.ts`

```tsx
// @Decorator 추가
@EnableDrop
export class PageComponent
  extends BaseComponent<HTMLUListElement>
  implements Composable
{
  private children = new Set<SectionContainer>();
  private dropTarget?: SectionContainer;
  private dragTarget?: SectionContainer;

  constructor(private pageItemConstructor: SectionContainerConstructor) {
    super('<ul class="page"></ul>'); // 단순 상속만 추가
    // drag and drop
    // this.element.addEventListener('dragover', (event: DragEvent) => {
    //   this.onDragOver(event);
    // });
    // this.element.addEventListener('drop', (event: DragEvent) => {
    //   this.onDrop(event);
    // });
  }
}
```

EnableDrop이라는 데코레이터를 추가함에 따라 생성자 함수 실행 시 로직을 간편하게 줄일 수 있게 됨.

데코레이터라는 간단한 어노테이션을 사용하면 클래스를 사용하는 곳마다 일일히 이벤트 리스너를 등록할 필요없이 데코레이터 안에서 각 이벤트 리스너를 등록하는 로직을 넣어 감싸주면, 실제 실행되는 이벤트에만 집중하도록 구조를 개선할 수 있게됨

**PageItemComponent**

- **Hoverable** (호버가 가능한, 무언가 올라올 수 있는) 인터페이스
- **Draggable** (드래깅이 가능한) 인터페이스

⇒ PageItem은 드래깅이 가능하고, 다른 것이 그 위로 올라올 수 있음을 의미함

**PageComponent**

- **Droppable** (무언가 떨어트릴 수 있는) 인터페이스

⇒ PageComponent는 드래깅 하는 어떤 아이템을 Page 안에 떨어트리는걸 처리할 수 있음을 의미함

### 유용한 라이브러리 사이트

https://sortablejs.github.io/Sortable/

https://github.com/haltu/muuri

https://codepen.io/retrofuturistic/pen/tlbHE

https://github.com/atlassian/react-beautiful-dnd
