import { useContext } from "react";
import Box from "@mui/material/Box";
import * as buttons from "~/components/Buttons";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import { AuthContext } from "./Auth.context";

const { GithubButton, GitlabButton, BitbucketButton } = buttons;

interface Props {
  providers: any;
}

export default function ProviderAuth({ providers }: Props) {
  const { loginOauth } = useContext(AuthContext);

  return (
    <Card sx={{ width: "100%" }}>
      <CardHeader
        title="Authentication"
        subtitle="Login with your provider"
        sx={{ textAlign: "center" }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          px: { xs: 0, md: 6 },
        }}
      >
        {providers?.github && (
          <GithubButton
            sx={{
              mb: providers?.gitlab || providers.bitbucket ? 4 : 0,
            }}
            onClick={() => loginOauth?.("github")}
          />
        )}
        {providers?.gitlab && (
          <GitlabButton
            sx={{ mb: providers?.bitbucket ? 4 : 0 }}
            onClick={() => loginOauth?.("gitlab")}
          />
        )}
        {providers?.bitbucket && (
          <BitbucketButton onClick={() => loginOauth?.("bitbucket")} />
        )}
      </Box>
    </Card>
  );
}
