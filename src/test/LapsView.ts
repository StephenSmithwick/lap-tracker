import { View } from "@/test/View";

export class LapsView extends View {
  static selector = ".laps";

  items() {
    return this.$$("li").map((li) => {
      const [runner, timestamp] = li.textContent!.split(" at ");
      return { runner, timestamp };
    });
  }
}
