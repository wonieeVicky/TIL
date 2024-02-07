class MotionVideo {
  constructor() {
    console.log('Video class created');
  }
  static render(): MotionVideo {
    document.querySelector('#MotionFunc')!.innerHTML +=
      '<button class="video" id="MotionBtn">VIDEO</button>';
    return new MotionVideo();
  }
}
