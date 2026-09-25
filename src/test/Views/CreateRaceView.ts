import { View } from "./View";
import { fireEvent } from "@solidjs/testing-library";

export class CreateRaceView extends View {
  static selector = "form.create-race";

  setName(value: string) {
    fireEvent.input(this.$("input.name")!, { target: { value } });
  }

  submit() {
    fireEvent.submit(this.container);
  }

  cancel() {
    fireEvent.click(this.$("button.cancel")!);
  }
}
