import nock from "nock";
import { describe, it, expect, beforeEach } from "vitest";
import {
  render,
  fireEvent,
  waitFor,
  type RenderResult,
} from "@testing-library/react";
import AdminSystem from "./System";

describe("~/pages/admin/System.tsx", () => {
  let wrapper: RenderResult;

  const fetchRuntimesScope = (runtimes: string[]) => {
    return nock(process.env.API_DOMAIN || "")
      .get("/admin/system/runtimes")
      .reply(200, { runtimes });
  };

  beforeEach(async () => {
    const scope = fetchRuntimesScope(["node@24", "python@3"]);

    createWrapper();

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
    });
  });

  const createWrapper = async () => {
    wrapper = render(<AdminSystem />);
  };

  it("renders the component", () => {
    expect(wrapper.getByText("Runtimes installed")).toBeTruthy();
    expect(
      wrapper.getByText(
        "Information about your runtimes installed on your Stormkit"
      )
    ).toBeTruthy();
    expect(wrapper.getByText("Runtime name")).toBeTruthy();
    expect(wrapper.getByText("Runtime version")).toBeTruthy();
  });

  it("should submit the form", async () => {
    const scope = nock(process.env.API_DOMAIN || "")
      .post("/admin/system/runtimes", {
        runtimes: ["node@24", "python@3"],
      })
      .reply(200, { ok: true });

    fireEvent.click(wrapper.getByText("Save"));

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
    });
  });
});
