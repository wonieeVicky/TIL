## 3D 공간에서 캐릭터 움직이기

[춘식이 관찰일기 사이트](https://choonsikdiary.com/)처럼 캐릭터를 움직여본다.

![](../../img/230613-1.gif)

위와 같이 원하는 위치로 이동 시 이벤트가 발생하도록 구현한다. 구현한 기능을 설명하는 것 위주로 작업해봄.

`ilbunidiary/src/main.js`

```jsx
import * as THREE from "three";

// Texture
const textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load("/images/grid.png");
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.x = 10;
floorTexture.repeat.y = 10;
```

먼저 텍스쳐 설정을 해본다. 밑 바닥 grid를 설정한 것임. repeat 메서드를 사용해서 반복 정도를 조절할 수 있음

```jsx
// ..

// Renderer
const canvas = document.querySelector("#three-canvas");
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
```

기본 Scene 추가 후 Camera는 OrthographicCamera를 사용함.
이는 직교 카메라로 객체가 어디있던 동일한 크기로 보여주는 특징을 가진다. 마우스 컨트롤에 따라 확대되지 않으므로 2D와 비슷하게 보여지게 해줌. 각 인자로 left, right, top, bottom, near, far 등의 정보를 추가해주었다.
