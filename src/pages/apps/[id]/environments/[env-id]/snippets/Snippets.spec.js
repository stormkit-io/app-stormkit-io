import { waitFor, fireEvent } from "@testing-library/react";
import { withMockContext } from "~/testing/helpers";
import nock from "nock";
import * as data from "~/testing/data";

const fileName = `pages/apps/[id]/environments/[env-id]/snippets/Snippets`;

jest.mock("codemirror/keymap/sublime", () => {});
jest.mock("codemirror/theme/idea.css", () => {});

describe(fileName, () => {
  let wrapper;
  let toggleModal;
  let snippets;

  const app = data.mockApp();
  const env = data.mockEnvironments({ app }).slice(0, 1)[0];

  beforeEach(() => {
    toggleModal = jest.fn();
    snippets = data.mockSnippets();

    nock(process.env.API_DOMAIN)
      .get(`/app/${app.id}/envs/${env.name}/snippets`)
      .reply(200, { snippets });

    wrapper = withMockContext({
      path: `~/${fileName}`,
      props: {
        app,
        environment: env,
        toggleModal,
      },
    });
  });

  test("should load snippets", async () => {
    await waitFor(() => {
      expect(wrapper.getByText(snippets.head[0].title)).toBeTruthy();
      expect(wrapper.getByText(snippets.body[0].title)).toBeTruthy();
    });
  });

  test("should have a new button which opens a modal", async () => {
    await waitFor(() => {
      expect(wrapper.getByText(snippets.head[0].title)).toBeTruthy();
    });

    fireEvent.click(wrapper.getByLabelText("Insert snippet"));

    await waitFor(() => {
      expect(toggleModal).toHaveBeenCalled();
    });
  });
});
