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

### 조명 설치

다음으로는 조명 설치를 해본다. 만들 징검다리 UI를 보면 아래와 같음

![](../../img/230520-1.png)

빛이 4군데에서 비춰지고 있다는 것을 알 수 있다. spotLight를 네 귀퉁이에서 가운데로 쏴서 구현
현재는 이러하다.

![](../../img/230520-2.png)

`src/common.js`

```jsx
// ..

export const cm2 = {
  backgroundColor: "#3e1322",
  lightColor: "#ffe9ac" // lightColor 추가
};
```

`src/main.js`

```jsx
// ..
import { cm1, cm2 } from "./common";

// Renderer ..
renderer.shadowMap.enabled = true; // 그림자 속성 추가
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 그림자를 부드럽게 보이게 함

// scene, Camera..

// Light..
const ambientLight = new THREE.AmbientLight(cm2.lightColor, 0.8);
cm1.scene.add(ambientLight);

const spotLightDistance = 50;
const spotLight1 = new THREE.SpotLight(cm2.lightColor, 1);
spotLight1.castShadow = true; // 그림자
const spotLight2 = spotLight1.clone(); // spotLight1을 복제
const spotLight3 = spotLight1.clone(); // spotLight1을 복제
const spotLight4 = spotLight1.clone(); // spotLight1을 복제

spotLight1.position.set(-spotLightDistance, spotLightDistance, spotLightDistance);
spotLight2.position.set(spotLightDistance, spotLightDistance, spotLightDistance);
spotLight3.position.set(-spotLightDistance, spotLightDistance, -spotLightDistance);
spotLight4.position.set(spotLightDistance, spotLightDistance, -spotLightDistance);

cm1.scene.add(spotLight1, spotLight2, spotLight3, spotLight4);

// Controls, Mesh..
```

위와 같이 spotLight를 4군데에서 동일한 거리 간격으로 쏴주도록 구현함

![](../../img/230520-3.png)

한층 밝아졌다. 바닥을 두고 화면 확장을 하면 더 확실히 빛의 영향을 확인할 수 있음
