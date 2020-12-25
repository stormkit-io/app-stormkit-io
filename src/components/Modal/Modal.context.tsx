import React, {
  ReactNode,
  useState,
  createContext,
  Children,
  cloneElement
} from "react";
import { timeout } from "./constants";

// Provides a context for custom modals which need a context.
// Simply assign this object to the exported component, and it will
// be a Modal.context instance.
export default (): ReactNode => {
  const context = createContext({});

  /**
   * The context provider.
   */
  const Provider = ({ children, ...rest }: any) => {
    const [isOpen, toggleModal] = useState(false);

    // Add a wrapper function to call the callback whenever the modal
    // is totally closed or opened.
    const toggleModalWrapper = (val: boolean, cb: any) => {
      toggleModal(val);
      cb && setTimeout(cb, timeout);
    };

    return (
      <context.Provider value={{ isOpen, toggleModal: toggleModalWrapper }}>
        {Children.map(children, child => cloneElement(child, rest))}
      </context.Provider>
    );
  };

  return {
    Provider,
    Consumer: context.Consumer
  };
};
