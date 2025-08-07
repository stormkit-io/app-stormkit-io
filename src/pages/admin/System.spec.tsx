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
      .reply(200, { runtimes, autoInstall: true });
  };

  const fetchMiseVersionScope = () => {
    return nock(process.env.API_DOMAIN || "")
      .get("/admin/system/mise")
      .reply(200, { version: "1.0.0" });
  };

  beforeEach(async () => {
    const scope = fetchRuntimesScope(["node@24", "python@3"]);
    const scopeVersion = fetchMiseVersionScope();

    createWrapper();

    await waitFor(() => {
      expect(scopeVersion.isDone()).toBe(true);
      expect(scope.isDone()).toBe(true);
    });
  });

  const createWrapper = async () => {
    wrapper = render(<AdminSystem />);
  };

  it("renders the component", () => {
    expect(wrapper.getByText("Installed runtimes")).toBeTruthy();
    expect(
      wrapper.getByText(
        "Manage runtimes that are installed on your Stormkit instance."
      )
    ).toBeTruthy();
    expect(wrapper.getByText("Runtime name")).toBeTruthy();
    expect(wrapper.getByText("Runtime version")).toBeTruthy();
  });

  it("should submit the form", async () => {
    const scope = nock(process.env.API_DOMAIN || "")
      .post("/admin/system/runtimes", {
        autoInstall: false,
        runtimes: ["node@24", "python@3"],
      })
      .reply(200, { ok: true });

    expect(
      wrapper.getByText("Save").parentElement?.getAttribute("disabled")
    ).toBe("");

    // Turn off auto-install
    await fireEvent.click(wrapper.getByLabelText("Auto install"));

    expect(
      wrapper.getByText("Save").parentElement?.getAttribute("disabled")
    ).toBe(null);

    await fireEvent.click(wrapper.getByText("Save"));

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
    });
  });

  it("should fetch mise version", async () => {
    expect(wrapper.getByText("Mise"));
    expect(
      wrapper.getByText(
        "Stormkit relies on open-source mise for runtime management."
      )
    );
    expect(wrapper.getByText("Upgrade to latest"));

    await waitFor(() => {
      expect(wrapper.getByText("Current version")).toBeTruthy();
      expect(wrapper.getByText("1.0.0")).toBeTruthy();
    });
  });

  it("should request an update for mise", async () => {
    const scope = nock(process.env.API_DOMAIN || "")
      .post("/admin/system/mise")
      .reply(200, { ok: true });

    fireEvent.click(wrapper.getByText("Upgrade to latest"));

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
    });

    expect(wrapper.getByText("Mise was upgraded successfully")).toBeTruthy();
  });
});
