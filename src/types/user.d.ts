declare type User = {
  id: string;
  avatar: string;
  email: string;
  fullName: string;
  displayName: string;
  memberSince: number;
  isAdmin?: boolean;
  package: {
    id: "enterprise" | "medium" | "starter" | "free";
    customStorage: boolean;
  };
};

declare type ConnectedAccount = {
  provider: Provider;
  hasPersonalAccessToken: boolean;
  displayName: string;
  url?: string;
};
