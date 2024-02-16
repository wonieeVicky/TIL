type Motion = 'image' | 'video' | 'note' | 'task' | 'root';
type MotionData = {
  title: string;
  url: string;
  type: Motion;
};

class MotionFunction {
  title: string = '';
  url: string = '';
  type: Motion; // image, video, note, task

  private readonly MOTION_STORAGE_KEY: string = 'motionData';

  constructor(type: Motion) {
    this.type = type;
  }

  saveData() {
    const title = document.querySelector('#title') as HTMLInputElement;
    const url = document.querySelector('#url') as HTMLInputElement;
    this.title = title.value;
    this.url = url.value;

    if (!this.title || !this.url) {
      alert('Please fill out the form');
      return;
    }

    const newData: MotionData = {
      title: this.title,
      url: this.url,
      type: this.type
    };

    if (localStorage.getItem(this.MOTION_STORAGE_KEY)) {
      const data = JSON.parse(
        localStorage.getItem(this.MOTION_STORAGE_KEY) as string
      );

      if (
        data.some(
          (item: MotionData) =>
            item.title === this.title && item.url === this.url
        )
      ) {
        alert('The data is already exist');
        return;
      }

      localStorage.setItem(
        this.MOTION_STORAGE_KEY,
        JSON.stringify([...data, newData])
      );
    } else {
      localStorage.setItem(this.MOTION_STORAGE_KEY, JSON.stringify([newData]));
    }

    this.toggleModal();
    this.updateDocument(newData);
  }

  deleteData(index: number) {
    const data = JSON.parse(
      localStorage.getItem(this.MOTION_STORAGE_KEY) as string
    );
    data.splice(index, 1);
    localStorage.setItem(this.MOTION_STORAGE_KEY, JSON.stringify(data));
    this.updateDocument();
  }

  public updateDocument(updateData?: MotionData) {
    if (!localStorage.getItem(this.MOTION_STORAGE_KEY)) {
      return;
    }

    const data = JSON.parse(
      localStorage.getItem(this.MOTION_STORAGE_KEY) as string
    );
    const $motionContent = document.querySelector(
      `#document article`
    ) as HTMLDivElement;

    if (!updateData) {
      $motionContent.innerHTML = '';
      data.forEach((item: MotionData) => {
        $motionContent.innerHTML += this.generateContent(item);
      });
    } else {
      $motionContent.innerHTML += this.generateContent(updateData);
    }

    document.querySelectorAll('.motion-item-close').forEach((item, index) => {
      item.addEventListener('click', () => this.deleteData(index));
    });
  }

  toggleModal(): void {
    const modal = document.querySelector('#modal')!;
    modal.classList.remove('active');
    const modalBackground = document.querySelector('.modal-background')!;
    modalBackground.classList.remove('active');
    const modalContent = document.querySelector('.modal-content')!;
    modalContent.innerHTML = '';
  }

  private generateContent = (data: MotionData) => {
    const mapTypeToRenderHtml: Record<string, string> = {
      image: `<img src=${data.url} alt=${data.title} />`,
      video: `<iframe width="100%" src="${data.url}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
    };
    return `
      <div class="motion-item">
        <div class="motion-item-close"></div>
        
        ${mapTypeToRenderHtml[data.type]}
        <div class="motion-item-content">
          <h3>${data.title}</h3>
        </div>
      </div>
    `;
  };

  activeModal(): void {
    // add classList
    const $modal = document.querySelector('#modal')!;
    $modal.classList.add('active');
    const $modalContent = document.querySelector('.modal-content')!;
    $modalContent.classList.add('active');
    const $modalBackground = document.querySelector('.modal-background')!;
    $modalBackground.classList.add('active');

    // add event listener
    $modalBackground.addEventListener('click', () => {
      this.toggleModal();
    });
    const $modalClose = document.querySelector('.modal-close')!;
    $modalClose.addEventListener('click', () => {
      this.toggleModal();
    });
    const $modalSave = document.querySelector('.modal-save')!;
    $modalSave.addEventListener('click', () => {
      this.saveData();
    });
  }

  addModalContent(): void {
    this.activeModal();
  }
}

class MotionImage extends MotionFunction {
  constructor(public readonly type: Motion) {
    super(type);
  }

  addModalContent(): void {
    const modalBody = document.querySelector('.modal-body')!;
    modalBody.innerHTML = `
      <label for="title">Title</label>
      <input type="text" id="title" placeholder="Title" required />
      <label for="url">URL</label>
      <input type="text" id="url" placeholder="https://picsum.photos/500/300" required />`;
    super.addModalContent();
  }
}

class MotionVideo extends MotionFunction {
  constructor(public readonly type: Motion) {
    super(type);
  }

  addModalContent(): void {
    const modalBody = document.querySelector('.modal-body')!;
    modalBody.innerHTML = `
      <label for="title">Title</label>
      <input type="text" id="title" placeholder="Title" required />
      <label for="url">URL</label>
      <input type="text" id="url" placeholder="https://www.youtube.com/watch?v=2YjixJqvMfA" required />`;
    super.addModalContent();
  }
}

class MotionNote extends MotionFunction {
  constructor(public readonly type: Motion) {
    super(type);
  }
  addModalContent(): void {
    const modalBody = document.querySelector('.modal-body')!;
    modalBody.innerHTML = `
      <label for="title">Title</label>
      <input type="text" id="title" placeholder="Title" required />
      <label for="url">Body</label>
      <textarea id="url" placeholder="Write your note here" required></textarea>`;
    super.addModalContent();
  }
}

{
  const root = new MotionFunction('root');
  const image = new MotionImage('image');
  const video = new MotionVideo('video');
  const note = new MotionNote('note');

  window.addEventListener('load', () => {
    root.updateDocument();

    document.querySelector('#Image')!.addEventListener('click', function () {
      image.addModalContent();
    });
    document.querySelector('#Video')!.addEventListener('click', function () {
      video.addModalContent();
    });
    document.querySelector('#Note')!.addEventListener('click', function () {
      note.addModalContent();
    });
  });
}
