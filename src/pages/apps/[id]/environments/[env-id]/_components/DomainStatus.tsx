import { Typography } from "@mui/material";
import { green, red } from "@mui/material/colors";
import PublicIcon from "@mui/icons-material/Public";
import PublicOffIcon from "@mui/icons-material/PublicOff";
import Spinner from "~/components/Spinner";

interface StatusProps {
  status?: number;
  loading?: boolean;
}

export default function DomainStatus({ status, loading }: StatusProps) {
  return (
    <div className="flex items-center">
      {loading && <Spinner width={4} height={4} />}
      {!loading && (
        <Typography
          component="span"
          sx={{
            display: "flex",
            alignItems: "center",
            color: status === 200 ? green[500] : red[500],
          }}
        >
          {status === 200 && <PublicIcon sx={{ fontSize: 15, mr: 1 }} />}
          {status !== 200 && <PublicOffIcon sx={{ fontSize: 15, mr: 1 }} />}
          <Typography component="span">{status}</Typography>
        </Typography>
      )}
    </div>
  );
}
