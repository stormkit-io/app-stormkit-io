import type { TimeSpan } from "./index.d";
import { useMemo, useState } from "react";
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
import Typography from "@mui/material/Typography";
import { grey, pink } from "@mui/material/colors";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";
import { useFetchVisitors } from "./actions";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any;
  label?: string;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const pieces = payload[0].payload.name.split(" ");

    return (
      <Box
        sx={{
          p: 2,
          borderRadius: 1,
          bgcolor: "rgba(0,0,0,0.5)",
          minWidth: "200px",
          textAlign: "center",
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
        {payload.map((p: any) => (
          <Typography key={p.name}>
            {p.value} {p.name} visitors
          </Typography>
        ))}
      </Box>
    );
  }

  return null;
}

const timeSpan: Record<TimeSpan, string> = {
  "24h": "24 hours",
  "7d": "7 days",
  "30d": "30 days",
};

interface Props {
  environment: Environment;
  ts: TimeSpan;
  onTimeSpanChange: (t: TimeSpan) => void;
}

export default function Visitors({ environment, onTimeSpanChange, ts }: Props) {
  const [display, setDisplay] = useState<"unique" | "total" | "all">("all");
  const { visitors, error, loading } = useFetchVisitors({
    envId: environment.id!,
    ts,
  });

  const totalVisitors = useMemo(() => {
    return visitors.reduce((prev, curr) => {
      return prev + (display === "unique" ? curr.unique : curr.total);
    }, 0);
  }, [visitors, display]);

  return (
    <Card error={error} loading={loading}>
      <CardHeader
        title="Visitors"
        subtitle={
          <>
            {display !== "unique" ? "Total " : ""}
            <Box component="span" sx={{ color: pink[300] }}>
              {totalVisitors}
            </Box>{" "}
            {display === "unique" ? "unique" : ""} visits in the last{" "}
            {timeSpan[ts]}
            <Box>{environment.domain?.name}</Box>
          </>
        }
        actions={
          <ToggleButtonGroup
            value={ts}
            exclusive
            sx={{ bgcolor: "rgba(0,0,0,0.3)" }}
            onChange={(_, val) => {
              if (val !== null) {
                onTimeSpanChange(val);
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
      <Box sx={{ height: 300, mb: 4 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={visitors}
            margin={{
              top: 10,
              right: 5,
              left: totalVisitors > 100 ? -25 : -28,
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
            <Area
              hide={display === "unique"}
              type="linear"
              dataKey="total"
              stroke="#6048b0a9"
              fill="#1c499ca9"
              dot
            />
            <Area
              hide={display === "total"}
              type="linear"
              dataKey="unique"
              stroke="#6048b0a9"
              fill="#a048b0a9"
              dot
            />
          </AreaChart>
        </ResponsiveContainer>
        <Box sx={{ justifyContent: "center", display: "flex", width: "100%" }}>
          <Typography
            sx={{
              color: "#1c499c",
              mr: 2,
              cursor: "pointer",
            }}
            onClick={() => {
              setDisplay(display === "total" ? "all" : "total");
            }}
          >
            Total visitors
          </Typography>
          <Typography
            sx={{ color: "#7a3782", cursor: "pointer" }}
            onClick={() => {
              setDisplay(display === "unique" ? "all" : "unique");
            }}
          >
            Unique visitors
          </Typography>
        </Box>
      </Box>
      <CardFooter sx={{ textAlign: "left", color: grey[500] }}>
        <Typography sx={{ fontSize: 12 }}>
          Bots are excluded from these statistics
        </Typography>
      </CardFooter>
    </Card>
  );
}
