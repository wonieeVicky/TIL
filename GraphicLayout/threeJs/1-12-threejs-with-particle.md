﻿## Particle

이번 섹션에서는 Particle에 대해 배워본다. three.js로 Particle(작은 입자)들을 랜덤하게 뿌리거나, 흩어지게 하고, 입자 대신 이미지를 사용해보는 등의 작업을 해봄. 일반 Mesh랑 다르게 Particle 사용하면 특별한 효과를 낼 수 있음

### Basic Geometry Particle

![](../../img/230508-1.png)

먼저 위와 같은 구가 있다고 하자. 이 Mesh에 wireframe이 보이도록 살짝 수정해주면 아래와 같음

```jsx
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshStandardMaterial({ wireframe: true });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
```

![](../../img/230508-2.png)

기본 Geometry에서 Particle을 사용한다는 것은 각 정점(vertex)들의 Particle을 하나로 묶는 것을 의미한다.

`src/ex01.js`

```jsx
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ----- 주제: 기본 Geometry 파티클

export default function example() {
  // Renderer, Scene, Camera, Light, Controls ..

  // Mesh
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.PointsMaterial();
  const points = new THREE.Points(geometry, material); // mesh 대신 points 사용
  scene.add(points);

  // ..
}
```

위와 같이 기존의 material을 `PointsMaterial`로 수정 후 Mesh가 아닌 Points라는 걸로 scene.add 시켜줌
그러면 아래와 같이 노출된다.

![](../../img/230508-3.png)

자글자글한 픽셀 뭉치 구와 같은데 OrbitControls가 적용되어있으므로 이를 확대시켜보면 아래와 같다.

![](../../img/230508-4.png)

각 점들이 살아있다. 우선 각 Particle 사이즈가 너무 크므로 좀 줄여준다.

```jsx
export default function example() {
  // Mesh
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.PointsMaterial({
    size: 0.02 // size 설정
  });
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // ..
}
```

그러면 좀 더 가시적인 Particle UI 확인 가능

![](../../img/230508-5.png)

원근에 따라 Particle의 사이즈가 다르게 보이는데 이를 하나의 사이즈로 고정할 수도 있음

```jsx
export default function example() {
  // Mesh
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.PointsMaterial({
    size: 1,
    sizeAttenuation: false // 설정 추가
  });

  // 혹은 아래와 같이 설정해줄 수도 있음
  // material.size = 0.02;
  // material.sizeAttenuation = false;

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // ..
}
```

그러면 아래와 같은 구가 만들어진다.

![](../../img/230508-6.png)

특이하다. 이러한 Particle rlsmddmf 활용해서 재미있는 형태의 UI를 구현할 수 있음

### random Particle

이번에는 랜덤한 위치에 Particle을 흩뿌려보자.
아까는 정해진 형태의 Particle을 보여주기 위해 기본 제공되는 `SphereGeometry`를 이용했다.

이번에는 Geometry가 필요하지만, 형태가 정해져있지 않으므로 `BufferGeometry`를 사용한다.
BufferGeometry는 기본으로 가진 형태가 없이 우선 geometry를 만든 뒤 vertex를 직접 세팅 할 경우 사용하는 메서드이다.

`src/ex02.js`

```jsx
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ----- 주제: 랜덤 파티클

export default function example() {
  // Renderer, Scene, Camera, Light, Controls ..

  // Mesh(Geometry + Material)
  const geometry = new THREE.BufferGeometry();
  const count = 1000;

  // BufferGeometry에 노출할 포인트들의 위치 설정
  // Float32Array position 배열은 x, y, z를 가지므로 3개씩 1000개 생성
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < positions.length; i++) {
    positions[i] = (Math.random() - 0.5) * 10; // -5 ~ 5 사이의 랜덤
  }

  // BufferAttribute에 positions 배열을 넣어줌(3은 x, y, z를 의미)
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({ size: 0.03, color: "plum" });
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  const points = new THREE.Points(geometry, material); // mesh 대신 points 사용
  scene.add(points);

  // ..
}
```

위와 같이 BufferGeometry를 사용해서 랜덤 파티클을 구현할 수 있다.

![](../../img/230509-1.gif)

1000개의 점을 -5 ~ 5 사이의 값을 가지도록 랜덤하게 설정하여 PointsMaterial과 함께 조합함
위 코드를 통해 우주 속의 별을 표현해볼 수 있다.

### Particle Image

