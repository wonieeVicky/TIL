import { DoubleSide, MeshBasicMaterial, Mesh } from "three";

export class ImagePanel {
  constructor(info) {
    const texture = info.textureLoader.load(info.imageSrc); // texture 생성
    const material = new MeshBasicMaterial({ map: texture, side: DoubleSide }); // material 생성

    this.mesh = new Mesh(info.geometry, material); // mesh 생성
    this.mesh.position.set(info.x, info.y, info.z); // mesh 위치 설정
    this.mesh.lookAt(0, 0, 0); // mesh의 z축을 카메라 방향으로 설정

    info.scene.add(this.mesh); // scene에 mesh 추가
  }
}
