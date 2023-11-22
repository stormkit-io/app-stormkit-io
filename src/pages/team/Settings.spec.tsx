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
    team?: Team;
  }

  const teams = mockTeams();

  const createWrapper = ({ team }: Props) => {
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

  beforeEach(() => {
    createWrapper({ team: teams[1] });
  });

  test("should load all sections", () => {
    expect(wrapper.getByText("Team settings")).toBeTruthy();
    expect(wrapper.getByText("Team members")).toBeTruthy();
    expect(wrapper.getByText("Danger zone")).toBeTruthy();
  });
});
