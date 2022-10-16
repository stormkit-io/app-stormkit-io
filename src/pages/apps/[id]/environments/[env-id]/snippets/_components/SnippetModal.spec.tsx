import type { RenderResult } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router";
import { waitFor, fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import { mockUpsertSnippets } from "~/testing/nocks/nock_snippets";
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
  snippets: Snippets;
  closeModal: () => void;
  setSnippets: (s: Snippets) => void;
}

describe("~/pages/apps/[id]/environments/[env-id]/snippets/_components/SnippetModal.tsx", () => {
  let wrapper: RenderResult;
  let currentApp: App;
  let currentEnv: Environment;
  let snippets: Snippets;
  let closeModal: jest.Mock;
  let setSnippets: jest.Mock;

  const snippet = {
    title: "Google Analytics",
    prepend: false,
    enabled: false,
    content: "<script>\n    console.log('Hello world');\n</script>",
  };

  const createWrapper = ({
    app,
    env,
    closeModal,
    setSnippets,
    snippets,
    snippet,
  }: Props) => {
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
              setSnippets={setSnippets}
              closeModal={closeModal}
              snippets={snippets}
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
      snippets = { head: [], body: [] };
      closeModal = jest.fn();
      setSnippets = jest.fn();

      createWrapper({
        app: currentApp,
        env: currentEnv,
        snippets,
        closeModal,
        setSnippets,
      });
    });

    test("should handle form submission", async () => {
      const scope = mockUpsertSnippets({
        appId: currentApp.id,
        envName: currentEnv.name,
        snippets: {
          head: [snippet],
          body: [],
        },
      });

      await userEvent.type(wrapper.getByLabelText("Title"), "Google Analytics");
      await fireEvent.click(wrapper.getByText("Create"));

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
      });

      expect(closeModal).toHaveBeenCalled();
      expect(setSnippets).toHaveBeenCalledWith({
        head: [
          {
            ...snippet,
            _injectLocation: "head",
            _i: 0,
          },
        ],
        body: [],
      });
    });
  });

  describe("edit mode", () => {
    beforeEach(() => {
      currentApp = mockApp();
      currentEnv = mockEnvironment({ app: currentApp });
      snippets = {
        head: [],
        body: [{ ...snippet, _injectLocation: "body", _i: 0 }],
      };

      closeModal = jest.fn();
      setSnippets = jest.fn();

      createWrapper({
        app: currentApp,
        env: currentEnv,
        snippets,
        snippet: snippets.body[0],
        closeModal,
        setSnippets,
      });
    });

    test("should handle form submission", async () => {
      const scope = mockUpsertSnippets({
        appId: currentApp.id,
        envName: currentEnv.name,
        snippets: {
          head: [],
          body: [{ ...snippet, title: "Hotjar" }],
        },
      });

      await userEvent.clear(wrapper.getByLabelText("Title"));
      await userEvent.type(wrapper.getByLabelText("Title"), "Hotjar");
      await fireEvent.click(wrapper.getByText("Update"));

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
      });

      expect(closeModal).toHaveBeenCalled();
      expect(setSnippets).toHaveBeenCalledWith({
        head: [],
        body: [{ ...snippet, _injectLocation: "body", _i: 0, title: "Hotjar" }],
      });
    });
  });
});
