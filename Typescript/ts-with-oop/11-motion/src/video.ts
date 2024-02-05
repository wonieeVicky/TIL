class MotionVideo {
  constructor() {
    console.log('Video class created');
  }
  render() {
    document.querySelector('#MotionFunc')!.innerHTML +=
      '<button class="motionBtn">VIDEO</button>';
  }
}
