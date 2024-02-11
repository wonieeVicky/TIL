type MotionData = {};

class MotionFunction {
  title: string = '';
  url: string = '';
  type: string = ''; // image, video, note, task

  constructor(type: string) {
    this.type = type;
  }

  getData = () => {
    const title = (
      document.querySelector('input[name="title"]') as HTMLInputElement
    ).value;
    const url = (
      document.querySelector('input[name="url"]') as HTMLInputElement
    ).value;
    this.title = title;
    this.url = url;
    this.saveData();
  };

  saveData() {
    const data: MotionData = {
      title: this.title,
      url: this.url,
      type: this.type
    };
    console.log(data);
  }

  toggleModal() {
    if (document.querySelector('.modalInner')) {
      return;
    }
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
    document.querySelector('#modal')!.appendChild($modalContent);
    const modal = document.querySelector('#modal') as HTMLElement;
    modal.classList.add('active');
    document.querySelector('.add')!.addEventListener('click', () => {
      this.getData();
      modal.classList.remove('active');
    });
  }
}

{
  const image = new MotionFunction('image');
  window.addEventListener('load', () => {
    document
      .querySelector('#Image')!
      .addEventListener('click', image.toggleModal);
  });
}
