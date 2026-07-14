import axios from "axios";

export const api = axios.create();

api.interceptors.request.use(
  async (config) => {
    const isServer = typeof window === "undefined";

    if (isServer) {
      if (!config.baseURL) {
        const { WebConfiguration } = await import("@matterchat/config");
        config.baseURL = WebConfiguration.addresses.api;
      }
      // Add session token
      try {
        const { auth } = await import("@/auth");

        const session = await auth();
        const token = (session as any)?.accessToken;

        if (token) config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.warn("Could not retrieve session token on server:", error);
      }
    } else {
      if (!config.baseURL) {
        const { getConfig } = await import("@/hooks/useConfig");

        const appConfig = getConfig();
        const apiBaseUrl = appConfig.addresses.api;

        if (apiBaseUrl) config.baseURL = apiBaseUrl;
      }

      // Add session token
      try {
        const { getSession } = await import("next-auth/react");
        const session = await getSession();

        if (session && "accessToken" in session && session.accessToken)
          config.headers.Authorization = `Bearer ${session.accessToken}`;
      } catch (error) {
        console.warn("Could not retrieve session token on client:", error);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
