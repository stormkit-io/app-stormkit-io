import { prepareHeaders, errTokenExpired } from "./helpers";
import qs from "query-string";

export default class Gitlab {
  baseurl = "https://gitlab.com/api/v4";

  // This value will be üp-dated by Auth.context.
  accessToken = "";

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

      return fetch(request).then(res => {
        if (res.status === 401) {
          return reject(errTokenExpired);
        }

        return res.json().then(user => {
          resolve(user);
        });
      });
    });
  }

  /**
   * Installations retrieves a list of installations.
   *
   * @param {Number} page The page number to fetch.
   * @param {Number} size The number of items to fetch.
   */
  repositories({ page, size = 20 } = {}) {
    return new Promise((resolve, reject) => {
      const headers = prepareHeaders(this.accessToken);
      const params = {
        membership: "true",
        order_by: "id",
        per_page: size,
        page,
      };

      const request = new Request(
        `${this.baseurl}/projects?${qs.stringify(params)}`,
        {
          headers,
        }
      );

      return fetch(request).then(res => {
        if (res.status === 401) {
          return reject(errTokenExpired);
        }

        return res.json().then(json => {
          resolve({ repos: json, nextPage: res.headers.get("X-Next-Page") });
        });
      });
    });
  }
}
