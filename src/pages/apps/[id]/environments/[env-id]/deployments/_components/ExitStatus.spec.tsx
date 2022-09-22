import React from "react";
import { render, RenderResult } from "@testing-library/react";
import ExitStatus from "./ExitStatus";

interface Props {
  code: number | null;
}

describe("~/apps/[id]/environments/[env-id]/deployments/_components/ExitStatus.tsx", () => {
  let wrapper: RenderResult;

  const createWrapper = ({ code }: Props) => {
    wrapper = render(<ExitStatus code={code} />);
  };

  test.each`
    color      | exitCode | label
    ${"green"} | ${0}     | ${"Successful"}
    ${"red"}   | ${-1}    | ${"Stopped manually"}
    ${"red"}   | ${300}   | ${"Failed"}
    ${"blue"}  | ${null}  | ${"Deployment still running"}
  `(
    "should display a $color icon when the exit code is $exitCode",
    ({ exitCode, color, label }) => {
      createWrapper({ code: exitCode });
      expect(wrapper.container.innerHTML).toContain(color);
      expect(wrapper.getByLabelText(label)).toBeTruthy();
    }
  );
});
