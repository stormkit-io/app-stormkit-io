import type { RenderResult } from "@testing-library/react";
import { describe, expect, beforeEach, it, vi, type Mock } from "vitest";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { mockSetVolumesConfig } from "~/testing/nocks/nock_volumes";
import VolumesConfigModal from "./VolumesConfigModal";

interface Props {
  config?: VolumeConfig;
}

describe("~/pages/apps/[id]/environments/[env-id]/volumes/VolumesConfigModal.tsx", () => {
  let wrapper: RenderResult;
  let onClose: Mock;
  let onSuccess: Mock;

  const createWrapper = ({ config }: Props) => {
    onClose = vi.fn();
    onSuccess = vi.fn();

    wrapper = render(
      <VolumesConfigModal
        onClose={onClose}
        onSuccess={onSuccess}
        config={config}
      />
    );
  };

  describe("when volumes is not yet configured", () => {
    beforeEach(() => {
      createWrapper({});
    });

    it("should display filesys as default selected value", () => {
      expect(wrapper.getByText("File System")).toBeTruthy();
      expect(wrapper.getByDisplayValue("/shared/volumes")).toBeTruthy();
    });

    it("should display a learn more button", () => {
      expect(wrapper.getByText("Learn more").getAttribute("href")).toBe(
        "https://www.stormkit.io/docs/features/volumes#filesys"
      );
    });

    it("should save save the config", async () => {
      const scope = mockSetVolumesConfig({
        config: { mountType: "filesys", rootPath: "/shared/volumes" },
      });

      fireEvent.click(wrapper.getByText("Save"));

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
        expect(onSuccess).toHaveBeenCalled();
      });
    });
  });

  describe("when volumes is already configured", () => {
    beforeEach(() => {
      createWrapper({
        config: { mountType: "filesys", rootPath: "/mnt/stormkit" },
      });
    });

    it("should display the pre-filled configuration", () => {
      expect(wrapper.getByText("File System")).toBeTruthy();
      expect(wrapper.getByDisplayValue("/mnt/stormkit")).toBeTruthy();
    });
  });
});
