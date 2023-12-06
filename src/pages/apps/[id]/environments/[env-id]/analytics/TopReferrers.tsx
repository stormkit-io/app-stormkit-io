import Box from "@mui/material/Box";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardRow from "~/components/CardRow";
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
    <Card sx={{ mt: 4, width: "100%" }} error={error} loading={loading}>
      <CardHeader title="Top referrers" />
      <Box sx={{ maxHeight: "300px", overflow: "auto" }}>
        {referrers.map(ref => (
          <CardRow key={ref.name} chipLabel={ref.count.toString()}>
            {ref.name}
          </CardRow>
        ))}
      </Box>
    </Card>
  );
}
