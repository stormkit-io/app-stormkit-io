import { waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { withMockContext } from "~/testing/helpers";
import * as nocks from "~/testing/nocks";

const fileName =
  "pages/apps/[id]/environments/[env-id]/domain/_components/DomainModal";

describe(fileName, () => {
  const app = { id: "1" };
  const env = { env: "production" };
  const path = `~/${fileName}`;
  let wrapper;

  beforeEach(() => {
    wrapper = withMockContext(path, {
      app,
      environment: env,
      toggleModal: jest.fn(),
      isOpen: true,
      history: { replace: jest.fn() }
    });
  });

  describe("always", () => {
    test("should contain the title", () => {
      expect(wrapper.getByText("Set up a new domain")).toBeTruthy();
    });
  });

  describe("success", () => {
    test("should submit the form properly", async () => {
      const domain = "app.stormkit.io";
      const scope = nocks.mockDomainInsertCall({ app, env, domain });
      const domainName = wrapper.getByLabelText("Domain name");
      userEvent.type(domainName, domain);
      fireEvent.click(wrapper.getByText("Start verification process"));

      await waitFor(() => {
        expect(wrapper.injectedProps.history.replace).toHaveBeenCalledWith(
          expect.objectContaining({ state: { envs: expect.anything() } })
        );
        expect(scope.isDone()).toBe(true);
      });
    });
  });

  describe("error", () => {
    test("should display the error messages - 400", async () => {
      const domain = "app";
      const scope = nocks.mockDomainInsertCall({
        app,
        env,
        domain,
        status: 400,
        response: { ok: false }
      });

      const domainName = wrapper.getByLabelText("Domain name");
      userEvent.type(domainName, domain);
      fireEvent.click(wrapper.getByText("Start verification process"));

      await waitFor(() => {
        expect(
          wrapper.getByText("Please provide a valid domain name.")
        ).toBeTruthy();
        expect(wrapper.injectedProps.history.replace).not.toHaveBeenCalled();
        expect(scope.isDone()).toBe(true);
      });
    });

    test("should display the error messages - 429", async () => {
      const domain = "app";
      const scope = nocks.mockDomainInsertCall({
        app,
        env,
        domain,
        status: 429,
        response: { ok: false }
      });

      const domainName = wrapper.getByLabelText("Domain name");
      userEvent.type(domainName, domain);
      fireEvent.click(wrapper.getByText("Start verification process"));

      await waitFor(() => {
        expect(
          wrapper.getByText(/You have issued too many requests/)
        ).toBeTruthy();
        expect(wrapper.injectedProps.history.replace).not.toHaveBeenCalled();
        expect(scope.isDone()).toBe(true);
      });
    });

    test("should display the error messages - other", async () => {
      const domain = "app";
      const scope = nocks.mockDomainInsertCall({
        app,
        env,
        domain,
        status: 500,
        response: { ok: false }
      });

      const domainName = wrapper.getByLabelText("Domain name");
      userEvent.type(domainName, domain);
      fireEvent.click(wrapper.getByText("Start verification process"));

      await waitFor(() => {
        expect(
          wrapper.getByText(/Something went wrong while setting up the domain/)
        ).toBeTruthy();
        expect(wrapper.injectedProps.history.replace).not.toHaveBeenCalled();
        expect(scope.isDone()).toBe(true);
      });
    });
  });
});
