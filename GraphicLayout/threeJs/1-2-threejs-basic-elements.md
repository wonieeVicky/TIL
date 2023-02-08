## three.js 기본 요소

### 기본 장면 구성요소 살펴보기

본격적으로 기본 요소에 대해 살펴본다.

![](../../img/230203-1.png)

three.js로 구현된 장면을 무대라고 생각해보자. 여기서 무대는 Scene이다.
무대 위에는 아바타가 서있는데 이렇게 무대 위에 올려진 객체들을 Mesh라고 한다.
이 메쉬는 모양 Geometry과 재질 Material로 구성된다.
모양은 전체 형태, 재질은 색깔, 거친 표현 등의 느낌을 나타냄

연극무대를 촬영하는 카메라 Camera는 시야각 Field of view를 가지는데, 어느정도 시야로 보여줄 것인지를 설정하는 부분을 담당한다. (시야각에 따라 사물이 다르게 보이므로), 조명 Light는 재질 Material을 어떻게 사용하느냐에 따라 필요/불필요가 결정되어진다.

이러한 위의 모든 내용을 화면으로 보여주는 것은 렌더러 Renderer가 담당한다.

위 무대는 3차원이므로 축의 방향이 매우 중요하다. x, y, z축을 다룰 수 있는데,
x축은 객체를 기준으로 좌(-)-우(+)를 의미한다. y 축은 위(+)-아래(-)를 의미한다. z 축은 앞(+)-뒤(-)를 의미

### 기본 장면 만들기 - Renderer

위 그림에서 살펴본 걸 코드로 직접 구현해본다.
가장 먼저 이전 시간 webpack 설정을 토대로 기본 three 프로젝트 환경을 구성해 줌

```bash
> npm i -D @babel/cli @babel/core @babel/preset-env babel-loader clean-webpack-plugin copy-webpack-plugin core-js cross-env html-webpack-plugin source-map-loader terser-webpack-plugin webpack webpack-cli webpack-dev-server
> npm i three
> npm start
> npm run build
```

src 하위에 `index.html`, `main.css`, `main.js`를 모두 생성 후 데브 서버가 정상 동작함을 기준으로 한다.
이제 main.js에 three.js를 import 해서 하나씩 테스트할 일만 남았다.

가장 먼저 화면에 그림을 그려주는 렌더러Renderer를 만들어본다.

`./src/main.js`

```jsx
import * as THREE from "three";

// 동적으로 캔버스 조립하기
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); // renderer.domElement는 캔버스를 의미
```

위와 같이 기본적인 렌더러를 생성 후 body에 복붙해주는 코드를 넣으면 아래와 같이 화면에 반영된다.

![](../../img/230204-1.png)

canvas가 body 에 그려짐. 위 코드에서 `renderer.domElement`는 캔버스를 의미한다.

위 방법은 js 파일에서 직접 canvas를 생성해서 붙여주는 방법으로 구현했는데, canvas를 html 내에 위치시켜놓고 필요한 엘리먼트를 가져와서 렌더링하는 방식도 있음. 어떻게 하느냐 모두 장단점이 있는데 canvas를 html 상에 미리 만들어놓고 사용하는 방식으로 주로 진행함

`src/index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- ... -->
    <link rel="stylesheet" href="./main.css" />
  </head>

  <body>
    <canvas id="three-canvas"></canvas>
  </body>
</html>
```

`src/main.css`

```css
/* ... */
#three-canvas {
  position: absolute;
  left: 0;
  top: 0;
}
```

`src/main.js`

```jsx
import * as THREE from "three";

// html에서 캔버스 가져와서 사용하기
const canvas = document.querySelector("#three-canvas");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
```

위와 같이 코드를 넣어주면 위 동적 캔버스 조립 코드와 같은 결과를 확인할 수 있다.

### 기본장면 만들기 - Camera

이제 Scene을 만들자. Scene은 전체 요소들이 포함되는 공간을 의미함