이번에는 Particle에 이미지를 사용해보자. 우선 이미지를 로드해야 한다.
그러려면 webpack 설정부터 바꿔야지

`webpack.config.js`

```jsx
module.exports = {
  mode: webpackMode,
  // ..
  plugins: [
    // ..
    new CopyWebpackPlugin({
      patterns: [
        { from: "./src/main.css", to: "./main.css" },
        { from: "./src/images", to: "./images" } // 추가
      ]
    })
  ]
};
```

`src/ex03.js`

```jsx
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ----- 주제: 파티클 이미지

export default function example() {
  // Renderer, Scene, Camera, Light, Controls ..

  // Particle
  const geometry = new THREE.BufferGeometry();
  const count = 1000;

  const positions = new Float32Array(count * 3);
  for (let i = 0; i < positions.length; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  // 파티클 이미지 로드
  const textureLoader = new THREE.TextureLoader();
  const particleTexture = textureLoader.load("/images/star.png");

  const material = new THREE.PointsMaterial({
    size: 0.3,
    map: particleTexture
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // ..
}
```

textureLoader로 별 이미지를 로드해와서, 이를 PointMaterial의 map 속성에 추가해준다.
그러면 아래와 같이 랜덤 파티클 UI의 점들이 별 이미지로 노출되는 것을 확인할 수 있다.

![](../../img/230510-1.png)

그런데 자세히 보면, 배경이 투명하지가 않음. png를 썻는데도 그러네.. 이건 옵션으로 해결한다.

```jsx
export default function example() {
  // Renderer, Scene, Camera, Light, Controls ..

  // Particle ..
  const textureLoader = new THREE.TextureLoader();
  const particleTexture = textureLoader.load("/images/star.png");

  const material = new THREE.PointsMaterial({
    size: 0.3,
    map: particleTexture,
    // 파티클 이미지를 투명하게 세팅
    transparent: true,
    alphaMap: particleTexture,
    depthWrite: false
  });

  // ..
}
```

위와 같이 transparent, alphaMap, depthWrite 옵션을 주면 투명하게 세팅이 된다.

![좀 어색한 느낌이 있지만 은근 예쁨](../../img/230510-1.gif)

### 여러가지 색상의 파티클

이번에는 파티클의 색을 여러가지로 바꿔본다.

`src/ex04.js`

```jsx
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ----- 주제: 여러가지 색의 파티클

export default function example() {
  // Renderer, Scene, Camera, Light, Controls ..

  // Particle
  const geometry = new THREE.BufferGeometry();
  const count = 1000;

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < positions.length; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
    colors[i] = Math.random(); // colors 배열에 0 ~ 1 사이 값 추가
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  // BufferAttirbute에 color 배열을 넣어줌(3은 x, y, z를 의미)
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  // load
  const textureLoader = new THREE.TextureLoader();
  const particleTexture = textureLoader.load("/images/star.png");

  const material = new THREE.PointsMaterial({
    size: 0.3,
    map: particleTexture,
    transparent: true,
    alphaMap: particleTexture,
    depthWrite: false,
    // 한가지 단일 색
    // color: "lime",
    // 색상
    vertexColors: true
  });

  // ..
}
```

위와 같이 colors라는 Float32Array 배열에 0 ~ 1 사이의 값이 들어가도록 저장 후 이를 geometry의 color 배열에 담고, PointsMaterial의 vertexColors를 활성화 시켜주면 랜덤한 컬러가 노출된다.

![나름의 갬성이 있다](../../img/230511-1.gif)

### 포인트 좌표에 메쉬 생성하기

이번에는 포인트 좌표에 메쉬를 생성해보고자 한다. geometry에 생성되는 좌표에 다른 메쉬를 생성 후 붙여넣는 것을 의미함. 메쉬는 sphere mesh를 생성해본다.

`src/ex05.js`

```jsx
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ----- 주제: Point 좌표에 Mesh 생성하기

export default function example() {
  // Renderer, Scene, Camera, Light, Controls ..

  // Particle
  const sphereGeometry = new THREE.SphereGeometry(1, 8, 8);
  console.log(sphereGeometry);

  // ..
}
```

기존 Particle 로직을 모두 지우고 새로 시작, sphereGeometry 생성해서 내부를 확인해보면 `attributes.position`에 각 sphere를 이루는 좌표 값이 들어있다.

![](../../img/230511-1.png)

이 위치를 이용해서 이자리에 plane Mesh를 생성해 봄

