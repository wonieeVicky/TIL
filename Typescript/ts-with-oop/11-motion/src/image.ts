class MotionImage {
  constructor() {
    console.log('Image class created');
  }
  render() {
    document.querySelector('#MotionFunc')!.innerHTML +=
      '<button class="motionBtn">IMAGE</button>';
  }
}
