## 실전 사이드 프로젝트 만들어보기

**디자인 영감 Dribble**: https://dribbble.com/shots/14931899-TIGERS

**백그라운드 이미지 만드는 사이트**: https://coolbackgrounds.io/

**프로젝트 전반적으로 쓰인 모든 색상 코드들:**

```
:root {
  --bg-main-color: #00000080;
  --bg-accent-color: #2d2d2d;
  --accent-color: #f64435;
  --text-accent-color: #ffe498;
  --text-edit-bg-color: #575757;
  --border-color: #3f3f3f;
  --shadow-color: #202020;
  --document-bg-color: #68686850;
  --component-bg-gradient: radial-gradient(circle, #646464e6 0%, #363636e6 100%);
  --smokywhite: #dddbd8;
  --black: #000000;
  --translucent-black: #00000099;
}
```

**랜덤 이미지 사이트**: https://picsum.photos/

### 프로젝트 계획을 세우는 테크닉

MoSCoW 방식 (Must have: 있어야 함, Should have: 가져야 함, Could have: 가질 수 있음, Won’t have: 갖지 않음)

1. What are the features
   1. 기능 단위 나열
      1. 필수(must have)
      2. 있으면 좋은(good to have)
      3. 있으면 바람직한(nice to have)
2. What is the roadmap?
   1. 마일스톤별 개발 → 단계별로 프로덕트로 배포 가능한 수준이어야 함

### Project Plan

- **나의 프로젝트 계획**
- https://www.justinmind.com/blog/user-story-examples/
  - **프로젝트 기능들**
    - feature 1
    - feature 2
  - **구현 계획**
    - 첫번째 MS 1 (Must Have)
      - feature 1
      - feature 2
      - ...
    - 두번째 MS 2 (Good to have)
    - 세번째 MS 3 (Nice to have)
  - **어려웠던 부분/ 완성하지 못한 기능들**
    - ...

![alt text](../img/240210-1.png)

- must have
  - As a user, I want to add an image
  - As a user, I want to add youtube video
  - As a user, I want to add a note
  - As a user, I want to add todo list
  - As a user, I want to add delete sections
- good to have
  - As a user, I want to reorder sections by dragging
- nice to have
  - As a user, I want to update sections

### Project Structure

![Interactions 구조](240210-2.png)

- header
- document
- footer

### 프로젝트 환경 설정

`tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "es6" /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', or 'ESNEXT'. */,
    "module": "ES2015" /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */,
    "outDir": "./dist" /* Redirect output structure to the directory. */,
    "rootDir": "./src" /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */,
    "removeComments": true /* Do not emit comments to output. */,
    "noEmitOnError": true /* Do not emit outputs if any errors were reported. */,

    /* Strict Type-Checking Options */
    "strict": true /* Enable all strict type-checking options. */,

    /* Additional Checks */
    "noUnusedLocals": true /* Report errors on unused locals. */,
    "noUnusedParameters": true /* Report errors on unused parameters. */,
    "noImplicitReturns": true /* Report error when not all code paths in function return a value. */,
    "noFallthroughCasesInSwitch": true /* Report errors for fallthrough cases in switch statement. */,
    "noUncheckedIndexedAccess": true /* Include 'undefined' in index signature results */,

    /* Module Resolution Options */
    "esModuleInterop": true /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */,

    /* Advanced Options */
    "skipLibCheck": true /* Skip type checking of declaration files. */,
    "forceConsistentCasingInFileNames": true /* Disallow inconsistently-cased references to the same file. */
  }
}
```

### 프로젝트 구현 플랜

전반적 전략과 흐름

- App
  - App 클래스는 상태를 가지고 있고, 상태를 변화시킬 수 있는 함수로 묶여져 있음
  - header, footer, document로 나뉜다.
  - document ⇒ PageComponent 클래스
    - ImageComponent, NoteComponent, VideoComponent, TodoComponent
- 컴포넌트의 캡슐화, 추상화, 상속, 유연한 확장성을 고려한다.

### Code Refactoring

아래 리팩토링 내용. 복기 필요