```jsx
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ----- 주제: Point 좌표에 Mesh 생성하기

export default function example() {
  // Renderer, Scene, Camera, Light, Controls ..

  // Mesh
  const planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.3), new THREE.MeshBasicMaterial({ color: "red", side: THREE.DoubleSide }));

  // Points
  const sphereGeometry = new THREE.SphereGeometry(1, 8, 8);
  // planeMesh의 position 정보
  const positionArray = sphereGeometry.attributes.position.array;

  // 여러 개의 Plane Mesh 생성
  let plane;
  for (let i = 0; i < positionArray.length; i += 3) {
    plane = planeMesh.clone(); // planeMesh 복사
    plane.position.x = positionArray[i]; // x에 값 추가
    plane.position.y = positionArray[i + 1]; // y에 값 추가
    plane.position.z = positionArray[i + 2]; // z에 값 추가

    scene.add(plane);
  }

  // ..
}
```

위와 같이 planeMesh를 각 sphereGeometry 좌표에 넣으면 아래와 같이 된다.

![](../../img/230511-2.gif)

planeMesh는 색종이 같이 생긴 형태이므로 위와 같이 노출됨. 중심을 바라보도록 설정해볼 수도 있음

```jsx
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ----- 주제: Point 좌표에 Mesh 생성하기

export default function example() {
  // Renderer, Scene, Camera, Light, Controls ..

  // Mesh
  const planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.3), new THREE.MeshBasicMaterial({ color: "red", side: THREE.DoubleSide }));

  // Points
  const sphereGeometry = new THREE.SphereGeometry(1, 8, 8);
  const positionArray = sphereGeometry.attributes.position.array;

  let plane;
  for (let i = 0; i < positionArray.length; i += 3) {
    plane = planeMesh.clone();
    plane.position.x = positionArray[i];
    plane.position.y = positionArray[i + 1];
    plane.position.z = positionArray[i + 2];

    plane.lookAt(new THREE.Vector3(0, 0, 0)); // plane의 z축을 카메라 방향으로 설정

    scene.add(plane);
  }

  // ..
}
```

mesh도 lookAt 메서드가 있음

![](../../img/230511-3.gif)

그러면 위와 같이된다. mesh는 그냥 점이 아니므로 각각 다른 texture를 입힐 수 있으므로 다양한 활용이 가능하다. 다음엔 이걸 이용해서 갤러리도 한번 만들어보자

### 형태가 바뀌는 이미지 패널 구현

위 구에서 빨간색 planeMesh 하나하나에 이미지 패널을 구현하고, 버튼을 클릭하면 랜덤한 위치로 이동되었다가 회귀하는 애니메이션을 구현해보고자 한다. 먼저 기존의 PlaneMesh 구현을 모듈로 분리해볼 것이다. 
상세한 클래스 모듈을 생성하기 전 어떤 전달인자가 만들어져야하는지 클래스 생성부부터 작업해본다.

`src/ex06.js`

```jsx
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ImagePanel } from "./ImagePanel";

// ----- 주제: 형태가 바뀌는 이미지 패널

export default function example() {
  // Renderer, Scene, Camera, Light, Controls ..

  // Mesh
  const planeGeometry = new THREE.PlaneGeometry(0.3, 0.3);

  // textureLoader
  const textureLoader = new THREE.TextureLoader();

  // Points
  const sphereGeometry = new THREE.SphereGeometry(1, 8, 8);
  const positionArray = sphereGeometry.attributes.position.array;

  // ImagePanel 클래스 객체 생성
  let imagePanel;
  for (let i = 0; i < positionArray.length; i += 3) {
    imagePanel = new ImagePanel({
      textureLoader,
      scene,
      geometry: planeGeometry,
      imageSrc: `/images/0${Math.ceil(Math.random() * 5)}.jpg`, // 1 ~ 5 random
      x: positionArray[i],
      y: positionArray[i + 1],
      z: positionArray[i + 2]
    });
  }

  // ...
}
```

위와 같이 ImagePanel 구현을 위해 textureLoader, scene, geometry, imageSrc, position 좌표를 인자값으로 넣어주면 될 것으로 보임. 이제 실제 ImagePanel 클래스를 구현해보자

### 형태가 바뀌는 이미지 패널 구현

