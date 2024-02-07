class MotionTask {
  constructor() {
    console.log('Task class created');
  }
  static render(): MotionTask {
    document.querySelector('#MotionFunc')!.innerHTML +=
      '<button class="task" id="MotionBtn">TASK</button>';
    return new MotionTask();
  }
}
