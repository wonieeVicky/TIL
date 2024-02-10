type MotionData = {};

class MotionFunction {
  title: string = '';
  url: string = '';
  type: string = ''; // image, video, note, task

  constructor(type: string) {
    this.type = type;
  }

  addClickEvent() {}

  drawModal() {
    const $modalContent = document.createElement('div');
    $modalContent.className = 'modalInner';
    $modalContent.innerHTML = `
      <div>
        <label for="title">Title</label>
        <input type="text" name="title" />
      </div>
      <div>
        <label for="url">Url</label>
        <input type="text" name="url" />
      </div>
      <div>
        <button class="add">ADD</button>
      </div>
    `;
    document.querySelector('#MotionModal')!.appendChild($modalContent);
    const modal = document.querySelector('#MotionModal') as HTMLElement;
    modal.classList.add('active');
  }
}

{
  const image = new MotionFunction('image');
}
