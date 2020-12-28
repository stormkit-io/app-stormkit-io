import { LocalStorage } from "~/utils/storage";

export default class Api {
  static STORAGE_TOKEN_KEY = "skit_token";

  static isAbsolute(url) {
    return url && url.match(/^(https?|\/\/)/) !== null;
  }

  constructor(opts) {
    this.baseurl = opts.baseurl;
    this.headers = {
      "Content-Type": "application/json"
    };

    const token = LocalStorage.get(Api.STORAGE_TOKEN_KEY);

    if (token) {
      this.setAuthToken(token);
    }
  }

  setAuthToken(token) {
    LocalStorage.set(Api.STORAGE_TOKEN_KEY, token);
    this.headers.Authorization = "Bearer " + token;
  }

  getAuthToken() {
    return LocalStorage.get(Api.STORAGE_TOKEN_KEY);
  }

  removeAuthToken() {
    LocalStorage.del(Api.STORAGE_TOKEN_KEY);
    delete this.headers.Authorization;
  }

  getHeaders(additional = {}) {
    const headers = new Headers();

    Object.keys(this.headers).forEach(k => {
      headers.append(k, this.headers[k]);
    });

    Object.keys(additional).forEach(k => {
      headers.append(k, additional[k]);
    });

    return headers;
  }

  /**
   * Wrapper function for the fetch API.
   *
   * @param url
   * @param opts
   * @return {Promise<any>}
   */
  async fetch(url, opts = {}) {
    if (Api.isAbsolute(url) === false) {
      url = this.baseurl.replace(/\/+$/, "") + "/" + url.replace(/^\//, "");
    }

    opts.headers = this.getHeaders(opts.headers);
    const request = new Request(url, opts);
    const resp = await fetch(request);

    if (resp.status === 403) {
      try {
        const json = await resp.json();

        if (json?.user === false) {
          window.location.href = "/auth";
          return;
        }
      } catch (e) {
        // Do nothing
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

      return json;
    } catch (e) {
      // Do nothing as the response is successful. Maybe it's an empty response.
    }
  }

  // Helper method for sending post requests.
  async post(url, opts = {}) {
    // This line of code allows using post as post(url, myRequestBody)
    if (!opts.body && !opts.params) {
      opts = { body: opts };
    }

    opts.method = "POST";

    if (opts.body || opts.params) {
      opts.body = JSON.stringify(opts.body || opts.params);
    }

    return this.fetch(url, opts);
  }

  // Helper method for sending put requests.
  async put(url, opts = {}) {
    // This line of code allows using post as put(url, myRequestBody)
    if (!opts.body && !opts.params) {
      opts = { body: opts };
    }

    opts.method = "PUT";

    if (opts.body || opts.params) {
      opts.body = JSON.stringify(opts.body || opts.params);
    }

    return this.fetch(url, opts);
  }

  // Helper method for sending delete requests.
  async delete(url, opts = {}) {
    // This line of code allows using post as put(url, myRequestBody)
    if (!opts.body && !opts.params) {
      opts = { body: opts };
    }

    opts.method = "DELETE";

    if (opts.body || opts.params) {
      opts.body = JSON.stringify(opts.body || opts.params);
    }

    return this.fetch(url, opts);
  }
}
