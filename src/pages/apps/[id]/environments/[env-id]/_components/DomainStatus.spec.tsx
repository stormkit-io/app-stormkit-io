import type { RenderResult } from "@testing-library/react";
import React from "react";
import { render } from "@testing-library/react";
import DomainStatus from "./DomainStatus";

interface WrapperProps {
  status?: number;
}

describe("~/pages/apps/[id]/environments/[env-id]/_components/DomainStatus.tsx", () => {
  let wrapper: RenderResult;

  const createWrapper = ({ status }: WrapperProps) => {
    wrapper = render(<DomainStatus status={status} />);
  };

  test("should always display the icon", () => {
    createWrapper({});
    expect(wrapper.container.innerHTML).toContain("fa-globe");
  });

  test("should display only the icon when status is undefined", () => {
    createWrapper({});
    expect(wrapper.container.textContent).toBe("");
  });

  test("should display the icon and the status when the status is defined", () => {
    createWrapper({ status: 200 });
    expect(wrapper.container.textContent).toBe("200");
  });
});
