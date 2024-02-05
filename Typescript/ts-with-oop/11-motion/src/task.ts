class MotionTask {
  constructor() {
    console.log('Task class created');
  }
  render() {
    document.querySelector('#MotionFunc')!.innerHTML +=
      '<button class="motionBtn">TASK</button>';
  }
}
