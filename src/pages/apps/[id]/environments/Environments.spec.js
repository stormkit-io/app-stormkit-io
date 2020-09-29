import { waitFor } from "@testing-library/react";
import nock from "nock";
import { withAppContext } from "~/testing/helpers";
import * as data from "~/testing/data";

describe("pages/apps/[id]/environments", () => {
  let wrapper;
  const mockResponse = data.mockEnvironmentsResponse();
  const domains = ["app.stormkit.io", "app--development.stormkit.dev"];

  domains.forEach((domain) => {
    nock("http://localhost")
      .post(`/app/proxy`, { appId: "1", url: `https://${domain}` })
      .reply(200, { status: 200 });
  });

  beforeEach(() => {
    wrapper = withAppContext({
      app: data.mockAppResponse(),
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
