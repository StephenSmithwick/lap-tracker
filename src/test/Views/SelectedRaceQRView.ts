import { View } from "./View";

export class SelectedRaceQRView extends View {
  static selector = ".show-race-qr";
  hasQrCode = () => !!this.$("svg");
}
