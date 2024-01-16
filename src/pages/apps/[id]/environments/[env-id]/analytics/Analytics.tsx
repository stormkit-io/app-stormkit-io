import type { TimeSpan } from "./index.d";
import { useContext, useState } from "react";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import EmptyPage from "~/components/EmptyPage";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import Visitors from "./Visitors";
import TopReferrers from "./TopReferrers";
import TopPaths from "./TopPaths";
import ByCountries from "./Countries";

export default function Analytics() {
  const [timeSpan, setTimeSpan] = useState<TimeSpan>("24h");
  const { environment } = useContext(EnvironmentContext);

  if (!environment?.domain?.name) {
    return (
      <Card sx={{ color: "white", width: "100%" }}>
        <CardHeader title="Analytics" />
        <EmptyPage>
          Analytics are collected only for custom domains. <br />
          <Button
            sx={{ mt: 2 }}
            variant="contained"
            color="secondary"
            onClick={e => {
              e.preventDefault();
            }}
          >
            <Link
              href={`/apps/${environment.appId}/environments/${environment.id}#domain`}
              sx={{
                color: "white",
                ":hover": { color: "inherit", textDecoration: "none" },
              }}
            >
              Setup a custom domain
            </Link>
          </Button>
        </EmptyPage>
      </Card>
    );
  }

  return (
    <Box sx={{ color: "white" }}>
      <Card sx={{ mb: 2 }}>
        <CardHeader
          title="Analytics"
          subtitle="Monitor user analytics for the specified domain within this environment configuration."
        />
      </Card>
      <Visitors
        environment={environment}
        ts={timeSpan}
        onTimeSpanChange={setTimeSpan}
      />
      <Box
        sx={{
          mt: 2,
          display: "flex",
          gap: 2,
        }}
      >
        <TopReferrers environment={environment} />
        <TopPaths environment={environment} />
      </Box>
      <ByCountries environment={environment} />
    </Box>
  );
}
