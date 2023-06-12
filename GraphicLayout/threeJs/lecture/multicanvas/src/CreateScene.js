import { Color, PerspectiveCamera, Scene } from "three";

export class CreateScene {
  constructor(info) {
    this.renderer = info.renderer;
    this.el = document.querySelector(info.placeholder);
    const rect = this.el.getBoundingClientRect(); // DOMRect {x: 8, y: 8, width: 784, …}

    const bgColor = info.bgColor || "white";
    const fov = info.fov || 75; // field of view
    const aspect = rect.width / rect.height;
    const near = info.near || 0.1;
    const far = info.far || 100;
    const cameraPosition = info.cameraPosition || { x: 0, y: 0, z: 3 };

    // Scene
    this.scene = new Scene();
    this.scene.background = new Color(bgColor);

    // Camera
    this.camera = new PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);

    this.scene.add(this.camera);
    this.meshes = []; // mesh들을 담아놓을 배열공간 추가
  }

  set(func) {
    func();
  }

  render() {
    const renderer = this.renderer;
    const rect = this.el.getBoundingClientRect();

    // 영역이 화면에 포함되지 않은 경우 함수 종료
    const isOffScreen =
      rect.top > renderer.domElement.clientHeight || rect.bottom < 0 || rect.left > renderer.domElement.clientWidth || rect.right < 0;
    if (isOffScreen) return;

    this.camera.aspect = rect.width / rect.height;
    this.camera.updateProjectionMatrix();

    // setScissor: true로 설정하면, 캔버스의 영역을 벗어나는 부분은 그리지 않는다.
    const canvasBottom = renderer.domElement.clientHeight - rect.bottom;
    renderer.setScissor(rect.left, canvasBottom, rect.width, rect.height);
    renderer.setViewport(rect.left, canvasBottom, rect.width, rect.height);
    renderer.setScissorTest(true);

    renderer.render(this.scene, this.camera);
  }
}
