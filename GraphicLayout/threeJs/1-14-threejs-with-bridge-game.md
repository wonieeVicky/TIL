## 징검다리 게임 구현

### 기본 장면 구성

이번 예제에서는 기존과는 조금 다른 방식으로 작업해본다.
Scene, Camera를 공통 모듈로 만든 뒤 거기에 넣고 사용하려함

`src/common.js`

```jsx
import { Scene } from "three";

// 공통 객체 정의
export const cm1 = {
  canvas: document.querySelector("#three-canvas"),
  scene: new Scene()
};

// 커스텀 데이터 정의
export const cm2 = {
  backgroundColor: "#3e1322"
};
```

`src/main.js`

```jsx
// ..
import { cm1, cm2 } from "./common";

// ----- 주제: The Bridge 게임 만들기

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: cm1.canvas, // cm1 적용
  antialias: true
});
// ..

// scene
cm1.scene.background = new THREE.Color(cm2.backgroundColor); // cm1, cm2 적용

// Camera..
cm1.scene.add(camera); // cm1 적용

// Light..
cm1.scene.add(directionalLight); // cm1 적용

// Controls

// Mesh..
cm1.scene.add(mesh); // cm1 적용

// ..
```

위와 같이 기존 소스에 정의한 데이터를 적용하여 기본 장면을 구성하였다.
