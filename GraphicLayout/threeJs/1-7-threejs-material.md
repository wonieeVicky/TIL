﻿## Material(재질)

### MeshBasicMaterial

이번 섹션에서는 Material에 대해 알아본다. 재질도 다양한 종류와 기능을 가지고 있다.
MeshBasicMaterial은 입체감이 없는 기본적 Material이다.

`material/src/ex01.js`

```
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ----- 주제: MeshBasicMaterial

export default function example() {
  // Renderer, Scene, Camera ...
  // Controls - camera lookat으로 물체를 바라보므로 정중앙에 사물이 위치함
  const controls = new OrbitControls(camera, renderer.domElement);

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);

	// MeshBasicMaterial 적용
  const material = new THREE.MeshBasicMaterial({
    color: "seagreen",
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // ..
}
```

![](../../img/230228-1.gif)

별도의 빛이나 그림자의 영향을 받지 않으므로 Light도 필요가 없다.
단색으로 노출되는 기본적 기능이므로 성능도 가장 빠름

### MeshLambertMaterial, MeshPhongMaterial

이번에는 MeshLambertMaterial, MeshPhongMaterial를 배워본다.
두 개를 비교하면서 익혀봄. 즉 mesh를 두 개 만든다.

`src/ex02.js`

```jsx
// ----- 주제: MeshLambertMaterial, MeshPhongMaterial

export default function example() {
  // Renderer, Scene, Camera, Controls ...

  // Light - 빛이 필요하므로 Light 추가
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.set(1, 0, 2);
  scene.add(ambientLight, directionalLight);

  // Mesh
  const geometry = new THREE.SphereGeometry(1, 16, 16);

  // MeshLambertMaterial 하이라이트, 반사광 없는 재질
  const material1 = new THREE.MeshLambertMaterial({ color: "seagreen" });
  // MeshPhongMaterial 하이라이트, 반사광 표현 가능한 재질
  const material2 = new THREE.MeshPhongMaterial({ color: "seagreen" });

  const mesh1 = new THREE.Mesh(geometry, material1);
  const mesh2 = new THREE.Mesh(geometry, material2);
  mesh1.position.x = -1.5;
  mesh2.position.x = 1.5;
  scene.add(mesh1, mesh2);

  // ..
}
```

위와 같이 MeshLambertMaterial, MeshPhongMaterial를 넣어주면 두 개의 구를 확인할 수 있음

![왼쪽이 하이라이트, 반사광이 없는 MeshLambertMaterial, 오른쪽이 당구공 느낌의 반사광이 있는 MeshPhongMaterial](../../img/230301-1.png)

MeshPhongMaterial 는 하이라이트 정도를 조절할 수 있다.

```jsx
// ----- 주제: MeshLambertMaterial, MeshPhongMaterial

export default function example() {
  // Renderer, Scene, Camera, Controls ...

  // Mesh
  const geometry = new THREE.SphereGeometry(1, 16, 16);
  const material1 = new THREE.MeshLambertMaterial({ color: "seagreen" });
  const material2 = new THREE.MeshPhongMaterial({
    color: "seagreen",
    shininess: 1000, // shininess 정도 조절
  });

  const mesh1 = new THREE.Mesh(geometry, material1);
  const mesh2 = new THREE.Mesh(geometry, material2);
  mesh1.position.x = -1.5;
  mesh2.position.x = 1.5;
  scene.add(mesh1, mesh2);

  // ..
}
```

위와 같이 하면 두 Material 간 차이를 극명하게 확인할 수 있다.

![](../../img/230301-2.png)

위 shininess 값을 0으로 주면 해당 속성을 사용하지 않는 개념이므로 MeshLambertMaterial과 동일하게 노출

### **MeshStandardMaterial**

앞서 배웠던 MeshPhongMaterial과 MeshStandardMaterial을 비교해본다.

`src/ex03.js`

```jsx
// ----- 주제: MeshStandardMaterial

export default function example() {
  // Renderer, Scene, Camera, Controls ...

  // Mesh
  const geometry = new THREE.SphereGeometry(1, 16, 16);

  // MeshPhongMaterial 하이라이트, 반사광 표현 가능한 재질
  const material1 = new THREE.MeshPhongMaterial({ color: "orangered" });
  // MeshStandardMaterial 하이라이트, 반사광 표현 가능한 재질
  const material2 = new THREE.MeshStandardMaterial({ color: "orangered" });

  // mesh.add...
  // ..
}
```

![왼쪽이 MeshPhongMaterial, 오른쪽이 MeshStandardMaterial](../../img/230301-3.png)

위 두 속성은 모두 하이라이트와 반사광 표현이 가능한 재질이다. 단, 사용방법과 노출되는 느낌이 살짝 다름

`src/ex03.js`

