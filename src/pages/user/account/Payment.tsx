import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useSearchParams } from "react-router-dom";

export default function Payment() {
  const [query] = useSearchParams({});

  return (
    <Box
      sx={{ m: "auto", bgcolor: "rgba(0,0,0,0.1)", textAlign: "center" }}
      maxWidth="md"
    >
      {query.get("success") && (
        <>
          <Typography
            variant="h1"
            sx={{ fontSize: 32, mb: 2, fontWeight: 400, color: "white" }}
          >
            Thank you for your purchase!
          </Typography>
          <Typography
            variant="h2"
            sx={{ fontSize: 20, fontWeight: 400, color: "white" }}
          >
            Your tier has been updated.{" "}
            <Link
              color="secondary.dark"
              href="/"
              sx={{ textDecoration: "none", ":hover": { opacity: 0.8 } }}
            >
              Click here
            </Link>{" "}
            to go back to your apps.
          </Typography>
        </>
      )}
    </Box>
  );
}
