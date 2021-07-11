import React, { createContext } from "react";
import { Switch, Route } from "react-router";
import { connect } from "~/utils/context";
import AppContext, { AppContextProps } from "~/pages/apps/App.context";
import routes from "./routes";

const Context = createContext({});

type ContextProps = Pick<AppContextProps, "environments">;

const EnvironmentsContext: React.FC<ContextProps> = ({
  environments,
}): React.ReactElement => {
  return (
    <Context.Provider value={{ environments }}>
      <Switch>
        {routes.map(route => (
          <Route
            {...route}
            key={Array.isArray(route.path) ? route.path[0] : route.path}
          />
        ))}
      </Switch>
    </Context.Provider>
  );
};

const enhanced = connect<unknown, ContextProps>(EnvironmentsContext, [
  { Context: AppContext, props: ["environments"] },
]);

export default Object.assign(enhanced, {
  Consumer: Context.Consumer,
  Provider: enhanced,
});
