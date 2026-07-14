import { useConfigState } from "./states/useConfigState";

export function useConfig() {
  const configuration = useConfigState((state) => state.configuration);

  return configuration;
}

export function getConfig() {
  return useConfigState.getState().configuration;
}
