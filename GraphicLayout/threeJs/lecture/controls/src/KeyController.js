export class KeyController {
  constructor() {
    // 생성자
    this.keys = [];

    window.addEventListener("keydown", (e) => {
      console.log(e.code + " 누름");
      this.keys[e.code] = true; // 키보드 누르면 true - 예를 들어 w키를 누르면 this.keys["KeyW"] = true;
    });

    window.addEventListener("keyup", (e) => {
      console.log(e.code + " 뗌");
      delete this.keys[e.code]; // 키보드 뗄 때 this.keys["KeyW"] 삭제
    });
  }
}
