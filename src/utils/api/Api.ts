import { LocalStorage } from "~/utils/storage";

type Body =
  | string
  | Blob
  | ArrayBufferView
  | ArrayBuffer
  | FormData
  | URLSearchParams
  | ReadableStream<Uint8Array>
  | null
  | undefined;

interface Options {
  baseurl: string;
}

interface FetchOptions extends Record<string, unknown> {
  method?: "POST" | "GET" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: Body;
  params?: Body; // alias for body
}

export default class Api {
  static STORAGE_TOKEN_KEY = "skit_token";

  static isAbsolute(url: string): boolean {
    return url?.match(/^(https?|\/\/)/) !== null;
  }

  baseurl = "";
  headers: Record<string, string> = {};

  constructor(opts: Options) {
    this.baseurl = opts.baseurl;
    this.headers = {
      "Content-Type": "application/json",
    };

    const token = LocalStorage.get(Api.STORAGE_TOKEN_KEY);

    if (token) {
      this.setAuthToken(token);
    }
  }

  setAuthToken(token: string): void {
    LocalStorage.set(Api.STORAGE_TOKEN_KEY, token);
    this.headers.Authorization = "Bearer " + token;
  }

  getAuthToken(): string | undefined | null {
    return LocalStorage.get(Api.STORAGE_TOKEN_KEY);
  }

  removeAuthToken(): void {
    LocalStorage.del(Api.STORAGE_TOKEN_KEY);
    delete this.headers.Authorization;
  }

  getHeaders(additional: Record<string, string> = {}): Headers {
    const headers = new Headers();

    Object.keys(this.headers).forEach(k => {
      headers.append(k, this.headers[k]);
    });

    Object.keys(additional).forEach(k => {
      headers.append(k, additional[k]);
    });

    if (document.cookie.indexOf("sk_canary=true") > -1) {
      headers.append("SK-canary", "true");
    }

    return headers;
  }

  private async handle403(response: Response): Promise<void> {
    try {
      const json = await response.json();

      if (json?.user === false && window.location.pathname !== "/auth") {
        window.location.href = "/auth";
        return;
      }
    } catch (e) {
      throw response;
    }
  }

  /**
   * Wrapper function for the fetch API.
   *
   * @param url
   * @param opts
   * @return {Promise<any>}
   */
  async fetch<T>(url: string, opts: FetchOptions = {}): Promise<T> {
    if (Api.isAbsolute(url) === false) {
      url = this.baseurl.replace(/\/+$/, "") + "/" + url.replace(/^\//, "");
    }

    const headers = this.getHeaders(opts.headers);
    const request = new Request(url, { ...opts, headers });
    const resp = await fetch(request);

    if (resp.status === 403) {
      try {
        this.handle403(resp);
      } catch (e) {
        throw resp;
      }
    }

    if (resp.status.toString()[0] !== "2") {
      throw resp;
    }

    try {
      const json = await resp.json();

      if (json && json.jwt) {
        this.setAuthToken(json.jwt);
      }

      return json as T;
    } catch (e) {
      return {} as T;
    }
  }

  // Helper method for sending post requests.
  async post<T>(url: string, opts: FetchOptions = {}): Promise<T> {
    // This line of code allows using post as post(url, myRequestBody)
    if (!opts.body && !opts.params) {
      opts = { body: opts as unknown as Body };
    }

    opts.method = "POST";

    if (opts.body || opts.params) {
      opts.body = JSON.stringify(opts.body || opts.params);
    }

    return this.fetch(url, opts);
  }

  // Helper method for sending put requests.
  async put<T>(url: string, opts: FetchOptions = {}): Promise<T> {
    // This line of code allows using post as put(url, myRequestBody)
    if (!opts.body && !opts.params) {
      opts = { body: opts as unknown as Body };
    }

    opts.method = "PUT";

    if (opts.body || opts.params) {
      opts.body = JSON.stringify(opts.body || opts.params);
    }

    return this.fetch(url, opts);
  }

  // Helper method for sending delete requests.
  async delete<T>(url: string, opts: FetchOptions = {}): Promise<T> {
    // This line of code allows using post as put(url, myRequestBody)
    if (!opts.body && !opts.params) {
      opts = { body: opts as unknown as Body };
    }

    opts.method = "DELETE";

    if (opts.body || opts.params) {
      opts.body = JSON.stringify(opts.body || opts.params);
    }

    return this.fetch(url, opts);
  }
}
