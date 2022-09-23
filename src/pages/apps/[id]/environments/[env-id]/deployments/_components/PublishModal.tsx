import React, { useState, useMemo, useEffect } from "react";
import cn from "classnames";
import FormControlLabel from "@mui/material/FormControlLabel";
import Slider from "@mui/material/Slider";
import Container from "~/components/Container";
import Modal from "~/components/ModalV2";
import Button from "~/components/ButtonV2";
import InfoBox from "~/components/InfoBoxV2";
import Form from "~/components/FormV2";
import Author from "./Author";
import { publishDeployments } from "../actions";

interface Props {
  environment: Environment;
  deployment: Deployment;
  onClose: () => void;
  onUpdate: () => void;
  app: App;
}

const PublishModal: React.FC<Props> = ({
  app,
  environment,
  deployment,
  onClose,
  onUpdate,
}) => {
  const { published = [] } = environment;
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [showPrevDeployments, setShowPrevDeployments] = useState(false);
  const [percentages, setPercentages] = useState<Record<string, number>>({
    [deployment.id]: 100,
  });

  const previouslyPublished = useMemo(
    () => published.filter(p => p.deploymentId !== deployment?.id) || [],
    [published, deployment?.id]
  );

  useEffect(() => {
    if (showPrevDeployments) {
      const percentagePerRow = 100 / (previouslyPublished.length + 1);

      setPercentages(
        previouslyPublished.reduce(
          (current, p) => ({
            ...current,
            [p.deploymentId]: Math.floor(percentagePerRow),
          }),
          { [deployment.id]: Math.ceil(percentagePerRow) }
        )
      );
    } else if (percentages[deployment.id] !== 100) {
      setPercentages({ [deployment.id]: 100 });
    }
  }, [showPrevDeployments, previouslyPublished]);

  return (
    <Modal
      open={Boolean(deployment)}
      onClose={onClose}
      aria-labelledby={"Publish modal"}
      aria-describedby={"Publish a deployment"}
    >
      <Container
        title="Publish deployment"
        maxWidth="max-w-none"
        actions={
          previouslyPublished.length > 0 && (
            <FormControlLabel
              label="Publish gradually"
              control={
                <Form.Checkbox
                  defaultChecked={false}
                  onChange={e => {
                    setShowPrevDeployments(e.target.checked);
                  }}
                />
              }
            />
          )
        }
      >
        <PublishRow
          showSlider={showPrevDeployments}
          commitAuthor={deployment?.commit.author}
          commitMessage={deployment?.commit.message}
          defaultPercentage={percentages[deployment.id]}
          onChange={percentage => {
            setPercentages({ ...percentages, [deployment.id]: percentage });
          }}
        />
        {showPrevDeployments && (
          <>
            <h3 className="mt-12 px-4 font-bold">Currently published</h3>
            {previouslyPublished.map(p => (
              <PublishRow
                key={p.deploymentId}
                commitAuthor={p.commitAuthor}
                commitMessage={p.commitMessage}
                defaultPercentage={percentages[p.deploymentId]}
                showSlider
                onChange={percentage => {
                  setPercentages({
                    ...percentages,
                    [p.deploymentId!]: percentage,
                  });
                }}
              />
            ))}
          </>
        )}
        {error && (
          <InfoBox className="mx-4" type={InfoBox.ERROR}>
            {error}
          </InfoBox>
        )}
        <div className="flex justify-center w-full mt-4 py-4">
          <Button
            loading={loading}
            onClick={() => {
              setLoading(true);
              publishDeployments({
                percentages,
                envId: environment.id!,
                app,
              })
                .then(() => {
                  setLoading(false);
                  onUpdate();
                  onClose();
                })
                .catch(e => {
                  setLoading(false);
                  setError(
                    typeof e === "string"
                      ? e
                      : "An error occurred while publishing. Please try again later."
                  );
                });
            }}
          >
            <span>
              Publish to{" "}
              <span className="font-bold">{environment.getDomainName?.()}</span>
            </span>
          </Button>
        </div>
      </Container>
    </Modal>
  );
};

interface PublishRowProps {
  showSlider?: boolean;
  commitMessage?: string;
  commitAuthor?: string;
  defaultPercentage?: number;
  onChange: (percentage: number) => void;
}

const PublishRow: React.FC<PublishRowProps> = ({
  showSlider,
  commitMessage,
  commitAuthor,
  onChange,
  defaultPercentage = 100,
}) => {
  return (
    <div className="my-4 px-4">
      <div className={cn("bg-blue-10 px-4 py-4", { "pb-2": showSlider })}>
        <div>
          {commitMessage?.split("\n")[0]}
          <br />
          <Author author={commitAuthor} />
        </div>
        {showSlider && (
          <div>
            <Slider
              onChange={(_, value) => {
                onChange(value as number);
              }}
              value={defaultPercentage}
              color="secondary"
              valueLabelDisplay="auto"
            ></Slider>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublishModal;
