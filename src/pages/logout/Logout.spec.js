import { waitFor } from "@testing-library/react";
import { withUserContext } from "~/testing/helpers";
import { LocalStorage } from "~/utils/storage";

describe("pages/logout", () => {
  test("should trigger the logout function on mount", async () => {
    LocalStorage.set("skit_token", "abc");

    withUserContext({
      path: "/logout"
    });

    await waitFor(() => {
      expect(LocalStorage.get("skit_token")).toBe(null);
    });
  });
});
