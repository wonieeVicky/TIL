## 여러 개의 Scene 동시에 사용하기

### 다중 장면, 다중 캔버스 만들기

![이런 HTML 구조가 있다고 했을 때..](../../img/230607-1.png)

여러 개의 캔버스가 위와 같은 사각형 내에 각각 들어간다고 상상해보자 어떻게 만들 수 있을까?
언뜻 보기에는 3개의 canvas 위에 three.js를 입히면 되지않을까? 싶지만 각 캔버스마다 자원을 공유할 수 없어서 3개의 별도 three.js가 굴러가게 된다. 즉 엄청 무거워진다. 비효율적.. 따라서 여러 개를 사용하면서 효율적인 방법을 찾아야 한다.

한 판에 여러 개의 Three.js 즉, 여러 개의 Scene을 넣어보자. ([다중 캔버스, 다중 장면 만들기](https://threejs.org/manual/#en/multiple-scenes) 참고)
우리가 사용할 방법은 html 엘리먼트로 위치와 크기를 잡아 놓은 뒤 하나의 canvas에 해당하는 위치와 크기를 이용해 영역을 지정해서 해당하는 영역만 렌더링 시켜주는 방법이다. 각각의 조명과 mesh들을 가지고 있겠지만, 하나의 renderer를 사용할 수 있게 되고, 자원을 공유할 수 있게되어서 효율적이라고 할 수 있음

![비치는 사각형 영역만 렌더링..](../../img/230607-2.png)

multicanvas 프로젝트 환경 세팅을 마친 뒤 초기 코드는 아래와 같다.

`multicanvas/src/index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>three.js</title>
    <link rel="stylesheet" href="./main.css" />
  </head>
  <body>
    <canvas id="three-canvas"></canvas>
    <ul class="view-list">
      <li class="view-item">
        <div class="canvas-placeholder a"></div>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nisi, neque.</p>
      </li>
      <li class="view-item">
        <div class="canvas-placeholder b"></div>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nisi, neque.</p>
      </li>
      <li class="view-item">
        <div class="canvas-placeholder c"></div>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nisi, neque.</p>
      </li>
    </ul>
  </body>
</html>
```

`multicanvas/src/main.js`

```jsx
import * as THREE from "three";

// ----- 주제: 여러개의 캔버스 사용하기

// Renderer
const canvas = document.querySelector("#three-canvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

// 그리기
const clock = new THREE.Clock();

function draw() {
  const delta = clock.getDelta();

  renderer.render(scene, camera);
  renderer.setAnimationLoop(draw);
}

function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}

// 이벤트
window.addEventListener("resize", setSize);

draw();
```

위 코드는 scene, light, mesh 등이 설정되어있지 않은 상태이다.
우선 위 이미지의 배치를 위해 css 부터 추가해보고자 한다.

`src/main.css`

```css
body {
  margin: 0;
}

li {
  list-style: none;
}

#three-canvas {
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1; /* canvas는 html보다 뒤에 있어야 하므로 */
  background: gray; /* canvas 확인을 위해 색깔 추가 */
}

.view-item {
  display: flex;
  margin: 30px;
}

.view-item:nth-child(even) .canvas-placeholder {
  order: 2;
}

.canvas-placeholder {
  width: 300px;
  height: 200px;
  margin-right: 30px;
  border: 1px solid black;
}
```

이제 스크립트를 본격적으로 작성해본다. 위 main.js에서 renderer는 한개만 쓰지만 들어갈 박스마다 scene은 각각 생성할 것이다. 이를 공통 모듈로 만들어보고자 함

scene을 따로 만든다는 것은 각 scene마다 카메라도 각각 배치되어야 하므로 setSize 안에 존재하는 camera 설정도 삭제해준다. 즉, setSize 에는 `renderer.setSize(window.innerWidth, window.innerHeight)`만 존재하게됨. draw 함수의 camera 설정도 제거해준다.

`/src/main.js`

```jsx
// ..

function draw() {
  const delta = clock.getDelta();

  // renderer.render(scene, camera);
  renderer.setAnimationLoop(draw);
}

function setSize() {
  // camera.aspect = window.innerWidth / window.innerHeight;
  // camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.render(scene, camera);
}
```

이제 정말 각 scene을 CreateScene이라는 클래스 모듈로 구현해본다.
먼저 해당 클래스에 어떤 값이 들어가야할까 고민해보면 아래와 같다.

`src/main.js`

```jsx
import { CreateScene } from "./CreateScene";

// Renderer..
const scene1 = new CreateScene({
  renderer,
  bgColor: "pink",
  placeholder: ".canvas-placeholder.a"
});

// ...
```

위와 같이 renderer는 기본적으로 포함, scene과 camera 생성에 필요한 최소한의 것을 넣었다.
placeholder를 넣은 것은 camera 설정 시 해당 엘리먼트에 대한 width, height 값을 가져오기 위해 엘리먼트의 클래스 값을 직접 주입함..

`src/CreateScene.js`

```jsx
import { Color, PerspectiveCamera, Scene } from "three";

export class CreateScene {
  constructor(info) {
    this.renderer = info.renderer;
    this.el = document.querySelector(info.placeholder);
    const rect = this.el.getBoundingClientRect(); // DOMRect {x: 8, y: 8, width: 784, …}

    const bgColor = info.bgColor || "white";
    const fov = info.fov || 75; // field of view
    const aspect = rect.width / rect.height;
    const near = info.near || 0.1;
    const far = info.far || 100;
    const cameraPosition = info.cameraPosition || { x: 0, y: 0, z: 3 };

    // Scene
    this.scene = new Scene();
    this.scene.background = new Color(bgColor);

    // Camera
    this.camera = new PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);

    this.scene.add(this.camera);
  }
}
```

위 기본 내용을 통해 CreateScene에서 Scene과 Camera를 직접 생성해보았다.
위에서 참고할 사항은 element를 placeholder 값으로 가져와서 getBoundingClientRect 메서드로 필요한 데이터를 가져다 쓰는 부분과, camera 설정 시 fov, aspect, near, far 설정하는 부분에 주목한다.

![getBoundingClientRect 메서드로 위의 값들을 가져올 수 있다.](../../img/230610-1.png)
