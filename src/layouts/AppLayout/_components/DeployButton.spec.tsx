import type { RenderResult } from "@testing-library/react";
import { fireEvent, render } from "@testing-library/react";
import * as router from "react-router";
import mockApp from "~/testing/data/mock_app";
import mockEnv from "~/testing/data/mock_environment";
import DeployButton from "./DeployButton";

interface Props {
  app: App;
  env: Environment;
  initialEntries?: string[];
  initialIndex?: number;
}

describe("~/layouts/AppLayout/_components/DeployButton.tsx", () => {
  let wrapper: RenderResult;
  let currentApp: App;
  let currentEnv: Environment;
  let navigate: jest.Func;

  const createWrapper = ({ app, env, initialIndex, initialEntries }: Props) => {
    navigate = jest.fn();

    jest.spyOn(router, "useNavigate").mockReturnValue(navigate);

    const { RouterProvider, createMemoryRouter } = router;

    const memoryRouter = createMemoryRouter(
      [
        {
          path: "*",
          element: (
            <DeployButton
              app={app}
              environments={[env]}
              selectedEnvId={env.id!}
            />
          ),
        },
      ],
      {
        initialEntries,
        initialIndex,
      }
    );

    wrapper = render(<RouterProvider router={memoryRouter} />);
  };

  afterEach(() => {
    wrapper.unmount();
  });

  describe("without query parameter", () => {
    beforeEach(() => {
      currentApp = mockApp();
      currentEnv = mockEnv({ app: currentApp });
      createWrapper({ app: currentApp, env: currentEnv });
    });

    test("mounts the button properly", () => {
      expect(wrapper.getByText("Deploy")).toBeTruthy();
      expect(() => wrapper.getByText("Start a deployment")).toThrow();
    });

    test("displays the modal when button is clicked", () => {
      fireEvent.click(wrapper.getByText("Deploy"));
      expect(wrapper.getByText("Start a deployment")).toBeTruthy();
    });
  });

  describe("with deploy query parameter", () => {
    beforeEach(() => {
      currentApp = mockApp();
      currentEnv = mockEnv({ app: currentApp });
      createWrapper({
        app: currentApp,
        env: currentEnv,
        initialEntries: ["/path?deploy"],
      });
    });

    test("should open the modal by default", () => {
      expect(wrapper.getByText("Start a deployment")).toBeTruthy();
    });
  });
});
