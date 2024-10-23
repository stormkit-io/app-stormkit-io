import type { RenderResult } from "@testing-library/react";
import * as router from "react-router";
import { render } from "@testing-library/react";
import { AuthContext } from "~/pages/auth/Auth.context";
import mockTeams from "~/testing/data/mock_teams";
import mockUser from "~/testing/data/mock_user";
import Settings from "./Settings";

const { RouterProvider, createMemoryRouter } = router;

describe("~/pages/team/Settings.tsx", () => {
  let wrapper: RenderResult;
  let reloadTeams: jest.Func;

  interface Props {
    selectedTeam: Team;
    teams?: Team[];
  }

  const createWrapper = ({ teams, selectedTeam: team }: Props) => {
    reloadTeams = jest.fn();

    const memoryRouter = createMemoryRouter(
      [
        {
          path: "/:team/settings",
          element: (
            <AuthContext.Provider
              value={{ user: mockUser(), teams, reloadTeams }}
            >
              <Settings />
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

  describe("when has admin access", () => {
    const teams = mockTeams();
    teams[1].currentUserRole = "admin";

    beforeEach(() => {
      createWrapper({ selectedTeam: teams[1], teams });
    });

    test("should load all sections", () => {
      expect(wrapper.getByText("Team settings")).toBeTruthy();
      expect(wrapper.getByText("Team members")).toBeTruthy();
      expect(wrapper.getByText("Danger zone")).toBeTruthy();
    });
  });

  describe("when has developer access", () => {
    const teams = mockTeams();
    teams[1].currentUserRole = "developer";

    beforeEach(() => {
      createWrapper({ selectedTeam: teams[1], teams });
    });

    test("should load all sections", () => {
      expect(wrapper.getByText("Team settings")).toBeTruthy();
      expect(wrapper.getByText("Team members")).toBeTruthy();
      expect(() => wrapper.getByText("Danger zone")).toThrow();
    });
  });
});
