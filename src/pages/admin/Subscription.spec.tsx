import type { Scope } from "nock";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, waitFor, type RenderResult } from "@testing-library/react";
import AdminSubscription from "./Subscription";
import { mockFetchInstanceDetails } from "~/testing/nocks/nock_user";
import { cache } from "~/pages/auth/actions";

interface Props {
  license: {
    seats: number;
    remaining: number;
    premium: boolean;
    isFree: boolean;
  };
}

describe("~/pages/admin/Jobs.tsx", () => {
  let wrapper: RenderResult;
  let fetchInstanceDetailsScope: Scope;

  beforeEach(() => {
    // Reset cache
    cache.details = undefined;
    cache.fetchPromise = null;
    cache.loading = true;
  });

  afterEach(async () => {
    await waitFor(() => {
      expect(fetchInstanceDetailsScope.isDone()).toBeTruthy();
    });
  });

  const createWrapper = async ({ license }: Props) => {
    fetchInstanceDetailsScope = mockFetchInstanceDetails({
      response: {
        update: { api: false },
        license: license,
      },
    });

    wrapper = render(<AdminSubscription />);
  };

  it("should display correct settings for premium plans", async () => {
    createWrapper({
      license: {
        seats: 15,
        remaining: 12,
        isFree: false,
        premium: true,
      },
    });

    expect(wrapper.getByTestId("card-loading")).toBeTruthy();

    await waitFor(() => {
      expect(wrapper.getByText("Premium")).toBeTruthy();
      expect(wrapper.getByText("15")).toBeTruthy();
      expect(wrapper.getByText("12")).toBeTruthy();
    });

    expect(() => wrapper.getByTestId("card-loading")).toThrow();
  });

  it("should display correct settings for free plans", async () => {
    createWrapper({
      license: {
        seats: 1,
        remaining: 0,
        isFree: true,
        premium: false,
      },
    });

    expect(wrapper.getByTestId("card-loading")).toBeTruthy();

    await waitFor(() => {
      expect(wrapper.getByText("Free")).toBeTruthy();
      expect(wrapper.getByText("1")).toBeTruthy();
      expect(wrapper.getByText("0")).toBeTruthy();
    });

    expect(() => wrapper.getByTestId("card-loading")).toThrow();
  });
});
