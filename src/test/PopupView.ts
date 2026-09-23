import { View } from "@/test/View";

export class PopupView extends View {
  static selector = ".popup";
  message = () => this.text;
  type = () => this.classes.filter((c) => c !== "popup");
}
