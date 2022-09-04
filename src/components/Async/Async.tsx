import React, { Suspense } from "react";
import Spinner from "~/components/Spinner";
import "./Async.css";

const Async = (
  dynamicImport: () => Promise<{ default: React.FC }>
): React.ReactNode => {
  const Component = React.lazy(dynamicImport);

  return (
    <Suspense fallback={<Spinner pageCenter />}>
      <Component />
    </Suspense>
  );
};

export default Async;
