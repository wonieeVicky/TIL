export class House {
  constructor(info) {
    this.x = info.x;
    this.z = info.z;

    this.height = info.height || 2;

    info.gltfLoader.load(info.modelSrc, (glb) => {
      this.mesh = glb.scene.children[0];
      this.mesh.castShadow = true; // 그림자 효과
      this.mesh.position.set(this.x, this.height / 2, this.z);
      info.scene.add(this.mesh);
    });
  }
}
