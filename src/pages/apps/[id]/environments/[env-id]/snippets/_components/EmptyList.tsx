import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import emptyListSvg from "~/assets/images/empty-list.svg";

export default function EmptyList() {
  return (
    <Box sx={{ textAlign: "center", my: 12 }}>
      <img src={emptyListSvg} alt="Empty app list" className="m-auto" />
      <Typography sx={{ mt: 6 }}>
        It's quite empty in here.
        <br />
        Create a new snippet to manage them.
      </Typography>
    </Box>
  );
}
