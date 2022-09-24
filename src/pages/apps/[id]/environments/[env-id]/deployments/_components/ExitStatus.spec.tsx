import React from "react";
import { render, RenderResult } from "@testing-library/react";
import ExitStatus from "./ExitStatus";

interface Props {
  code: number | null;
  emptyPackage: boolean;
}

describe("~/apps/[id]/environments/[env-id]/deployments/_components/ExitStatus.tsx", () => {
  let wrapper: RenderResult;

  const createWrapper = ({ code, emptyPackage }: Props) => {
    wrapper = render(<ExitStatus code={code} emptyPackage={emptyPackage} />);
  };

  test.each`
    color       | exitCode | label                                   | emptyPackage
    ${"green"}  | ${0}     | ${"Successful"}                         | ${false}
    ${"red"}    | ${-1}    | ${"Stopped manually"}                   | ${false}
    ${"red"}    | ${300}   | ${"Failed"}                             | ${false}
    ${"blue"}   | ${null}  | ${"Deployment still running"}           | ${false}
    ${"yellow"} | ${0}     | ${"Deployment has no content uploaded"} | ${true}
  `(
    "should display a $color icon when the exit code is $exitCode",
    ({ exitCode, color, label, emptyPackage }) => {
      createWrapper({ code: exitCode, emptyPackage });
      expect(wrapper.container.innerHTML).toContain(color);
      expect(wrapper.getByLabelText(label)).toBeTruthy();
    }
  );
});
