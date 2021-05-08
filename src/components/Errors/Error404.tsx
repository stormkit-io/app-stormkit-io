import React from "react";
import Link from "~/components/Link";
import Logo from "~/components/Logo";

const Error404: React.FC = ({ children }): React.ReactElement => {
  return (
    <div className="flex flex-col m-auto max-w-lg items-center h-full justify-center">
      <h1 className="text-pink-50 text-9xl mb-12 font-bold">4 oh 4</h1>
      <div className="text-white text-3xl text-center leading-normal">
        {children}
      </div>
      <div className="mt-32">
        <Link to="/">
          <Logo iconOnly />
        </Link>
      </div>
    </div>
  );
};

export default Error404;
