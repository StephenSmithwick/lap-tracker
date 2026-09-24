import { Component } from "solid-js";
import type { RaceData } from "@/api";

interface ConfirmRaceProps {
  race: RaceData;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmRace: Component<ConfirmRaceProps> = (props) => (
  <div class="confirm-race" role="alertdialog">
    <p>Switch to race "{props.race.name}"?</p>
    <button onClick={() => props.onConfirm()}>Switch</button>
    <button onClick={() => props.onCancel()}>Cancel</button>
  </div>
);
