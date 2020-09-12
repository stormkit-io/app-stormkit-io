import { prepareHeaders, errTokenExpired } from "./helpers";

export default class Github {
  baseurl = "https://api.github.com";

  // This is required to enable the preview api for github.
  // It only needs to be included in endpoints which are related to github apps.
  previewHeader = "application/vnd.github.machine-man-preview+json";

  // This value will be üp-dated by Auth.context.
  accessToken = global.GITHUB_ACCESS_TOKEN;

  /**
   * User returns the currently logged in user.
   * We need the user-to-server token to get a valid response
   * from this endpoint. This token can be obtained by using
   * the Auth.context:loginOauth method.
   *
   * @param {*} token The access token to make api calls.
   */
  user() {
    return new Promise((resolve, reject) => {
      const headers = prepareHeaders(this.accessToken);
      const request = new Request(`${this.baseurl}/user`, { headers });

      return fetch(request).then((res) => {
        if (res.status === 401) {
          return reject(errTokenExpired);
        }

        return res.json().then((user) => {
          resolve(user);
        });
      });
    });
  }

  /**
   * Installations retrieves a list of installations.
   *
   * @param {Number} page The page number to fetch.
   */
  installations({ page = 1 } = {}) {
    return new Promise((resolve, reject) => {
      const headers = prepareHeaders(this.accessToken);
      headers.set("Accept", this.previewHeader);
      headers.set("If-None-Match", ""); // https://github.com/octokit/rest.js/issues/890

      const request = new Request(
        `${this.baseurl}/user/installations?page=${page}&per_page=25`,
        { headers }
      );

      return fetch(request).then((res) => {
        if (res.status === 401) {
          return reject(errTokenExpired);
        }

        resolve(res.json());
      });
    });
  }

  /**
   * Repositories lists alls the repositories user have and
   * we're allowed to see. In order to fetch repositories from github,
   * it is required to pass the installation id, which can obtained from
   * installations endpoint (the method above).
   *
   * @param {Number} installationId The id of the installation we'd like to show the repositories.
   * @param {Number} page The page number.
   */
  repositories({ installationId, params = {} } = {}) {
    return new Promise((resolve, reject) => {
      const headers = prepareHeaders(this.accessToken);
      headers.set("Accept", this.previewHeader);
      headers.set("If-None-Match", ""); // https://github.com/octokit/rest.js/issues/890

      // push default params if no params set yet
      if (Object.keys(params).length === 0) {
        params.page = 1;
        params.per_page = 100;
      }

      // build query
      const query = Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

      const request = new Request(
        `${this.baseurl}/user/installations/${installationId}/repositories?${query}`,
        { headers }
      );

      return fetch(request).then((res) => {
        if (res.status === 401) {
          return reject(errTokenExpired);
        }

        return res.json().then((repos) => {
          resolve(repos);
        });
      });
    });
  }
}
