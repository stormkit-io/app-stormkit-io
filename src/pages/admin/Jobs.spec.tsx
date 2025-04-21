import { describe, it, expect, beforeEach } from "vitest";
import {
  fireEvent,
  render,
  waitFor,
  type RenderResult,
} from "@testing-library/react";
import nock from "nock";
import AdminJobs from "./Jobs";

describe("~/pages/admin/Jobs.tsx", () => {
  let wrapper: RenderResult;

  beforeEach(() => {
    wrapper = render(<AdminJobs />);
  });

  describe.each`
    job                               | index | endpoint
    ${"Sync analytics last 30 days"}  | ${0}  | ${"/admin/jobs/sync-analytics?ts=30d"}
    ${"Sync analytics last 7 days"}   | ${1}  | ${"/admin/jobs/sync-analytics?ts=7d"}
    ${"Sync analytics last 24 hours"} | ${2}  | ${"/admin/jobs/sync-analytics?ts=24h"}
    ${"Remove old artifacts"}         | ${3}  | ${"/admin/jobs/remove-old-artifacts"}
  `("Job: $job", ({ job, index, endpoint }) => {
    it("should render", () => {
      expect(wrapper.getByText(job)).toBeTruthy();
    });

    it("should fetch the correct endpoint", async () => {
      const scope = nock(process.env.API_DOMAIN || "")
        .post(endpoint)
        .reply(200);

      fireEvent.click(wrapper.getAllByText("Sync").at(index)!);

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
      });
    });
  });
});
