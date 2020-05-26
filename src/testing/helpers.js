import React from "react";
import { XhrMock } from "@react-mock/xhr";
import { render } from "@testing-library/react";
import { Router, withRouter } from "react-router-dom";
import { createMemoryHistory } from "history";
import RootContext from "~/pages/Root.context";

const RouteHelper = withRouter(({ location }) => {
  return (
    <>
      <div data-testid="location-display-search">{location.search}</div>
      <div data-testid="location-display-path">{location.pathname}</div>
    </>
  );
});

export const renderWithContext = (
  Component,
  { props, context, history = createMemoryHistory() } = {}
) => {
  const MockRouter = ({ children }) => children;

  return render(
    <Router history={history}>
      <RootContext Router={MockRouter} defaultContext={context}>
        <Component {...props} />
        <RouteHelper />
      </RootContext>
    </Router>
  );
};

/**
 * Checks if we have a relative URL. If we do, it substitutes with our tutti api URL.
 *
 * @param {object} mock The mock object
 */
const convertMockUrls = (mock) => {
  // if it's regex, no need to instert anything, reutrn as it is
  if (mock.url instanceof RegExp) {
    return mock;
  }

  if (mock.noPrefix !== true) {
    const pattern = /^https?:\/\//i;
    // if it's not an absolute url, insert our tutti testing URL
    if (!pattern.test(mock.url) && !(mock.url instanceof RegExp)) {
      mock.url = `http://localhost/api/${mock.url}`;
    }
  }

  return mock;
};

/**
 * Wrapper on top of XhrMock to add some standard mocks and handle the URLs to be mocked.
 *
 * @param {object} props
 */
export const XHRMock = (props) => {
  const { children, mocks = [], ...rest } = props;

  if (!Array.isArray(mocks)) {
    throw new Error("XHRMock only accepts an array of mocks.");
  }

  const normalizedMocks = mocks.map(convertMockUrls);

  return (
    <XhrMock mocks={normalizedMocks} {...rest}>
      {children}
    </XhrMock>
  );
};
