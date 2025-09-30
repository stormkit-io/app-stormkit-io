interface UserProps {
  isAdmin?: boolean;
  packageId: SubscriptionName;
}

const idToName: Record<SubscriptionName, string> = {
  free: "Free Trial",
  starter: "Starter",
  medium: "Medium",
  enterprise: "Enterprise",
  "self-hosted": "Self-Hosted Edition",
};

const defaultProps: UserProps = {
  isAdmin: false,
  packageId: "enterprise",
};

export default ({ isAdmin, packageId }: UserProps = defaultProps): User => ({
  id: "123",
  avatar: "https://example.com/avatar/user",
  email: "test@stormkit.io",
  fullName: "John Doe",
  displayName: "johnDoe",
  memberSince: 1588622630,
  isAdmin,
  package: {
    id: packageId,
    name: idToName[packageId],
    edition: packageId === "self-hosted" ? "limited" : "",
  },
});
