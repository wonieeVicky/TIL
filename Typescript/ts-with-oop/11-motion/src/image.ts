class MotionImage {
  private title: string = '';
  private url: string = '';

  static render(): MotionImage {
    document.querySelector('#MotionFunc')!.innerHTML +=
      '<button class="image" id="MotionBtn">IMAGE</button>';
    return new MotionImage();
  }
}
