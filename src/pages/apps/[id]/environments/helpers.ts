import { toArray } from "~/utils/helpers/array";

export const prepareBuildObject = (
  values: Record<string, string>,
  isServerless: boolean
): BuildConfig => {
  const vars: Record<string, string> = {};

  const keys = toArray<string>(values["build.vars.keys"]);
  const vals = toArray<string>(values["build.vars.values"]);

  keys.forEach((key, i) => {
    if (key.trim() !== "") {
      vars[key.trim()] = vals[i].trim().replace(/^['"]+|['"]+$/g, "");
    }
  });

  const build: BuildConfig = {
    cmd: values["build.cmd"],
    entry: values["build.entry"] || "",
    distFolder: values["build.distFolder"] || "",
    vars,
  };

  if (isServerless && !build.entry) {
    build.entry = "__SSR__";
  }

  return build;
};
