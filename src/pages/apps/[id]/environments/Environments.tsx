import React, { useContext, useState } from "react";
import cn from "classnames";
import { AppContext } from "~/pages/apps/[id]/App.context";
import Button from "~/components/ButtonV2";
import Container from "~/components/Container";
import Link from "~/components/Link";
import EnvironmentFormModal from "./_components/EnvironmentFormModal";
import EnvironmentStatus from "./_components/EnvironmentStatus";

const Environments: React.FC = (): React.ReactElement => {
  const { app, environments } = useContext(AppContext);
  const [isModalOpen, toggleModal] = useState(false);

  return (
    <Container
      title="Environments"
      maxWidth="max-w-none"
      actions={
        <div>
          <Button
            onClick={() => toggleModal(true)}
            type="button"
            category="button"
            aria-label="Open create environment modal"
          >
            New environment
          </Button>
        </div>
      }
    >
      <div className="p-4 pt-0">
        {environments.map((env, index) => (
          <div
            key={env.id}
            className={cn("bg-blue-10 p-4", { "mt-4": index > 0 })}
          >
            <div>
              <Link
                to={`/apps/${app.id}/environments/${env.id}`}
                className="font-bold"
              >
                {env.name}
              </Link>
            </div>
            <div className="text-xs flex items-center mt-3">
              <label className="flex w-20 text-gray-50">Branch</label>
              <span>
                <span className="fa fa-code-branch w-6 text-gray-50"></span>
                {env.branch}
              </span>
            </div>
            <div className="text-xs mt-3">
              <EnvironmentStatus env={env} app={app} />
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <EnvironmentFormModal
          app={app}
          isOpen={isModalOpen}
          onClose={() => {
            toggleModal(false);
          }}
        />
      )}
    </Container>
  );
};

export default Environments;
