import { Mesh } from "three";
import { Stuff } from "./Stuff";
import { cm1, geo, mat } from "./common";

export class Glass extends Stuff {
  constructor(info) {
    super(info);

    this.type = info.type;
    this.step = info.step;

    this.geometry = geo.glass;
    switch (this.type) {
      case "normal":
        this.material = mat.glass1;
        this.mass = 1;
        break;
      case "strong":
        this.material = mat.glass2;
        this.mass = 1000;
        break;
    }

    // geometry의 내부 속성을 사용해서 사이즈를 설정
    this.width = this.geometry.parameters.width;
    this.height = this.geometry.parameters.height;
    this.depth = this.geometry.parameters.depth;

    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.set(this.x, this.y, this.z);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.name = this.name;
    this.mesh.step = this.step;
    this.mesh.type = this.type;
    cm1.scene.add(this.mesh);

    this.setCannonBody();
  }
}
