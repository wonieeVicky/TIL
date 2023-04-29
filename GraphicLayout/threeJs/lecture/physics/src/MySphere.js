import { Body, Sphere, Vec3 } from "cannon-es";
import { Mesh } from "three";

export class MySphere {
  constructor(info) {
    this.scene = info.scene;
    this.cannonWorld = info.cannonWorld;
    this.geometry = info.geometry;
    this.material = info.material;
    this.x = info.x;
    this.y = info.y;
    this.z = info.z;
    this.scale = info.scale;

    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.scale.set(this.scale, this.scale, this.scale);
    this.mesh.castShadow = true;
    this.mesh.position.set(this.x, this.y, this.z); // position 설정은 cannon body에서 설정하면 mesh가 따라가므로 무의미함
    this.scene.add(this.mesh);

    this.setCannonBody();
  }

  setCannonBody() {
    const shape = new Sphere(0.5 * this.scale); // Sphere의 크기가 모두 다른 상태 > 각 반지름을 구해야 함
    this.cannonBody = new Body({
      mass: 1,
      position: new Vec3(this.x, this.y, this.z),
      shape
    });

    this.cannonWorld.addBody(this.cannonBody);
  }
}
