import { RouterProvider, createMemoryRouter } from "react-router";
import { fireEvent, render, RenderResult } from "@testing-library/react";
import { AuthContext } from "~/pages/auth/Auth.context";
import mockTeams from "~/testing/data/mock_teams";
import mockUser from "~/testing/data/mock_user";
import mockApp from "~/testing/data/mock_app";
import TeamToggle from "./TeamToggle";

describe("~/layouts/TopMenu/Teams/TeamToggle.tsx", () => {
  let wrapper: RenderResult;

  interface Props {
    app?: App;
    teams?: Team[];
    initialPath?: string;
  }

  const teams = mockTeams();

  const createWrapper = ({ app, teams, initialPath = "/personal" }: Props) => {
    const memoryRouter = createMemoryRouter(
      [
        {
          path: "/:team?",
          element: (
            <AuthContext.Provider value={{ user: mockUser(), teams }}>
              <TeamToggle app={app} />
            </AuthContext.Provider>
          ),
        },
      ],
      { initialEntries: [initialPath], initialIndex: 0 }
    );

    wrapper = render(<RouterProvider router={memoryRouter} />);
  };

  test("should pick the right team from the slug", () => {
    createWrapper({ teams, initialPath: `/${teams[1].slug}` });
    expect(wrapper.getByText(teams[1].name)).toBeTruthy();
  });

  test("should pick the right team based on the app", () => {
    const app = mockApp();
    app.teamId = teams[2].id;
    createWrapper({ teams, app, initialPath: "/" });
    expect(wrapper.getByText(teams[2].name)).toBeTruthy();
  });

  test("should open team modal when create team button is clicked", () => {
    createWrapper({ teams, initialPath: `/${teams[1].slug}` });
    fireEvent.click(wrapper.getByText(teams[1].name));
    fireEvent.click(wrapper.getByText("Create team"));

    expect(
      wrapper.getByText("Use teams to collaborate with other team members.")
    ).toBeTruthy();
  });
});