```jsx
// ----- 주제: MeshStandardMaterial

export default function example() {
  // Renderer, Scene, Camera, Controls ...

  // Mesh
  const geometry = new THREE.SphereGeometry(1, 16, 16);

  // MeshPhongMaterial 하이라이트, 반사광 표현 가능한 재질
  const material1 = new THREE.MeshPhongMaterial({
    color: "orangered",
    shininess: 800, // 재질 표현(shininess)
  });

  // MeshStandardMaterial 하이라이트, 반사광 표현 가능한 재질
  const material2 = new THREE.MeshStandardMaterial({
    color: "orangered",
    roughness: 0.5, // 재질 표현 (roughness)
    metalness: 0.5, // 재질 표현 - 쇠느낌(?)
  });

  // mesh.add...
  // ..
}
```

위와 같이 효과를 넣으면 아래와 같이 결과가 나온다.

![](../../img/230301-4.png)

성능은 MeshPhongMaterial이 살짝 빠른 편, 원하는 메서드를 골라서 사용한다.
이 밖에도 매우 다양한 메서드와 옵션 들이 있으니 그 중에서 필요한 걸로 골라쓴다.

### 각지게 표현하기, flatShading

각지게 표현하는 것에 대해 확인하고 넘어간다. 자주 쓰인다.

`src/ex04.js`

```jsx
// ----- 주제: flatShading

export default function example() {
  // Renderer, Scene, Camera, Controls ...

  // Mesh
  const geometry = new THREE.SphereGeometry(1, 16, 16);
  const material1 = new THREE.MeshPhongMaterial({
    color: "orangered",
    shininess: 800,
    flatShading: true,
  });
  const material2 = new THREE.MeshStandardMaterial({
    color: "orangered",
    roughness: 0.2,
    metalness: 0.3,
    flatShading: true,
  });

  // mesh.add...
  // ..
}
```

위와 같이 넣으면 각진 구 모양 생성! 요즘 다양하게 사용하는 스타일인 것 같당

![](../../img/230301-1.gif)

### Mesh의 앞뒷면

이번에는 Mesh의 앞, 뒷면에 대해 알아본다. Meterial은 점(vertext), 선(edge), 면(face)으로 이루어져있다. 위 설정에 따라 앞, 뒷면을 다양하게 설정할 수 있음. 아래와 같은 mesh가 구현되어 있다고 하자.

`src/ex05.js`

```jsx
// ----- 주제: Side

export default function example() {
  // Renderer, Scene, Camera, Controls ...
  // Mesh
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const material = new THREE.MeshStandardMaterial({
    color: "orangered",
    roughness: 0.2,
    metalness: 0.3,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // ..
}
```

기본적인 BoxGeometry와 MeshStandardMaterial이 연결되어있음. 사물의 뒷면이 별도로 노출되지 않는다.
여기에 뒷면을 보이게 옵션을 추가해본다.

![](../../img/230302-1.gif)

```jsx
export default function example() {
  // Renderer, Scene, Camera, Controls ...
  // Mesh
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const material = new THREE.MeshStandardMaterial({
    color: "orangered",
    roughness: 0.2,
    metalness: 0.3,
    // side: THREE.FrontSide, // default value
    // side: THREE.BackSide, // 뒷 면만 보이게
    side: THREE.DoubleSide, // 큐브 안쪽까지 모두 다 보이게
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // ..
}
```

위와 같이 side란 옵션으로 큐브 안쪽, 혹은 뒷면만 보이도록 설정 가능

![side: THREE.DoubleSide](../../img/230302-2.gif)

### 텍스쳐 이미지 로드하기

외부 이미지를 로드한 뒤 객체에 입혀본다. (포장)

