export interface APIUser {
  id: unknown;
}

export interface APIRepositoryList {
  repos: APIRepository[];
}

export type APIRepositoryParams = { page?: number; size?: number };

export interface APIRepository {
  id: unknown;
}

export interface BaseAPI {
  baseurl: string;

  user(): Promise<APIUser>;
  repositories(params: APIRepositoryParams): Promise<APIRepositoryList>;
}
