interface DiffFields {
  appName?: string;
  appRepo?: string;
  appRuntime?: string;
  envId?: string;
  envName?: string;
  envBranch?: string;
  envBuildConfig?: BuildConfig;
  envAutoPublish?: boolean;
  envAutoDeploy?: boolean;
  envAutoDeployBranches?: string;
  domainName?: string;
  domainCertValue?: string;
  domainCertKey?: string;
  snippetTitle?: string;
  snippetContent?: string;
  snippetEnabled?: boolean;
  snippetPrepend?: boolean;
  snippetRules?: SnippetRules;
  snippetLocation?: "head" | "body";
  snippets?: string[]; // Name of created snippets.
}

interface Diff {
  old: DiffFields;
  new: DiffFields;
}

declare interface Audit {
  id: string;
  appId?: string;
  envId?: string;
  envName?: string;
  teamId?: string;
  userDisplay?: string;
  tokenName?: string;
  action: string;
  diff: Diff;
  timestamp?: int;
}
