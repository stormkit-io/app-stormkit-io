import React, { ReactElement, FC } from "react";
import { Link } from "react-router-dom";
import Logo from "~/components/Logo";
import UserMenu from "./UserMenu";

const Header: FC = (): ReactElement => (
  <header className="w-full py-6 flex items-center justify-between relative px-3 lg:px-0">
    <Link to="/">
      <Logo iconSize={8} />
    </Link>
    <UserMenu />
  </header>
);

export default Header;