위 구에서 빨간색 planeMesh 하나하나에 이미지 패널을 구현하고, 버튼을 클릭하면 랜덤한 위치로 이동되었다가 회귀하는 애니메이션을 구현해보고자 한다. 먼저 기존의 PlaneMesh 구현을 모듈로 분리해볼 것이다. 
상세한 클래스 모듈을 생성하기 전 어떤 전달인자가 만들어져야하는지 클래스 생성부부터 작업해본다.

`src/ex06.js`

```jsx
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ImagePanel } from "./ImagePanel";

// ----- 주제: 형태가 바뀌는 이미지 패널

export default function example() {
  // Renderer, Scene, Camera, Light, Controls ..

  // Mesh
  const planeGeometry = new THREE.PlaneGeometry(0.3, 0.3);

  // textureLoader
  const textureLoader = new THREE.TextureLoader();

  // Points
  const sphereGeometry = new THREE.SphereGeometry(1, 8, 8);
  const positionArray = sphereGeometry.attributes.position.array;

  // ImagePanel 클래스 객체 생성
  let imagePanel;
  for (let i = 0; i < positionArray.length; i += 3) {
    imagePanel = new ImagePanel({
      textureLoader,
      scene,
      geometry: planeGeometry,
      imageSrc: `/images/0${Math.ceil(Math.random() * 5)}.jpg`, // 1 ~ 5 random
      x: positionArray[i],
      y: positionArray[i + 1],
      z: positionArray[i + 2]
    });
  }

  // ...
}
```

위와 같이 ImagePanel 구현을 위해 textureLoader, scene, geometry, imageSrc, position 좌표를 인자값으로 넣어주면 될 것으로 보임. 이제 실제 ImagePanel 클래스를 구현해보자

`src/ImagePanel.js`

```jsx
import { DoubleSide, MeshBasicMaterial, Mesh } from "three";

export class ImagePanel {
  constructor(info) {
    const texture = info.textureLoader.load(info.imageSrc); // texture 생성
    const material = new MeshBasicMaterial({ map: texture, side: DoubleSide }); // material 생성

    this.mesh = new Mesh(info.geometry, material); // mesh 생성
    this.mesh.position.set(info.x, info.y, info.z); // mesh 위치 설정
    this.mesh.lookAt(0, 0, 0); // mesh의 z축을 카메라 방향으로 설정

    info.scene.add(this.mesh); // scene에 mesh 추가
  }
}
```

그러면 원하는 이미지가 갤러리처럼 노출되는 것을 확인할 수 있다.

![](../../img/230512-1.gif)

위와 같이 이미지 적용까지 완료. 이제 Random, Sphere 버튼을 누르면 랜덤한 위치로 퍼졌다가 다시 모이도록 구현해보겠다. 우선 버튼을 2개 만들어봄

`src/ex06.js`

위와 같이 ex06.js 에서 자체적으로 random, sphere 버튼을 생성하고, 버튼을 감싸고 있는 btns wrapper에 클릭 이벤트를 추가하여 처리한다. 

```jsx
export default function example() {
  // Renderer, Scene, Camera, Light, Controls, Mesh ..

	// Points
  const sphereGeometry = new THREE.SphereGeometry(1, 8, 8);
  const spherePositionArray = sphereGeometry.attributes.position.array;
  const randomPositionArray = []; // random position 정보
  for (let i =0; i < spherePositionArray.length; i++) {
    randomPositionArray.push((Math.random() - 0.5) * 10);
	}

	// ..

  function setShape(e) {
    const { type } = e.target.dataset;
    switch (type) {
      case "random":
				// ..
        break;
      case "sphere":
				// ..
        break;
    }
  }

  // 버튼 추가
  const btnWrapper = document.createElement('div'); // addEventListener를 위한 div
  btnWrapper.classList.add('btns');

  const randomBtn = document.createElement('button');
  randomBtn.dataset.type = 'random';
  randomBtn.innerText = 'Random';
  randomBtn.style.cssText = 'position: absolute; left: 20px; top: 20px; '
  btnWrapper.append(randomBtn);

  const sphereBtn = document.createElement('button');
  sphereBtn.dataset.type = 'sphere';
  sphereBtn.innerText = 'Sphere';
  sphereBtn.style.cssText = 'position: absolute; left: 20px; top: 50px; '
  btnWrapper.append(sphereBtn);

  document.body.append(btnWrapper);

  // 이벤트
  btnWrapper.addEventListener('click', setShape)
	// ..
}
```

