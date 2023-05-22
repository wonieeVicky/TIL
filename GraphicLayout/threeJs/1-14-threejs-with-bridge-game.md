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

### 무대 설치1

다음에는 기둥 다리 등의 무대를 설치해본다. 먼저 기둥 다리의 각도를 아래와 같이 설정해준다. 위에서 바라보도록 각도 조정

`src/main.js`

```jsx
// ..
import { cm1, cm2 } from "./common";

// Renderer, scene ..
// Camera..
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = -4;
camera.position.y = 19;
camera.position.z = 14;
cm1.scene.add(camera);

// Light, Controls
```

기존 Mesh 코드를 모두 삭제한 뒤 바닥, 기둥까지 모듈로 생성하여 추가해본다.
아래와 같이 동일한 메쉬로 사용될 것은 클래스를 상속받아 처리하도록 할 수 있다.

`src/Stuff.js`

```jsx
// Stuff.js는 물체를 생성하는 클래스임
// 물체를 생성하는 클래스를 따로 만들어서 사용하는 이유는 물체를 생성하는 코드를 따로 모아서 관리하기 위함
// 물체를 생성하는 코드를 따로 모아서 관리하면 물체를 생성하는 코드를 재사용하기 쉬움

export class Stuff {
  constructor(info = {}) {
    this.name = info.name || "";
    this.x = info.x || 0;
    this.y = info.y || 0;
    this.z = info.z || 0;

    this.rotationY = info.rotationY || 0;
    this.rotationX = info.rotationX || 0;
    this.rotationZ = info.rotationZ || 0;
  }
}
```

일단 기본적인 물체를 생성하는 클래스 개념으로 Stuff 객체를 위와 같이 생성한다.
그리고 pillar(기둥)과 floor(바닥)에 사용할 geometry, material 요소들을 common.js 안에 추가해줌

`src/common.js`

```jsx
import { BoxGeometry, MeshPhongMaterial, Scene } from "three";

// ..

export const cm2 = {
  backgroundColor: "#3e1322",
  lightColor: "#ffe9ac",
  pillarColor: "#071d28", // add
  floorColor: "#111" // add
};

export const geo = {
  pillar: new BoxGeometry(5, 10, 5),
  floor: new BoxGeometry(200, 1, 200)
};

export const mat = {
  pillar: new MeshPhongMaterial({ color: cm2.pillarColor }),
  floor: new MeshPhongMaterial({ color: cm2.floorColor })
};
```

위와 같이 하나의 데이터 안에서 관리되도독 하면 유지보수에 편리함

`src/Pillar.js`

```jsx
import { Mesh } from "three";
import { Stuff } from "./Stuff";
import { cm1, geo, mat } from "./common";

export class Pillar extends Stuff {
  constructor(info) {
    super(info);

    this.geometry = geo.pillar;
    this.material = mat.pillar;

    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.set(this.x, this.y, this.z);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    cm1.scene.add(this.mesh);
  }
}
```

`src/Floor.js`

```jsx
import { Mesh } from "three";
import { Stuff } from "./Stuff";
import { cm1, geo, mat } from "./common";

export class Floor extends Stuff {
  constructor(info) {
    super(info);

    this.geometry = geo.floor;
    this.material = mat.floor;

    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.set(this.x, this.y, this.z);

    this.mesh.receiveShadow = true; //castShadow는 필요없음

    cm1.scene.add(this.mesh);
  }
}
```

위와 같이 입맛대로 클래스를 구현해 준 다음 실제 위 클래스 객체들을 main.js에서 아래와 같이 사용함

`src/main.js`

```jsx
// ..
import { cm1, cm2 } from "./common";
import { Pillar } from "./Pillar";
import { Floor } from "./Floor";

// Renderer, scene, Camera, Light, Controls

// 물체 만들기
const glassUnitSize = 1.2; // 유리칸의 사이즈

// 기둥
const pillar1 = new Pillar({
  name: "pillar",
  x: 0,
  y: 5.5, // pillar의 높이가 10이라서 절반으로 조정
  z: -glassUnitSize * 12 - glassUnitSize / 2 // 1.2는 다리의 유리칸 하나의 사이즈, 12는 다리의 유리칸 개수, 0.6은 다리의 유리칸 사이의 간격
});

const pillar2 = new Pillar({
  name: "pillar",
  x: 0,
  y: 5.5,
  z: glassUnitSize * 12 + glassUnitSize / 2 // 1.2는 다리의 유리칸 하나의 사이즈, 12는 다리의 유리칸 개수, 0.6은 다리의 유리칸 사이의 간격
});

// 바닥
const floor = new Floor({ name: "floor" });
```

위와 같이 기둥 2개 클래스와 바닥면에 대해 객체 데이터를 넣어주면 아래와 같이 정상적으로 노출된다.

![조명에 따른 기둥의 그림자 생성도 잘 됨](../../img/230522-1.gif)
