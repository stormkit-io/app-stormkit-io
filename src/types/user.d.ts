declare type SubscriptionName =
  | "free"
  | "starter"
  | "medium"
  | "enterprise"
  | "self-hosted";

declare type Edition = "limited" | "premium";

declare interface User {
  id: string;
  avatar: string;
  email: string;
  fullName: string;
  displayName: string;
  memberSince: number;
  isAdmin?: boolean;
  isPaymentRequired?: boolean;
  freeTrialEnds?: number;
  package: {
    id: SubscriptionName;
    name: string;
    maxDeploymentsPerMonth: number;
    edition: Edition | "";
  };
}

declare interface ConnectedAccount {
  provider: Provider;
  hasPersonalAccessToken: boolean;
  displayName: string;
  url?: string;
}
