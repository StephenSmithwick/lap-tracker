import { Component, createResource, Show, Suspense } from "solid-js";
import QRCode from "qrcode";
import { context } from "@/context";
import type { RaceData } from "@/api";

export const ShowRaceQR: Component = () => {
  const { api } = context();
  const [raceDetails] = createResource(async () => {
    const res = await api.races.selected.$get();
    const race = (await res.json()) as RaceData;
    return race
      ? {
          race,
          svg: await QRCode.toString(race.id, { type: "svg" }),
        }
      : undefined;
  });

  return (
    <div class="show-race-qr">
      <Suspense fallback={<p>Loading race...</p>}>
        <Show when={raceDetails()} fallback={<p>No race selected.</p>}>
          {(details) => (
            <>
              <h2>{details().race.name}</h2>
              {/* eslint-disable-next-line solid/no-innerhtml -- SVG is generated */}
              <div innerHTML={details().svg} />
            </>
          )}
        </Show>
      </Suspense>
    </div>
  );
};
