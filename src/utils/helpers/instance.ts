/**
 * Checks whether the current instance is a self-hosted environment or not.
 */
export function isSelfHosted(url: string = window.location.href): boolean {
  const regex = /^https?:\/\/(?:.*\.)?stormkit\.(io|dev)(?:\/|$)/i;
  return !regex.test(url);
}