- 개선 전
  `./src/app.ts`

  ```tsx
  import { ImageComponent } from './components/page/item/image.js';
  import { PageComponent } from './components/page/page.js';

  class App {
    private readonly page: PageComponent;
    constructor(appRoot: HTMLElement) {
      this.page = new PageComponent();
      this.page.attachTo(appRoot);

      const image = new ImageComponent(
        'Image Title',
        'https://picsum.photos/600/300'
      );
      image.attachTo(appRoot, 'beforeend');
    }
  }

  new App(document.querySelector('.document')! as HTMLElement);
  ```

  `./src/components/page/page.ts`

  ```tsx
  /**
   * PageComponent
   * - PageComponent는 HTMLUListElement를 상속받아 만들어진 커스텀 엘리먼트이다.
   * - PageComponent는 생성자를 통해 생성된 HTMLUListElement를 가지고 있다.
   * - attachTo 메서드를 통해 부모 엘리먼트에 자신의 엘리먼트를 추가할 수 있다.
   */
  export class PageComponent {
    private element: HTMLUListElement;

    constructor() {
      this.element = document.createElement('ul');
      this.element.setAttribute('class', 'page');
      this.element.textContent = 'This is PageComponent';
    }

    // type InsertPosition = "afterbegin" | "afterend" | "beforebegin" | "beforeend";
    attachTo(parent: HTMLElement, position: InsertPosition = 'afterbegin') {
      parent.insertAdjacentElement(position, this.element);
    }
  }
  ```

  `./src/components/page/item/image.ts`

  ```tsx
  /**
   * ImageComponent
   */
  export class ImageComponent {
    private element: HTMLElement;

    constructor(readonly title: string, readonly url: string) {
      const template = document.createElement('template');
      template.innerHTML = `
        <section class="image">
          <div class="image__holder">
            <img class="image__thumbnail" />
          </div>
          <p class="image__title"></p>
        </section>`;

      // template.innerHTML로 데이터를 바로 주입하지 않고 필요한 부분만 아래처럼 업데이트 해준다.
      this.element = template.content.firstElementChild! as HTMLElement;
      const imageElement = this.element.querySelector(
        '.image__thumbnail'
      )! as HTMLImageElement;
      imageElement.src = url;
      imageElement.alt = title;

      const titleElement = this.element.querySelector(
        '.image__title'
      )! as HTMLParagraphElement;
      titleElement.textContent = title;
    }

    attachTo(parent: HTMLElement, position: InsertPosition = 'afterbegin') {
      parent.insertAdjacentElement(position, this.element);
    }
  }
  ```

- 개선 후
  위 PageComponent와 ImageComponent에 존재하는 중복 코드. 캡슐화가 필요하다.
  `./src/app.ts` 동일
  `./src/components/component.ts` 공통 로직을 다루는 캡슐화된 기본 BaseComponent 클래스 생성

  ```tsx
  export interface Component {
    // element를 interface에 추가하지 않는 이유 ?
    // - element는 BaseComponent 클래스 내부에서만 사용되기 때문. 외부에서 사용할 필요가 없으므로 알 필요가 없다.
    attachTo(parent: HTMLElement, position?: InsertPosition): void;
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
  }
  ```

  `./src/components/page/page.ts`

  ```tsx
  import { BaseComponent } from '../component.js';

  export class PageComponent extends BaseComponent<HTMLUListElement> {
    constructor() {
      super('<ul class="page">This is PageComponent</ul>');
    }
  }
  ```

  `./src/components/page/item/image.ts`

  ```tsx
  import { BaseComponent } from '../../component.js';

  /**
   * ImageComponent
   */
  export class ImageComponent extends BaseComponent<HTMLElement> {
    constructor(readonly title: string, readonly url: string) {
      super(`
        <section class="image">
          <div class="image__holder">
            <img class="image__thumbnail" />
          </div>
          <p class="image__title"></p>
        </section>`);

      const imageElement = this.element.querySelector(
        '.image__thumbnail'
      )! as HTMLImageElement;
      imageElement.src = url;
      imageElement.alt = title;

      const titleElement = this.element.querySelector(
        '.image__title'
      )! as HTMLParagraphElement;
      titleElement.textContent = title;
    }
  }
  ```

  🪄 BaseComponent의 Generic Type, Interface 정의 복기 필요
