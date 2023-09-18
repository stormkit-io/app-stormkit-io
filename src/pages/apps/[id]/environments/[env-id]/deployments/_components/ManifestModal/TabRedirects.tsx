import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import Button from "@mui/material/Button";
import emptyListSvg from "~/assets/images/empty-list.svg";

interface Props {
  redirects?: Redirects[] | null;
}

function EmptyPage() {
  return (
    <Box
      sx={{
        py: 2,
        mx: 2,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "rgba(0,0,0,0.1)",
      }}
    >
      <img src={emptyListSvg} alt="Empty redirects" className="max-w-64 mb-8" />
      <p className="text-center">
        This deployment has no redirects.
        <br />
        Create a top-level{" "}
        <span className="font-mono text-xs text-white font-bold">
          redirects.json
        </span>{" "}
        to add server side redirects.{" "}
      </p>
      <p className="text-center mt-8">
        <Button
          href="https://www.stormkit.io/docs/features/redirects-and-path-rewrites"
          variant="contained"
          color="secondary"
        >
          Learn more
        </Button>
      </p>
    </Box>
  );
}

function isRedirectStatus(redirect?: number) {
  if (!redirect) {
    return false;
  }

  const mod = redirect % 300;

  // Is redirect between 300 and 307?
  return mod >= 0 && mod < 7;
}

export default function TabRedirects({ redirects }: Props) {
  if (!redirects) {
    return <EmptyPage />;
  }

  return (
    <Box sx={{ px: 2 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: "rgba(0,0,0,0.1)" }}>
            <TableCell>From</TableCell>
            <TableCell>To</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {redirects?.map(redirect => (
            <TableRow key={redirect.from}>
              <TableCell>{redirect.from}</TableCell>
              <TableCell>{redirect.to}</TableCell>
              <TableCell>
                {isRedirectStatus(redirect.status)
                  ? redirect.status
                  : "Path rewrite"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
