import React from "react";
import { connect } from "~/utils/context";
import Button from "~/components/Button";
import { ModalContextProps } from "~/components/Modal";
import { RootContextProps } from "~/pages/Root.context";
import DeployModal from "./DeployModal";

interface Props extends Pick<RootContextProps, "api"> {
  app: App;
  environments: Array<Environment>;
}

const HeaderActions: React.FC<Props & ModalContextProps> = ({
  api,
  app,
  environments,
  toggleModal,
}) => {
  return (
    <div className="mr-6">
      <Button
        primary
        className="rounded-xl py-3 font-bold"
        onClick={() => toggleModal(true)}
      >
        <span className="fas fa-rocket mr-4 text-lg" />
        <span className="text-sm">Deploy now</span>
      </Button>
      <DeployModal api={api} app={app} environments={environments} />
    </div>
  );
};

export default connect<Props, ModalContextProps>(HeaderActions, [
  {
    Context: DeployModal,
    props: ["toggleModal"],
    wrap: true,
  },
]);