`src/main.js`

```jsx
import * as THREE from "three";

// ..
// scene 생성
const scene = new THREE.Scene();
```

간단하게 위와 같이 만들면 끝. 다음으로 Camera를 만들어본다.
카메라는 여러 종류가 있는데 대표적으로 2가지를 많이 쓴다. 그 중 원근 카메라 PerspectiveCamera라는 가장 간단한 카메라를 사용해본다. (3D 장면 렌더링 시 가장 널리 쓰이는 투영모드임

자세한 사항은 [문서](https://threejs.org/docs/index.html?q=camera#api/ko/cameras/PerspectiveCamera)에서 확인해볼 수 있으며 생성자는 아래와 같다. 매개변수 자리에 4가지의 인자가 들어감.

**PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )**

`fov` — 카메라 절두체 수직 시야. 아래 그림의 시야각Field of View을 의미
`aspect` — 카메라 절두체 종횡비. 가로, 세로 화면 비율
`near` — 카메라 절두체 근평면. 얼마나 가까우면 안보이게 할 것인가?
`far` — 카메라 절두체 원평면. 얼마나 멀면 안보이게 할 것인가?

![](../../img/230205-1.png)

위 그림에 카메라와 가장 가까운 똥은 near보다 더 앞에 있으므로 화면에 담기지 않고, 가장 마지막에 있는 똥도 far 보다 더 멀리 있으므로 화면에 담기지 않음.. mesh가 near와 far 사이에 있고 시야각(feld of view)안에 들어와야 보인다는 컨셉! 이해하자

`src/main.js`

```jsx
import * as THREE from "three";

// ..
// camera 생성 - PerspectiveCamera(시야각fov, 종횡비aspect, near, far)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// 무대에 올리기
scene.add(camera);
```

위와 같이 카메라를 scene에 붙였다. 여기서 camera를 scene에 붙이기만 했을 뿐 위치 설정을 하지 않았는데,
위치 설정을 안했을 때에는 기본 값 x=0, y=0, z=0으로 설정되어 있다.

따라서, 이 상태에 있으면 물체도 0, 0, 0 좌표에, 카메라도 0, 0, 0 좌표에 존재하므로 아무것도 보이지 않음
그래서 보통 카메라를 약간 뒤로 빼주어서 (z축으로) 물체가 보이도록 해준다.

```jsx
// ..
// 추가! 카메라를 뒤로..
camera.position.z = 5;

// 무대에 올리기
scene.add(camera);
```

위에서 5라는 숫자는 사물의 크기에 비례해서 작업자가 설정한 값이다.
만약 카메라의 위치를 물체로 부터 5미터 뒤라고 했을 때 사람의 크기는 1.8미터라고 가정한다면 우리가 상상하는 사람을 바라보는 기준이 될 것임.. 이처럼 비율에 근거해서 가정하는 값

### 기본 장면 만들기 - Mesh

다음에는 물체를 만들어본다. mesh는 무대 위에 올려져있는 객체 하나하나를 의미한다.
Geometry모양과 Material재질을 조합함

`src/main.js`

```jsx
// Mesh 설정 - Geometry + Material
const geometry = new THREE.BoxGeometry(1, 1, 1); // 1 * 1 * 1 정육면체 생성
const material = new THREE.MeshBasicMaterial({
  // color: 0x00ff00,
  // color: "#00ff00",
  color: "green",
}); // 재질에 대한 속성을 객체에 설정함. 위와 같이 다양한 방법으로 넣을 수 있다.

// Mesh 생성
const mesh = new THREE.Mesh(geometry, material);
// 무대에 올리기
scene.add(mesh);
```

위 BoxGeometry, MeshBasicMaterial 는 모양과 재질을 표현하는 가장 기본적인 메서드임
각 모양과 재질을 따로 설정해준 뒤 Mesh를 생성해서 Scene에 연결시키는 개념

위와 같이 설정하여도 화면에는 아무것도 보이지 않는다. 바로 Renderer가 해당 코드를 렌더링시키지 않았기 때문
따라서 아래와 같이 렌더러에게 연결시켜준다.

`src/main.js`

```jsx
// ..

// 그리기
renderer.render(scene, camera);
```

앞서 설정한 scene과 camera를 연결시켜주는 개념임. 그러면 화면에 아래와 같이 보인다.

![](../../img/230205-2.png)

직육면체를 만들었는데 그냥 2D 네모로만 보인다. 카메라의 위치가 정면을 바라보고 있어서 그렇다.
z 축으로만 뒤로 5 당겨놓음. y 축을 조정해서 위에서 바라보도록, x 축을 조정해서 오른쪽에서 바라보도록 설정해본다.

`src/main.js`

```jsx
// ..
// camera 위치 추가
camera.position.x = 1;
camera.position.y = 2;
camera.position.z = 5;

scene.add(camera);
```

![](../../img/230205-3.png)

위와 같이 보인다 ㅋㅋ 위 내용이 three.js 아주 기본 내용을 조합한 것이다.
매우 단순해 보일 수 있으나 그러하다. 재질 표현에서 사용한 MeshBasicMaterial의 경우 빛Light에 영향을 안받는 메서드이므로, 이 때문에 별도의 조명이 없어도 박스를 확인할 수 있는 것이다.

그런데 자세히보면 물체의 아웃라인이 살짝 깨져보인다.
계단식으로 거칠게 표현됨. 이는 렌더러 설정으로 부드럽게antialiasing 보이도록 설정할 수 있다.

`src/main.js`

```jsx
// ..
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true, // 추가
});

renderer.setSize(window.innerWidth, window.innerHeight);
```

추가적인 연산이 필요하므로 성능저하는 발생할 수 있다. 부드럽게 보이는 것이 필요할 때는 해당 옵션을 추가해서 노출해준다.

### 직교 카메라(Orthographic Camera)

이번에는 직교 카메라를 배워보자. 기존의 원근 카메라PerspectiveCamera 코드는 주석처리 해준다.
우선 이 둘의 차이를 먼저 짚고 넘어가보자

![](../../img/230205-4.png)

PerspectiveCamera는 자연스럽게 사람의 눈으로 보는 것처럼 원근이 적용되어 있다.
반면에 OrthographicCamera는 원근에 따라 물체의 크기가 다르게 표현되지 않는다. 거리에 상관없이 크기가 동일하게 표현

OrthographicCamera 이를 가장 대표적으로 사용하는 케이스가 디아블로나 롤, 룰더스카이 같은 게임들에서 사용한다.
기본적으로 사용하지는 않고 특정 조건에서만 사용하는 카메라라고 볼 수 있다.

OrthographicCamera에 대한 [문서에서 설명](https://threejs.org/docs/index.html?q=camera#api/ko/cameras/OrthographicCamera)도 [렌더링된 이미지에서 객체의 크기는 카메라와의 거리에 관계없이 일정하게 유지된다.] 라고 적혀 있음. 생성자는 아래와 같다.

**OrthographicCamera( left : Number, right : Number, top : Number, bottom : Number, near : Number, far : Number )**

- `left` — 카메라 절두체 좌평면.
- `right` — 카메라 절두체 우평면.
- `top` — 카메라 절두체 상평면.
- `bottom` — 카메라 절두체 하평면.
- `near` — 카메라 절두체 근평면.
- `far` — 카메라 절두체 원평면.

ㅊ

`src/main.js`

```jsx
// camera 생성 - 직교 카메라 OrthographicCamera(left, right, top, bottom, near, far)
const camera = new THREE.OrthographicCamera(
  -(window.innerWidth / window.innerHeight), // left
  window.innerWidth / window.innerHeight, // right
  1, // top
  -1, // bottom
  0.1, // near
  1000
);

// camera 위치 설정
camera.position.x = 1;
camera.position.y = 2;
camera.position.z = 5;

// 카메라가 바라보는 위치 설정 - 큐브 원점을 바라보도록 설정
camera.lookAt(0, 0, 0);

// 무대에 올리기
scene.add(camera);
```

기존 원근카메라와 동일한 조건으로 x, y, z 축의 위치를 설정하면 화면에 물체가 보이지 않는다.
카메라가 너무 위에서 바라보고 있기 때문인데, 이를 큐브 원점(0, 0, 0)을 바라보도록 lookAt 메서드를 이용해 설정해준다.

![](../../img/230205-6.png)

뭔가 굉장히 무시무시하고, 이해하기 어려운 직육면체가 나타났다. 뚜둥.. 어색한 3D 같음
이를 개선하기 위해 camera의 zoom 설정을 추가해준 뒤 update 해준다.

`src/main.js`

```jsx
// ..
camera.position.x = 1;
camera.position.y = 2;
camera.position.z = 5; // 직교 카메라에서는 원근을 z 값으로 조정하지 않는다.

camera.lookAt(0, 0, 0);

// 카메라 zoom 설정
camera.zoom = 0.5;

// 카메라 설정 업데이트
camera.updateProjectionMatrix();

scene.add(camera);
```

OrthographicCamera의 경우 특정한 상황에서만 사용하게 되므로, 주로 원근 카메라를 이용한다고 가정하고 진행함

이해를 높기 위한 이미지 추가.. ([https://www.oreilly.com/library/view/learn-threejs/9781788833288/75c09eef-2a7d-47b2-8965-e3cd1fe1e6fe.xhtml](https://www.oreilly.com/library/view/learn-threejs/9781788833288/75c09eef-2a7d-47b2-8965-e3cd1fe1e6fe.xhtml))

![](../../img/230205-7.png)
![](../../img/230205-8.png)

### 소스코드 구조 잡기

좀 더 깊이 있는 배움을 위해 프로젝트 구조를 조금 변경해본다.

`src/ex01.js` (신규 파일 생성)

```jsx
import * as THREE from "three";

// --- 주제: 기본 장면
export default function example() {
  // main.js source 여기에 복붙
}
```

`src/main.js`

```jsx
import example from "./ex01";

example();
```

위와 같은 모듈 구조로 변경

### 브라우저 창 사이즈 변경에 대응하기

이번에는 창 사이즈 변경 시 거기에 맞춰서 대응되도록 개선해본다. 지금은 그대로 있음..
일단 기본 소스코드를 ex02.js 파일로 생성하여 위치시킨다.

`src/ex02.js`

```jsx
import * as THREE from "three";

// --- 주제: 브라우저 창 사이즈 변경에 대응하기

export default function example() {
  // renderer
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // scene
  const scene = new THREE.Scene();
  // camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  camera.position.x = 1;
  camera.position.y = 2;
  camera.position.z = 5;
  scene.add(camera);

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: "green" });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // 그리기
  renderer.render(scene, camera);
}
```

초기 renderer.render 이후 resize에 대한 이벤트를 아래와 같이 그려준다.

```jsx
export default function example() {
  // ...
  renderer.render(scene, camera);

  // resize 시 변화하는 것들을 새로 설정해준다.
  function setSize() {
    // camera
    camera.aspect = window.innerWidth / window.innerHeight;
    // updateProjectionMatrix 카메라 투영에 관련된 값에 변화가 있을 때는 실행해야 함
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  // Event
  window.addEventListener("resize", setSize); // setSize 적용
}
```

위처럼 처리하면 브라우저 리사이즈 시 알아서 규격이 대응되는 것을 확인할 수 있다.
그런데 실제 적용된 캔버스 사이즈를 보면 초기에 적용된 가로, 세로 값이 그대로 적용되어 있음

![](../../img/230206-1.png)

캔버스도 고해상도 표현을 위해서는 크기를 크게 만든 뒤 줄여서 표현해주어야 한다.
어떻게? 뷰포트에서 표현하는 사이즈와 실제 물리적인 픽셀 개수가 다르게 처리하는 방법으로 고해상도 표현이 가능함.
만약 픽셀 밀도 즉, 집적도가 2배인 디스플레이라면 가로가 100px인 이미지를 표현 시
실제 이미지의 크기를 2배 크기인 200px로 만든 뒤 100px로 줄여 표현하면 훨씬 더 고해상도로 보여지게 할 수 있다.
캔버스도 마찬가지임. 캔버스 크기를 2배로 잡아주면 훨씬 더 고해상도로 구현할 수 있을 것이다.

이를 구현하기 위해서는 현재 나의 기기의 픽셀 밀도가 몇인지 알면 좋다.

```jsx
export default function example() {
  // ..
  console.log(window.devicePixelRatio); // 해당 기기의 픽셀 밀도를 나타냄
}
```

위와 같이 window.devicePixelRatio라는 메서드를 통해 해당 기기의 픽셀 밀도(비율)를 숫자로 나타낼 수 있는데, 현재 맥북을 사용하므로 2가 출력되고 있다. 현재 나의 기기가 100px를 표현할 때 200px를 사용한다는 것을 의미함.

이 메서드를 왜 이용할까? 사람마다 각자 디바이스의 픽셀 밀도는 다를것이므로 각 디바이스별 값으로 세팅을 해주도록 하면 모든 기기에 최적화가 될 수 있을 것이기 때문이다.

`src/ex02.js`

```jsx
export default function example() {
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 렌더링 품질을 높이기 위해 픽셀 밀도를 설정함
  // 비율이 1인 경우 그냥 1을 쓰고, 그 이상일 경우 2배로 처리하는 삼항 조건자 추가 - 성능에 유리함
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  // ..
}
```

위와 같이 적용해준 뒤 화면을 확인해보면 canvas 사이즈가 2배로 커져서 적용된 것을 확인할 수 있다.

![](../../img/230206-1.png)

위와 같이 처리하면 크기는 달라지지 않으나 훨씬 더 고밀도의 화면을 구현할 수 있게 된다.

![실제 더 선명해진 것 같기도..?](../../img/230206-1.png)

### 배경의 색, 투명도 설정하기

시커먼 배경색을 좀 수정해보자.

`src/ex03.js`

```jsx
import * as THREE from "three";

// --- 주제: 배경의 색, 투명도 설정하기

export default function example() {
  const canvas = document.querySelector("#three-canvas");
  // alpha 화면을 투명하게 처리
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
  // 배경색 불투명도 설정 - 0.5만큼 불투명하게!
  renderer.setClearAlpha(0.5);

  // ..
}
```

위와 같이 배경색을 투명하게, 불투명도를 50%로 줬더니 아래와 같이 노출된다.

![](../../img/230207-1.png)

이번엔 색을 지정해보자.

```jsx
import * as THREE from "three";

// --- 주제: 배경의 색, 투명도 설정하기

export default function example() {
  // ..

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  // ..

  // renderer.setClearColor(0x00ff00); // 아래와 같은 표현
  renderer.setClearColor("#00ff00");
  renderer.setClearAlpha(0.5);
}
```

![박스는 빨간색으로 바꿔줬다. (****MeshBasicMaterial)****](../../img/230207-2.png)

이번에는 다른 방법으로 바꿔본다. renderer 설정이 아닌 scene에 설정해본다.
renderer 위에 scene이 존재하므로 scene에 배경색을 설정하면 renderer 설정은 무시된다.

```jsx
import * as THREE from "three";

// --- 주제: 배경의 색, 투명도 설정하기

export default function example() {
  // ..

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor("#00ff00");
  renderer.setClearAlpha(0.5);

  // scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("blue"); // 위 renderer 설정은 무시됨
}
```

위와 같이 배경색을 파란색으로 처리해버린 뒤 화면을 보면 위 renderer 설정은 완전 무시되어 덮여진 것을 알 수 있다.

![덮어썻기 때문에 기존 설정은 보이지 않는다.](../../img/230207-3.png)

배경색에 투명도 등의 설정을 할 경우 renderer 메서드를 사용하고, 간단한 색감만 사용할 경우 scene에서 처리해준다.

### 빛(조명, Light)

이번에는 조명light을 추가해본다. 빛의 여러가지가 있는데 DirectionalLight를 사용함

`src/ex04.js`

```jsx
import * as THREE from "three";

// --- 주제: 조명 추가하기

export default function example() {
  // ..

  // 추가
  const light = new THREE.DirectionalLight(0xffffff, 1);
  scene.add(light);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  // const material = new THREE.MeshBasicMaterial({ color: "red" });
  const material = new THREE.MeshStandardMaterial({ color: "red" }); // material 변경
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer.render(scene, camera);
}
```

위와 같이 DirectionalLight로 조명을 설정 후 scene.add로 조명을 적용해주면 됨.
하지만 화면에 조명은 추가되지 않는다. 왜? MeshBasicMaterial 메서드를 사용했기 때문이다.
MeshBasicMaterial은 빛에 반응을 하지 않는 객체이다. 영향을 받지 않음.

따라서 위 material을 빛에 영향을 받는 MeshStandardMaterial 메서드로 변경해준다.

![](../../img/230208-1.png)

그럼 이렇게 보여진다. 갑자기 위에서 바라보는 사각형처럼 보인다. three.js에서 DirectionalLight는 태양빛과 비슷하다. 무대에 존재하는 객체들에게 빛을 전체적으로 비춰주는데 빛의 위치가 위에 있는 상태라고 보면 됨

정육면체가 살짝 좌측으로 이동되어 있는 것 같은 것은 camera의 x 축이 1만큼 이동되어 있기 때문이다.
해당 적용을 제외하면 아래와 같이 변경된다.

![](../../img/230208-2.png)

이번에는 빛도 포지션을 좀 움직여줘본다.

```jsx
import * as THREE from "three";

// --- 주제: 조명 추가하기

export default function example() {
  // ..
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.z = 2;
  scene.add(light);

  // ..
  renderer.render(scene, camera);
}
```

![](../../img/230208-3.png)

camera의 위치와 light의 위치를 커스텀하여 좌측면도 비치게 할 수 있다.

```jsx
import * as THREE from "three";

// --- 주제: 조명 추가하기

export default function example() {
  // ..
  // camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  camera.position.x = 2; // 추가
  camera.position.y = 2;
  camera.position.z = 5;
  scene.add(camera);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.x = 1; // 추가
  light.position.z = 2;
  scene.add(light);

  // ..
  renderer.render(scene, camera);
}
```

![mesh, camera, light 모두 scene.add 메서드로 무대 위에 올리며, position 속성으로 그 위치를 조정하는 것이다.](../../img/230208-4.png)

빛의 강도도 DirectionalLight의 인자 숫자를 변경해서 다양하게 바꿀 수 있음

```jsx
import * as THREE from "three";

// --- 주제: 조명 추가하기

export default function example() {
  // ..

  // const light = new THREE.DirectionalLight(0xffffff, 1);
  // const light = new THREE.DirectionalLight(0xffffff, 0.1);
  // const light = new THREE.DirectionalLight(0xffffff, 10);
  const light = new THREE.DirectionalLight(0xffffff, 0.5);
  // ..

  renderer.render(scene, camera);
}
```

![](../../img/230208-5.png)

이러한 조명은 많이 넣을 수 있다. (너무 많이 넣음 성능에 좋지 않으니 적당히 사용)
