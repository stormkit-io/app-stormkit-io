import { useState, useMemo, useEffect } from "react";
import cn from "classnames";
import FormControlLabel from "@mui/material/FormControlLabel";
import Slider from "@mui/material/Slider";
import Container from "~/components/Container";
import Modal from "~/components/Modal";
import Button from "~/components/ButtonV2";
import InfoBox from "~/components/InfoBoxV2";
import Form from "~/components/FormV2";
import CommitInfo from "./CommitInfo";
import { publishDeployments } from "./actions";

interface Props {
  deployment: DeploymentV2;
  onClose: () => void;
  onUpdate: () => void;
}

export default function PublishModal({ deployment, onClose, onUpdate }: Props) {
  const { published = [] } = {} as Environment;
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
          deployment={deployment}
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
                deployment={
                  {
                    id: p.deploymentId,
                    branch: p.branch,
                    commit: {
                      message: p.commitMessage,
                      author: p.commitAuthor,
                      sha: p.commitSha,
                    },
                  } as DeploymentV2
                }
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
                envId: deployment.envId,
                appId: deployment.appId,
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
              {/* <span className="font-bold">{environment.getDomainName?.()}</span> */}
            </span>
          </Button>
        </div>
      </Container>
    </Modal>
  );
}

interface PublishRowProps {
  showSlider?: boolean;
  deployment: DeploymentV2;
  defaultPercentage?: number;
  onChange: (percentage: number) => void;
}

function PublishRow({
  deployment,
  showSlider,
  onChange,
  defaultPercentage = 100,
}: PublishRowProps) {
  return (
    <div className="my-4 px-4">
      <div className={cn("bg-blue-10 px-4 py-4", { "pb-2": showSlider })}>
        <CommitInfo deployment={deployment} />
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
}
