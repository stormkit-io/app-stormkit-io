import { waitFor } from "@testing-library/react";
import nock from "nock";
import { withAppContext } from "~/testing/helpers";
import { mockEnvironments, mockApp } from "~/testing/data";

describe("pages/Apps/:id/Environments", () => {
  let wrapper;
  const mockResponse = mockEnvironments();
  const domains = ["app.stormkit.io", "app--development.stormkit.dev"];

  domains.forEach((domain) => {
    nock("https://cors-anywhere.herokuapp.com")
      .head(`/https://${domain}`)
      .reply(200);
  });

  beforeEach(() => {
    wrapper = withAppContext({
      app: mockApp(),
      envs: mockResponse,
      path: "/apps/1/environments",
    });
  });

  test("should list environments", async () => {
    await waitFor(() => {
      mockResponse.envs.forEach((env) => {
        expect(wrapper.getByText(env.branch)).toBeTruthy();
        expect(wrapper.getByText(env.env)).toBeTruthy();
        expect(wrapper.getAllByText(/Status/)).toBeTruthy();
        expect(wrapper.getAllByText(/200/)).toBeTruthy();
      });

      domains.forEach((domain) => {
        expect(wrapper.getByText(domain)).toBeTruthy();
      });
    });
  });
});
