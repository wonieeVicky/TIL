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
