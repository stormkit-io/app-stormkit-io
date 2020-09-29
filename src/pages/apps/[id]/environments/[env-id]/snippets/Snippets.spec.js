import { waitFor, fireEvent } from "@testing-library/react";
import { withAppContext } from "~/testing/helpers";
import * as data from "~/testing/data";
import * as nocks from "~/testing/nocks";

describe("pages/apps/[id]/environments/[env-id]/snippets", () => {
  let wrapper;

  const mockResponse = data.mockEnvironmentsResponse();

  const app = data.mockAppResponse();
  const envs = data.mockEnvironmentsResponse().envs.slice(0, 1);
  const env = envs[0];

  beforeEach(() => {
    nocks.mockAppProxy({ app, envs });
    nocks.mockSnippetsResponse({ app, env });

    wrapper = withAppContext({
      app,
      envs: mockResponse,
      path: `/apps/${app.id}/environments/${env.id}/snippets`,
    });
  });

  test("should load snippets", async () => {
    await waitFor(() => {
      expect(wrapper.getByText("Snippet 1")).toBeTruthy();
      expect(wrapper.getByText("Snippet 2")).toBeTruthy();
    });
  });

  test("should have a new button which opens a modal", async () => {
    let button;

    await waitFor(() => {
      button = wrapper.getByLabelText("Insert snippet");
      expect(button).toBeTruthy();
    });

    fireEvent.click(button);

    await waitFor(() => {
      expect(wrapper.getByText("Create snippet")).toBeTruthy();
    });
  });
});
