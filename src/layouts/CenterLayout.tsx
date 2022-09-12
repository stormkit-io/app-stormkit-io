import React, { useContext } from "react";
import cn from "classnames";
import SideMenu from "~/components/SideMenu";
import { AuthContext } from "~/pages/auth/Auth.context";
import HeaderButtons from "./_components/HeaderButtons";

interface Props {
  children: React.ReactNode;
}

const DefaultLayout: React.FC<Props> = ({ children }) => {
  const { user } = useContext(AuthContext);

  return (
    <main
      className={cn("flex flex-col min-h-screen m-auto items-center w-full", {
        "justify-center": !user,
      })}
    >
      {user && (
        <SideMenu menuItems={[]}>
          <HeaderButtons />
        </SideMenu>
      )}
      {children}
    </main>
  );
};

export default DefaultLayout;
