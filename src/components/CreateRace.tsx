import { context } from "@/context";
import { Component, createSignal, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";

export const CreateRace: Component = () => {
  const navigate = useNavigate();

  const { api } = context();
  const [creating, setCreating] = createSignal(false);
  const [error, setError] = createSignal<string>();

  const createRace = async (e: SubmitEvent) => {
    e.preventDefault();
    const name = new FormData(e.currentTarget as HTMLFormElement).get(
      "name",
    ) as string;
    setCreating(true);
    try {
      const res = await api.races.$post({ json: { name } });
      if (res.ok) {
        navigate("/race/qr");
      } else {
        setError("Failed to create race");
      }
    } catch {
      setError("Failed to create race");
    } finally {
      setCreating(false);
    }
  };

  return (
    <form class="race-form" onSubmit={createRace}>
      <input type="text" name="name" placeholder="Race name" />
      <button type="submit" disabled={creating()}>
        Create race
      </button>
      <Show when={error()}>
        <p role="alert">{error()}</p>
      </Show>
    </form>
  );
};
