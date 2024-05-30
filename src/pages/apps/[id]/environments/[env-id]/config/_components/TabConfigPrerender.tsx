import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/lab/LoadingButton";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";
import { useSubmitHandler } from "../actions";

interface Props {
  app: App;
  environment: Environment;
  setRefreshToken: (v: number) => void;
}

export default function TabConfigRedirects({
  environment: env,
  app,
  setRefreshToken,
}: Props) {
  const prerenderEnabled = Boolean(env.build.prerender);

  const [showPrerender, setShowPrerender] = useState(prerenderEnabled);

  const { submitHandler, error, success, isLoading } = useSubmitHandler({
    app,
    env,
    setRefreshToken,
  });

  if (!env) {
    return <></>;
  }

  return (
    <Card
      id="prerender"
      component="form"
      sx={{ color: "white", mb: 2 }}
      error={error}
      success={success}
      onSubmit={submitHandler}
    >
      <CardHeader
        title="Prerender"
        subtitle="Built-in prerendering functionality for crawlers."
      />

      <Box sx={{ bgcolor: "rgba(0,0,0,0.2)", p: 1.75, pt: 1, mb: 4 }}>
        <FormControlLabel
          sx={{ pl: 0, ml: 0 }}
          label="Enable prerendering"
          control={
            <Switch
              color="secondary"
              checked={showPrerender}
              onChange={() => {
                setShowPrerender(!showPrerender);
              }}
            />
          }
          labelPlacement="start"
        />
        <Typography sx={{ opacity: 0.5 }}>
          Prerendering can enhance your SEO score and help with social media
          crawlers craft powerful cards for your website.
        </Typography>
      </Box>
      {showPrerender && (
        <>
          <Box sx={{ bgcolor: "rgba(0,0,0,0.2)", p: 1.75, pt: 1, mb: 4 }}>
            <TextField
              label="Wait for selector"
              variant="filled"
              autoComplete="off"
              defaultValue={env?.build.prerender?.waitFor || ""}
              fullWidth
              name="build.prerender.waitFor"
              placeholder=".my-class"
              helperText={
                "When specified the crawler will wait until the selector is found. The maximum wait time is 5 seconds."
              }
            />
          </Box>
          <Box sx={{ bgcolor: "rgba(0,0,0,0.2)", p: 1.75, pt: 1, mb: 4 }}>
            <TextField
              label="Cache duration"
              variant="filled"
              autoComplete="off"
              type="number"
              defaultValue={env?.build.prerender?.waitFor || "2"}
              fullWidth
              name="build.prerender.cacheDuration"
              placeholder="2"
              sx={{
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                  {
                    display: "none",
                  },
                "& input[type=number]": {
                  MozAppearance: "textfield",
                },
              }}
              helperText={
                "The cache duration in hours. Each published deployment will empty the cache."
              }
            />
          </Box>
          <Box sx={{ bgcolor: "rgba(0,0,0,0.2)", p: 1.75, pt: 1, mb: 4 }}>
            <TextField
              label="User Agent"
              variant="filled"
              autoComplete="off"
              defaultValue={
                env?.build.prerender?.matchUserAgent ||
                "Googlebot|AdsBot|Twitterbot|Crawler|Facebot|LinkedInBot"
              }
              fullWidth
              name="build.prerender.matchUserAgent"
              helperText={
                "Matched user agents will be shown the prerendered page."
              }
            />
          </Box>
        </>
      )}

      <CardFooter>
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          loading={isLoading}
        >
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}
