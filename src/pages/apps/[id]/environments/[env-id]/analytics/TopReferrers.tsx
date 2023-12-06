import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardRow from "~/components/CardRow";
import CardFooter from "~/components/CardFooter";
import { useFetchTopReferrers } from "./actions";

interface Props {
  environment: Environment;
}

export default function TopReferrers({ environment }: Props) {
  const { referrers, error, loading } = useFetchTopReferrers({
    envId: environment.id!,
    domainName: environment.domain.name!,
  });

  return (
    <Card sx={{ mt: 4 }} error={error} loading={loading}>
      <CardHeader
        title="Referrers"
        subtitle="Top 50 referrers in the last 30 days."
      />
      <Box sx={{ maxHeight: "300px", overflow: "auto" }}>
        {referrers.map(ref => (
          <CardRow key={ref.name} chipLabel={ref.count.toString()}>
            {ref.name}
          </CardRow>
        ))}
      </Box>
      <CardFooter sx={{ color: grey[500], textAlign: "left" }}>
        <Typography>Same domain referrers are excluded.</Typography>
      </CardFooter>
    </Card>
  );
}
