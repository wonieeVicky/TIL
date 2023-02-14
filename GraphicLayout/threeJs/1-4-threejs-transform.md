## Transform(변환)

### 위치 이동

이번 시간에는 변환에 대해 알아본다. 형태의 변화 중 위치 이동을 먼저 해보자
가장 간단하게 위치를 이동 시키는 건 mesh의 position을 조절하는 방법이 있음

`src/ex01.js`

```jsx
import * as THREE from "three";
import dat from "dat.gui";

// ----- 주제: 위치 이동

export default function example() {
  // ..

  function draw() {
    mesh.position.y = 2; // 위치 설정

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  draw();
}
```

위와 같이 해주면 mesh가 2만큼 y축으로 증가한 위치에 이동됨. 위 코드는 아래와 같이 쓸 수 있다.

```jsx
import * as THREE from "three";
import dat from "dat.gui";

// ----- 주제: 위치 이동

export default function example() {
  // ..

  function draw() {
    // mesh.position.y = 2; // 위치 설정
    mesh.position.set(-1, 2, -5); // x, y, z

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  draw();
}
```

`position.set` 메서드를 쓰면 x, y, z 축에 대한 위치를 한번에 설정할 수 있음

실제 이동한 mesh가 원점으로부터 거리가 얼마정도인지 알고 싶다면 아래와 같이 측정할 수 있다.

```jsx

import * as THREE from "three";
import dat from "dat.gui";

// ----- 주제: 위치 이동

export default function example() {
  // ..

  function draw() {
    // mesh.position.y = 2; // 위치 설정
		mesh.position.set(-1, 2, -5); // x, y, z
		console.log(mesh.position.length()); // 원점에서부터 거리를 측정
    console.log(mesh.position.distanceTo(camera.position)); // 카메라까지 거리를 측정
		console.log(mesh.position.distanceTo(new THREE.Vector3(1, 2, 0)); // 새로운 vector까지 거리를 측정

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  draw();
}
```
