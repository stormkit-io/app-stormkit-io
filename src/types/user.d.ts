declare type User = {
  id: string;
  avatar: string;
  email: string;
  fullName: string;
  displayName: string;
  memberSince: number;
};

declare type ConnectedAccount = {
  provider: Provider;
  hasPersonalAccessToken: boolean;
  displayName: string;
  url?: string;
};
