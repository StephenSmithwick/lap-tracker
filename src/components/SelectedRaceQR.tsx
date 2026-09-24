import { Component, createResource, Show, Suspense } from "solid-js";
import QRCode from "qrcode";
import { context } from "@/context";
import type { RaceData } from "@/api";
import { raceQrData } from "@/qr";

export const ShowRaceQR: Component = () => {
  const { api } = context();
  const [raceDetails] = createResource(async () => {
    const res = await api.races.selected.$get();
    const race = (await res.json()) as RaceData;
    return race
      ? {
          race,
          svg: await QRCode.toString(raceQrData(race.id), { type: "svg" }),
        }
      : undefined;
  });

  return (
    <div class="show-race-qr">
      <Suspense fallback={<p>Loading race...</p>}>
        <Show when={raceDetails()} fallback={<p>No race selected.</p>}>
          {
            (details) => <div innerHTML={details().svg} /> // eslint-disable-line solid/no-innerhtml -- SVG is generated
          }
        </Show>
      </Suspense>
    </div>
  );
};
