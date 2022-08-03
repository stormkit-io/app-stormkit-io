import React, { ReactElement, FC } from "react";
import { Link } from "react-router-dom";
import Logo from "~/components/Logo";
import UserMenu from "./UserMenu";
import News from "./News";

const Header: FC = (): ReactElement => (
  <header className="w-full py-6 flex items-center justify-between relative px-3 lg:px-0">
    <Link to="/">
      <Logo iconSize={8} />
    </Link>
    <div className="flex flex-auto items-center justify-end">
      <News />
      <UserMenu />
    </div>
  </header>
);

export default Header;
