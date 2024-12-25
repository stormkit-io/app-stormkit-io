import type { RenderResult } from "@testing-library/react";
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import type { Scope } from "nock";
import { render } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import { LocalStorage } from "~/utils/storage";
import { mockFetchInstanceDetails } from "~/testing/nocks/nock_user";
import UpdateSnackbar from "./UpdateSnackbar";

interface WrapperProps {
  status?: number;
  response?: InstanceDetails;
}

describe("pages/auth/UpdateSnackbar.tsx", () => {
  let wrapper: RenderResult;
  let scope: Scope;

  const apiVersion = "v1.7.30";
  const apiCommit = "a4ee052";

  const createWrapper = ({ status, response }: WrapperProps) => {
    scope = mockFetchInstanceDetails({ status, response });
    wrapper = render(<UpdateSnackbar />);

    return wrapper;
  };

  describe("when self-hosted", () => {
    afterEach(() => {
      LocalStorage.del("STORMKIT_UPDATE");
      delete process.env.GIT_HASH;
    });

    describe("when api needs an update", () => {
      beforeEach(async () => {
        LocalStorage.set("STORMKIT_UPDATE", "my-version");

        await createWrapper({
          status: 200,
          response: {
            latest: { apiVersion: "v1.8.35" },
            stormkit: { selfHosted: true, apiCommit, apiVersion },
          },
        });

        await waitFor(() => {
          expect(scope.isDone()).toBe(true);
        });
      });

      it("displays the snackbar", async () => {
        expect(wrapper.container.textContent).toBe(
          "Stormkit API has a newer version"
        );
      });
    });

    describe("when previously dismissed", () => {
      beforeEach(async () => {
        LocalStorage.set("STORMKIT_UPDATE", apiVersion);

        await createWrapper({
          status: 200,
          response: {
            latest: { apiVersion },
            stormkit: { selfHosted: true, apiCommit, apiVersion },
          },
        });

        await waitFor(() => {
          expect(scope.isDone()).toBe(true);
        });
      });

      it("does not display the snackbar", () => {
        expect(wrapper.container.innerHTML).toBe("");
      });
    });
  });

  describe("when cloud", () => {
    afterEach(() => {
      LocalStorage.del("STORMKIT_UPDATE");
      delete process.env.GIT_HASH;
    });

    describe("when both api and ui needs an update", () => {
      beforeEach(async () => {
        await createWrapper({
          status: 200,
          response: {
            stormkit: { selfHosted: false, apiCommit, apiVersion },
          },
        });

        await waitFor(() => {
          expect(scope.isDone()).toBe(true);
        });
      });

      it("does not display the snackbar", () => {
        expect(wrapper.container.innerHTML).toBe("");
      });
    });
  });
});
