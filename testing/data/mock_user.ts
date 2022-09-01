interface UserProps {
  isAdmin?: boolean;
  packageId: "enterprise" | "medium" | "starter" | "free";
}

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
  },
});
