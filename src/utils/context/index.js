import React, { Fragment } from "react";
import { createContext } from "react";

// IMPORTANT: Put whatever is not serializable in the global context.
// The rest should go into the redux state.
const GlobalContext = createContext({
  /**
   * The request object.
   */
  request: null
});

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
  Provider: ({ value, children }) => (
    <GlobalContext.Consumer>
      {context => (
        <GlobalContext.Provider value={{ ...context, ...value }}>
          {children}
        </GlobalContext.Provider>
      )}
    </GlobalContext.Consumer>
  )
};

/**
 * HOC for components which need the
 *
 * @param WrappedComponent
 * @return {function(*): *}
 */
export default WrappedComponent => props => (
  <Context.Consumer>
    {context => <WrappedComponent {...props} {...context} />}
  </Context.Consumer>
);

/**
 * Recursive function that goes through all required contexts and injects the values into a component
 *
 * @param {object} Component the component to be enhanced
 * @param {array} Contexts an array of objects like [{Context: AuthContext, props: ["user"]}]
 * @return {func} a function receiving initialProps so that we don't have to call connect with an arrow function
 */
export const connect = (Component, Contexts = []) => {
  if (Array.isArray(Contexts) === false) {
    throw new Error("Second argument of connect should be an array.");
  }

  function loopContexts(Component, Contexts, props) {
    // If we reached last context, stop here
    if (Contexts.length === 0) {
      return <Component {...props} />;
    }

    // Generate required props for first consumer
    const Current = Contexts[0];

    if (!Current || !Current.Context.Consumer) {
      throw new Error("The passed context needs to have a Consumer attribute");
    }

    if (Current.wrap && !Current.Context.Provider) {
      throw new Error("The passed context needs to have a Provider attribute");
    }

    // If wrap is enabled, wrap the consumer with the provider.
    const Provider = Current.wrap ? Current.Context.Provider : Fragment;
    const Consumer = Current.Context.Consumer;

    return (
      <Provider>
        <Consumer>
          {p => {
            // Get only the required props
            const filtered = filterProps(p, Current.props);
            // Merge them with previous props (initial + props from each step in consumer loop)
            const merged = { ...props, ...filtered };
            // Call for the remaining contexts
            return loopContexts(Component, Contexts.slice(1), merged);
          }}
        </Consumer>
      </Provider>
    );
  }

  return initialProps => loopContexts(Component, Contexts, initialProps);
};

/**
 * Loops through props and returns an object with only the keys inside the values array
 * @param {object} props
 * @param {array} values
 */
const filterProps = (props, values) => {
  const filtered = {};
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

  return filtered;
};

export { default as windowContext } from "./windowContext";
