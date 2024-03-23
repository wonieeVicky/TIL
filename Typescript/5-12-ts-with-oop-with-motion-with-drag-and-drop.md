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
