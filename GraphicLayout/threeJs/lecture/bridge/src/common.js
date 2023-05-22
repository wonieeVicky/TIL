import { BoxGeometry, MeshPhongMaterial, Scene } from "three";

export const cm1 = {
  canvas: document.querySelector("#three-canvas"),
  scene: new Scene()
};

export const cm2 = {
  backgroundColor: "#3e1322",
  lightColor: "#ffe9ac",
  pillarColor: "#071d28",
  floorColor: "#111"
};

export const geo = {
  pillar: new BoxGeometry(5, 10, 5),
  floor: new BoxGeometry(200, 1, 200)
};

export const mat = {
  pillar: new MeshPhongMaterial({ color: cm2.pillarColor }),
  floor: new MeshPhongMaterial({ color: cm2.floorColor })
};
