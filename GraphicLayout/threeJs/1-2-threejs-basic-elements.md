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

const canvas = document.querySelector("#three-canvas");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
```

위와 같이 코드를 넣어주면 위 동적 캔버스 조립 코드와 같은 결과를 확인할 수 있다.
