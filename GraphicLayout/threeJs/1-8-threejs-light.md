## Light(조명)

### Light 기본 사용법

기본적인 Light를 적용해보자. [AmbientLight](https://threejs.org/docs/index.html?q=amb#api/en/lights/AmbientLight)는 전체적으로 은은하게 깔아주는 기본적인 Light이다.

`light/src/ex01.js`

```jsx
// ----- 주제: Light 기본 사용법

export default function example() {
  // Renderer, Scene, Camera, Controls...

  // Light
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: "seagreen" });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  //...
}
```

위 코드를 넣으면 아래와 같이 녹색 박스가 노출된다.

![](../../img/230315-1.png)

여기에 mesh를 여러개 추가해보자

`src/ex01.js`

```jsx
// ----- 주제: Light 기본 사용법

export default function example() {
  // Renderer, Scene, Camera, Controls...

  // Light
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  // Geometry
  const planeGeometry = new THREE.PlaneGeometry(10, 10);
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const sphereGeometry = new THREE.SphereGeometry(0.7, 16, 16);

  // Material
  const material1 = new THREE.MeshStandardMaterial({ color: "white" });
  const material2 = new THREE.MeshStandardMaterial({ color: "white" });
  const material3 = new THREE.MeshStandardMaterial({ color: "white" });

  // Mesh
  const plane = new THREE.Mesh(planeGeometry, material1);
  const box = new THREE.Mesh(boxGeometry, material2);
  const sphere = new THREE.Mesh(sphereGeometry, material3);
  scene.add(plane, box, sphere);

  //...
}
```

위와 같이 mesh를 여러개 추가하면 하얀색 만 나옴 시야를 뒤로 빼면 바닥으로 깐 planeGeometry와 이외의 mesh들이 붙어있는 구조인 것을 확인할 수 있다.

![](../../img/230315-2.png)

이들을 좀 떼어보자

```jsx
// ----- 주제: Light 기본 사용법

export default function example() {
  // Renderer, Scene, Camera, Controls...

  // Light
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  // Geometry
  const planeGeometry = new THREE.PlaneGeometry(10, 10);
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const sphereGeometry = new THREE.SphereGeometry(0.7, 16, 16);

  // Material
  const material1 = new THREE.MeshStandardMaterial({ color: "white" });
  const material2 = new THREE.MeshStandardMaterial({ color: "royalblue" });
  const material3 = new THREE.MeshStandardMaterial({ color: "gold" });

  // Mesh
  const plane = new THREE.Mesh(planeGeometry, material1);
  const box = new THREE.Mesh(boxGeometry, material2);
  const sphere = new THREE.Mesh(sphereGeometry, material3);

  plane.rotation.x = Math.PI * -0.5; // 눞혀주기
  box.position.set(1, 1, 0); // 우측으로 이동
  sphere.position.set(-1, 1, 0); // 좌측으로 이동

  scene.add(plane, box, sphere);

  //...
}
```

위처럼 mesh 별 컬러와 위치를 다르게 해주면 아래와 같이 노출됨

![](../../img/230315-3.png)

여기에 빛을 한가지 더 추가해보자

```jsx
// ----- 주제: Light 기본 사용법

export default function example() {
  // Renderer, Scene, Camera, Controls...

  // Light
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  // DirectionalLight 추가 - 태양광과 같은 느낌(전체적으로 뿌려짐)
  const light = new THREE.DirectionalLight("white", 0.5);
  light.position.y = 3;
  scene.add(light);

  //...
}
```

![](../../img/230315-4.png)

위와 같이 노출됨. 그런데 light.position을 설정해도 빛이 어느방향에서 넘어오는지 확인이 좀 어렵다. 그때에는 DirectionLightHelper를 사용하면 도움을 받을 수 있다.

```jsx
// ----- 주제: Light 기본 사용법

export default function example() {
  // Renderer, Scene, Camera, Controls...

  // Light
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  // DirectionalLight
  const light = new THREE.DirectionalLight("white", 0.5);
  light.position.y = 3;
  scene.add(light);

  // DirectionalLightHelper 추가
  const lightHelper = new THREE.DirectionalLightHelper(light);
  scene.add(lightHelper);

  //...
}
```

위와 같이 DirectionalLightHelper를 적용시키면 아래 이미지와 같이 빛이 비추는 방향이 사각형으로 그려짐

![](../../img/230315-5.png)

이러한 빛의 방향을 다양한 상황으로 확인하고 싶다면. dat.GUI를 활용하면 된다.

```jsx
// ----- 주제: Light 기본 사용법

export default function example() {
  // Renderer, Scene, Camera, Controls, Light, Mesh, AxesHelper ..

  // Dat GUI - light.position을 gui 툴에 적용
  const gui = new dat.GUI();
  gui.add(light.position, "x", -5, 5).name("light X");
  gui.add(light.position, "y", -5, 5).name("light Y");
  gui.add(light.position, "z", 2, 10).name("light Z");

  //...
}
```

위와 같이 light.position 값을 dat.GUI에 적용하면 아래와 같음

![](../../img/230315-1.gif)

light.position에 대한 이해를 깊게 해볼 수 있다.

### Light 애니메이션

이번에는 Light에 애니메이션을 넣어보자! 움직이는 것이니 draw 함수 안에서 구현한다.

`src/ex02.js`

```jsx
// ----- 주제: Light 애니메이션

export default function example() {
  // ...

  // DirectionalLight 추가 - 태양광과 같은 느낌(전체적으로 뿌려짐)
  const light = new THREE.DirectionalLight("red", 0.5); // 위치 확인을 위해 색 변경
  light.position.y = 3;
  scene.add(light);

  // ..
  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    // const delta = clock.getDelta(); // 프레임마다 시간을 가져옴(항상 같은 값)
    const time = clock.getElapsedTime(); // 시작후 경과된 시간을 가져옴(계속 증가하는 값)

    // 삼각함수 사용 원리
    // sin: 0 ~ 1 ~ 0 ~ -1 ~ 0 : a = 1일 때 b의 값을 의미(y)
    // cos: 1 ~ 0 ~ -1 ~ 0 ~ 1 : a = 1일 때 c의 값을 의미(x)

    light.position.x = Math.cos(time) * 3;
    light.position.z = Math.sin(time) * 3;

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  // ..
  draw();
}
```

![light 위치 변화에 따른 사물의 빛 변화를 확인해보자](../../img/230316-1.gif)

위와 같이 빛이 동그란 원형을 띄는 애니메이션으로 동작하는 것을 확인할 수 있다.
이를 위 코드에서는 cos, sin 함수를 이용해서 구현했는데, 원래는 아래와 같다.

![sin은 b/a이며 a=1일 때, b를 나타낸다. cos는 c/a이며 a=1d일 때, c를 나타낸다.](../../img/230316-1.png)

![a값은 동일하므로 b의 값이 증감함에 따라 c값이 작아지므로, 이러한 원리를 통해 원형 애니메이션 동작이 가능해짐](../../img/230316-2.png)
