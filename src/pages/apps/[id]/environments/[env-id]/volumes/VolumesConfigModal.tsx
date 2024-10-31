import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import Option from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import Button from "@mui/lab/LoadingButton";
import Modal from "~/components/Modal";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";
import api from "~/utils/api/Api";
import { useState } from "react";

interface ChildProps {
  config?: VolumeConfig;
}

interface Props extends ChildProps {
  onSuccess: () => void;
  onClose: () => void;
}

function ToBeImplemented() {
  return (
    <Alert color="info" sx={{ mb: 4 }}>
      <Typography>
        <Link
          href="https://github.com/stormkit-io/app-stormkit-io/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=Feature%20Request:%20Implement%20new%20destination%20for%20Volumes"
          target="_blank"
          rel="noreferrer noopener"
          sx={{ textDecoration: "underline" }}
        >
          Create an issue
        </Link>{" "}
        if you'd like to use other destinations.
      </Typography>
    </Alert>
  );
}

function FileSystemConfig({ config }: ChildProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <TextField
        variant="filled"
        name="rootPath"
        label="Root path"
        defaultValue={config?.rootPath || "/shared/volumes"}
        fullWidth
        helperText={
          <>
            <Typography component="span" sx={{ mb: 2, display: "block" }}>
              Specify the root path where your files will be uploaded.{" "}
              <Link href="https://www.stormkit.io/docs/features/volumes#filesys">
                Learn more
              </Link>
              .
            </Typography>
          </>
        }
      />
    </Box>
  );
}

export default function VolumesConfigModal({
  config,
  onClose,
  onSuccess,
}: Props) {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [mountType, setMountType] = useState<VolumeMountType>(
    config?.mountType || "filesys"
  );

  return (
    <Modal onClose={onClose} open>
      <Card
        error={error}
        component="form"
        onSubmit={e => {
          e.preventDefault();

          const form = e.target as HTMLFormElement;
          const data = Object.fromEntries(
            new FormData(form).entries()
          ) as Record<string, string>;

          setLoading(true);
          setError(undefined);

          api
            .post("/volumes/config", data)
            .then(() => {})
            .then(() => {
              onSuccess();
            })
            .catch(res => {
              if (res.status === 401) {
                setError("You do not have to perform the requested operation.");
              } else {
                setError(
                  "Something went wrong while updating volumes configuration."
                );
              }
            })
            .finally(() => {
              setLoading(false);
            });
        }}
      >
        <CardHeader
          title="Configure Stormkit Volumes"
          subtitle="These settings will apply to all applications across your instance."
        />
        <Box>
          <Box sx={{ mb: 4 }}>
            <FormControl variant="standard" fullWidth>
              <InputLabel id="mount-type" sx={{ pl: 2, pt: 1.25 }}>
                Mount
              </InputLabel>
              <Select
                labelId="mount-type"
                name="mountType"
                variant="filled"
                value={mountType}
                fullWidth
                onChange={e => {
                  setMountType(e.target.value as VolumeMountType);
                }}
              >
                <Option value="filesys">File System</Option>
                <Option value="other">Other</Option>
                {/* <Option value="aws:s3">AWS S3</Option> */}
                {/* <Option value="alibaba:oss">Alibaba Cloud OSS</Option> */}
                {/* <Option value="hetzner:oss">Hetzner Cloud OSS</Option> */}
              </Select>
            </FormControl>
          </Box>
          {mountType === "filesys" ? (
            <FileSystemConfig config={config} />
          ) : (
            <ToBeImplemented />
          )}
        </Box>
        <CardFooter>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            loading={loading}
          >
            Save
          </Button>
        </CardFooter>
      </Card>
    </Modal>
  );
}
