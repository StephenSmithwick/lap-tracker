import { Component, createSignal, onCleanup, onMount, Show } from "solid-js";
import { context } from "@/context";
import type { ScanResult } from "@/api";
import { Popup, PopupParams } from "./Popup";

function runnerLabel(info: unknown): string {
  if (typeof info === "string") return info;
  if (info && typeof info === "object" && "name" in info) {
    const { name } = info as { name: unknown };
    if (typeof name === "string") return name;
  }
  return JSON.stringify(info);
}

export const ScanRacerQR: Component = () => {
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

  const onDecode = async (data: string) => {
    try {
      const res = await api.runners.scan.$post({ json: { data } });
      const result = (await res.json()) as ScanResult;
      setPopup({
        message: `Lap ${result.lapCount} - ${runnerLabel(result.runner.info)}`,
        type: "success",
      });
    } catch {
      setPopup({ message: "Unable to record lap, try again", type: "error" });
    }
  };

  onMount(scan);
  onCleanup(scanner.stop);

  return (
    <div class="scan-racer-qr">
      <video ref={(el) => (video = el)} muted playsinline />
      <Show when={popup()}>
        <Popup {...popup()!} />
      </Show>
    </div>
  );
};
