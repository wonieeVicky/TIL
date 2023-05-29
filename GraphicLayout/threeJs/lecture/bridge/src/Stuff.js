// Stuff.js는 물체를 생성하는 클래스입니다.
// 물체를 생성하는 클래스를 따로 만들어서 사용하는 이유는 물체를 생성하는 코드를 따로 모아서 관리하기 위함
// 물체를 생성하는 코드를 따로 모아서 관리하면 물체를 생성하는 코드를 재사용하기 쉬움

import { Body, Box, Vec3 } from "cannon-es";
import { cm1 } from "./common";

export class Stuff {
  constructor(info = {}) {
    this.name = info.name || "";
    this.x = info.x || 0;
    this.y = info.y || 0;
    this.z = info.z || 0;

    this.rotationY = info.rotationY || 0;
    this.rotationX = info.rotationX || 0;
    this.rotationZ = info.rotationZ || 0;

    this.cannonMaterial = info.cannonMaterial || cm1.defaultMaterial;
    this.mass = info.mass || 1;
  }
  setCannonBody() {
    const material = this.cannonMaterial;
    const shape = new Box(new Vec3(this.width / 2, this.height / 2, this.depth / 2));
    this.cannonBody = new Body({
      mass: this.mass,
      position: new Vec3(this.x, this.y, this.z),
      shape,
      material
    });
    cm1.world.addBody(this.cannonBody);
  }
}
