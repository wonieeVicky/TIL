class MotionNote {
  constructor() {
    console.log('Note class created');
  }
  render() {
    document.querySelector('#MotionFunc')!.innerHTML +=
      '<button class="motionBtn">NOTE</button>';
  }
}
