import type { RenderResult } from "@testing-library/react";
import * as router from "react-router";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { AuthContext } from "~/pages/auth/Auth.context";
import mockTeams from "~/testing/data/mock_teams";
import mockUser from "~/testing/data/mock_user";
import { mockInviteTeamMember } from "~/testing/nocks/nock_team_members";
import InviteMemberModal from "./InviteMemberModal";

const { RouterProvider, createMemoryRouter } = router;

describe("~/pages/team/InviteMemberModal.tsx", () => {
  let wrapper: RenderResult;
  let onClose: jest.Func;
  let reloadTeams: jest.Func;

  interface Props {
    team?: Team;
  }

  const teams = mockTeams();

  const createWrapper = ({ team }: Props) => {
    onClose = jest.fn();
    reloadTeams = jest.fn();

    const memoryRouter = createMemoryRouter(
      [
        {
          path: "/:team/settings",
          element: (
            <AuthContext.Provider
              value={{ user: mockUser(), teams, reloadTeams }}
            >
              <InviteMemberModal teamId={teams[1].id} onClose={onClose} />
            </AuthContext.Provider>
          ),
        },
      ],
      {
        initialEntries: [`/${team?.slug}/settings`],
        initialIndex: 0,
      }
    );

    wrapper = render(<RouterProvider router={memoryRouter} />);
  };

  beforeEach(() => {
    createWrapper({ team: teams[1] });
  });

  test("should display title and subtitle", () => {
    expect(wrapper.getByText("Invite team member")).toBeTruthy();
    expect(
      wrapper.getByText(
        "Team members will be able to see and modify all projects in the team."
      )
    ).toBeTruthy();
  });

  test("should create an invitation token for the invited user", async () => {
    const scope = mockInviteTeamMember({
      teamId: teams[1].id,
      email: "jamie@stormkit.io",
      role: "admin",
      response: { token: "my-token" },
    });

    fireEvent.change(wrapper.getByLabelText("Email"), {
      target: { value: "jamie@stormkit.io" },
    });

    fireEvent.click(wrapper.getByText("Invite"));

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);

      expect(
        wrapper.getByText(
          "Share the following link with your colleague to invite them to the team."
        )
      ).toBeTruthy();

      expect(
        wrapper.getByDisplayValue(
          "http://localhost/invitation/accept?token=my-token"
        )
      ).toBeTruthy();
    });
  });
});
