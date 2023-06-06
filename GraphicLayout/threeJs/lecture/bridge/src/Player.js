import { AnimationMixer, BoxGeometry, Mesh, MeshBasicMaterial } from "three";
import { Stuff } from "./Stuff";
import { cm1 } from "./common";

export class Player extends Stuff {
  constructor(info) {
    super(info);

    // geometry의 내부 속성을 사용해서 사이즈를 설정
    this.width = 0.5;
    this.height = 0.5;
    this.depth = 0.5;

    // this.mesh = new Mesh(new BoxGeometry(this.width, this.height, this.depth), new MeshBasicMaterial({ transparent: true, opacity: 0 }));
    // this.mesh.castShadow = true;
    // this.mesh.position.set(this.x, this.y, this.z);
    // cm1.scene.add(this.mesh);

    cm1.gltfLoader.load("/models/ilbuni.glb", (glb) => {
      // 그림자 생성
      glb.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
        }
      });

      this.modelMesh = glb.scene.children[0];
      this.modelMesh.position.set(this.x, this.y, this.z);
      this.modelMesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ); // 방향 돌려준다.
      this.modelMesh.castShadow = true;
      cm1.scene.add(this.modelMesh);

      this.modelMesh.animations = glb.animations; // 임의로 설정
      cm1.mixer = new AnimationMixer(this.modelMesh); // 재활용 하기 위해 cm1.mizer에 저장
      this.actions = [];
      this.actions.push(cm1.mixer.clipAction(this.modelMesh.animations[0])); // default
      this.actions.push(cm1.mixer.clipAction(this.modelMesh.animations[1])); // fall
      this.actions.push(cm1.mixer.clipAction(this.modelMesh.animations[2])); // jump

      this.actions[2].repetitions = 1; // jump 애니메이션은 한번만 수행하도록
      this.actions[0].play();

      this.setCannonBody();
    });
  }
}
