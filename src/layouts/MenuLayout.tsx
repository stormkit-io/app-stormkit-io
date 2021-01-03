import React, { ReactNode, ReactElement, FC } from "react";

type Props = {
  menu: ReactNode;
  children: ReactNode;
};

const MenuLayout: FC<Props> = ({ menu, children }: Props): ReactElement => (
  <main className="flex min-h-screen m-auto items-center app-layout">
    <div className="w-64 fixed left-0 top-0 bottom-0">{menu}</div>
    <div className="flex flex-col flex-auto w-full ml-64 px-4 min-h-screen">
      {children}
    </div>
  </main>
);

export default MenuLayout;
