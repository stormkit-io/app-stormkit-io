import { useState } from "react";
import { useParams } from "react-router";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import LensIcon from "@mui/icons-material/Lens";
import Typography from "@mui/material/Typography";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";
import Error404 from "~/components/Errors/Error404";
import Spinner from "~/components/Spinner";
import { useFetchDeployment, useWithPageRefresh } from "../actions";
import DeploymentRow from "~/shared/deployments/DeploymentRow";
import { grey } from "@mui/material/colors";

const splitLines = (message: string): string[] => {
  // Remove first and last empty lines
  const lines = message
    .replace(/^[\n\s]+|[\n\s]+$/g, "")
    .replace(/\n\n+/g, "\n\n")
    .split("\n");

  return lines;
};

const shouldShowDuration = (
  hasDurationSupport: boolean | undefined,
  d: DeploymentV2,
  i: number
): boolean => {
  if (!hasDurationSupport) {
    return false;
  }

  if (d.status === "running") {
    return (d.logs?.length || 1) - 1 !== i;
  }

  return true;
};

const iconProps = {
  fontSize: 12,
};

export default function Deployment() {
  const { deploymentId } = useParams();
  const [refreshToken, setRefreshToken] = useState<number>();
  const { deployment, error, loading } = useFetchDeployment({
    deploymentId,
    refreshToken,
  });

  useWithPageRefresh({ deployment, setRefreshToken });

  const isRunning = deployment?.status === "running";

  const showEmptyPackageWarning =
    deployment &&
    !isRunning &&
    !deployment.stoppedAt &&
    !deployment.clientPackageSize &&
    !deployment.serverPackageSize;

  if (!deployment && !loading && !error) {
    return (
      <Card sx={{ width: "100%", pt: "12rem" }}>
        <Error404>
          <Typography>Deployment is not found.</Typography>
        </Error404>
      </Card>
    );
  }

  const hasDurationSupport = deployment?.logs?.some(
    d => d.duration && d.duration > 0
  );

  return (
    <Card
      sx={{ width: "100%" }}
      error={error}
      loading={loading}
      contentPadding={false}
      info={
        showEmptyPackageWarning ? (
          <>
            Deployment package is empty. Make sure that the build folder is
            specified properly.
          </>
        ) : (
          ""
        )
      }
    >
      <CardHeader
        sx={{
          py: 2,
          px: 0,
          pb: 0,
          mb: 2,
        }}
      >
        {deployment && (
          <DeploymentRow
            deployment={deployment}
            setRefreshToken={setRefreshToken}
            viewDetails={false}
            exactTime
            sx={{ borderTop: "none !important" }}
          />
        )}
      </CardHeader>
      {deployment?.logs?.map(({ title, status, duration, message = "" }, i) => (
        <Box
          key={title}
          data-testid={`deployment-step-${i}`}
          sx={{ px: 3, mb: 2, ":last-of-type": { mb: 0 } }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              borderBottom: `1px solid ${grey[900]}`,
              color: "white",
              p: 1,
              pb: 2,
            }}
          >
            {isRunning && deployment.logs!.length - 1 === i ? (
              <CircularProgress
                size={12}
                color="error"
                variant="indeterminate"
                sx={iconProps}
              />
            ) : (
              <LensIcon color={status ? "success" : "error"} sx={iconProps} />
            )}
            <Box
              sx={{
                flex: 1,
                fontFamily: "monospace",
                ml: 2,
                display: "inline-block",
              }}
            >
              {title}
            </Box>
            {shouldShowDuration(hasDurationSupport, deployment, i) ? (
              <Typography
                component="span"
                sx={{ color: grey[500], fontSize: 11 }}
              >
                {duration}s
              </Typography>
            ) : (
              ""
            )}
          </Box>
          {message.length ? (
            <Box
              component="code"
              bgcolor="transparent"
              sx={{
                fontFamily: "monospace",
                fontSize: 12,
                display: "block",
                py: 2,
                lineHeight: 1.5,
                overflow: "auto",
                color: "white",
              }}
              style={{ maxHeight: "400px" }}
            >
              {splitLines(message).map((line, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    color: grey[500],
                    "&:hover": { color: "white", bgcolor: "rgba(0,0,0,0.1)" },
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      display: "inline-block",
                      minWidth: "50px",
                      maxWidth: "50px",
                      width: "100%",
                      textAlign: "right",
                      mr: 1,
                    }}
                  >
                    {i + 1}.
                  </Box>{" "}
                  {line}
                </Box>
              ))}
            </Box>
          ) : (
            ""
          )}
        </Box>
      ))}
      <CardFooter sx={{ display: "flex", justifyContent: "center" }}>
        {isRunning && <Spinner primary />}
        {deployment?.status === "success" && (
          <Button
            href={deployment.previewUrl}
            variant="contained"
            color="secondary"
          >
            Preview
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
