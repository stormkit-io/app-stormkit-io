declare type User = {
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
    id: "enterprise" | "medium" | "starter" | "free";
  };
};

declare type ConnectedAccount = {
  provider: Provider;
  hasPersonalAccessToken: boolean;
  displayName: string;
  url?: string;
};
