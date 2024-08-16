import type { RenderResult } from "@testing-library/react";
import { render } from "@testing-library/react";
import AuditMessage from "./AuditMessage";

interface Props {
  audit: Audit;
}

describe("~/shared/feed/AuditMessage.tsx", () => {
  let wrapper: RenderResult;

  const createWrapper = ({ audit }: Props) => {
    wrapper = render(<AuditMessage audit={audit} />);
  };

  const diffs: Record<string, any> = {
    "CREATE:DOMAIN": {
      new: { domainName: "app.stormkit.io" },
    },
    "UPDATE:DOMAIN": {
      old: { domainName: "app.stormkit.io" },
      new: {
        domainName: "app.stormkit.io",
        domainCertKey: "my-key",
        domainCertValue: "my-cert",
      },
    },
    "DELETE:DOMAIN": {
      old: { domainName: "app.stormkit.io" },
    },
    "CREATE:ENV": {
      new: { envName: "staging" },
    },
    "UPDATE:ENV": {
      new: { envName: "staging" },
    },
    "DELETE:ENV": {
      old: { envName: "staging" },
    },
    "CREATE:APP": {
      new: { appName: "sample-project" },
    },
    "UPDATE:APP": {
      new: { appName: "sample-project" },
    },
    "DELETE:APP": {
      old: { appName: "sample-project" },
    },
    "CREATE:SNIPPET": {
      new: { snippets: ["a", "b"] },
    },
    "UPDATE:SNIPPET": {},
    "DELETE:SNIPPET": {
      old: { snippets: ["2", "5"] },
    },
  };

  test.each`
    action              | expected
    ${"CREATE:DOMAIN"}  | ${"Added app.stormkit.io domain to production environment"}
    ${"UPDATE:DOMAIN"}  | ${"Added custom certificate to app.stormkit.io"}
    ${"DELETE:DOMAIN"}  | ${"Removed app.stormkit.io domain from production environment"}
    ${"CREATE:ENV"}     | ${"Created the staging environment"}
    ${"UPDATE:ENV"}     | ${"Updated the staging environment"}
    ${"DELETE:ENV"}     | ${"Removed the staging environment"}
    ${"CREATE:APP"}     | ${"Created the sample-project application"}
    ${"UPDATE:APP"}     | ${"Updated the sample-project application"}
    ${"DELETE:APP"}     | ${"Deleted the sample-project application"}
    ${"CREATE:SNIPPET"} | ${"Created 2 new snippets in production environment"}
    ${"UPDATE:SNIPPET"} | ${"Updated 1 snippet in production environment"}
    ${"DELETE:SNIPPET"} | ${"Deleted 2 snippets in production environment"}
  `("displays the correct message for $action", ({ action, expected }) => {
    const audit: Audit = {
      id: "1",
      action,
      appId: "1",
      envId: "1",
      envName: "production",
      userDisplay: "jdoe",
      timestamp: 1723501214,
      diff: diffs[action],
    };

    createWrapper({ audit });

    expect(wrapper.container.textContent).toContain(expected);
  });
});
