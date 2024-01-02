import type { IntegrationFormValues } from "../actions";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";
import InputDesc from "~/components/InputDescription";
import { updateIntegration, deleteIntegration } from "../actions";

interface Props {
  app: App;
  environment: Environment;
  setRefreshToken: (val: number) => void;
}

const CustomStorage: React.FC<Props> = ({
  app,
  environment,
  setRefreshToken,
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState<React.ReactNode>();
  const [integration, setIntegration] = useState<Integration | undefined>(
    environment.customStorage?.integration
  );

  return (
    <Card
      component="form"
      sx={{ color: "white" }}
      error={error}
      success={
        success
          ? "Custom storage configuration was saved successfully. Your app will now be served from your custom storage."
          : ""
      }
      onSubmit={e => {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        const values = Object.fromEntries(
          formData.entries()
        ) as IntegrationFormValues;

        setLoading(true);
        setSuccess(false);
        setError(undefined);
        updateIntegration({
          app,
          values,
          environmentId: environment.id!,
        })
          .then(() => {
            setSuccess(true);
            setRefreshToken(Date.now());
          })
          .catch(async e => {
            if (typeof e === "string") {
              return setError(e);
            }

            try {
              const data = await e.json();
              setError(
                Object.values(data.errors).map(e => (
                  <div>{e as React.ReactNode}</div>
                ))
              );
            } catch {
              setError("Something went wrong while setting custom storage.");
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }}
    >
      <CardHeader
        title="Custom storage"
        subtitle="Host your assets in your provider."
      />

      <Box sx={{ mb: 4 }}>
        <FormControl variant="standard" fullWidth>
          <InputLabel id="auto-deploy-label" sx={{ pl: 2, pt: 1 }}>
            Auto deploy
          </InputLabel>
          <Select
            name="integration"
            className="no-border h-full"
            variant="filled"
            fullWidth
            defaultValue={integration || "_"}
            value={integration || "_"}
            onChange={e => {
              setIntegration(e.target.value as Integration);
            }}
          >
            <MenuItem disabled value={"_"}>
              Choose an integration
            </MenuItem>
            <MenuItem value="bunny_cdn">Bunny CDN</MenuItem>
            <MenuItem value="aws_s3">AWS S3</MenuItem>
          </Select>
        </FormControl>
        <InputDesc>
          <Typography>
            Build artifacts will be uploaded to this provider instead of
            Stormkit servers.
          </Typography>
        </InputDesc>
      </Box>

      {integration !== undefined && (
        <Box sx={{ mb: 4 }}>
          <TextField
            variant="filled"
            name="externalUrl"
            label="External URL"
            defaultValue={environment.customStorage?.externalUrl}
            placeholder="e.g. https://www.stormkit.io"
            fullWidth
            required
          />
          <InputDesc>
            Your custom domain that is not managed by Stormkit. It will be used
            to provide preview links.
          </InputDesc>
        </Box>
      )}
      {integration === "bunny_cdn" && (
        <>
          <Box sx={{ mb: 4 }}>
            <TextField
              label="Storage Key"
              variant="filled"
              name="settings.STORAGE_KEY"
              defaultValue={
                environment.customStorage?.settings?.["STORAGE_KEY"]
              }
              placeholder="The API key of your storage zone"
              fullWidth
              required
            />
          </Box>
          <Box sx={{ mb: 4 }}>
            <TextField
              variant="filled"
              name="settings.STORAGE_ZONE"
              label="Storage Zone"
              defaultValue={
                environment.customStorage?.settings?.["STORAGE_ZONE"]
              }
              placeholder="My storage zone"
              fullWidth
              required
            />
            <InputDesc>
              <span>
                The name of the Storage zone - it corresponds to the{" "}
                <b>username</b> under FTP &amp; API Access
              </span>
            </InputDesc>
          </Box>
        </>
      )}

      {integration === "aws_s3" && (
        <>
          <Box sx={{ mb: 4 }}>
            <TextField
              variant="filled"
              label="Access Key ID"
              name="settings.ACCESS_KEY_ID"
              required
              defaultValue={
                environment.customStorage?.settings?.["ACCESS_KEY_ID"]
              }
              fullWidth
            />
            <InputDesc>AWS Access Key ID obtained from IAM service</InputDesc>
          </Box>
          <Box sx={{ mb: 4 }}>
            <TextField
              variant="filled"
              label="Secret Access Key"
              type="password"
              name="settings.SECRET_ACCESS_KEY"
              required
              defaultValue={
                environment.customStorage?.settings?.["SECRET_ACCESS_KEY"]
              }
              fullWidth
            />
            <InputDesc>
              AWS Secret Access Key obtained from IAM service
            </InputDesc>
          </Box>
          <Box sx={{ mb: 4 }}>
            <TextField
              variant="filled"
              label="Bucket name"
              name="settings.BUCKET_NAME"
              className="bg-blue-10 no-border h-full"
              required
              defaultValue={
                environment.customStorage?.settings?.["BUCKET_NAME"]
              }
              fullWidth
            />
          </Box>
          <Box sx={{ mb: 4 }}>
            <TextField
              name="settings.KEY_PREFIX"
              label="Key prefix"
              variant="filled"
              className="bg-blue-10 no-border h-full"
              defaultValue={environment.customStorage?.settings?.["KEY_PREFIX"]}
              fullWidth
            />
            <InputDesc>
              Key prefis is the path to upload the files inside your Bucket. Do
              not prefix with a forward slash (/).
            </InputDesc>
          </Box>
          <Box sx={{ mb: 4 }}>
            <TextField
              variant="filled"
              label="AWS Region"
              name="settings.REGION"
              placeholder="e.g eu-central-1"
              className="bg-blue-10 no-border h-full"
              defaultValue={environment.customStorage?.settings?.["REGION"]}
              fullWidth
            />
            <InputDesc>
              <span>
                Region name where there bucket was created. Defaults to{" "}
                <b>eu-central-1</b>.
              </span>
            </InputDesc>
          </Box>
        </>
      )}
      <CardFooter
        sx={{
          display: "flex",
          justifyContent: integration ? "space-between" : "flex-end",
        }}
      >
        {integration && (
          <div>
            <Button
              type="button"
              variant="contained"
              color="primary"
              loading={deleteLoading}
              sx={{ textTransform: "none" }}
              onClick={() => {
                setDeleteLoading(true);
                setSuccess(false);
                setError(undefined);
                deleteIntegration({
                  app,
                  environmentId: environment.id!,
                })
                  .then(() => {
                    setIntegration(undefined);
                    setRefreshToken(Date.now());
                  })
                  .finally(() => {
                    setDeleteLoading(false);
                  });
              }}
            >
              Remove
            </Button>
          </div>
        )}

        <Button
          type="submit"
          variant="contained"
          color="secondary"
          disabled={!integration}
          loading={loading}
          sx={{ textTransform: "none", ml: 2 }}
        >
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CustomStorage;
