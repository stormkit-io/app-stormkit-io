import React, { Fragment } from "react";
import { createContext } from "react";

const GlobalContext = createContext({});

type Props = Record<string, unknown>;

interface ProviderProps {
  value: Record<string, unknown>;
  children: React.ReactNode;
}

interface ConnectedContext {
  Context: ContextWrapper;
  props: Array<string>;
  wrap?: boolean;
}

export const Context = {
  ...GlobalContext,

  /**
   * React is totally fine with nesting Providers. However it overwrites
   * what is passed in as a value. Therefore, we do a little hacking and
   * prevent this overwrite.
   *
   * @param {object} value The context itself. Make sure to pass in a unique key.
   * @param {*} children React children.
   * @return {*}
   */
  Provider: ({ value, children }: ProviderProps): React.ReactElement => (
    <GlobalContext.Consumer>
      {context => (
        <GlobalContext.Provider value={{ ...context, ...value }}>
          {children}
        </GlobalContext.Provider>
      )}
    </GlobalContext.Consumer>
  ),
};

/**
 * Recursive function that goes through all required contexts and injects the values into a component
 *
 * @param {object} Component the component to be enhanced
 * @param {array} Contexts an array of objects like [{Context: AuthContext, props: ["user"]}]
 * @return {func} a function receiving initialProps so that we don't have to call connect with an arrow function
 */
export function connect<ComponentProps, ContextProps>(
  Component: React.FC<ComponentProps & ContextProps>,
  Contexts: Array<ConnectedContext> = []
): React.FC<ComponentProps> {
  const loopContexts = (
    loopedContexts: Array<ConnectedContext>,
    mergedProps: ContextProps | ComponentProps
  ): React.ReactElement => {
    // If we reached last context, stop here
    if (loopedContexts.length === 0) {
      return <Component {...(mergedProps as ContextProps & ComponentProps)} />;
    }

    // Generate required props for first consumer
    const Current = loopedContexts.shift();

    if (!Current || !Current.Context.Consumer) {
      throw new Error("The passed context needs to have a Consumer attribute");
    }

    if (Current.wrap && !Current.Context.Provider) {
      throw new Error("The passed context needs to have a Provider attribute");
    }

    const { Consumer } = Current.Context;

    // If wrap is enabled, wrap the consumer with the provider.
    const ProviderOrFragment = Current.wrap
      ? Current.Context.Provider
      : Fragment;

    return (
      <ProviderOrFragment>
        <Consumer>
          {(p: Props) => {
            // Get only the required props
            const contextProps = filterProps<ContextProps>(p, Current.props);
            // Call for the remaining contexts
            return loopContexts(loopedContexts, {
              ...mergedProps,
              ...contextProps,
            });
          }}
        </Consumer>
      </ProviderOrFragment>
    );
  };

  return (props): React.ReactElement => loopContexts(Contexts.slice(0), props);
}

/**
 * Loops through props and returns an object with only the keys inside the values array
 * @param {object} props
 * @param {array} values
 */
function filterProps<P = Record<string, unknown>>(
  props: Props,
  values: Array<string>
): P {
  const filtered: Props = {};
  const propKeys = Object.keys(props || {});

  values.forEach(propKey => {
    let desiredPropKey = propKey;

    // This allows importing props as exportedPropName:desiredInjectedPropName.
    // It is useful in cases where two different contexts export the same property name.
    if (propKey.indexOf(":") !== -1) {
      [propKey, desiredPropKey] = propKey.split(":");
    }

    if (propKeys.indexOf(propKey) === -1) {
      throw new Error(
        `connect: Error, prop ${propKey} is not exported. Is the provider called?`
      );
    }

    filtered[desiredPropKey] = props[propKey];
  });

  return filtered as P;
}
