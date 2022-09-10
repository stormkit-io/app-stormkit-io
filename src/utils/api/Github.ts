import qs from "query-string";
import { prepareHeaders, errTokenExpired } from "./helpers";
import { LocalStorage } from "~/utils/storage";
import { LS_ACCESS_TOKEN } from "./Api";

interface RepositoriesProps {
  // The id of the installation we'd like to show the repositories.
  installationId: string;
  params?: {
    page?: number;
    per_page?: number;
  };
}

interface Repository {
  name: string;
  full_name: string;
}

interface InstallationsProps {
  page?: number;
}

interface InstallationResponse {
  total_count: number;
  installations: Installation[];
}

interface RepositoriesResponse {
  total_count: number;
  repositories: Repository[];
}

export interface PageQueryParams {
  page: number;
  per_page?: number;
}

export interface Installation {
  id: string;
  account: {
    login: string;
    avatar_url: string;
  };
}

class Github {
  baseurl = "https://api.github.com";

  // This is required to enable the preview api for github.
  // It only needs to be included in endpoints which are related to github apps.
  previewHeader = "application/vnd.github.machine-man-preview+json";

  // This is the access token required to fetch repositories.
  accessToken = LocalStorage.get(LS_ACCESS_TOKEN);

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

  installations({
    page = 1,
  }: InstallationsProps = {}): Promise<InstallationResponse> {
    return new Promise((resolve, reject) => {
      const headers = prepareHeaders(this.accessToken);
      headers.set("Accept", this.previewHeader);
      headers.set("If-None-Match", ""); // https://github.com/octokit/rest.js/issues/890

      const request = new Request(
        `${this.baseurl}/user/installations?page=${page}&per_page=25`,
        { headers }
      );

      return fetch(request).then(res => {
        if (res.status === 401) {
          return reject(errTokenExpired);
        }

        resolve(res.json());
      });
    });
  }

  repositories({
    installationId,
    params = {},
  }: RepositoriesProps): Promise<RepositoriesResponse> {
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
      const query = qs.stringify(params);

      const request = new Request(
        `${this.baseurl}/user/installations/${installationId}/repositories?${query}`,
        { headers }
      );

      return fetch(request).then(res => {
        if (res.status === 401) {
          return reject(errTokenExpired);
        }

        return res.json().then(repos => {
          resolve(repos);
        });
      });
    });
  }
}

export default new Github();
