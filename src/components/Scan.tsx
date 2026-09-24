import { Component, createSignal, onCleanup, onMount, Show } from "solid-js";
import { context } from "@/context";
import type { RaceData, RunnerData, ScanResult } from "@/api";
import { Popup, PopupParams } from "./Popup";
import { ConfirmRace } from "./ConfirmRace";
import { parseRaceId } from "@/qr";

function name({ info }: RunnerData): string | undefined {
  if (typeof info === "string") return info;
  if (info && typeof info === "object" && "name" in info) {
    const { name } = info as { name: unknown };
    if (typeof name === "string") return name;
  }
}

export const Scan: Component = () => {
  const { api, scanner } = context();
  let video: HTMLVideoElement | undefined;

  const [popup, setPopup] = createSignal<PopupParams>();
  const [pendingRace, setPendingRace] = createSignal<RaceData>();

  function resumeScanning() {
    if (video) scanner.start(video, onDecode);
  }

  function scan() {
    setPopup(undefined);
    if (video) {
      resumeScanning();
    } else {
      setPopup({ message: "Unable to access camera", type: "error" });
    }
  }

  // Scanning a race QR switches everyone's selected race, so it's held for
  // confirmation rather than applied immediately - it's an easy thing for
  // someone to trigger by mistake (or mischief) with a photo of the code.
  const scanRace = async (id: string) => {
    try {
      const res = await api.races[":id"].$get({ param: { id } });
      const race = (await res.json()) as RaceData;
      scanner.stop();
      setPendingRace(race);
    } catch {
      setPopup({ message: "Race not found", type: "error" });
    }
  };

  const cancelRaceSwitch = () => {
    setPendingRace(undefined);
    resumeScanning();
  };

  const confirmRaceSwitch = async () => {
    const race = pendingRace();
    if (!race) return;
    setPendingRace(undefined);
    try {
      const res = await api.races[":id"].join.$post({
        param: { id: race.id },
      });
      const joined = (await res.json()) as RaceData;
      setPopup({ message: `Joined ${joined.name}`, type: "success" });
    } catch {
      setPopup({ message: "Unable to join race, try again", type: "error" });
    } finally {
      resumeScanning();
    }
  };

  const scanRunner = async (data: string) => {
    try {
      const res = await api.runners.scan.$post({ json: { data } });
      const result = (await res.json()) as ScanResult;
      const runnerName = name(result.runner);
      setPopup({
        message: `Lap ${result.lapCount}${runnerName ? ` - ${runnerName}` : ""}`,
        type: "success",
      });
    } catch {
      setPopup({ message: "Unable to record lap, try again", type: "error" });
    }
  };

  const onDecode = async (data: string) => {
    const raceId = parseRaceId(data);
    if (raceId) {
      await scanRace(raceId);
    } else {
      await scanRunner(data);
    }
  };

  onMount(scan);
  onCleanup(scanner.stop);

  return (
    <div class="scan">
      <video ref={(el) => (video = el)} muted playsinline />
      <Show when={pendingRace()}>
        {(race) => (
          <ConfirmRace
            race={race()}
            onConfirm={confirmRaceSwitch}
            onCancel={cancelRaceSwitch}
          />
        )}
      </Show>
      <Show when={popup()}>
        <Popup {...popup()!} />
      </Show>
    </div>
  );
};
