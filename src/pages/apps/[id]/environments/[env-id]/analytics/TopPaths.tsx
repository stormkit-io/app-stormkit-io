import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardRow from "~/components/CardRow";
import CardFooter from "~/components/CardFooter";
import { useFetchTopPaths } from "./actions";
import { truncate } from "./helpers";

interface Props {
  environment: Environment;
}

export default function TopPaths({ environment }: Props) {
  const { paths, error, loading } = useFetchTopPaths({
    envId: environment.id!,
  });

  return (
    <Card sx={{ width: "100%" }} error={error} loading={loading}>
      <CardHeader
        title="Paths"
        subtitle="Top 50 visited paths in the last 30 days."
      />
      <Box
        sx={{
          maxHeight: "300px",
          overflow: "auto",
        }}
      >
        {paths.map(path => (
          <CardRow key={path.name} chipLabel={path.count.toString()}>
            {truncate(path.name)}
          </CardRow>
        ))}
      </Box>
      <CardFooter sx={{ color: grey[500], textAlign: "left" }}>
        <Typography sx={{ fontSize: 12 }}>
          Client-side routing is not calculated.
        </Typography>
      </CardFooter>
    </Card>
  );
}
