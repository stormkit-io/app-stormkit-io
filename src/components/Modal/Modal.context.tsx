import React, { useState, createContext, cloneElement } from "react";
import { timeout } from "./constants";

interface Props {
  children: React.ReactNode;
}

export interface ModalContextProps {
  isOpen?: boolean;
  toggleModal: (val: boolean, cb?: () => void) => void;
}

// Provides a context for custom modals which need a context.
// Simply assign this object to the exported component, and it will
// be a Modal.context instance.
export default (): ContextWrapper => {
  const context = createContext({});

  const Provider: React.FC<Props> = ({
    children,
    ...rest
  }): React.ReactElement => {
    const [isOpen, toggleModal] = useState(false);

    const toggleModalWrapper = (val: boolean, cb?: () => void) => {
      toggleModal(val);
      cb && setTimeout(cb, timeout);
    };

    return (
      <context.Provider value={{ isOpen, toggleModal: toggleModalWrapper }}>
        {React.Children.map(children, (child: React.ReactNode) => {
          if (!React.isValidElement(child)) {
            throw new Error(
              "[Modal.context]: Invalid element provided as a child"
            );
          }

          return cloneElement(child, rest);
        })}
      </context.Provider>
    );
  };

  return {
    Provider,
    Consumer: context.Consumer,
  };
};
