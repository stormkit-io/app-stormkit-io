import type { MemoryHistory } from "history";
import type { RenderResult } from "@testing-library/react";
import type { Scope } from "nock";
import React from "react";
import * as router from "react-router";
import { createMemoryHistory } from "history";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { mockFetchApps } from "~/testing/nocks";
import { mockApp } from "~/testing/data";
import Apps from "./Apps";

describe("~/pages/apps/Apps.tsx", () => {
  const apps = [
    mockApp({ id: "1231231", displayName: "My-app" }),
    mockApp({ id: "5121231", displayName: "My-second-app" }),
  ];

  let wrapper: RenderResult;
  let history: MemoryHistory;

  const createWrapper = () => {
    history = createMemoryHistory();
    wrapper = render(
      <router.Router location={history.location} navigator={history}>
        <Apps />
      </router.Router>
    );
  };

  describe("when user has already created apps", () => {
    let scope: Scope;

    beforeEach(() => {
      scope = mockFetchApps({ response: { apps, hasNextPage: false } });
      createWrapper();
    });

    test("should fetch the list of apps", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("My-app")).toBeTruthy();
        expect(wrapper.getByText("My-second-app")).toBeTruthy();
      });
    });

    test("should have a button to create a new app", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("Create new app")).toBeTruthy();
      });
    });

    test("should not have a button to load more", async () => {
      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
        expect(() => wrapper.getByText("Load more")).toThrow();
      });
    });
  });

  describe("when user has more apps to load", () => {
    beforeEach(() => {
      mockFetchApps({ response: { apps, hasNextPage: true } });
      createWrapper();
    });

    test("should have a button to load more", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("Load more")).toBeTruthy();
      });
    });

    test("should trigger a new call when the button is clicked", async () => {
      const newApps = [{ ...apps[0], id: "7481841" }];

      const scope = mockFetchApps({
        from: 20,
        response: { apps: newApps, hasNextPage: false },
      });

      let button: HTMLElement;

      await waitFor(() => {
        button = wrapper.getByText("Load more");
      });

      fireEvent.click(button!);

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
      });
    });
  });
});
