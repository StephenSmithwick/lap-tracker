export class LapsView {
  container: HTMLElement;

  items() {
    return [...this.container.querySelectorAll("li")].map((li) => {
      const [runnerRef, timestamp] = li.textContent!.split(" at ");
      return { runnerRef, timestamp };
    });
  }

  constructor(container: HTMLElement) {
    this.container = container;
  }
}
