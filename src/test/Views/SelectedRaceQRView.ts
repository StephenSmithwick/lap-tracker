import { View } from "./View";

export class SelectedRaceQRView extends View {
  static selector = ".show-race-qr";
  raceName = () => this.$("h2")?.textContent;
  hasQrCode = () => !!this.$("svg");
}
