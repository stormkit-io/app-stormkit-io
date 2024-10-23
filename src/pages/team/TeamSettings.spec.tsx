import type { RenderResult } from "@testing-library/react";
import * as router from "react-router";
import { fireEvent, render, waitFor } from "@testing-library/react";
import mockTeams from "~/testing/data/mock_teams";
import { mockUpdateTeam } from "~/testing/nocks/nock_team";
import TeamSettings from "./TeamSettings";

const { RouterProvider, createMemoryRouter } = router;

describe("~/pages/team/TeamSettings.tsx", () => {
  let wrapper: RenderResult;
  let reloadTeams: jest.Func;
  let navigateSpy: jest.Mock;

  interface Props {
    team: Team;
  }

  const mockUseNavigate = () => {
    navigateSpy = jest.fn();
    jest.spyOn(router, "useNavigate").mockReturnValue(navigateSpy);
  };

  const createWrapper = ({ team }: Props) => {
    reloadTeams = jest.fn();

    const memoryRouter = createMemoryRouter(
      [
        {
          path: "/:team/settings",
          element: <TeamSettings team={team} reloadTeams={reloadTeams} />,
        },
      ],
      {
        initialEntries: [`/${team?.slug}/settings`],
        initialIndex: 0,
      }
    );

    wrapper = render(<RouterProvider router={memoryRouter} />);
  };

  describe("when has admin rights", () => {
    const teams = mockTeams();
    teams[1].currentUserRole = "owner";

    beforeEach(() => {
      mockUseNavigate();
      createWrapper({ team: teams[1] });
    });

    test("should display title and subtitle", () => {
      expect(wrapper.getByText("Team settings")).toBeTruthy();
      expect(
        wrapper.getByText("Only Owners and Admins can update team settings.")
      ).toBeTruthy();
    });

    test("should update a team", async () => {
      const team = { ...teams[1], name: "My new name", slug: "my-new-name" };
      const scope = mockUpdateTeam({
        name: team.name,
        teamId: team.id,
        response: team,
      });

      fireEvent.change(wrapper.getByLabelText("Team name"), {
        target: { value: team.name },
      });

      fireEvent.click(wrapper.getByText("Update"));

      await waitFor(() => {
        scope.isDone();
        expect(reloadTeams).toHaveBeenCalled();
        expect(navigateSpy).toHaveBeenCalledWith(`/${team.id}/settings`, {
          replace: true,
        });
      });
    });
  });

  describe("when has developer rights", () => {
    const teams = mockTeams();
    teams[1].currentUserRole = "developer";

    beforeEach(() => {
      mockUseNavigate();
      createWrapper({ team: teams[1] });
    });

    test("should display title and subtitle", () => {
      expect(wrapper.getByText("Team settings")).toBeTruthy();
      expect(
        wrapper.getByText("Only Owners and Admins can update team settings.")
      ).toBeTruthy();
    });

    test("should not have an update button", () => {
      expect(() => wrapper.getByText("Update")).toThrow();
    });
  });
});
