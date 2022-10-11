export const isFrameworkRecognized = (framework?: string): boolean => {
  if (!framework) {
    return false;
  }

  return ["nuxt", "next"].includes(framework);
};
