import { Component, createSignal, onCleanup, Show } from "solid-js";
import { context } from "@/context";
import type { RaceData } from "@/api";
import { onMount } from "solid-js";
import { Popup, PopupParams } from "./Popup";

export const ScanRaceQR: Component = () => {
  const { api, scanner } = context();
  let video: HTMLVideoElement | undefined;

  const [popup, setPopup] = createSignal<PopupParams>();

  function scan() {
    if (video) {
      setPopup(undefined);
      scanner.start(video, onDecode);
    } else {
      setPopup({ message: "Unable to access camera", type: "error" });
    }
  }

  const onDecode = async (id: string) => {
    try {
      const res = await api.races[":id"].join.$post({ param: { id } });
      const race = (await res.json()) as RaceData;
      setPopup({ message: `Joined ${race.name}`, type: "success" });
    } catch {
      setPopup({ message: "Unable to join race, try again", type: "error" });
    }
  };

  onMount(scan);
  onCleanup(scanner.stop);

  return (
    <div>
      <video ref={(el) => (video = el)} muted playsinline />
      <Show when={popup()}>
        <Popup {...popup()!} />
      </Show>
    </div>
  );
};
