import type { RenderResult } from "@testing-library/react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import { AppContext } from "~/pages/apps/[id]/App.context";
import mockApp from "~/testing/data/mock_app";
import mockEnvironment from "~/testing/data/mock_environment";
import { mockDomainInsert } from "~/testing/nocks/nock_domains";
import DomainModal from "./DomainModal";

interface Props {
  app: App;
  environment: Environment;
}

describe("~/pages/apps/[id]/environments/[env-id]/config/_components/TabDomainConfig/DomainModal.tsx", () => {
  let wrapper: RenderResult;
  let setRefreshToken: jest.Mock;
  let currentApp: App;
  let currentEnv: Environment;

  const createWrapper = ({ app, environment }: Props) => {
    setRefreshToken = jest.fn();

    wrapper = render(
      <AppContext.Provider
        value={{
          app,
          environments: [environment],
          setRefreshToken,
        }}
      >
        <EnvironmentContext.Provider value={{ environment }}>
          <DomainModal onClose={jest.fn()} setRefreshToken={setRefreshToken} />
        </EnvironmentContext.Provider>
      </AppContext.Provider>
    );
  };

  beforeEach(() => {
    currentApp = mockApp();
    currentEnv = mockEnvironment({ app: currentApp });

    createWrapper({ app: currentApp, environment: currentEnv });
  });

  test("inserts a domain", async () => {
    const scope = mockDomainInsert({
      appId: currentApp.id,
      envId: currentEnv.id!,
      domain: "www.stormkit.io",
    });

    await userEvent.type(
      wrapper.getByLabelText("Domain name"),
      "www.stormkit.io"
    );

    fireEvent.click(wrapper.getByText("Start verification process"));

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
      expect(setRefreshToken).toHaveBeenCalled();
    });
  });
});
