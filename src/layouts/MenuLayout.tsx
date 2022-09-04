import React, { ReactNode, ReactElement, FC } from "react";

type Props = {
  menu: ReactNode;
  children: ReactNode;
};

const MenuLayout: FC<Props> = ({ menu, children }: Props): ReactElement => (
  <main className="flex min-h-screen m-auto items-center app-layout w-full">
    <div className="lg:w-64 fixed left-0 top-0 bottom-0">{menu}</div>
    <div className="flex flex-col flex-auto w-full ml-20 lg:ml-64 px-4 min-h-screen">
      {children}
    </div>
  </main>
);

export default MenuLayout;
