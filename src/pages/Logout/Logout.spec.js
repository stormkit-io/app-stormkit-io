import { renderWithContext } from "~/testing/helpers";
import Logout from "./Logout";

describe("pages/Logout", () => {
  test("should trigger the logout function on mount", () => {
    const logout = jest.fn();
    const wrapper = renderWithContext(Logout, {
      context: { logout },
      routeHelpers: false,
    });
    expect(wrapper.container.innerHTML).toBe("");
    expect(logout).toHaveBeenCalled();
  });
});
