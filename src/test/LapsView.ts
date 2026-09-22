export class LapsView {
  container: HTMLElement;

  items() {
    return [...this.container.querySelectorAll("li")].map((li) => {
      const [runner, timestamp] = li.textContent!.split(" at ");
      return { runner, timestamp };
    });
  }

  constructor(container: HTMLElement) {
    this.container = container;
  }
}
