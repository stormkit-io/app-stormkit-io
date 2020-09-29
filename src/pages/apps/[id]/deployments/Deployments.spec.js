import { waitFor } from "@testing-library/react";
import nock from "nock";
import { withAppContext } from "~/testing/helpers";
import * as data from "~/testing/data";

describe("pages/apps/[id]/deployments", () => {
  let wrapper;

  describe("when hasNextPage is true", () => {
    beforeEach(() => {
      const mockDeploymentsResponse = data.mockDeploymentsResponse();
      mockDeploymentsResponse.hasNextPage = true;

      nock("http://localhost")
        .post(`/app/deployments`, { appId: "1", from: 0 })
        .reply(200, mockDeploymentsResponse);

      wrapper = withAppContext({
        app: data.mockAppResponse(),
        envs: data.mockEnvironmentsResponse(),
        path: "/apps/1/deployments",
      });
    });

    test("should have a button to load more", async () => {
      await waitFor(() => {
        const button = wrapper.getByText("Load more");
        expect(button).toBeTruthy();
      });
    });
  });

  describe("when hasNextPage is false", () => {
    beforeEach(() => {
      const mockDeploymentsResponse = data.mockDeploymentsResponse();
      mockDeploymentsResponse.hasNextPage = false;

      nock("http://localhost")
        .post(`/app/deployments`, { appId: "1", from: 0 })
        .reply(200, mockDeploymentsResponse);

      wrapper = withAppContext({
        app: data.mockAppResponse(),
        envs: data.mockEnvironmentsResponse(),
        path: "/apps/1/deployments",
      });
    });

    test("should not have a button to load more", async () => {
      await waitFor(() => {
        expect(wrapper.getByText(/Improve snippets/)).toBeTruthy();
        expect(() => wrapper.getByText("Load more")).toThrow();
      });
    });
  });
});
