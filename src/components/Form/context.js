import { createContext } from "react";

export default createContext({
  /**
   * Whether the form is sending a request or not.
   */
  loading: false,

  /**
   * Collected errors.
   */
  errors: {}
});
