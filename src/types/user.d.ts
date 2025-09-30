declare type SubscriptionName =
  | "free"
  | "starter"
  | "medium"
  | "enterprise"
  | "self-hosted";

declare type Edition = "community" | "enterprise";

declare interface User {
  id: string;
  avatar: string;
  email: string;
  fullName: string;
  displayName: string;
  memberSince: number;
  isAdmin?: boolean;
  isPaymentRequired?: boolean;
  package: {
    id: SubscriptionName;
    name: string;
    edition: Edition | "";
  };
}

declare interface ConnectedAccount {
  provider: Provider;
  hasPersonalAccessToken: boolean;
  displayName: string;
  url?: string;
}

declare interface InstanceDetails {
  latest?: {
    apiVersion: string;
  };
  license?: {
    seats: number;
    remaining: number;
    edition: Edition;
  };
  stormkit?: {
    apiCommit: string;
    apiVersion: string;
    selfHosted: boolean;
  };
  update?: {
    api: boolean;
  };
  auth?: {
    github?: string; // The github account name
  };
}
