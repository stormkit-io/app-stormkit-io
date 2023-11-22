import type { RenderResult } from "@testing-library/react";
import * as router from "react-router";
import { fireEvent, render, waitFor } from "@testing-library/react";
import mockTeams from "~/testing/data/mock_teams";
import { mockCreateTeam } from "~/testing/nocks/nock_team";
import TeamModal from "./TeamModal";

const { RouterProvider, createMemoryRouter } = router;

describe("~/layouts/TopMenu/Teams/TeamModal.tsx", () => {
  let wrapper: RenderResult;
  let onClose: jest.Func;
  let reloadTeams: jest.Func;
  let navigateSpy: jest.Mock;

  interface Props {
    team?: Team;
  }

  const teams = mockTeams();

  const mockUseNavigate = () => {
    navigateSpy = jest.fn();
    jest.spyOn(router, "useNavigate").mockReturnValue(navigateSpy);
  };

  const createWrapper = ({ team }: Props) => {
    onClose = jest.fn();
    reloadTeams = jest.fn();

    const memoryRouter = createMemoryRouter([
      {
        path: "/:team?",
        element: <TeamModal onClose={onClose} reload={reloadTeams} />,
      },
    ]);

    wrapper = render(<RouterProvider router={memoryRouter} />);
  };

  beforeEach(() => {
    mockUseNavigate();
    createWrapper({});
  });

  test("should display header", () => {
    expect(wrapper.getByText("New Team")).toBeTruthy();
  });

  test("should display subheader", () => {
    expect(
      wrapper.getByText("Use teams to collaborate with other team members.")
    ).toBeTruthy();
  });

  test("should not allow creating empty teams", () => {
    fireEvent.click(wrapper.getByText("Create"));
    expect(wrapper.getByText("Team name is a required field.")).toBeTruthy();
  });

  test("should create a team", async () => {
    const team = { ...teams[2], name: "My team", slug: "my-team" };
    const scope = mockCreateTeam({ name: team.name, response: team });

    fireEvent.change(wrapper.getByLabelText("Team name"), {
      target: { value: team.name },
    });

    fireEvent.click(wrapper.getByText("Create"));

    await waitFor(() => {
      scope.isDone();
      expect(onClose).toHaveBeenCalled();
      expect(reloadTeams).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith(`/${team.slug}`, {
        replace: true,
      });
    });
  });
});
