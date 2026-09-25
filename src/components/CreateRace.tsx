import { Component, createSignal, Setter } from "solid-js";
import { context } from "@/context";
import type { RaceData } from "@/api";

interface Props {
  onCancel: () => void;
  onCreate: (race: RaceData) => void;
  setError: Setter<string | undefined>;
}

export const CreateRace: Component<Props> = (props) => {
  const { api } = context();
  const [name, setName] = createSignal("");

  const submitCreate = async (e: SubmitEvent) => {
    e.preventDefault();
    const raceName = name().trim();
    if (!raceName) return;
    props.setError(undefined);
    try {
      const res = await api.races.$post({ json: { name: raceName } });
      if (!res.ok) throw new Error("Failed to create race");
      const race = (await res.json()) as RaceData;
      props.onCreate(race);
    } catch {
      props.setError("Failed to create race");
    }
  };

  return (
    <form class="create-race" onSubmit={submitCreate}>
      <input
        type="text"
        class="name"
        placeholder="New race name"
        value={name()}
        onInput={(e) => setName(e.currentTarget.value)}
        autofocus
      />
      <button class="cancel" type="button" onClick={() => props.onCancel()}>
        ✖
      </button>
    </form>
  );
};
