import { RouterProvider, createMemoryRouter } from "react-router";
import { render, RenderResult, fireEvent } from "@testing-library/react";
import mockTeams from "~/testing/data/mock_teams";
import TeamMenu from "./TeamMenu";

describe("~/layouts/TopMenu/Teams/TeamMenu.tsx", () => {
  let wrapper: RenderResult;
  let onSettingsClick: jest.Func;
  let onClickAway: jest.Func;
  let onCreateTeamButtonClicked: jest.Func;

  interface Props {
    selectedTeam?: Team;
    teams?: Team[];
  }

  const createWrapper = ({ selectedTeam, teams }: Props) => {
    onSettingsClick = jest.fn();
    onClickAway = jest.fn();
    onCreateTeamButtonClicked = jest.fn();

    const memoryRouter = createMemoryRouter([
      {
        path: "*",
        element: (
          <TeamMenu
            selectedTeam={selectedTeam}
            teams={teams}
            onSettingsClick={onSettingsClick}
            onClickAway={onClickAway}
            onCreateTeamButtonClicked={onCreateTeamButtonClicked}
          />
        ),
      },
    ]);

    wrapper = render(<RouterProvider router={memoryRouter} />);
  };

  describe("with no existing teams", () => {
    beforeEach(() => {
      createWrapper({
        teams: [mockTeams()[0]],
      });
    });

    test("should handle create team button clicked", () => {
      fireEvent.click(wrapper.getByText("Create team"));
      expect(onCreateTeamButtonClicked).toHaveBeenCalled();
    });

    test("should just list personal team", () => {
      expect(wrapper.getByText("default")).toBeTruthy();
      expect(wrapper.getByText("Personal")).toBeTruthy();
      expect(wrapper.getAllByRole("link").length).toBe(1);
    });

    test("should not display the group members icon", () => {
      expect(() => wrapper.getByLabelText("Team members")).toThrow();
    });
  });

  describe.each`
    selectedTeam | shouldShowSettings | role
    ${0}         | ${false}           | ${"owner (default)"}
    ${1}         | ${false}           | ${"developer"}
    ${2}         | ${true}            | ${"admin"}
  `("permissions: $role", ({ selectedTeam, shouldShowSettings }) => {
    const teams = mockTeams();

    beforeEach(() => {
      createWrapper({
        teams,
        selectedTeam: teams[selectedTeam],
      });
    });

    test("should list all teams", () => {
      expect(wrapper.getByRole("list").querySelectorAll("a").length).toBe(3);
    });

    const findTeam = (id: string) => wrapper.getByTestId(`team-${id}`);

    if (shouldShowSettings) {
      test("should display the group members icon", () => {
        expect(wrapper.getByLabelText("Team members")).toBeTruthy();
      });

      test("should display the team settings icon", () => {
        expect(findTeam(teams[selectedTeam].id).innerHTML).toContain(
          "Team settings"
        );
      });
    } else {
      test("should not display the group members icon", () => {
        expect(() => wrapper.getByLabelText("Team members")).toThrow();
      });

      test("should not display the team settings icon", () => {
        expect(findTeam(teams[selectedTeam].id).innerHTML).not.toContain(
          "Team settings"
        );
      });
    }
  });
});
