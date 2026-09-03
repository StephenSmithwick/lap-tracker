import { context } from "@/context";
import { Component, createResource, For } from "solid-js";

export const Laps: Component = () => {
  const { api } = context();
  const [laps, { refetch: refetchLaps }] = createResource(
    async () => {
      const res = await api.laps.$get();
      return res.json();
    },
    { initialValue: [] },
  );

  return (
    <ul>
      <For each={laps()}>{(lap) => <li>{lap}</li>}</For>
    </ul>
  );
};
