import { WebConfiguration, IWebConfiguration } from "@matterchat/config";
import { create } from "zustand";

export interface IConfigState {
  configuration: IWebConfiguration;
  setConfiguration: (configuration: IWebConfiguration) => void;
}

export const useConfigState = create<IConfigState>((set) => ({
  configuration: {} as IWebConfiguration,

  setConfiguration: (configuration: IWebConfiguration) =>
    set({ configuration }),
}));
