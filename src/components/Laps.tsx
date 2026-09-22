import { context } from "@/context";
import { Component, createResource, For, Suspense } from "solid-js";

export const Laps: Component = () => {
  const { api } = context();
  const [laps] = createResource(async () => {
    const res = await api.laps.$get();
    return res.json();
  });

  return (
    <Suspense fallback={<p>Loading laps...</p>}>
      <ul>
        <For each={laps()}>
          {(lap) => (
            <li>
              {lap.runner} at {lap.timestamp}
            </li>
          )}
        </For>
      </ul>
    </Suspense>
  );
};
