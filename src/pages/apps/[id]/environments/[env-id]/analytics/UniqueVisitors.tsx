import { useContext, useMemo, useState } from "react";
import {
  YAxis,
  AreaChart,
  Area,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import { useFetchUniqueVisitors } from "./actions";
import Spinner from "~/components/Spinner";
import { Typography } from "@mui/material";
import { grey, indigo, pink, purple } from "@mui/material/colors";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const pieces = payload[0].payload.name.split(" ");

    return (
      <Box
        sx={{
          p: 2,
          borderRadius: 1,
          bgcolor: "rgba(0,0,0,0.5)",
          minWidth: "120px",
          textAlign: "right",
        }}
      >
        <Typography
          sx={{
            borderBottom: `1px solid ${grey[900]}`,
            pb: 1,
            mb: 1,
          }}
        >
          {pieces[1] || pieces[0]}
        </Typography>
        <Typography>{payload[0].value} visitors</Typography>
      </Box>
    );
  }

  return null;
}

const timeSpan = {
  "24h": "24 hours",
  "7d": "7 days",
  "30d": "30 days",
};

export default function UniqueVisitors() {
  const [ts, setTs] = useState<"24h" | "7d" | "30d">("24h");
  const { environment } = useContext(EnvironmentContext);
  const { visitors, error, loading } = useFetchUniqueVisitors({
    envId: environment.id!,
    ts,
  });

  const totalVisitors = useMemo(() => {
    return visitors.reduce((prev, curr) => {
      return prev + curr.count;
    }, 0);
  }, [visitors]);

  return (
    <Card error={error}>
      <CardHeader
        title="Unique visitors"
        subtitle={
          <>
            Total{" "}
            <Box component="span" sx={{ color: pink[300] }}>
              {totalVisitors}
            </Box>{" "}
            visitors in the last {timeSpan[ts]}.
          </>
        }
        actions={
          <ToggleButtonGroup
            value={ts}
            exclusive
            sx={{ bgcolor: "rgba(0,0,0,0.3)" }}
            onChange={(_, val) => {
              if (val !== null) {
                setTs(val);
              }
            }}
            aria-label="display mode"
          >
            <ToggleButton
              value="24h"
              aria-label="24 hours"
              size="small"
              sx={{ fontSize: 12, textTransform: "capitalize" }}
            >
              24 hours
            </ToggleButton>
            <ToggleButton
              value="7d"
              aria-label="7 days"
              size="small"
              sx={{ fontSize: 12, textTransform: "capitalize" }}
            >
              7 Days
            </ToggleButton>
            <ToggleButton
              value="30d"
              aria-label="30 days"
              size="small"
              sx={{ fontSize: 12, textTransform: "capitalize" }}
            >
              30 Days
            </ToggleButton>
          </ToggleButtonGroup>
        }
      />
      {loading && <Spinner />}
      {!loading && (
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={visitors}
              margin={{
                top: 0,
                right: 0,
                left: -30,
                bottom: 10,
              }}
            >
              <CartesianGrid horizontalPoints={[0]} stroke="#181329" />
              <Tooltip content={<CustomTooltip />} />
              <YAxis
                tick={{
                  fill: "white",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12,
                }}
              />
              <Area type="linear" dataKey="count" stroke="#6048b0a9" dot />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Card>
  );
}
