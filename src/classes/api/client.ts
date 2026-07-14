import api from "@/lib/api";
import { ApiVersion } from "@matterchat/contracts";

export class ApiClient {
  public static async get<ResponseType>(
    version: ApiVersion,
    path: string,
  ): Promise<ResponseType> {
    return await this.request<ResponseType>(version, "GET", path);
  }

  public static async post<ResponseType, BodyType>(
    version: ApiVersion,
    path: string,
    body: BodyType,
  ): Promise<ResponseType> {
    return await this.request<ResponseType, BodyType>(
      version,
      "POST",
      path,
      body,
    );
  }

  public static async put<ResponseType, BodyType>(
    version: ApiVersion,
    path: string,
    body: BodyType,
  ): Promise<ResponseType> {
    return await this.request<ResponseType, BodyType>(
      version,
      "PUT",
      path,
      body,
    );
  }

  public static async patch<ResponseType, BodyType>(
    version: ApiVersion,
    path: string,
    body: BodyType,
  ): Promise<ResponseType> {
    return await this.request<ResponseType, BodyType>(
      version,
      "PATCH",
      path,
      body,
    );
  }

  public static async delete<ResponseType>(
    version: ApiVersion,
    path: string,
  ): Promise<ResponseType> {
    return await this.request<ResponseType>(version, "DELETE", path);
  }

  private static async request<ResponseType, BodyType = {}>(
    version: ApiVersion,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    path: string,
    body?: BodyType,
  ): Promise<ResponseType> {
    if (body && (method === "GET" || method === "DELETE"))
      throw new Error("GET and DELETE requests cannot have a body");

    const response = await api
      .request<ResponseType>({
        method: method,
        url: `/v${version}${path.startsWith("/") ? path : `/${path}`}`,
        data: body,
      })
      .catch((e) => ({ error: e.response }));

    if ("error" in response)
      throw new Error(response.error?.data?.message || "Unknown error");

    return response.data;
  }
}
