import React from "react";
import Button from "~/components/ButtonV2";
import emptyListSvg from "~/assets/images/empty-list.svg";

const EmptyList: React.FC = () => {
  return (
    <div className="text-center">
      <img src={emptyListSvg} alt="Empty app list" className="m-auto" />
      <p className="my-12">
        It's quite empty in here.
        <br />
        Connect your repository to get started.
      </p>
      <Button href="/apps/new" category="action">
        Create new app
      </Button>
    </div>
  );
};

export default EmptyList;
