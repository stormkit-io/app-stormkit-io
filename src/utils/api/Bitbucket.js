import {
  prepareHeaders,
  errTokenExpired,
  errNotEnoughPermissions,
} from "./helpers";

export default class Bitbucket {
  baseurl = "https://api.bitbucket.org/2.0";

  // This value will be üp-dated by Auth.context.
  accessToken = global.BITBUCKET_ACCESS_TOKEN;

  /**
   * User returns the currently logged in user object.
   */
  user() {
    return new Promise((resolve, reject) => {
      const headers = prepareHeaders(this.accessToken);
      const request = new Request(this.baseurl + "/user", { headers });

      return fetch(request).then((res) => {
        if (res.status === 401) {
          return reject(errTokenExpired);
        }

        resolve(res.json());
      });
    });
  }

  /**
   * Lists all the repositories the user is an admin.
   *
   * @param {String} team The name of the team.
   */
  repositories({ team, params = {} } = {}) {
    const url = team ? `/repositories/${team}` : "/repositories";

    return new Promise((resolve, reject) => {
      const headers = prepareHeaders(this.accessToken);

      // push default params if no params set yet
      if (Object.keys(params).length === 0) {
        params.role = "admin";
        params.pagelen = 100;
      }

      // build query
      const query = Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

      const request = new Request(`${this.baseurl}${url}?${query}`, {
        headers,
      });

      return fetch(request).then((res) => {
        if (res.status === 401) {
          return reject(errTokenExpired);
        }

        resolve(res.json());
      });
    });
  }

  /**
   * Lists all teams which the user belongs.
   */
  teams() {
    return new Promise((resolve, reject) => {
      const headers = prepareHeaders(this.accessToken);
      const request = new Request(this.baseurl + "/teams?role=admin", {
        headers,
      });

      return fetch(request).then((res) => {
        if (res.status === 401) {
          reject(errTokenExpired);
        }

        if (res.status === 403) {
          reject(errNotEnoughPermissions);
        }

        resolve(res.json());
      });
    });
  }
}
