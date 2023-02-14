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

### 크기 조정

이번에는 크기를 조정해봄 mesh.scale로 변경하거나 mesh.scale.set 메서드로 변경가능

`src/ex02.js`

```jsx
import * as THREE from "three";
import dat from "dat.gui";

// ----- 주제: 크기 조정

export default function example() {
  // ..

  function draw() {
    mesh.scale.x = 2;
    mesh.scale.y = 0.5;

    // 혹은
    mesh.scale.set(2, 0.5, 1); // x, y, z

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  draw();
}
```

위와 같이 설정하면 아래와 같은 납작한 박스의 크기를 가진 mesh가 노출됨

![](../../img/230214-1.png)

### 회전

`src/ex03.js`

```jsx
import * as THREE from "three";
import dat from "dat.gui";

// ----- 주제: 회전

export default function example() {
  // ..

  function draw() {
    const delta = clock.getDelta();

    // Math.PI(3.14) = 180도
    mesh.rotation.x = THREE.MathUtils.degToRad(45); // 45도를 x축 기준으로 회전
    mesh.rotation.x = Math.PI / 4; // 위와 동일한 효과, 45도를 x축 기준으로 회전
    mesh.rotation.x = 1; // 30도 정도 회전
    mesh.rotation.y += delta; // 30도씩 회전

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  draw();
}
```

위와 같이 draw에 넣지 않고, 사물을 바깥에서 위치를 변경시켜보자.

```jsx
import * as THREE from "three";
import dat from "dat.gui";

// ----- 주제: 회전

export default function example() {
  // ..

  mesh.rotation.reorder("YXZ"); // 축 중심을 reorder로 설정
  mesh.rotation.y = THREE.MathUtils.degToRad(45);
  mesh.rotation.x = THREE.MathUtils.degToRad(10);

  // ..
}
```

위와 같이 y, x 축을 45, 10도씩 각 회전시키고 reorder로 x축 회전을 잘 잡아줌

![](../../img/230214-2.png)

만약 `mesh.rotation.reorder(”YXZ”)`가 없다면 아래와 같은 결과가 도출됨

![](../../img/230214-3.png)

축 이동을 적절히 해주어야 함
