import React from "react";
import Header from "./_components/Header";

interface Props {
  children: React.ReactNode;
  header?: React.ReactNode;
}

const DefaultLayout: React.FC<Props> = ({
  children,
  header = <Header />,
}): React.ReactElement => {
  return (
    <main className="flex flex-col max-w-screen-lg min-h-screen m-auto items-center">
      {header}
      <div className="flex flex-auto lg:mt-12 w-full px-3 lg:px-0">
        <div className="flex flex-auto">{children}</div>
      </div>
    </main>
  );
};

export default DefaultLayout;
