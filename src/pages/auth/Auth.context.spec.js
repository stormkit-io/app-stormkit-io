import React from "react";
import router from "react-router";
import { render } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { waitFor } from "@testing-library/react";
import { LocalStorage } from "~/utils/storage";
import Api from "~/utils/api/Api";
import * as Auth from "~/pages/auth/Auth.context";
import * as nocks from "~/testing/nocks";

const { AuthContext, default: ContextProvider } = Auth;

describe("pages/auth/Auth.context", () => {
  let wrapper;
  let scope;
  let context;

  const createWrapper = () => {
    const history = createMemoryHistory();
    const api = new Api({
      baseurl: process.env.API_DOMAIN,
    });

    wrapper = render(
      <Router history={history}>
        <ContextProvider api={api}>
          <AuthContext.Consumer>
            {ctx => {
              context = ctx;
            }}
          </AuthContext.Consumer>
        </ContextProvider>
      </Router>
    );

    wrapper.history = history;
    return wrapper;
  };

  describe("when there is a session token but it is expired", () => {
    beforeEach(() => {
      LocalStorage.set("skit_token", "my-expired-token");

      jest.spyOn(router, "useLocation").mockReturnValue({
        search: "my-query=1",
        pathname: "/apps/1231231",
      });

      scope = nocks.mockFetchUser({ response: { ok: false, user: null } });
      createWrapper();
    });

    afterEach(() => {
      LocalStorage.del("skit_token");
    });

    test("redirects user to the auth page", async () => {
      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
        expect(wrapper.history.location.pathname).toBe("/auth");
        expect(wrapper.history.location.search).toBe(
          "?redirect=%2Fapps%2F1231231my-query%3D1"
        );
      });
    });
  });

  describe("when there is a session token and user is logged in", () => {
    beforeEach(() => {
      LocalStorage.set("skit_token", "my-valid-token");

      jest.spyOn(router, "useLocation").mockReturnValue({
        search: "my-query=1",
        pathname: "/apps/1231231",
      });

      scope = nocks.mockFetchUser({});
      createWrapper();
    });

    afterEach(() => {
      LocalStorage.del("skit_token");
    });

    test("shows the context properly", async () => {
      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
        expect(context).toEqual({
          user: {
            displayName: "stormkit",
            avatar: "https://avatars2.githubusercontent.com/u/3321893?v=4",
            email: "foo@bar",
            memberSince: 1551184200,
            id: "1644802351",
            fullName: "Foo Bar",
            package: { id: "free" },
          },
          accounts: [
            { provider: "gitlab", url: "", displayName: "Stormkit" },
            {
              provider: "bitbucket",
              url: "https://bitbucket.org/%7B6e4d532c-e1b6-4496-90cb-f94f09af2bda%7D/",
              displayName: "stormkit",
            },
            {
              provider: "github",
              url: "https://api.github.com/users/stormkit",
              displayName: "stormkit",
            },
          ],
          authError: null,
          loginOauth: expect.any(Function),
          logout: expect.any(Function),
        });
      });
    });
  });
});
