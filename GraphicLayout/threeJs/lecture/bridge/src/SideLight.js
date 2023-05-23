import { Mesh } from "three";
import { cm1, geo, mat } from "./common";

export class SideLight {
  constructor(info) {
    const container = info.container || cm1.scene;

    this.name = info.name || "";
    this.x = info.x || 0;
    this.y = info.y || 0;
    this.z = info.z || 0;

    this.geometry = geo.sideLight;
    this.material = mat.sideLight;

    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.set(this.x, this.y, this.z);

    // cm1.scene.add(this.mesh); // scene에 추가하지 않음
    container.add(this.mesh);
  }
}
