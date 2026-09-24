import { ChooseRaceView } from "./ChooseRaceView";
import { ConfirmRaceView } from "./ConfirmRaceView";
import { LapsView } from "./LapsView";
import { PopupView } from "./PopupView";
import { SelectedRaceQRView } from "./SelectedRaceQRView";
import { loadView } from "./View";

export const loadViews = ({ container }: { container: HTMLElement }) => ({
  laps: async () => await loadView(container, LapsView),
  popup: async () => await loadView(container, PopupView),
  selectedRaceQr: async () => await loadView(container, SelectedRaceQRView),
  chooseRace: async () => await loadView(container, ChooseRaceView),
  confirmRace: async () => await loadView(container, ConfirmRaceView),
});
