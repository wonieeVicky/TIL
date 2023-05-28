// Stuff.js는 물체를 생성하는 클래스입니다.
// 물체를 생성하는 클래스를 따로 만들어서 사용하는 이유는 물체를 생성하는 코드를 따로 모아서 관리하기 위함
// 물체를 생성하는 코드를 따로 모아서 관리하면 물체를 생성하는 코드를 재사용하기 쉬움

import { Box, Vec3 } from "cannon-es";

export class Stuff {
  constructor(info = {}) {
    this.name = info.name || "";
    this.x = info.x || 0;
    this.y = info.y || 0;
    this.z = info.z || 0;

    this.rotationY = info.rotationY || 0;
    this.rotationX = info.rotationX || 0;
    this.rotationZ = info.rotationZ || 0;
  }
  setCannonBody() {
    const material = info.cannonMaterial || cm1.defaultMaterial;
    const shape = new Box(new Vec3(this.width / 2, this.height / 2, this.depth / 2));
  }
}