이왕이면 3D 모델을 위해 만들어진 이미지를 가져다 쓰면 더 그럴싸해 보일 것 같다.
구글에 3d texture라고 검색하면 다양한 이미지들이 많이 나옴. 여기 [사이트](https://3dtextures.me/)를 참고했음

벽돌 텍스쳐 이미지를 [여기](https://3dtextures.me/2020/09/17/brick-wall-019/)에서 다운로드 한 뒤 src/textures/brick 폴더에 옮겨둔다.
코드 작업을 하기에 앞서 src 폴더 내부에 넣어둔 이미지를 사용하기 위해 webpack 설정을 추가한다.

`material/webpack.config.js`

```jsx
// ..
module.exports = {
  // ..
  plugins: [
    // ..
    // CopyWebpackPlugin: 그대로 복사할 파일들을 설정하는 플러그인
    // 아래 patterns에 설정한 파일/폴더는 빌드 시 dist 폴더에 자동으로 생성됩니다.
    // patterns에 설정한 경로에 해당 파일이 없으면 에러가 발생합니다.
    // 사용하는 파일이나 폴더 이름이 다르다면 변경해주세요.
    // 그대로 사용할 파일들이 없다면 CopyWebpackPlugin을 통째로 주석 처리 해주세요.
    new CopyWebpackPlugin({
      patterns: [
        { from: "./src/main.css", to: "./main.css" },
        { from: "./src/textures", to: "./textures" }, // textures 폴더 추가
      ],
    }),
  ],
};
```

`src/ex06.js`

```jsx
// ----- 주제: 텍스쳐 이미지 로드하기

export default function example() {
  // 텍스쳐 이미지 로드
  const textureLoader = new THREE.TextureLoader();
  // 이미지 호출 - 예시 1
  const texture = textureLoader.load("/textures/brick/Brick_Wall_019_basecolor.jpg");
  // 이미지 호출 - 예시 2
  const texture = textureLoader.load(
    "/textures/brick/Brick_Wall_019_basecolor123123.jpg"
    // () => console.log("로드 완료"),
    // () => console.log("로드 중"),
    // () => console.log("로드 실패")
  );

  // ..
}
```

텍스쳐 이미지 로드는 위와 같이 THREE.TextureLoader 메서드를 호출해서 사용한다. 기본적으로 이미지 경로만 적어줘도 되고, 조건에 따라 체크할 수 있는 함수를 로드 중, 로드 완료, 로드 실패 조건으로 3가지 함수를 넣을 수 있다. 위에서 생성한 texture를 material에 적용해본다.

`src/ex06.js`

```jsx
// ----- 주제: 텍스쳐 이미지 로드하기

export default function example() {
  // 텍스쳐 이미지 로드
  const textureLoader = new THREE.TextureLoader();
  // 이미지 호출
  const texture = textureLoader.load("/textures/brick/Brick_Wall_019_basecolor.jpg");

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);

  const material1 = new THREE.MeshStandardMaterial({ map: texture });
  const material2 = new THREE.MeshBasicMaterial({ map: texture });

  const mesh1 = new THREE.Mesh(geometry, material1);
  const mesh2 = new THREE.Mesh(geometry, material2);

  mesh1.position.x = -1;
  mesh2.position.x = 1;

  scene.add(mesh1, mesh2);

  // ..
}
```

위와 같이 MeshStandardMaterial, MeshBasicMaterial에 texture를 매핑해주면 각 속성을 그대로 유지한 채 texture만 매핑된 사물을 확인할 수 있다.

![왼쪽이 MeshStandardMaterial 오른쪽이 MeshBasicMaterial](../../img/230303-1.png)

### 로딩 매니저(여러개의 텍스쳐 이미지)

여러개의 텍스쳐 이미지를 불러올 때는 three.js에서 제공하는 로딩 매니저를 사용하면 매우 유용하다.

`src/ex07.js`

```jsx
// ----- 주제: 로딩 매니저(여러개의 테스쳐 이미지를 로드할 때 사용)

export default function example() {
  // 텍스쳐 이미지 로더 생성
  const loadingManager = new THREE.LoadingManager();

  loadingManager.onStart = () => {
    console.log("로드 시작");
  };
  loadingManager.onProgress = (img) => {
    console.log(img + " 로드");
  };
  loadingManager.onLoad = () => {
    console.log("로드 완료");
  };
  loadingManager.onError = () => {
    console.log("로드 실패");
  };

  // 텍스쳐 로드 생성
  const textureLoader = new THREE.TextureLoader(loadingManager);
  const baseColorTex = textureLoader.load("/textures/brick/Brick_Wall_019_basecolor.jpg");
  const ambientTex = textureLoader.load("/textures/brick/Brick_Wall_019_ambientOcclusion.jpg");
  const normalTex = textureLoader.load("/textures/brick/Brick_Wall_019_normal.jpg");
  const roughnessTex = textureLoader.load("/textures/brick/Brick_Wall_019_roughness.jpg");
  const heightTex = textureLoader.load("/textures/brick/Brick_Wall_019_height.png");

  // ..

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material1 = new THREE.MeshStandardMaterial({ map: normalTex });
  const material2 = new THREE.MeshStandardMaterial({ map: heightTex });

  const mesh1 = new THREE.Mesh(geometry, material1);
  const mesh2 = new THREE.Mesh(geometry, material2);
  mesh1.position.x = -1;
  mesh2.position.x = 1;
  scene.add(mesh1, mesh2);

  // ..
}
```

위와 같이 코드를 넣으면 이미지 로드에 대한 정보를 각 onStart, onProgress, onLoad, onError 메서드를 통해서 가져올 수 있다.

```bash
로드 시작
/textures/brick/Brick_Wall_019_basecolor.jpg 로드
/textures/brick/Brick_Wall_019_ambientOcclusion.jpg 로드
/textures/brick/Brick_Wall_019_normal.jpg 로드
/textures/brick/Brick_Wall_019_roughness.jpg 로드
/textures/brick/Brick_Wall_019_height.png 로드
로드 완료
```

또한 각 메서드들이 잘 호출되어서 mesh에 입혀지는 것을 확인할 수 있음

![좌 normalTex, 우 heightTex](../../img/230304-1.png)

![좌 ambientTex, 우 roughnessTex](../../img/230304-1.png)

### 텍스쳐 변환

이번에는 텍스쳐 이미지의 위치를 이동하거나 회전하는 등의 변환을 해본다.
해골 모양의 [새로운 텍스쳐 이미지](https://3dtextures.me/2021/03/11/ground-skull-001/)를 사용해본다.

`src/ex08.js`

```jsx
// ----- 주제: 텍스쳐 이미지 변환

export default function example() {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("/textures/skull/Ground Skull_basecolor.jpg");

  // Renderer, Scene, Camera, Light, Controls ..

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ map: texture });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // ..
}
```

위와 같이 새로운 텍스쳐를 적용하면 아래와 같다.

![](../../img/230305-1.png)

무시무시한 해골이 노출되었다. 이제 이 텍스쳐 이미지에 변환을 하나씩 해보자.
먼저 텍스쳐의 위치를 x 축 위치로 0.3만큼 이동시켜본다.

`src/ex08.js`

```jsx
export default function example() {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("/textures/skull/Ground Skull_basecolor.jpg");
  texture.offset.x = 0.3; // 텍스쳐의 위치를 이동시킴

  // ..
}
```

위와 같이 offset으로 위치를 이동시키면 아래와 같이 노출된다.

![](../../img/230305-2.png)

0.3만큼 이동 후 남은 부분이 이상함.. x 축에 대한 여백을 기존 텍스쳐로 노출되도록 아래와 같이 설정한다.

```jsx
export default function example() {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("/textures/skull/Ground Skull_basecolor.jpg");

  texture.wrapS = THREE.RepeatWrapping; // 추가
  texture.offset.x = 0.3;

  // ..
}
```

그러면 원래대로 첫 번째 이미지와 동일하게 노출됨, offset.y로 0.3 움직여주면 아래와 위에 동일한 현상 발생

```jsx
export default function example() {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("/textures/skull/Ground Skull_basecolor.jpg");

  texture.wrapS = THREE.RepeatWrapping; // 추가

  texture.offset.x = 0.3;
  texture.offset.y = 0.3;

  // ..
}
```

![](../../img/230305-3.png)

```jsx
export default function example() {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("/textures/skull/Ground Skull_basecolor.jpg");

  texture.wrapS = THREE.RepeatWrapping; // x축
  texture.wrapT = THREE.RepeatWrapping; // y축

  texture.offset.x = 0.3;
  texture.offset.y = 0.3;

  // ..
}
```

위와 같이하면 모든 면이 첫 번째 이미지와 동일하게 노출된다. RepeatWrapping은 texture 변환 시 거의 기본적으로 넣어줘야하는 메서드임! 기억해두자.

```jsx
export default function example() {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("/textures/skull/Ground Skull_basecolor.jpg");

  texture.wrapS = THREE.RepeatWrapping; // x축
  texture.wrapT = THREE.RepeatWrapping; // y축

  texture.offset.x = 0.3;
  texture.offset.y = 0.3;

  // ..
}
```

다음으로 repeat에 대해 배워본다.

```jsx
export default function example() {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("/textures/skull/Ground Skull_basecolor.jpg");

  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  texture.offset.x = 0.3;
  texture.offset.y = 0.3;

  texture.repeat.x = 2; // repeat
  texture.repeat.y = 2; // repeat

  // ..
}
```

![](../../img/230305-4.png)

가로세로 2번의 반복을 주어 총 4개의 텍스트 이미지가 한 면에 노출되는 것을 확인할 수 있음 다음은 rotate이다.

```jsx
export default function example() {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("/textures/skull/Ground Skull_basecolor.jpg");

  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  // texture.rotation = Math.PI * 0.25; // 텍스쳐의 회전
  texture.rotation = THREE.MathUtils.degToRad(45); // 텍스쳐의 회전

  // ..
}
```

이러면 아래와 같이 회전함

![](../../img/230305-5.png)

그런데 뭔가 이상하다. 회전 축이 박스의 가운데에서 돌아가지 않아서.. 원하는대로 해골이 회전하지 않음 따라서 회전 중심축을 가운데로 바꿔준다.

```jsx
export default function example() {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("/textures/skull/Ground Skull_basecolor.jpg");

  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  texture.rotation = THREE.MathUtils.degToRad(65);
  texture.center.x = 0.5; // 텍스쳐의 중심점 변경 - x축 센터 정렬
  texture.center.y = 0.5; // 텍스쳐의 중심점 뱐걍 - y축 센터 정렬

  // ..
}
```

위와 같이 [texture.center](http://texture.center) 의 x, y 값을 0.5로 설정하면 한 면의 센터로 정렬되며 원하는대로 구현 가능함

![](../../img/230305-6.png)

### 여러 이미지 텍스쳐가 적용된 큐브

이번에는 여러가지 텍스쳐가 적용된 큐브를 만들어본다. 각각 면에 다른 이미지를 적용함
이미지는 `images/mcstyle` 폴더에 있는 이미지를 가져다 쓴다.

`src/ex09.js`

```jsx
// ----- 주제: 여러가지 텍스쳐가 적용된 큐브

export default function example() {
  const textureLoader = new THREE.TextureLoader();

  // 각 면에 들어갈 텍스쳐 이미지 로드
  const rightTexture = textureLoader.load("/textures/mcstyle/right.png");
  const leftTexture = textureLoader.load("/textures/mcstyle/left.png");
  const topTexture = textureLoader.load("/textures/mcstyle/top.png");
  const bottomTexture = textureLoader.load("/textures/mcstyle/bottom.png");
  const frontTexture = textureLoader.load("/textures/mcstyle/front.png");
  const backTexture = textureLoader.load("/textures/mcstyle/back.png");

  // 각 텍스쳐 원소로 가진 materials를 생성
  const materials = [
    new THREE.MeshBasicMaterial({ map: rightTexture }),
    new THREE.MeshBasicMaterial({ map: leftTexture }),
    new THREE.MeshBasicMaterial({ map: topTexture }),
    new THREE.MeshBasicMaterial({ map: bottomTexture }),
    new THREE.MeshBasicMaterial({ map: frontTexture }),
    new THREE.MeshBasicMaterial({ map: backTexture }),
  ];

  // ..

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const mesh = new THREE.Mesh(geometry, materials); // Mesh 적용 시 materials를 적용하여 각 면에 해당하는 이미지를 넣어줌
  scene.add(mesh);

  // ...
}
```

위와 같이 넣어주면 각 면에 맞는 이미지가 적용된 큐브가 만들어진다. (순서가 중요함)

![](../../img/230306-1.gif)

그런데 픽셀 크기의 이미지를 쓰니 화질이 영 떨어짐. 이를 개선하는 메서드가 있다.

```jsx
// ----- 주제: 여러가지 텍스쳐가 적용된 큐브

export default function example() {
  const textureLoader = new THREE.TextureLoader();

  // 각 면에 들어갈 텍스쳐 이미지 로드
  const rightTexture = textureLoader.load("/textures/mcstyle/right.png");
  // ..

  // 각 텍스쳐 원소로 가진 materials를 생성
  const materials = [
    new THREE.MeshBasicMaterial({ map: rightTexture }),
    // ..
  ];

  // 픽셀 크기의 이미지 화소를 선명하게 표현
  rightTexture.magFilter = THREE.NearestFilter;
  leftTexture.magFilter = THREE.NearestFilter;
  topTexture.magFilter = THREE.NearestFilter;
  bottomTexture.magFilter = THREE.NearestFilter;
  frontTexture.magFilter = THREE.NearestFilter;
  backTexture.magFilter = THREE.NearestFilter;

  // ..
}
```

위처럼 각 texture의 magFilterfh NearestFilter를 적용해주면 아래와 같이 선명한 블럭이 생성된다.

![](../../img/230306-2.gif)

마인크래프 블럭과 흡사한 블럭하나가 만들어진 것을 확인할 수 있음

### MeshToonMaterial(만화 느낌)

MeshToonMaterial은 만화 느낌을 주는 메서드이다.

`src/ex10.js`

```jsx
// ----- 주제: MeshToonMaterial (만화 느낌)

export default function example() {
  const textureLoader = new THREE.TextureLoader();
  // ...

  // Mesh
  const geometry = new THREE.ConeGeometry(1, 2, 128);
  const material = new THREE.MeshToonMaterial({
    color: "plum", // 2톤으로 만화적 표현 구현
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // ..
}
```

위와 같이 ConeGeometry 모양에 MeshToonMaterial을 plum color로 적용하면 아래와 같다.

![](../../img/230306-3.gif)

```jsx

```

여기에서 좀 더 그라데이션을 주기 위해 작은 픽셀에 (검정색-회색-하얀색) 3단계의 그라데이션이 담긴 파일(gradient.png)을 적용해본다. (포토샵을 이용해 간단히 생성 가능)

![1px에 위와 같이 각 색깔이 담겨있음](../../img/230306-1.png)

```jsx
// ----- 주제: MeshToonMaterial (만화 느낌)

export default function example() {
  const textureLoader = new THREE.TextureLoader();
  // gradientTex 이미지 로드
  const gradientTex = textureLoader.load("/textures/gradient.png");

  // ...

  // Mesh
  const geometry = new THREE.ConeGeometry(1, 2, 128);
  const material = new THREE.MeshToonMaterial({
    color: "plum",
    gradientMap: gradientTex, // gradientTex 적용
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // ..
}
```

위와 같이 gradientTex를 MeshToonMaterial의 gradientMap 속성에 적용하면 아래와 같이 노출된다.

![](../../img/230306-4.gif)

자연스러워졌으나 2D 만화의 느낌이 사라져버림. 이는 앞 시간에서 배운 magFilter를 적용하면 개선할 수 있다.

```jsx
// ----- 주제: MeshToonMaterial (만화 느낌)

export default function example() {
  const textureLoader = new THREE.TextureLoader();
  const gradientTex = textureLoader.load("/textures/gradient.png");
  gradientTex.magFilter = THREE.NearestFilter; // magFilter 적용

  // Mesh
  const geometry = new THREE.ConeGeometry(1, 2, 128);
  const material = new THREE.MeshToonMaterial({
    color: "plum",
    gradientMap: gradientTex,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // ..
}
```

위와 같이 magFilter에 NearestFilter를 적용해주면 영역 구분이 확실하게 나뉜 3단계 색을 가진 원뿔모양으로 변경됨. 만화 느낌 다시 만들어졌따 (🤨)

![](../../img/230306-5.gif)

### MeshNormalMaterial

이번에는 법선을 다루는 MeshNormalMaterial에 대해 알아본다.
위 코드에서 불필요한 부분을 제거하고 기본적인 MeshNormalMaterial만 적용하면 아래와 같다.

`src/ex11.js`

```jsx
// ----- 주제: MeshNormalMaterial(법선)

export default function example() {
  // ..
  // Mesh
  const geometry = new THREE.ConeGeometry(1, 2, 128);
  const material = new THREE.MeshNormalMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // ..
}
```

![](../../img/230307-1.gif)

위와 같이 법선 방향에 따라서 rgba 로 방향을 색으로 표현하기 때문에 자연스럽다.
위 원뿔을 큐브(`THREE.BoxGeometry(2,2,2)`)로 바꿔주면 방향에 따른 색 변화를 뚜렷하게 확인할 수 있다. (방향이 있으므로)

![](../../img/230307-2.gif)

### MeshMatcapMaterial

이번에는 MeshMatcapMaterial를 해본다. 구글에 matcap texture download라고 검색하면 여러가지 글이 나오는데, matcapmaterial은 동그란 이미지에 입체감이 있는 이미지로 이를 기반으로 3d 오브젝트 mesh에 적용할 수 있다.

![](../../img/230308-1.png)

[사이트](https://www.deviantart.com/sespider/art/163-FREE-MatCaps-258893793)에서 리소스를 다운로드 받은 뒤 `textures/matcap` 폴더에 옮긴 뒤 material3.jpg 파일을 적용한다.

![이 이미지를 적용해본다.(material3.jpg)](../../img/230308-2.jpg)

```jsx
// ----- 주제: MeshMatcapMaterial

export default function example() {
  const textureLoader = new THREE.TextureLoader();
  const matcapTex = textureLoader.load("/textures/matcap/material3.jpg");

  // ..
  // Mesh
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const material = new THREE.MeshMatcapMaterial({ matcap: matcapTex });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // ..
}
```

위와 같이 MeshMatcapMaterial에 matcapTex 데이터를 넣어주면 아래와 같이 노출됨.

![](../../img/230308-1.gif)

위 구에 적용된 요소들이 자연스럽게 BoxGeometry에 적용되어있다.

이를 `new THREE.SphereGeometry(1, 64, 64)`로 적용하면 아래와 같음
(거의 material3.jpg와 동일한 구가 생성된 느낌)

![](../../img/230308-3.png)

`new THREE.ConeGeometry(1, 2, 64)` 적용 시에는 아래와 같은 효과를 낼 수 있다.

![](../../img/230308-2.gif)

즉 구 형태에 입체감을 적용해놓으면 그것을 사용하여 mesh를 적용하는 개념이다.

![](../../img/230309-1.png)

위 이미지도 적용해보자.

```jsx
// ----- 주제: MeshMatcapMaterial

export default function example() {
  const textureLoader = new THREE.TextureLoader();
  const matcapTex = textureLoader.load("/textures/matcap/GeneticView_Purple-Jade.png");

  // 동일 ..
}
```

보라색 구 형태가 가진 입체감이 아래와 같이 입혀진다.

![](../../img/230309-1.gif)

싱기방기 ㅎ

### MeshStandardMaterial에 효과 더하기

```jsx
// ----- 주제: MeshStandardMaterial 에 효과 더하기

export default function example() {
  const textureLoader = new THREE.TextureLoader();
  const baseColorTex = textureLoader.load("/textures/brick/Brick_Wall_019_basecolor.jpg");
  // ..

  // Mesh
  const geometry = new THREE.BoxGeometry(3, 3, 3);
  const material = new THREE.MeshStandardMaterial({ map: baseColorTex });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // ..
}
```

위코드를 실행시켜 mesh를 확대해보면 사각형 박스에 해당 텍스쳐가 입혀진 상태로만 존재한다.

![](../../img/230311-1.png)

여기에 입체감을 조금 더해줄 수 있다.

```jsx
// ----- 주제: MeshStandardMaterial 에 효과 더하기

export default function example() {
  const textureLoader = new THREE.TextureLoader();
  const baseColorTex = textureLoader.load("/textures/brick/Brick_Wall_019_basecolor.jpg");
  // ..

  // Mesh
  const geometry = new THREE.BoxGeometry(3, 3, 3);
  const material = new THREE.MeshStandardMaterial({
    map: baseColorTex,
    normalMap: normalTex, // 입체감 부여
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // ..
}
```

![](../../img/230311-2.png)

입체감이 살짝 살아난 것을 확인할 수 있다. 여기에 저번 시간에 배운 roughness 효과를 주면

```jsx
// ----- 주제: MeshStandardMaterial 에 효과 더하기

export default function example() {
  const textureLoader = new THREE.TextureLoader();
  const baseColorTex = textureLoader.load("/textures/brick/Brick_Wall_019_basecolor.jpg");
  // ..

  // Mesh
  const geometry = new THREE.BoxGeometry(3, 3, 3);
  const material = new THREE.MeshStandardMaterial({
    map: baseColorTex,
    normalMap: normalTex, // 입체감 부여
    roughness: 0.3, // 거친 느낌 + 빛
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // ..
}
```

아래와 같은 진짜 벽돌벽 느낌이 난다..

![](../../img/230311-3.png)

빛에 비출 수록 더욱 그럴싸해보임

![](../../img/230311-4.png)

texture 세팅만으로 이러한 효과를 줄 수 있다.

아래와 같이 roughnessMap, adMap, aoMapIntensity 속성을 활용해서 좀 더 그럴싸한 mesh구현이 가능함

```jsx
// ----- 주제: MeshStandardMaterial 에 효과 더하기

export default function example() {
  const textureLoader = new THREE.TextureLoader();
  const baseColorTex = textureLoader.load("/textures/brick/Brick_Wall_019_basecolor.jpg");
  // ..

  // Mesh
  const geometry = new THREE.BoxGeometry(3, 3, 3);
  const material = new THREE.MeshStandardMaterial({
    map: baseColorTex,
    normalMap: normalTex, // 입체감 부여
    roughness: 0.3,
    metalness: 0.3,
    roughnessMap: roughnessTex, // nomalMap과 같이 입체감 부여
    aoMap: ambientTex, // 그림자 부분을 진하게
    aoMapIntensity: 5, // aoMap의 정도를 설정
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // ..
}
```

![](../../img/230311-5.png)

색을 넣으면 무시무시한 빨간색 벽돌 상자를 만들 수도 있음

```jsx
// ----- 주제: MeshStandardMaterial 에 효과 더하기

export default function example() {
  const textureLoader = new THREE.TextureLoader();
  const baseColorTex = textureLoader.load("/textures/brick/Brick_Wall_019_basecolor.jpg");
  // ..

  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("black");

  // Mesh
  const geometry = new THREE.BoxGeometry(3, 3, 3);
  const material = new THREE.MeshStandardMaterial({
    map: baseColorTex,
    normalMap: normalTex,
    roughness: 0.3,
    metalness: 0.3,
    roughnessMap: roughnessTex,
    aoMap: ambientTex,
    aoMapIntensity: 5,
    color: "red",
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // ..
}
```

![](../../img/230311-6.png)

### EnvironmentMap

EnvironmentMap은 주변에 뭔가 있는 것처럼 mesh에 비치게 하는 효과를 준다.
위 효과를 구현하기 위해 리소스를 [여기](https://polyhaven.com/a/dikhololo_night)에서 다운 받는다. (dikhololo_night_4k.hdr)

다운 받은 이미지를 큐브 모양 mesh에 적용할 때 이미지를 그대로 사용하는게 아니라 6개의 조각으로 나눠야함.
아래와 같이 말이다!

![3D View](../../img/230312-1.png)

![cubemap View](../../img/230312-2.png)

위처럼 3d View hdr 이미지를 cubemap view로 변환하여 사용함.
다운받은 이미지도 적용해보자.

![3D View](../../img/230312-3.png)

![Cubemap View](../../img/230312-4.png)

변환하는 cubemap view를 저장하는 방식은 3가지 방식이 있는데, 가장 마지막 방식인 각각 조각으로 나뉘어진 방식으로 선택하여 save 한다. (nx, ny, nz, px, py, pz.png - negative(-), positive(+)를 의미

![Cubemap View](../../img/230312-5.png)

이를 src/textures/cubemap 폴더에 옮겨 넣어준 뒤 코드를 추가해본다.

`src/ex14.js`

```jsx
// ----- 주제: EnvironmentMap

export default function example() {
  // 큐브 텍스쳐 이미지 로드
  const cubeTextureLoader = new THREE.CubeTextureLoader();
  const envMap = cubeTextureLoader
    .setPath("/textures/cubemap/")
    .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]); // + - 순서

  // ..
  // Mesh
  const geometry = new THREE.BoxGeometry(3, 3, 3);
  const material = new THREE.MeshStandardMaterial({ metalness: 2, roughness: 0.1, envMap });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // ..****
}
```

위와 같이 큐브 텍스쳐를 순서에 맞게 적용해서 넣은 뒤 화면에 렌더링하면 아래와 같이 노출된다.

![](../../img/230312-1.gif)

처음에는 하얀색 바탕에 아무것도 보이지 않지만, metalness, roughness 속성을 추가하면 아래와 같이 보임
MeshStandardMaterial이 아닌 MeshBasicMaterial을 사용하면 또 다르게 보인다.

```jsx
export default function example() {
  // 큐브 텍스쳐 이미지 로드
  // ..

  // **Mesh**
  const geometry = new THREE.BoxGeometry(3, 3, 3);
  const material = new THREE.MeshBasicMaterial({ envMap }); // Mesh 변경
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // ..
}
```

위 material 메서드를 변경하면 아래와 같이 노출됨.

![](../../img/230312-2.gif)

### Skybox

위에서 배운 EnvironmentMap의 경우 mesh에 주변 환경이 보여지도록 설정한 예시.
이번에는 배경에 주변 환경이 보여지도록(도배하는 느낌) 만들어본다. 실제 어떤 배경 공간을 만드는 의미임

`src/ex15.js`

```
// ----- 주제: Skybox
// https://polyhaven.com
// matheowis.github.io/HDRI-to-CubeMap

export default function example() {
  // 큐브 텍스쳐 이미지 로드
  const cubeTextureLoader = new THREE.CubeTextureLoader();

  // ...

  const scene = new THREE.Scene();
	scene.background = cubeTextureLoader
    .setPath("/textures/cubemap/")
    .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: "gold" });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // ..
}
```

위와 같이 기존 envMap 변수로 담았던 `cubeTextureLoader`를 scene.background로 지정해주면 됨
결과는 아래와 같다.

![](../../img/230313-1.gif)

저 큐브에 앞서 배웠던 envMap을 적용시켜 주변 환경이 비추는 효과를 준다면 더 그럴싸해 보일 것 같다.

`src/ex16.js`

```jsx
// ----- 주제: Skybox와 EnvMap

export default function example() {
  // 큐브 텍스쳐 이미지 로드
  const cubeTextureLoader = new THREE.CubeTextureLoader();
  const cubeTexture = cubeTextureLoader
    .setPath("/textures/cubemap/")
    .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]); // + - 순서

  // ..

  // Scene
  const scene = new THREE.Scene();
  scene.background = cubeTexture; // cubeTexture 배경화면 적용

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    envMap: cubeTexture, // envMap 으로 mesh 적용
    metalness: 2,
    roughness: 0.1,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // ...
}
```

위와 같이 처리해주면 배경화면 + 큐브에 비치는 배경 효과를 한번에 낼 수 있게된다.

![](../../img/230313-2.gif)

### Material에 Canvas 사용하기

이번 시간에는 메모리 상에 다른 캔버스를 하나 생성한 뒤 이 캔버스를 material의 texture로 활용해본다. canvas api를 사용해 애니메이션을 구현함(`ex01.js`를 기반으로 작업함)

`src/ex17.js`

```jsx
// ----- 주제: CanvasTexture

export default function example() {
  // Renderer, Scene, Camera, Controls..

  // CanvasTexture
  const texCanvas = document.createElement("canvas");
  const texContext = texCanvas.getContext("2d");
  texCanvas.width = 500; // texContext에 크기 설정
  texCanvas.height = 500; // texContext에 크기 설정
  const canvasTexture = new THREE.CanvasTexture(texCanvas); // THREE.CanvasTexture에 적용

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    map: canvasTexture, // canvasTexture 적용
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  function draw() {
    const time = clock.getElapsedTime(); // 흘러가는 time만 가져온다.

    material.map.needsUpdate = true; // needsUpdate 설정을 true로 해줘야 time * 50 정상 동작
    texContext.fillStyle = "green";
    texContext.fillRect(0, 0, texCanvas.width, texCanvas.height);
    texContext.fillStyle = "white";
    texContext.fillRect(time * 50, 100, 50, 50);
    texContext.font = "bold 50px sans-serif";
    texContext.fillText("Vicky", 200, 200);

    // ..
  }

  // ..
}
```

CanvasTexture를 위에서 생성한 뒤 이를 MeshBasicMaterial 에 map 요소로 추가해준다.
실제 그려질 데이터는 draw 함수 안에서 추가해줌(fillStyle, fillRect, font, fillText)
특히 draw 함수에서 특별한 애니메이션을 구현하기 위해서는 `material.map.needsUpdate`를 활성화해야 정상적으로 동작함.

![](../../img/230314-1.gif)

위 내용은 간단한 내용이지만 다양하게 활용하면 재미있는 큐브를 만들어낼 수 있을 것 같다.
