import type { RenderResult } from "@testing-library/react";
import * as router from "react-router";
import { render, waitFor } from "@testing-library/react";
import { AuthContext } from "~/pages/auth/Auth.context";
import mockTeams from "~/testing/data/mock_teams";
import mockUser from "~/testing/data/mock_user";
import { mockInvitationAccept } from "~/testing/nocks/nock_team_members";
import InvitationAccept from "./InvitationAccept";

const { RouterProvider, createMemoryRouter } = router;

describe("~/pages/team/InvitationAccept.tsx", () => {
  let wrapper: RenderResult;
  let reloadTeams: jest.Func;
  let navigateSpy: jest.Func;

  interface Props {
    token: string;
  }

  const teams = mockTeams();

  const mockUseNavigate = () => {
    navigateSpy = jest.fn();
    jest.spyOn(router, "useNavigate").mockReturnValue(navigateSpy);
  };

  const createWrapper = ({ token }: Props) => {
    mockUseNavigate();
    reloadTeams = jest.fn();

    const memoryRouter = createMemoryRouter(
      [
        {
          path: "/invitation/accept",
          element: (
            <AuthContext.Provider
              value={{ user: mockUser(), teams, reloadTeams }}
            >
              <InvitationAccept />
            </AuthContext.Provider>
          ),
        },
      ],
      {
        initialEntries: [`/invitation/accept?token=${token}`],
        initialIndex: 0,
      }
    );

    wrapper = render(<RouterProvider router={memoryRouter} />);
  };

  test("should accept the invitation and navigate to the teams page", async () => {
    const scope = mockInvitationAccept({
      token: "my-token",
      response: teams[1],
    });

    createWrapper({ token: "my-token" });

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
      expect(navigateSpy).toHaveBeenCalled();
    });
  });
});
