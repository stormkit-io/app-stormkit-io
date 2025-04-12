import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CardRow from "~/components/CardRow";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import { useFetchInstanceDetails } from "../auth/actions";

export default function Subscription() {
  const { details, loading } = useFetchInstanceDetails();
  const license = details?.license;

  return (
    <Card
      loading={loading}
      sx={{ backgroundColor: "container.transparent" }}
      contentPadding={false}
    >
      <CardHeader
        title="Subscription details"
        subtitle="Information about your Stormkit subscription"
      />
      <CardRow>
        <Typography variant="h2" color="text.secondary">
          Plan
        </Typography>
        <Typography>
          {license?.isFree ? "Free" : license?.premium ? "Premium" : "Standard"}
        </Typography>
      </CardRow>
      <CardRow>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h2" color="text.secondary">
            Seats
          </Typography>
          <Typography>
            {license?.seats === -1 ? "Unlimited" : license?.seats}
          </Typography>
        </Box>
      </CardRow>
      <CardRow>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h2" color="text.secondary">
            Remaining seats
          </Typography>
          <Typography>
            {license?.seats === -1 ? "Unlimited" : license?.remaining}
          </Typography>
        </Box>
      </CardRow>
    </Card>
  );
}
