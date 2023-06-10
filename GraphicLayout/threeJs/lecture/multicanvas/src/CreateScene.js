import { Color, PerspectiveCamera, Scene } from "three";

export class CreateScene {
  constructor(info) {
    this.renderer = info.renderer;
    this.el = document.querySelector(info.placeholder);
    const rect = this.el.getBoundingClientRect(); // DOMRect {x: 8, y: 8, width: 784, …}
    console.log("rect:", rect);

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
  }
}
