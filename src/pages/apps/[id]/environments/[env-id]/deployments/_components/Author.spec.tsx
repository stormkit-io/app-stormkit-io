import React from "react";
import { render, RenderResult } from "@testing-library/react";
import Author from "./Author";

interface Props {
  author?: string;
}

describe("~/apps/[id]/environments/[env-id]/deployments/_components/Author.tsx", () => {
  let wrapper: RenderResult;

  const createWrapper = ({ author }: Props) => {
    wrapper = render(<Author author={author} />);
  };

  test("should display the author information", () => {
    createWrapper({ author: "John Doe" });
    expect(wrapper.getByText("by John Doe")).toBeTruthy();
  });

  test("should return an empty string when author information misses", () => {
    createWrapper({ author: "" });
    expect(wrapper.container.innerHTML).toBe("");
  });
});
