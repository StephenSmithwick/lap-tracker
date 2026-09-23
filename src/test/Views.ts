import { LapsView } from "@/test/LapsView";
import { PopupView } from "@/test/PopupView";
import { loadView } from "@/test/View";

export const loadViews = ({ container }: { container: HTMLElement }) => ({
  laps: async () => await loadView(container, LapsView),
  popup: async () => await loadView(container, PopupView),
});