랜덤 위치에 흩뿌릴 random position도 추가 생성, setShape라는 함수가 클릭이벤트 관리하도록 구현
이제 상세한 setShape 부분을 구현해보자

![](../../img/230512-1.png)

이제 버튼 클릭 시 패널 이동이 되도록 구현해본다.

```bash
> npm i gsap
```

```jsx
import gsap from "gsap";

export default function example() {
  // Renderer, Scene, Camera, Light, Controls, Mesh..

	// 여러 개의 Plane Mesh 생성
  const imagePanels = []; // gsap 액션을 위한 추가
  let imagePanel;
  for (let i = 0; i < spherePositionArray.length; i += 3) {
    imagePanel = new ImagePanel({
      textureLoader,
      scene,
      geometry: planeGeometry,
      imageSrc: `/images/0${Math.ceil(Math.random() * 5)}.jpg`,
      x: spherePositionArray[i],
      y: spherePositionArray[i + 1],
      z: spherePositionArray[i + 2]
    });

    imagePanels.push(imagePanel); // imagePanel 인스턴스를 모은다.
  }

	// ..

  function setShape(e) {
    let array;
    const { type } = e.target.dataset;
    switch (type) {
      case "random":
        array = randomPositionArray; // array에 randomPositionArray 적용
        break;
      case "sphere":
        array = spherePositionArray; // array에 spherePositionArray 적용
        break;
    }

    for(let i=0; i<imagePanels.length; i++){
      // gasp.to(대상, {속성, 속성값, 속성, 속성값, ...}, 옵션(지속시간, delay, ease 등))
      gsap.to(imagePanels[i].mesh.position, {
        duration: 2,
        x: array[i * 3], 
        y: array[i * 3 + 1],
        z: array[i * 3 + 2],
      });
    }
  }

  // Buttons..

  // 이벤트
  btnWrapper.addEventListener('click', setShape)
	// ..
}
```

위와 같이 setShape 함수 내부를 각 imagePanels의 값에 따라 분산되었다가 다시 제자리로 돌아가도록 처리하면 아래와 같은 애니메이션이 구현된다. 

![](../../img/230514-1.gif)

그런데 살짝 마음에 안드는 부분은 흐트러진 형태가 너무 중구난방이라는 점.. 

![](../../img/230514-1.png)

각 mesh의 각도가 모두 다르기 때문에 위와 같이 노출됨. 이걸 좀 정리해볼까
Random을 눌렀을 때 position이 변경되면서도 일정한 간격을 가지도록 아래와 같이 구현함

`src/ImagePanel.js`

```jsx
export class ImagePanel {
  constructor(info) {
    // ..

    // Sphere 상태의 회전각을 저장
    this.sphereRotationX = this.mesh.rotation.x;
    this.sphereRotationY = this.mesh.rotation.y;
    this.sphereRotationZ = this.mesh.rotation.z;

    info.scene.add(this.mesh);
  }
}
```

`src/ex06.js`

```jsx
import gsap from "gsap";

export default function example() {
  // Renderer, Scene, Camera, Light, Controls, Mesh..
	// ..

  function setShape(e) {
    let array;
    const { type } = e.target.dataset;
    switch (type) {
      case "random":
        array = randomPositionArray;
        break;
      case "sphere":
        array = spherePositionArray;
        break;
    }

    for(let i=0; i<imagePanels.length; i++){
      gsap.to(imagePanels[i].mesh.position, {
        duration: 2,
        x: array[i * 3], 
        y: array[i * 3 + 1],
        z: array[i * 3 + 2],
      });

			// 회전
      if (type === "random") {****
				// random 일 때는 앞쪽을 바라보도록 정렬
        gsap.to(imagePanels[i].mesh.rotation, {
          duration: 2,
          x: 0,
          y: 0,
          z: 0
        });
      } else if (type === "sphere") {
				// 기존 Rotation으로 돌아가도록 처리
        gsap.to(imagePanels[i].mesh.rotation, {
          duration: 2,
          x: imagePanels[i].sphereRotationX,
          y: imagePanels[i].sphereRotationY,
          z: imagePanels[i].sphereRotationZ
        });
      }
    }
  }

  // Buttons..

  // 이벤트
  btnWrapper.addEventListener('click', setShape)
	// ..
}
```

![](../../img/230514-2.gif)

위와 같이 Random 버튼을 눌렀을 때 정면을 바라보도록(x, y, z) = (0, 0, 0) 처리되는 것을 확인할 수 있다.