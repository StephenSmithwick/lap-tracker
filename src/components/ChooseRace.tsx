import { Component, createResource, createSignal, Show } from "solid-js";
import { Select, createOptions } from "@thisbeyond/solid-select";
import "@thisbeyond/solid-select/style.css";
import { context } from "@/context";
import type { RaceData } from "@/api";

export const ChooseRace: Component = () => {
  const { api } = context();
  const [error, setError] = createSignal<string>();

  const [races] = createResource(async () => {
    const res = await api.races.$get();
    return (await res.json()) as RaceData[];
  });

  const [selected] = createResource(async () => {
    const res = await api.races.selected.$get();
    return (await res.json()) as RaceData;
  });

  const selectProps = createOptions(() => races() ?? [], {
    key: "name",
    createable: true,
  });

  const chooseRace = async (selected: RaceData | { name: string } | null) => {
    if (!selected) return;
    setError(undefined);
    try {
      const res =
        "id" in selected
          ? await api.races[":id"].join.$post({ param: { id: selected.id } })
          : await api.races.$post({ json: { name: selected.name } });
      if (!res.ok) throw new Error("Failed to select race");
    } catch {
      setError("Failed to select race");
    }
  };

  return (
    <div class="choose-race">
      <Select
        {...selectProps}
        class="race-select"
        initialValue={selected()}
        placeholder="Select or create a race"
        onChange={chooseRace}
      />
      <Show when={error()}>
        <p role="alert">{error()}</p>
      </Show>
    </div>
  );
};
