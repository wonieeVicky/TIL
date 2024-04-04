import {
  EnableDragging,
  EnableHover,
  EnableDrop
} from '../../decorators/draggable.js';
import { Draggable, Hoverable } from '../common/type.js';
import { BaseComponent, Component } from '../component.js';

// Composable 다른 녀석과 조합할 수 있음을 의미함
export interface Composable {
  addChild(child: Component): void;
}

type OnCloseListener = () => void;
type DragState = 'start' | 'stop' | 'enter' | 'leave';
type OnDragStateListener<T extends Component> = (
  target: T,
  state: DragState
) => void;

interface SectionContainer extends Component, Composable, Draggable, Hoverable {
  setOnCloseListener(listener: OnCloseListener): void;
  setOnDragStateListener(listener: OnDragStateListener<SectionContainer>): void;
  muteChildren(state: 'mute' | 'unmute'): void;
  getBoudingRect(): DOMRect;
  onDropped(): void;
}

// 다른 모드의 pageItemcomponent가 생성된다면?
// export class DarkModePageItemComponent extends BaseComponent<HTMLLIElement> implements SectionContainer { ... }

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

  onDragStart(_: DragEvent) {
    this.notifyDragObservers('start');
    this.element.classList.add('lifted');
  }
  onDragEnd(_: DragEvent) {
    this.notifyDragObservers('stop');
    this.element.classList.remove('lifted');
  }
  onDragEnter(_: DragEvent) {
    this.notifyDragObservers('enter');
    this.element.classList.add('drop-area');
  }
  onDragLeave(_: DragEvent) {
    this.notifyDragObservers('leave');
    this.element.classList.remove('drop-area');
  }

  notifyDragObservers(state: DragState) {
    this.dragStateListener && this.dragStateListener(this, state);
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
  setOnDragStateListener(listener: OnDragStateListener<PageItemComponent>) {
    this.dragStateListener = listener;
  }
  muteChildren(state: 'mute' | 'unmute'): void {
    if (state === 'mute') {
      this.element.classList.add('mute-children');
    } else {
      this.element.classList.remove('mute-children');
    }
  }
  getBoudingRect(): DOMRect {
    return this.element.getBoundingClientRect();
  }
  onDropped() {
    this.element.classList.remove('drop-area');
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

@EnableDrop
export class PageComponent
  extends BaseComponent<HTMLUListElement>
  implements Composable
{
  private children = new Set<SectionContainer>();
  private dropTarget?: SectionContainer;
  private dragTarget?: SectionContainer;

  constructor(private pageItemConstructor: SectionContainerConstructor) {
    super('<ul class="page"></ul>');
    // drag and drop
    // this.element.addEventListener('dragover', (event: DragEvent) => {
    //   this.onDragOver(event);
    // });
    // this.element.addEventListener('drop', (event: DragEvent) => {
    //   this.onDrop(event);
    // });
  }
  // dragover, drop event는 prevent default를 해줘야 한다.
  onDragOver(event: DragEvent) {
    // event.preventDefault();
  }
  onDrop(event: DragEvent) {
    // event.preventDefault();
    // 위치를 바꿔준다.
    if (!this.dropTarget) {
      return;
    }

    if (this.dragTarget && this.dragTarget !== this.dropTarget) {
      const dropY = event.clientY;
      const srcElement = this.dragTarget.getBoudingRect();

      this.dragTarget.removeFrom(this.element);
      this.dropTarget.attach(
        this.dragTarget,
        dropY < srcElement.y ? 'beforebegin' : 'afterend'
      );
    }
    this.dropTarget.onDropped();
  }
  addChild(section: Component) {
    // PageComponent는 PageItemComponent만 생성. PageComponent를 재사용하면서 원하는 컴포넌트를 생성하도록 리팩토링
    const item = new this.pageItemConstructor();
    item.addChild(section);
    item.attachTo(this.element, 'beforeend'); // 마지막에 붙인다.
    item.setOnCloseListener(() => {
      item.removeFrom(this.element);
      this.children.delete(item);
    });
    this.children.add(item);
    item.setOnDragStateListener(
      (target: SectionContainer, state: DragState) => {
        switch (state) {
          // update dragTarget
          case 'start':
            this.dragTarget = target;
            this.updateSections('mute');
            break;
          // update dragTarget
          case 'stop':
            this.dragTarget = undefined;
            this.updateSections('unmute');
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
      }
    );
  }

  private updateSections(state: 'mute' | 'unmute') {
    this.children.forEach((section: SectionContainer) => {
      section.muteChildren(state);
    });
  }
}
