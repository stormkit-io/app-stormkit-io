import type { RenderResult } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { waitFor, fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import {
  mockUpdateSnippet,
  mockInsertSnippet,
} from "~/testing/nocks/nock_snippets";
import mockApp from "~/testing/data/mock_app";
import mockEnvironment from "~/testing/data/mock_environment";
import SnippetModal from "./SnippetModal";

jest.mock("@codemirror/lang-json", () => ({ json: jest.fn() }));
jest.mock("@uiw/react-codemirror", () => ({ value }: { value: string }) => (
  <>{value}</>
));

interface Props {
  app: App;
  env: Environment;
  snippet?: Snippet;
  closeModal: () => void;
  setRefreshToken: (s: number) => void;
}

describe("~/pages/apps/[id]/environments/[env-id]/snippets/SnippetModal.tsx", () => {
  let wrapper: RenderResult;
  let currentApp: App;
  let currentEnv: Environment;
  let snippets: Snippet[];
  let closeModal: jest.Mock;
  let setRefreshToken: jest.Mock;

  const snippet: Snippet = {
    title: "Google Analytics",
    prepend: false,
    enabled: false,
    content: "<script>\n    console.log('Hello world');\n</script>",
    location: "head",
  };

  const createWrapper = ({ app, env, closeModal, snippet }: Props) => {
    wrapper = render(
      <MemoryRouter>
        <AppContext.Provider
          value={{
            app,
            environments: [env],
            setRefreshToken: jest.fn(),
          }}
        >
          <EnvironmentContext.Provider value={{ environment: env }}>
            <SnippetModal
              setRefreshToken={setRefreshToken}
              closeModal={closeModal}
              snippet={snippet}
            />
          </EnvironmentContext.Provider>
        </AppContext.Provider>
      </MemoryRouter>
    );
  };

  describe("insert mode", () => {
    beforeEach(() => {
      currentApp = mockApp();
      currentEnv = mockEnvironment({ app: currentApp });
      snippets = [];
      closeModal = jest.fn();
      setRefreshToken = jest.fn();

      createWrapper({
        app: currentApp,
        env: currentEnv,
        closeModal,
        setRefreshToken,
      });
    });

    test("should handle form submission", async () => {
      const scope = mockInsertSnippet({
        appId: currentApp.id,
        envId: currentEnv.id!,
        snippets: [{ ...snippet, rules: { hosts: ["www.e.org", "e.org"] } }],
      });

      await userEvent.type(wrapper.getByLabelText("Title"), "Google Analytics");
      await userEvent.type(wrapper.getByLabelText("Hosts"), "www.e.org, e.org");

      await fireEvent.click(wrapper.getByText("Create"));

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
      });

      expect(closeModal).toHaveBeenCalled();
      expect(setRefreshToken).toHaveBeenCalled();
    });
  });

  describe("edit mode", () => {
    beforeEach(() => {
      currentApp = mockApp();
      currentEnv = mockEnvironment({ app: currentApp });
      snippets = [{ ...snippet, location: "body", id: 1 }];

      closeModal = jest.fn();
      setRefreshToken = jest.fn();

      createWrapper({
        app: currentApp,
        env: currentEnv,
        snippet: snippets[0],
        closeModal,
        setRefreshToken,
      });
    });

    test("should handle form submission", async () => {
      const scope = mockUpdateSnippet({
        appId: currentApp.id,
        envId: currentEnv.id!,
        snippet: { ...snippet, location: "body", title: "Hotjar", id: 1 },
      });

      await userEvent.clear(wrapper.getByLabelText("Title"));
      await userEvent.type(wrapper.getByLabelText("Title"), "Hotjar");
      await fireEvent.click(wrapper.getByText("Update"));

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
      });

      expect(closeModal).toHaveBeenCalled();
      expect(setRefreshToken).toHaveBeenCalled();
    });
  });
});
