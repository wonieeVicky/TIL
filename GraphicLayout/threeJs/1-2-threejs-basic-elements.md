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
