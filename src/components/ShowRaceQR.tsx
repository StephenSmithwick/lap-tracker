import {
  Component,
  createResource,
  createSignal,
  Show,
  Suspense,
} from "solid-js";
import QRCode from "qrcode";
import { context } from "@/context";
import type { RaceData } from "@/api";

interface RaceQr {
  race: RaceData;
  svg: string;
}

async function toRaceQr(race: RaceData | null): Promise<RaceQr | null> {
  if (!race) return null;
  const svg = await QRCode.toString(race.id, { type: "svg" });
  return { race, svg };
}

export const ShowRaceQR: Component = () => {
  const { api } = context();
  const [current, { mutate }] = createResource(async () => {
    const res = await api.races.selected.$get();
    return toRaceQr((await res.json()) as RaceData | null);
  });
  const [name, setName] = createSignal("");
  const [creating, setCreating] = createSignal(false);
  const [error, setError] = createSignal<string>();

  const createRace = async (e: SubmitEvent) => {
    e.preventDefault();
    setError(undefined);
    setCreating(true);
    try {
      const res = await api.races.$post({ json: { name: name() } });
      if (!res.ok) throw new Error("Failed to create race");
      mutate(await toRaceQr((await res.json()) as RaceData));
    } catch {
      setError("Failed to create race");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Suspense fallback={<p>Loading race...</p>}>
      <Show
        when={current()}
        fallback={
          <form onSubmit={createRace}>
            <p>No race selected yet. Create one:</p>
            <input
              type="text"
              placeholder="Race name"
              value={name()}
              onInput={(e) => setName(e.currentTarget.value)}
            />
            <button type="submit" disabled={creating()}>
              Create race
            </button>
            <Show when={error()}>
              <p role="alert">{error()}</p>
            </Show>
          </form>
        }
      >
        {(raceQr) => (
          <div>
            <h2>{raceQr().race.name}</h2>
            {/* eslint-disable-next-line solid/no-innerhtml -- SVG is generated, not user input */}
            <div innerHTML={raceQr().svg} />
          </div>
        )}
      </Show>
    </Suspense>
  );
};
