import { createContext } from "react";

type theme = "dark" | "light";

interface RootContextProps {
  mode: theme;
  setMode: (v: theme) => void;
}

export const RootContext = createContext<RootContextProps>({
  mode: "dark",
  setMode: () => {},
});
