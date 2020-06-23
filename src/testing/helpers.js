import React from "react";
import nock from "nock";
import { render } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import Api from "~/utils/api/Api";
import Root from "~/pages/Root";
import RootContext from "~/pages/Root.context";
import { LocalStorage } from "~/utils/storage";
import * as data from "~/testing/data";

export const withUserContext = ({
  user = data.mockUserResponse(),
  path,
  ...rest
}) => {
  LocalStorage.set(Api.STORAGE_TOKEN_KEY, "123-abc");

  nock("http://localhost")
    .get("/user")
    .reply(200, user);

  if (!rest.history) {
    rest.history = createMemoryHistory({
      initialEntries: [path],
      initialIndex: 0,
    });
  }

  return renderWithContext({ ...rest });
};

export const withAppContext = ({ app, envs, path, status = 200, user }) => {
  nock("http://localhost")
    .get(`/app/${app.id}`)
    .reply(status, { app });

  if (envs) {
    nock("http://localhost")
      .get(`/app/1/envs`)
      .reply(status, envs);
  }

  return withUserContext({
    user,
    history: createMemoryHistory({
      initialEntries: [path],
      initialIndex: 0,
    }),
  });
};

export const renderWithContext = ({ history = createMemoryHistory() } = {}) => {
  const MockRouter = ({ children }) => children;
  const component = render(
    <Router history={history}>
      <Root Router={MockRouter} Context={RootContext} />
    </Router>
  );
  component.history = history;
  return component;
};
