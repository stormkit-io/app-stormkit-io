import type { RenderResult } from "@testing-library/react";
import { describe, expect, beforeEach, afterEach, it, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockAdminRegister } from "~/testing/nocks/nock_user";
import api from "~/utils/api/Api";
import BasicAuthRegister from "./BasicAuthRegister";

declare const global: {
  NavigateMock: any;
};

describe("pages/auth/BasicAuthRegister", () => {
  let wrapper: RenderResult;

  const createWrapper = () => {
    return (wrapper = render(<BasicAuthRegister />));
  };

  beforeEach(() => {
    createWrapper();

    Object.defineProperty(window, "location", {
      value: {
        reload: vi.fn(),
      },
    });
  });

  afterEach(() => {
    api.removeAuthToken();
  });

  it("should render the register form", () => {
    expect(wrapper.getByLabelText("Email")).toBeTruthy();
    expect(wrapper.getByLabelText("Password")).toBeTruthy();
    expect(wrapper.getByLabelText("Password confirmation")).toBeTruthy();
    expect(
      wrapper.getByRole("button", { name: "Create account" })
    ).toBeTruthy();
  });

  it("should make a request to the api and reload the page on successfull requests", async () => {
    const email = wrapper.getByLabelText("Email");
    const password = wrapper.getByLabelText("Password");
    const passwordCnfrm = wrapper.getByLabelText("Password confirmation");
    const submit = wrapper.getByRole("button", { name: "Create account" });
    const scope = mockAdminRegister({
      payload: { email: "my-email@example.org", password: "my-password" },
      response: { sessionToken: "my-session-token" },
    });

    await userEvent.type(email, "my-email@example.org");
    await userEvent.type(password, "my-password");
    await userEvent.type(passwordCnfrm, "my-password");
    await userEvent.click(submit);

    await waitFor(() => {
      expect(scope.isDone()).toBeTruthy();
      expect(api.getAuthToken()).toBe("my-session-token");
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  it("should not submit the request if the email and/or password are not provided", async () => {
    await userEvent.click(
      wrapper.getByRole("button", { name: "Create account" })
    );

    await waitFor(() => {
      wrapper.getByText("Email and password are required.");
    });

    expect(window.location.reload).not.toHaveBeenCalled();
  });

  it("should not submit the request if the password and confirmation do not match", async () => {
    const email = wrapper.getByLabelText("Email");
    const password = wrapper.getByLabelText("Password");
    const passwordCnfrm = wrapper.getByLabelText("Password confirmation");
    const submit = wrapper.getByRole("button", { name: "Create account" });

    await userEvent.type(email, "my-email@example.org");
    await userEvent.type(password, "my-password");
    await userEvent.type(passwordCnfrm, "wrong-password");
    await userEvent.click(submit);

    await waitFor(() => {
      wrapper.getByText("Passwords do not match.");
    });

    expect(window.location.reload).not.toHaveBeenCalled();
  });
});
