import { WebConfiguration } from "@matterchat/config";
import { create } from "zustand";

export interface IConfigState {
  configuration: WebConfiguration;
  setConfiguration: (configuration: WebConfiguration) => void;
}

export const useConfigState = create<IConfigState>((set) => ({
  configuration: {},

  setConfiguration: (configuration: WebConfiguration) => set({ configuration }),
}));
