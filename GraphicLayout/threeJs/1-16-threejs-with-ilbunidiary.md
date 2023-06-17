## 3D 공간에서 캐릭터 움직이기

[춘식이 관찰일기 사이트](https://choonsikdiary.com/)처럼 캐릭터를 움직여본다.

![](../../img/230613-1.gif)

위와 같이 원하는 위치로 이동 시 이벤트가 발생하도록 구현한다. 구현한 기능을 설명하는 것 위주로 작업해봄.

`ilbunidiary/src/main.js`

```jsx
import * as THREE from 'three';

// Texture
const textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load('/images/grid.png');
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.x = 10;
floorTexture.repeat.y = 10;
```

먼저 텍스쳐 설정을 해본다. 밑 바닥 grid를 설정한 것임. repeat 메서드를 사용해서 반복 정도를 조절할 수 있음

```jsx
// ..

// Renderer
const canvas = document.querySelector('#three-canvas');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
```

Renderer에서는 기본 Renderer 설정 후 shadowMap.type을 PCFSoftShadowMap을 사용해 부드러운 그림자를 표현하도록 설정해주었음

```jsx
// ..
// Scene
const scene = new THREE.Scene();

// Camera - 직교 카메라 사용, 객체가 어디있던 동일한 크기로 보여준다. (2D와 비슷함)
const camera = new THREE.OrthographicCamera(
  -(window.innerWidth / window.innerHeight), // left
  window.innerWidth / window.innerHeight, // right,
  1, // top
  -1, // bottom
  -1000, // near
  1000 // far
);

const cameraPosition = new THREE.Vector3(1, 5, 5);
camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
camera.zoom = 0.2;
camera.updateProjectionMatrix();
scene.add(camera);

// Light
const ambientLight = new THREE.AmbientLight('white', 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('white', 0.5);
const directionalLightOriginPosition = new THREE.Vector3(1, 1, 1);
directionalLight.position.x = directionalLightOriginPosition.x;
directionalLight.position.y = directionalLightOriginPosition.y;
directionalLight.position.z = directionalLightOriginPosition.z;
directionalLight.castShadow = true;

// mapSize 세팅으로 그림자 퀄리티 설정
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
// 그림자 범위
directionalLight.shadow.camera.left = -100;
directionalLight.shadow.camera.right = 100;
directionalLight.shadow.camera.top = 100;
directionalLight.shadow.camera.bottom = -100;
directionalLight.shadow.camera.near = -100;
directionalLight.shadow.camera.far = 100;
scene.add(directionalLight);
```

기본 Scene 추가 후 Camera는 OrthographicCamera를 사용함.
이는 직교 카메라로 객체가 어디있던 동일한 크기로 보여주는 특징을 가진다. 마우스 컨트롤에 따라 확대되지 않으므로 2D와 비슷하게 보여지게 해줌. 각 인자로 left, right, top, bottom, near, far 등의 정보를 추가해주었다.

다음은 Mesh Mesh는 floor와 pointer, spot Mesh로 구성된다. 셋 다 Plan Mesh임

```jsx
// Mesh
const meshes = [];
const floorMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({
    map: floorTexture
  })
);
floorMesh.name = 'floor';
floorMesh.rotation.x = -Math.PI / 2; // 바닥이어야 하므로 -90도
floorMesh.receiveShadow = true;
scene.add(floorMesh);
meshes.push(floorMesh);

const pointerMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.MeshBasicMaterial({
    color: 'crimson',
    transparent: true,
    opacity: 0.5
  })
);
pointerMesh.rotation.x = -Math.PI / 2; // 바닥이어야 하므로 -90도
pointerMesh.position.y = 0.01;
pointerMesh.receiveShadow = true;
scene.add(pointerMesh);

const spotMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(3, 3),
  new THREE.MeshStandardMaterial({
    color: 'yellow',
    transparent: true,
    opacity: 0.5
  })
);
spotMesh.position.set(5, 0.005, 5);
spotMesh.rotation.x = -Math.PI / 2; // 바닥이어야 하므로 -90도
spotMesh.receiveShadow = true;
scene.add(spotMesh);
```

다음으로는 캐릭터와 집은 gltf 로더로 로드해온 파일이다.

```jsx
const gltfLoader = new GLTFLoader();

const house = new House({
  gltfLoader,
  scene,
  modelSrc: '/models/house.glb',
  x: 5,
  y: -1.3,
  z: 2
});

const player = new Player({
  scene,
  meshes,
  gltfLoader,
  modelSrc: '/models/ilbuni.glb'
});
```

House 클래스는 아래와 같이 구현한다.

`src/House.js`

```jsx
export class House {
  constructor(info) {
    this.x = info.x;
    this.y = info.y;
    this.z = info.z;

    this.visible = false; // 처음엔 안보이게

    info.gltfLoader.load(info.modelSrc, (glb) => {
      this.modelMesh = glb.scene.children[0];
      this.modelMesh.castShadow = true;
      this.modelMesh.position.set(this.x, this.y, this.z);
      info.scene.add(this.modelMesh);
    });
  }
}
```

Player 클래스도 아래와 같이 구현함

```jsx
import { AnimationMixer } from 'three';

export class Player {
  constructor(info) {
    this.moving = false; // 걸어가는 상태 체크를 위해 생성

    info.gltfLoader.load(info.modelSrc, (glb) => {
      // 그림자 표현 traverse로 구현
      glb.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
        }
      });

      this.modelMesh = glb.scene.children[0];
      this.modelMesh.position.y = 0.3;
      this.modelMesh.name = 'ilbuni';
      info.scene.add(this.modelMesh);
      info.meshes.push(this.modelMesh);

      this.actions = [];

      this.mixer = new AnimationMixer(this.modelMesh);
      this.actions[0] = this.mixer.clipAction(glb.animations[0]); // 일반 애니메이션
      this.actions[1] = this.mixer.clipAction(glb.animations[1]); // 걷기 애니메이션
      this.actions[0].play(); // 까딱까닥 움직임은 기본적으로 적용
    });
  }
}
```

다음으로 raycaster 코드를 추가한다. raycaster는 마우스 클릭 시 해당 좌표로 캐릭터가 이동시켜야하므로 필요함

```jsx
const raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let destinationPoint = new THREE.Vector3();
let angle = 0;
let isPressed = false; // 마우스를 누르고 있는 상태
```

다음으로는 마우스 이벤트부터 확인하자

```jsx
// 마우스 좌표를 three.js에 맞게 변환
function calculateMousePosition(e) {
  mouse.x = (e.clientX / canvas.clientWidth) * 2 - 1;
  mouse.y = -((e.clientY / canvas.clientHeight) * 2 - 1);
}

// 마우스 이벤트
canvas.addEventListener('mousedown', (e) => {
  isPressed = true;
  calculateMousePosition(e); // 클릭한 지점 체크, e 객체 그대로 사용
});
canvas.addEventListener('mouseup', () => {
  isPressed = false;
});
canvas.addEventListener('mousemove', (e) => {
  // 드래그 상태
  if (isPressed) {
    calculateMousePosition(e); // 클릭한 지점 체크
  }
});
```

터치 이벤트도 위와 유사한데, 이는 모바일 기기에서도 동작를 위해 추가함

```jsx
// 터치 이벤트
canvas.addEventListener('touchstart', (e) => {
  isPressed = true;
  calculateMousePosition(e.touches[0]); // e.touches로 데이터 가져올 수 있다.
});
canvas.addEventListener('touchend', () => {
  isPressed = false;
});
canvas.addEventListener('touchmove', (e) => {
  if (isPressed) {
    calculateMousePosition(e.touches[0]);
  }
});
```

그러면 이제 raycating에서 좌표 계산한 값을 사용하는 부분을 작업해보자. 기존에는 클릭 시 광선을 쏴서 그 시점의 좌표를 체크했는데, 이번에는 마우스가 움직일 때마다 해당 좌표를 UI로 노출해야하므로 draw 함수 안에서 tick 마다 계속 반복시켜줘야한다.

![이렇게 마우스 이동 시 마다 해당 좌표를 보여줘야하므로 draw 함수 내부에서 동작](../../img/230617-1.png)

drag의 상태가 isPressed 일때 raycasting이라는 함수를 시작하는데, 그 때 좌표를 캐치하는 코드가 들어간다.

```jsx
const raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let destinationPoint = new THREE.Vector3();
let angle = 0;
let isPressed = false; // 마우스를 누르고 있는 상태

const clock = new THREE.Clock();

function draw() {
  const delta = clock.getDelta();

  //..
  if (player.modelMesh) {
    if (isPressed) {
      raycasting(); // raycasting으로 해당 좌표 가져온다.
    }
    //..
  }
  renderer.render(scene, camera);
  renderer.setAnimationLoop(draw);
}

// 변환된 마우스 좌표를 이용해 래이캐스팅
function raycasting() {
  raycaster.setFromCamera(mouse, camera);
  checkIntersects();
}
```

그럼 raycaster가 좌표를 얻어오는 checkIntersects 함수를 살펴보자

```jsx
function checkIntersects() {
  // raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(meshes);

  // 광선에 부딪힌 item들이 있으면
  for (const item of intersects) {
    // 부딪힌 item이 floor일 때만 동작
    if (item.object.name === 'floor') {
      destinationPoint.x = item.point.x;
      destinationPoint.y = 0.3;
      destinationPoint.z = item.point.z;
      player.modelMesh.lookAt(destinationPoint); // 해당 좌표를 바라본다.

      player.moving = true; // 움직이는 상태 추가

      pointerMesh.position.x = destinationPoint.x; // 빨간색 포인터 mesh
      pointerMesh.position.z = destinationPoint.z; // 빨간색 포인터 mesh
    }
    break;
  }
}
```

destinationPoint는 Vertor3로 생성한 변수로 해당 변수에 x, y, z 값을 저장한다.
예를 들어 x의 경우 item.point.x가 저장되는데 item.point에는 광선이 부딪힌 지점의 x, y, z point 정보가 담겨있다. 이 정보로 캐릭터를 이동시키면 되기 때문에 해당 값을 사용한다.

그런데 y값은 0.3으로 고정됨. y는 평면상에서만 움직이기 때문에 캐릭터의 키에 맞춰서 한번 설정하는 값임
또 캐릭터는 해당 좌표를 자동으로 바라보고 따라오는데, 이는 위 코드에서 `player.modelMesh.lookAt(destinationPoint)`를 설정해줘서 가능함

마지막으로 draw 함수를 살펴본다.

`main.js`

```jsx
function draw() {
  const delta = clock.getDelta();

  if (player.mixer) player.mixer.update(delta); // 기본 애니메이션 동작 처리

  if (player.modelMesh) {
    // 플레이어가 생성되었을 때만 카메라가 플레이어를 바라보도록 실행
    camera.lookAt(player.modelMesh.position);
  }

  // 플레이어가 생성되었을 때만
  if (player.modelMesh) {
    // 누르고 있는 상태라면 raycasting
    if (isPressed) {
      raycasting();
    }

    // 움직이는 상태일 때
    if (player.moving) {
      // 걸어가는 상태(angle은 플레이어가 걸어가는 각도 계산 - 이동할 위치와 현 위치 사이의 사이의 각도)
      angle = Math.atan2(destinationPoint.z - player.modelMesh.position.z, destinationPoint.x - player.modelMesh.position.x);
      player.modelMesh.position.x += Math.cos(angle) * 0.05;
      player.modelMesh.position.z += Math.sin(angle) * 0.05;

      // 카메라가 플레이어를 따라가도록 설정
      camera.position.x = cameraPosition.x + player.modelMesh.position.x; // 카메라 포지션 + 플레이어 포지션
      camera.position.z = cameraPosition.z + player.modelMesh.position.z;

      player.actions[0].stop(); // 갸우뜽갸우뚱 멈추기
      player.actions[1].play(); // 걷기 애니메이션 시작

      // 해당 위치가 목표지점에 도착했을 때 멈추기
      if (Math.abs(destinationPoint.x - player.modelMesh.position.x) < 0.03 && Math.abs(destinationPoint.z - player.modelMesh.position.z) < 0.03) {
        player.moving = false;
        console.log('멈춤');
      }

      // 집이 나오는 spotMesh에 도착하면 멈추기 - 크기가 크기 때문에 1.5로 처리
      if (Math.abs(spotMesh.position.x - player.modelMesh.position.x) < 1.5 && Math.abs(spotMesh.position.z - player.modelMesh.position.z) < 1.5) {
        if (!house.visible) {
          console.log('나와');
          house.visible = true; // 집 보이기
          spotMesh.material.color.set('seagreen');
          // 애니메이션 구현, 집이 뛰어나오게 하자
          gsap.to(house.modelMesh.position, {
            duration: 1,
            y: 1,
            ease: 'Bounce.easeOut' // 띠용 효과를 주기 위함
          });
          // 카메라의 위치를 바꿔준다.
          gsap.to(camera.position, {
            duration: 1,
            y: 3
          });
        }
      } else if (house.visible) {
        console.log('들어가');
        house.visible = false; // 집 숨기기
        spotMesh.material.color.set('yellow');
        gsap.to(house.modelMesh.position, {
          // 집 들어가
          duration: 0.5,
          y: -1.3
        });
        gsap.to(camera.position, {
          // 카메라 위치 원래대로
          duration: 1,
          y: 5
        });
      }
    } else {
      // 서 있는 상태
      player.actions[1].stop();
      player.actions[0].play();
    }
  }

  renderer.render(scene, camera);
  renderer.setAnimationLoop(draw);
}
```

![이동할 위치에 대한 걸어갈 각도를 구한다.](../../img/230617-2.png)

위 순서에 대해 단계별로 이해해보면 됨 😆 원리를 이해하자
