import Box from "@mui/material/Box";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import UniqueVisitors from "./UniqueVisitors";

export default function Analytics() {
  return (
    <Box sx={{ color: "white" }}>
      <Card sx={{ mb: 2 }}>
        <CardHeader
          title="Analytics"
          subtitle="Monitor user analytics for the specified domain within this environment configuration."
        />
      </Card>
      <UniqueVisitors />
    </Box>
  );
}
