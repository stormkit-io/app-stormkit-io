import React from "react";
import nock from "nock";
import { render } from "@testing-library/react";
import { Router } from "react-router-dom";
import Api from "~/utils/api/Api";
import { LocalStorage } from "~/utils/storage";
import * as data from "~/testing/data";

/**
 * Mounts the component in the given `path` with mocked context. This function
 * mocks also required things such as the modal component and injects the api
 * by default.
 *
 * @param {string} path       The import path to the component's file.
 * @param {object} mockProps  The properties that will be directly injected to the component on mount.
 */
export const withMockContext = (...args) => {
  let path,
    mockProps,
    mockModal = true;

  if (typeof args[0] === "string") {
    path = args[0];
    mockProps = args[1];
  } else {
    path = args[0].path;
    mockProps = args[0].props ?? {};
    mockModal = args[0].mockModal ?? true;
  }

  if (mockModal) {
    jest.mock("~/components/Modal", () => {
      const mock = ({ children }) => children;
      mock.Context = i => i;
      return mock;
    });
  }

  // This is a tiny little hack to update mock props object for each test.
  global.__MOCK_PROPS__ = mockProps;

  mockProps.confirmModal = jest.fn().mockImplementation((_, { onConfirm }) => {
    onConfirm({
      setLoading: jest.fn(),
      setError: jest.fn(),
      closeModal: jest.fn(),
    });
  });

  mockProps.api = new Api({
    baseurl: process.env.API_DOMAIN,
  });

  const Component = require(path).default;
  const history = createMemoryHistory();

  const wrapper = render(
    <Router history={history}>
      <Component {...mockProps} />
    </Router>
  );

  return Object.assign(wrapper, {
    injectedProps: mockProps,
    spies: {
      history: {
        replace: jest.spyOn(history, "replace"),
      },
    },
    history,
  });
};

export const waitForPromises = () => new Promise(setImmediate);
