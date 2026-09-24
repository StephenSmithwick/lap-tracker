import { View } from "./View";
import { fireEvent } from "@solidjs/testing-library";

export class CreateRaceView extends View {
  static selector = ".race-form";
  get alert() {
    return this.$('p[role="alert"]')?.textContent;
  }
  setName(value: string) {
    fireEvent.input(this.$("input[name=name]")!, { target: { value } });
  }
  submit() {
    fireEvent.click(this.$("button[type=submit]")!);
  }
}
