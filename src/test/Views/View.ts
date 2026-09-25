import { waitFor } from "@solidjs/testing-library";

export abstract class View {
  static selector: string;

  constructor(protected container: Element) {}

  protected $(selector: string) {
    return this.container.querySelector(selector);
  }
  protected $$(selector: string) {
    return [...this.container.querySelectorAll(selector)];
  }

  get text() {
    return this.container.textContent ?? "";
  }
  get classes() {
    return [...this.container.classList];
  }
}

type ViewClass<V extends View> = {
  new (root: Element): V;
  selector: string;
};

export const loadView = async <V extends View>(
  container: HTMLElement,
  ViewClass: ViewClass<V>,
): Promise<V> => {
  const root = await waitFor(() => {
    const el = container.querySelector(ViewClass.selector);
    if (!el)
      throw new Error(`${ViewClass.name} (${ViewClass.selector}) not found`);
    return el;
  });
  return new ViewClass(root);
};

export const viewAccessor =
  <V extends View>(container: HTMLElement, ViewClass: ViewClass<V>) =>
  async () =>
    await loadView(container, ViewClass);
