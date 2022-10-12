import React, { useContext } from "react";
import cn from "classnames";
import SideMenu from "~/components/SideMenu";
import { AuthContext } from "~/pages/auth/Auth.context";
import UserButtons from "./_components/UserButtons";
import MobileHeader from "~/components/MobileHeader";

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
        <>
          <div className="md:hidden w-full sticky top-0 z-50">
            <MobileHeader menuItems={[]} />
          </div>
          <div className="hidden md:block">
            <SideMenu menuItems={[]}>
              <UserButtons />
            </SideMenu>
          </div>
        </>
      )}
      {children}
    </main>
  );
};

export default DefaultLayout;
