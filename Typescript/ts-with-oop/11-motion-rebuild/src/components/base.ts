interface Base {
  attachTo(parent: HTMLElement, position?: InsertPosition): void;
}
export class BaseComponent implements Base {
  protected readonly element: HTMLElement;

  constructor(htmlString: string) {
    const template = document.createElement('template');
    template.innerHTML = htmlString;
    this.element = template.content.firstElementChild! as HTMLElement;
  }

  attachTo(parent: HTMLElement, position: InsertPosition = 'afterbegin') {
    parent.insertAdjacentElement(position, this.element);
  }
}
