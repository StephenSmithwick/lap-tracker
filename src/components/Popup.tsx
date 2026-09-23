import { Component } from "solid-js";

export interface PopupParams {
  type: "error" | "success";
  message: string;
}
export const Popup: Component<PopupParams> = (params: PopupParams) => (
  <p class={`popup ${params.type}`}>{params.message}</p>
);
