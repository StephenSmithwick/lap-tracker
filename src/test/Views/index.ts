import { CreateRaceView } from "./CreateRaceView";
import { LapsView } from "./LapsView";
import { PopupView } from "./PopupView";
import { SelectedRaceQRView } from "./SelectedRaceQRView";
import { loadView } from "./View";

export const loadViews = ({ container }: { container: HTMLElement }) => ({
  laps: async () => await loadView(container, LapsView),
  popup: async () => await loadView(container, PopupView),
  selectedRaceQr: async () => await loadView(container, SelectedRaceQRView),
  createRace: async () => await loadView(container, CreateRaceView),
});
