class MotionNote {
  constructor() {
    console.log('Note class created');
  }
  static render(): MotionNote {
    document.querySelector('#MotionFunc')!.innerHTML +=
      '<button class="note" id="MotionBtn">NOTE</button>';
    return new MotionNote();
  }
}
