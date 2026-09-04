import { context } from "@/context";
import { Component, createResource, For, Show, Suspense } from "solid-js";

export const Laps: Component = () => {
  const { api } = context();
  const [laps, { refetch: refetchLaps }] = createResource(async () => {
    const res = await api.laps.$get();
    return res.json();
  });

  return (
    <Suspense fallback={<p>Loading laps...</p>}>
      <ul>
        <For each={laps()}>
          {(lap) => (
            <li>
              {lap.runnerRef} at {lap.timestamp}
            </li>
          )}
        </For>
      </ul>
    </Suspense>
  );
};
