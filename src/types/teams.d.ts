declare interface Team {
  id: string;
  name: string;
  slug: string;
  isDefault: boolean;
  currentUserRole: "owner" | "admin" | "developer";
}
