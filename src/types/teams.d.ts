declare interface Team {
  id: string;
  name: string;
  isDefault: boolean;
  currentUserRole: "owner" | "admin" | "developer";
}
