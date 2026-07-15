import { Gateway } from "@/classes/gateway";
import { create } from "zustand";

interface IGatewayState {
  gateway: Gateway | null;
  isConnected: boolean;

  setGateway: (gateway: Gateway | null) => void;
  setIsConnected: (isConnected: boolean) => void;
}

export const useGatewayState = create<IGatewayState>((set) => ({
  gateway: null,
  isConnected: false,

  setGateway: (gateway: Gateway | null) => set({ gateway }),
  setIsConnected: (isConnected: boolean) => set({ isConnected }),
}));
