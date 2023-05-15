## 스크롤 기반의 3D 랜딩 페이지 구현

# 예제 - 스크롤 기반의 3D 랜딩 페이지

스크롤에 따라 3D 애니메이션이 구현되는 예제를 만들어본다.

### 기본 구조 잡기

우선 아래의 기본 구조에서 시작해본다.

`scroll_page/src/main.js`

```jsx
import * as THREE from "three";

// ----- 주제: 스크롤에 따라 움직이는 3D 페이지

// Renderer
const canvas = document.querySelector("#three-canvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 1.5;
camera.position.z = 4;
scene.add(camera);

// Light
const ambientLight = new THREE.AmbientLight("white", 0.5);
scene.add(ambientLight);

// Light ..
// Mesh ..

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

우선 Light는 기존 DirectionalLight를 사용하지 않고 spotLight를 적용한다.

```jsx
// Renderer, Scene, Camera, Light
const ambientLight = new THREE.AmbientLight("white", 0.5);
scene.add(ambientLight);

// spot Light 추가
const spotLight = new THREE.SpotLight("white", 0.7);
spotLight.position.set(0, 150, 100);
spotLight.castShadow = true; // 그림자 효과
spotLight.shadow.mapSize.width = 1024; // 그림자의 Quality
spotLight.shadow.mapSize.height = 1024; // 그림자의 Quality
spotLight.shadow.camera.near = 1; // 그림자를 찍을 카메라의 Near
spotLight.shadow.camera.far = 200; // 그림자를 찍을 카메라의 Far
scene.add(spotLight);

// Mesh ..
```

다음으로는 Mesh를 그려주는데, 땅 위에 집이 있는 구조이므로 땅을 먼저 그려주면 아래와 같음.

```jsx
// Renderer, Scene..
const scene = new THREE.Scene();
scene.background = new THREE.Color("white"); // background Scene 추가

// Camera, Light, SpotLight..

// Mesh
const floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshStandardMaterial({ color: "white" }));
floorMesh.rotation.x = -Math.PI / 2;
scene.add(floorMesh);
```

위와 같이 추가해주면 바닥면과 하얀색 하늘이 표현됨. 바닥을 굳이 넣는 이유는 그림자 표현을 위해서이다.
이제 스크롤에 따라 보여줄 html을 추가해준다.

`src/index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="./main.css" />
  </head>

  <body>
    <canvas id="three-canvas"></canvas>
    <div class="sections">
      <section class="section">
        <h2>01</h2>
      </section>
      <section class="section">
        <h2>02</h2>
      </section>
      <section class="section">
        <h2>03</h2>
      </section>
      <section class="section">
        <h2>04</h2>
      </section>
      <section class="section">
        <h2>05</h2>
      </section>
    </div>
  </body>
</html>
```

`src/main.css`

```css
body {
  margin: 0;
}

#three-canvas {
  position: fixed;
  left: 0;
  top: 0;
}

.sections {
  position: relative;
  z-index: 1;
}

.section {
  height: 100vh;
  padding: 5rem;
  box-sizing: border-box;
}

.section h2 {
  margin: 0;
  font-size: 7vmin; /* vmin = viewport minimum, 가로, 세로 사이즈 중 작은 값 */
}

.section:nth-child(odd) {
  text-align: right;
}
```

![](../../img/230515-1.gif)
