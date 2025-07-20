import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { LocalStorage } from "~/utils/storage";
import { LS_PROVIDER } from "~/utils/api/Api";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";
import CardRow from "~/components/CardRow";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import ImportExport from "@mui/icons-material/ImportExport";
import LinkIcon from "@mui/icons-material/Link";
import BoltIcon from "@mui/icons-material/Bolt";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForward from "@mui/icons-material/ArrowForwardIos";
import { AuthContext } from "~/pages/auth/Auth.context";
import ButtonDropdown from "~/components/ButtonDropdown";
import AppName from "~/components/AppName";
import { useSelectedTeam } from "~/layouts/TopMenu/Teams/actions";
import { providerToText } from "~/utils/helpers/string";
import { useFetchAppList, createApp } from "./actions";
import { WelcomeModal, EmptyList } from "./_components";
import TeamStats from "./_components/TeamStats";

let timeout: NodeJS.Timeout;
const limit = 20;
const welcomeModalId = "welcome_modal";

export default function Apps() {
  const { teams } = useContext(AuthContext);
  const [from, setFrom] = useState(0);
  const [filter, setFilter] = useState("");
  const selectedTeam = useSelectedTeam({ teams });
  const navigate = useNavigate();

  const { apps, loading, error, hasNextPage } = useFetchAppList({
    from,
    filter,
    teamId: selectedTeam?.id,
  });

  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(
    LocalStorage.get(welcomeModalId) !== "shown"
  );

  const provider = LocalStorage.get<Provider>(LS_PROVIDER);

  if (loading && !filter) {
    return (
      <Box sx={{ width: "100%", position: "relative", mt: -2 }}>
        <Card loading={true} />
      </Box>
    );
  }

  const createBareApp = () => {
    createApp({ teamId: selectedTeam?.id }).then(app => {
      navigate(`/apps/${app.id}`);
    });
  };

  // This can happen if the self-hosted user has no provider configured
  if (!provider && apps.length === 0) {
    return (
      <Box sx={{ width: "100%" }} maxWidth="lg">
        <Card sx={{ px: { xs: 1, md: 4 } }}>
          <EmptyList
            primaryActionText="Configure authentication"
            primaryDesc="Configure authentication to import from private repositories

"
            primaryLink="https://www.stormkit.io/docs/self-hosting/authentication"
            secondaryLink="/apps/new/url"
            secondaryActionText="Import from URL"
            secondaryDesc="Start importing immediately by providing a public repository URL"
            onBareAppClick={createBareApp}
          />
        </Card>
      </Box>
    );
  }

  const importFromProvider = provider
    ? `Import from ${providerToText[provider]}`
    : "Configure authentication";

  const newAppHref = provider
    ? `/apps/new/${provider}`
    : "https://www.stormkit.io/docs/self-hosting/authentication";

  if (apps.length === 0 && !filter) {
    return (
      <Box sx={{ width: "100%" }} maxWidth="lg">
        <Card sx={{ px: { xs: 1, md: 4 } }}>
          <EmptyList
            primaryDesc="Grant access to import your private repositories"
            primaryActionText={importFromProvider}
            primaryLink={newAppHref}
            secondaryLink="/apps/new/url"
            secondaryDesc="Import directly by providing a public repository URL"
            secondaryActionText="Import from URL"
            onBareAppClick={createBareApp}
          />
        </Card>
      </Box>
    );
  }

  return (
    <Box maxWidth="lg" sx={{ width: "100%" }}>
      <Card
        contentPadding={false}
        errorTitle={false}
        loading={loading}
        error={
          error ||
          (!loading && apps.length === 0 && "This search produced no results.")
        }
      >
        <CardHeader
          title={
            selectedTeam?.isDefault
              ? "My apps"
              : `${selectedTeam?.name} Team Apps`
          }
          actions={
            <ButtonDropdown
              buttonText="Create new app"
              items={[
                {
                  icon: <ImportExport />,
                  text: importFromProvider,
                  href: newAppHref,
                },
                {
                  icon: <LinkIcon />,
                  text: "Import from URL",
                  href: `/apps/new/url`,
                },
                {
                  icon: <BoltIcon />,
                  text: "Create bare app",
                  onClick: createBareApp,
                },
              ]}
            />
          }
        />
        <TeamStats teamId={selectedTeam?.id} />
        <Box sx={{ mx: 4, mb: 2 }}>
          <TextField
            fullWidth
            autoFocus
            placeholder="Search"
            aria-label="Search apps"
            label="Search apps"
            variant="filled"
            onChange={e => {
              clearTimeout(timeout);
              timeout = setTimeout(() => {
                setFrom(0);
                setFilter(e.target.value);
              }, 250);
            }}
            InputProps={{
              endAdornment: <SearchIcon sx={{ fontSize: 16 }} />,
            }}
          />
        </Box>
        {apps.map(app => {
          const environmentsUrl = `/apps/${app.id}/environments`;

          return (
            <CardRow
              key={app.id}
              actions={
                <IconButton href={environmentsUrl}>
                  <ArrowForward sx={{ fontSize: 16 }} />
                </IconButton>
              }
            >
              <AppName app={app} />
            </CardRow>
          );
        })}
        {hasNextPage && (
          <CardFooter
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LoadingButton
              variant="text"
              loading={loading}
              onClick={() => {
                setFrom(from + limit);
              }}
            >
              Load more
            </LoadingButton>
          </CardFooter>
        )}
        <WelcomeModal
          isOpen={isWelcomeModalOpen}
          toggleModal={setIsWelcomeModalOpen}
          welcomeModalId={welcomeModalId}
        />
      </Card>
    </Box>
  );
}
