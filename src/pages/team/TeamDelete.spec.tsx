import type { RenderResult } from "@testing-library/react";
import * as router from "react-router";
import { fireEvent, render, waitFor } from "@testing-library/react";
import mockTeams from "~/testing/data/mock_teams";
import { mockRemoveTeam } from "~/testing/nocks/nock_team";
import TeamDelete from "./TeamDelete";

const { RouterProvider, createMemoryRouter } = router;

describe("~/pages/team/TeamDelete.tsx", () => {
  let wrapper: RenderResult;
  let reloadTeams: jest.Func;
  let navigateSpy: jest.Mock;

  interface Props {
    team: Team;
  }

  const teams = mockTeams();

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
          element: <TeamDelete team={team} reloadTeams={reloadTeams} />,
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
    mockUseNavigate();
    createWrapper({ team: teams[1] });
  });

  test("should display title and subtitle", () => {
    expect(wrapper.getByText("Danger zone")).toBeTruthy();
    expect(
      wrapper.getByText(
        "Permanently delete your Team and all of its contents from the Stormkit platform. This action cannot be undone — proceed with caution."
      )
    ).toBeTruthy();
  });

  test("should remove the team", async () => {
    const scope = mockRemoveTeam({
      teamId: teams[1].id,
    });

    fireEvent.click(wrapper.getByText("Delete"));

    fireEvent.change(wrapper.getByLabelText("Confirmation"), {
      target: { value: "Permanently delete my team" },
    });

    fireEvent.click(wrapper.getByText("Yes, continue"));

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
      expect(reloadTeams).toHaveBeenCalled();
    });
  });
});
