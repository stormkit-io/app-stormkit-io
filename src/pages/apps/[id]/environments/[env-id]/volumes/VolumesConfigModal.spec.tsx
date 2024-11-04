import type { RenderResult } from "@testing-library/react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { mockSetVolumesConfig } from "~/testing/nocks/nock_volumes";
import VolumesConfigModal from "./VolumesConfigModal";

interface Props {
  config?: VolumeConfig;
}

describe("~/pages/apps/[id]/environments/[env-id]/volumes/VolumesConfigModal.tsx", () => {
  let wrapper: RenderResult;
  let onClose: jest.Func;
  let onSuccess: jest.Func;

  const createWrapper = ({ config }: Props) => {
    onClose = jest.fn();
    onSuccess = jest.fn();

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

    test("should display filesys as default selected value", () => {
      expect(wrapper.getByText("File System")).toBeTruthy();
      expect(wrapper.getByDisplayValue("/shared/volumes")).toBeTruthy();
    });

    test("should display a learn more button", () => {
      expect(wrapper.getByText("Learn more").getAttribute("href")).toBe(
        "https://www.stormkit.io/docs/features/volumes#filesys"
      );
    });

    test("should save save the config", async () => {
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

    test("should display the pre-filled configuration", () => {
      expect(wrapper.getByText("File System")).toBeTruthy();
      expect(wrapper.getByDisplayValue("/mnt/stormkit")).toBeTruthy();
    });
  });
});