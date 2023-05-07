import { Mesh, BoxGeometry, MeshBasicMaterial } from "three";
import { Body, Vec3, Box } from "cannon-es";

export class Domino {
  constructor(info) {
    this.scene = info.scene;
    this.cannonWorld = info.cannonWorld;

    this.index = info.index;

    this.width = info.width || 0.6;
    this.height = info.height || 1;
    this.depth = info.depth || 0.2;

    this.x = info.x || 0;
    this.y = info.y || 0.5;
    this.z = info.z || 0;

    this.rotationY = info.rotationY || 0;

    info.gltfLoader.load("/models/domino.glb", (glb) => {
      this.modelMesh = glb.scene.children[0];
      this.modelMesh.name = `${this.index}번 도미노`;
      this.modelMesh.castShadow = true;
      this.modelMesh.position.set(this.x, this.y, this.z);
      this.scene.add(this.modelMesh);

      this.setCannonBody();
    });
  }
  setCannonBody() {
    const shape = new Box(new Vec3(this.width / 2, this.height / 2, this.depth / 2));
    this.cannonBody = new Body({
      mass: 1,
      position: new Vec3(this.x, this.y, this.z),
      shape
    });
    this.cannonBody.quaternion.setFromAxisAngle(new Vec3(0, 1, 0), this.rotationY); // (축, 각도)

    this.modelMesh.cannonBody = this.cannonBody;
    this.cannonWorld.addBody(this.cannonBody);
  }
}
