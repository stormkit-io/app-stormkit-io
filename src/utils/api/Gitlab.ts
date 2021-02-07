import { prepareHeaders, errTokenExpired, ApiGlobals } from "./helpers";
import { BaseAPI, APIRepositoryParams, APIUser } from "./BaseAPI";
import qs from "query-string";

export default class Gitlab implements BaseAPI {
  public baseurl = "https://gitlab.com/api/v4";

  // This value will be üp-dated by Auth.context.
  public accessToken?: string;

  constructor() {
    this.accessToken = (global as ApiGlobals).GITLAB_ACCESS_TOKEN;
  }

  /**
   * User returns the currently logged in user.
   * We need the user-to-server token to get a valid response
   * from this endpoint. This token can be obtained by using
   * the Auth.context:loginOauth method.
   *
   * @param {*} token The access token to make api calls.
   */
  user(): Promise<GitLabUser> {
    return new Promise((resolve, reject) => {
      const headers = prepareHeaders(this.accessToken);
      const request = new Request(`${this.baseurl}/user`, { headers });

      return fetch(request).then((res) => {
        if (res.status === 401) {
          return reject(errTokenExpired);
        }

        return res.json().then((user) => {
          user.created_at = new Date(user.created_at);
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
  repositories({ page, size = 20 }: APIRepositoryParams = {}): Promise<
    GitLabProjects
  > {
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

      return fetch(request).then((res) => {
        if (res.status === 401) {
          return reject(errTokenExpired);
        }

        return res.json().then((json) => {
          resolve({
            repos: json,
            nextPage: Number(res.headers.get("X-Next-Page")),
          });
        });
      });
    });
  }
}

export interface GitLabUser extends APIUser {
  id: number;
  username: string;
  name: string;
  state: string;
  avatar_url: string;
  web_url: string;
  created_at: Date;
  bio: string;
  bio_html: string;
  bot: boolean;
  location: null;
  public_email: string;
  skype: string;
  linkedin: string;
  twitter: string;
  website_url: string;
  organization: string;
  job_title: string;
}

export interface GitLabProjects {
  repos: GitLabProject[];
  nextPage?: number;
}

export interface GitLabProject {
  id: number;
  description: null;
  default_branch: string;
  visibility: string;
  ssh_url_to_repo: string;
  http_url_to_repo: string;
  web_url: string;
  readme_url: string;
  tag_list: string[];
  owner: Owner;
  name: string;
  name_with_namespace: string;
  path: string;
  path_with_namespace: string;
  issues_enabled: boolean;
  open_issues_count: number;
  merge_requests_enabled: boolean;
  jobs_enabled: boolean;
  wiki_enabled: boolean;
  snippets_enabled: boolean;
  can_create_merge_request_in: boolean;
  resolve_outdated_diff_discussions: boolean;
  container_registry_enabled: boolean;
  container_expiration_policy: ContainerExpirationPolicy;
  created_at: Date;
  last_activity_at: Date;
  creator_id: number;
  namespace: Namespace;
  import_status: string;
  import_error: null;
  permissions: Permissions;
  archived: boolean;
  avatar_url: string;
  license_url: string;
  license: License;
  shared_runners_enabled: boolean;
  forks_count: number;
  star_count: number;
  runners_token: string;
  ci_default_git_depth: number;
  ci_forward_deployment_enabled: boolean;
  public_jobs: boolean;
  shared_with_groups: SharedWithGroup[];
  repository_storage: string;
  only_allow_merge_if_pipeline_succeeds: boolean;
  allow_merge_on_skipped_pipeline: boolean;
  restrict_user_defined_variables: boolean;
  only_allow_merge_if_all_discussions_are_resolved: boolean;
  remove_source_branch_after_merge: boolean;
  printing_merge_requests_link_enabled: boolean;
  request_access_enabled: boolean;
  merge_method: string;
  auto_devops_enabled: boolean;
  auto_devops_deploy_strategy: string;
  approvals_before_merge: number;
  mirror: boolean;
  mirror_user_id: number;
  mirror_trigger_builds: boolean;
  only_mirror_protected_branches: boolean;
  mirror_overwrites_diverged_branches: boolean;
  external_authorization_classification_label: null;
  packages_enabled: boolean;
  service_desk_enabled: boolean;
  service_desk_address: null;
  autoclose_referenced_issues: boolean;
  suggestion_commit_message: null;
  marked_for_deletion_at: Date;
  marked_for_deletion_on: Date;
  compliance_frameworks: string[];
  statistics: Statistics;
  _links: Links;
}

export interface Links {
  self: string;
  issues: string;
  merge_requests: string;
  repo_branches: string;
  labels: string;
  events: string;
  members: string;
}

export interface ContainerExpirationPolicy {
  cadence: string;
  enabled: boolean;
  keep_n: null;
  older_than: null;
  name_regex: null;
  name_regex_delete: null;
  name_regex_keep: null;
  next_run_at: Date;
}

export interface License {
  key: string;
  name: string;
  nickname: string;
  html_url: string;
  source_url: string;
}

export interface Namespace {
  id: number;
  name: string;
  path: string;
  kind: string;
  full_path: string;
  avatar_url: string;
  web_url: string;
}

export interface Owner {
  id: number;
  name: string;
  created_at: Date;
}

export interface Permissions {
  project_access: Access;
  group_access: Access;
}

export interface Access {
  access_level: number;
  notification_level: number;
}

export interface SharedWithGroup {
  group_id: number;
  group_name: string;
  group_full_path: string;
  group_access_level: number;
}

export interface Statistics {
  commit_count: number;
  storage_size: number;
  repository_size: number;
  wiki_size: number;
  lfs_objects_size: number;
  job_artifacts_size: number;
  packages_size: number;
  snippets_size: number;
}
