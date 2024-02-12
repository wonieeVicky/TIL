type MotionData = {
  title: string;
  url: string;
};

class MotionFunction {
  title: string = '';
  url: string = '';
  type: string = ''; // image, video, note, task

  constructor(type: string) {
    this.type = type;
  }

  saveData = () => {
    const title = document.querySelector('#title') as HTMLInputElement;
    const url = document.querySelector('#url') as HTMLInputElement;
    this.title = title.value;
    this.url = url.value;

    if (!this.title || !this.url) {
      alert('Please fill out the form');
      return;
    }

    const newData = {
      title: this.title,
      url: this.url
    };

    if (localStorage.getItem(this.type)) {
      const data = JSON.parse(localStorage.getItem(this.type) as string);

      if (
        data.some(
          (item: MotionData) =>
            item.title === this.title && item.url === this.url
        )
      ) {
        alert('The data is already exist');
        return;
      }

      localStorage.setItem(this.type, JSON.stringify([...data, newData]));
    } else {
      localStorage.setItem(this.type, JSON.stringify([newData]));
    }

    this.toggleModal();
  };

  toggleModal = () => {
    const modal = document.querySelector('#modal')!;
    modal.classList.remove('active');
    const modalBackground = document.querySelector('.modal-background')!;
    modalBackground.classList.remove('active');
    const modalContent = document.querySelector('.modal-content')!;
    modalContent.innerHTML = '';
  };

  activeModal = () => {
    // add classList
    const $modal = document.querySelector('#modal')!;
    $modal.classList.add('active');
    const $modalContent = document.querySelector('.modal-content')!;
    $modalContent.classList.add('active');
    const $modalBackground = document.querySelector('.modal-background')!;
    $modalBackground.classList.add('active');

    // add event listener
    $modalBackground.addEventListener('click', this.toggleModal);
    const $modalClose = document.querySelector('.modal-close')!;
    $modalClose.addEventListener('click', this.toggleModal);
    const $modalSave = document.querySelector('.modal-save')!;
    $modalSave.addEventListener('click', this.saveData);
  };

  addModalContent = () => {
    const modalContent = document.querySelector('.modal-content')!;
    modalContent.innerHTML = `
      <div class="modal-header">
        <button class="modal-close"></button>
      </div>
      <div class="modal-body">
        <label for="title">Title</label>
        <input type="text" id="title" placeholder="Title" required />
        <label for="url">URL</label>
        <input type="text" id="url" placeholder="URL" required />
      </div>
      <div class="modal-footer">
        <button class="modal-save">ADD</button>
      </div>
      `;
    this.activeModal();
  };
}

{
  const image = new MotionFunction('image');
  window.addEventListener('load', () => {
    document
      .querySelector('#Image')!
      .addEventListener('click', image.addModalContent);
  });
}
