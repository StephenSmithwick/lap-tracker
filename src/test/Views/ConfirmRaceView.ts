import { View } from "./View";
import { fireEvent } from "@solidjs/testing-library";

export class ConfirmRaceView extends View {
  static selector = ".confirm-race";

  message = () => this.$("p")?.textContent;

  private button(text: string) {
    const button = this.$$("button").find((el) => el.textContent === text);
    if (!button) throw new Error(`Button "${text}" not found`);
    return button;
  }

  confirm() {
    fireEvent.click(this.button("Switch"));
  }

  cancel() {
    fireEvent.click(this.button("Cancel"));
  }
}
