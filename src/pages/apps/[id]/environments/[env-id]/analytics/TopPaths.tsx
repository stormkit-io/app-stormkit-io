import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardRow from "~/components/CardRow";
import { useFetchTopPaths } from "./actions";
import CardFooter from "~/components/CardFooter";

interface Props {
  environment: Environment;
}

export default function TopReferrers({ environment }: Props) {
  const { paths, error, loading } = useFetchTopPaths({
    envId: environment.id!,
  });

  return (
    <Card sx={{ mt: 4, width: "100%" }} error={error} loading={loading}>
      <CardHeader
        title="Paths"
        subtitle="Top 50 visited paths in the last 30 days."
      />
      <Box sx={{ maxHeight: "300px", overflow: "auto" }}>
        {paths.map(path => (
          <CardRow key={path.name} chipLabel={path.count.toString()}>
            {path.name}
          </CardRow>
        ))}
      </Box>
      <CardFooter sx={{ color: grey[500], textAlign: "left" }}>
        <Typography>Client-side routing is not calculated.</Typography>
      </CardFooter>
    </Card>
  );
}
