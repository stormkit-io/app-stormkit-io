import React, { ReactElement, ReactNode, FC } from "react";

type Props = {
  children: ReactNode;
};

const DefaultLayout: FC<Props> = ({ children }: Props): ReactElement => (
  <main className="flex flex-col max-w-screen-xl min-h-screen m-auto items-center justify-center">
    {children}
  </main>
);

export default DefaultLayout;
