import { View } from "./View";
import { fireEvent } from "@solidjs/testing-library";

export class ChooseRaceView extends View {
  static selector = ".choose-race";

  get alert() {
    return this.$('p[role="alert"]')?.textContent;
  }

  private get input() {
    return this.$(".solid-select-input") as HTMLInputElement;
  }

  open() {
    fireEvent.click(this.$(".solid-select-control")!);
  }

  search(value: string) {
    fireEvent.input(this.input, { target: { value } });
  }

  options() {
    return this.$$(".solid-select-option").map((el) => el.textContent);
  }

  choose(text: string) {
    const option = this.$$(".solid-select-option").find(
      (el) => el.textContent === text,
    );
    if (!option) throw new Error(`Option "${text}" not found`);
    fireEvent.click(option);
  }
}
