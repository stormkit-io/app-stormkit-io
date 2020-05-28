import { fireEvent, waitFor } from "@testing-library/react";
import { renderWithContext } from "~/testing/helpers";
import New from "./New";

describe("pages/Apps/New", () => {
  let wrapper;
  let loginOauthSpy;
  let history;
  const accessToken = "abx41xvad!4";
  const spies = {};

  const findGithubButton = () => wrapper.getByText("GitHub");
  const findGitlabButton = () => wrapper.getByText("GitLab");
  const findBitbucketButton = () => wrapper.getByText("Bitbucket");
  const findHavingIssues = () => wrapper.getByText(/Having issues/);
  const findEmail = () => wrapper.getByText("hello@stormkit.io");

  describe("always", () => {
    beforeEach(() => {
      wrapper = renderWithContext(New);
    });

    test("should contain 3 buttons", () => {
      expect(findGithubButton()).toBeTruthy();
      expect(findBitbucketButton()).toBeTruthy();
      expect(findGitlabButton()).toBeTruthy();
    });

    test("should contain link to email support", () => {
      expect(findHavingIssues()).toBeTruthy();
      expect(findEmail()).toBeTruthy();
    });
  });

  describe("when user gets the access token", () => {
    beforeEach(() => {
      loginOauthSpy = jest.fn().mockImplementation(() => ({ accessToken }));
      spies.api = {
        fetch: jest.fn().mockImplementation(() => Promise.resolve()),
      };
      spies.github = { fetch: jest.fn() };
      spies.gitlab = { fetch: jest.fn() };
      spies.bitbucket = { fetch: jest.fn() };
      spies.loginOauth = jest.fn().mockImplementation(() => loginOauthSpy);
      history = { push: jest.fn() };
      wrapper = renderWithContext(New, {
        context: { ...spies },
        props: { history },
      });
    });

    test("clicking to GitHub should open a GitHub login screen", async () => {
      fireEvent.click(findGithubButton());
      expect(spies.loginOauth).toHaveBeenCalledWith("github");
      await waitFor(() =>
        expect(history.push).toHaveBeenCalledWith("/apps/new/github")
      );
    });

    test("clicking to GitLab should open a GitLab login screen", async () => {
      fireEvent.click(findGitlabButton());
      expect(spies.loginOauth).toHaveBeenCalledWith("gitlab");
      await waitFor(() =>
        expect(history.push).toHaveBeenCalledWith("/apps/new/gitlab")
      );
    });

    test("clicking to Bitbucket should open a Bitbucket login screen", async () => {
      fireEvent.click(findBitbucketButton());
      expect(spies.loginOauth).toHaveBeenCalledWith("bitbucket");
      await waitFor(() =>
        expect(history.push).toHaveBeenCalledWith("/apps/new/bitbucket")
      );
    });
  });

  describe("when user does not get the access token", () => {
    beforeEach(() => {
      loginOauthSpy = jest
        .fn()
        .mockImplementation(() => ({ accessToken: null }));
      spies.api = {
        fetch: jest.fn().mockImplementation(() => Promise.resolve()),
      };
      spies.github = { fetch: jest.fn() };
      spies.gitlab = { fetch: jest.fn() };
      spies.bitbucket = { fetch: jest.fn() };
      spies.loginOauth = jest.fn().mockImplementation(() => loginOauthSpy);
      history = { push: jest.fn() };
      wrapper = renderWithContext(New, {
        context: { ...spies },
        props: { history },
      });
    });

    test("clicking to GitHub should open a GitHub login screen", async () => {
      fireEvent.click(findGithubButton());
      expect(spies.loginOauth).toHaveBeenCalledWith("github");
      await waitFor(() =>
        expect(history.push).not.toHaveBeenCalledWith("/apps/new/github")
      );
    });

    test("clicking to GitLab should open a GitLab login screen", async () => {
      fireEvent.click(findGitlabButton());
      expect(spies.loginOauth).toHaveBeenCalledWith("gitlab");
      await waitFor(() =>
        expect(history.push).not.toHaveBeenCalledWith("/apps/new/github")
      );
    });

    test("clicking to Bitbucket should open a Bitbucket login screen", async () => {
      fireEvent.click(findBitbucketButton());
      expect(spies.loginOauth).toHaveBeenCalledWith("bitbucket");
      await waitFor(() =>
        expect(history.push).not.toHaveBeenCalledWith("/apps/new/github")
      );
    });
  });
});
