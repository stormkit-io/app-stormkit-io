import React, { ReactElement, ReactNode, FC } from "react";
import Header from "./_components/Header";

type Props = {
  children: ReactNode;
  header?: ReactNode | undefined;
};

const DefaultLayout: FC<Props> = ({ children, header }: Props): ReactElement => {
  if (typeof header === undefined) {
    header = <Header />;
  }

  return (
    <main className="flex flex-col max-w-screen-lg min-h-screen m-auto items-center">
      {header}
      <div className="flex flex-auto mt-12 w-full">
        <div className={"flex flex-auto"}>{children}</div>
      </div>
    </main>
  );
};

export default DefaultLayout;
