import { Routes, Route } from "react-router";
import EnvironmentHeader from "./_components/EnvironmentHeader";
import routes from "./routes";
import EnvironmentContextProvider from "../Environment.context";

const EnvironmentsEntry = () => {
  return (
    <EnvironmentContextProvider>
      <div className="flex flex-col w-full">
        <EnvironmentHeader />
        <Routes>
          {routes.map(route => (
            <Route {...route} path={route.path} key={route.path} />
          ))}
        </Routes>
      </div>
    </EnvironmentContextProvider>
  );
};

export default EnvironmentsEntry;
