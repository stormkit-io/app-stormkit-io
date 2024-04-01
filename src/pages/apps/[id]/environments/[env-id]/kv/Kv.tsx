import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Button,
  Grid,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  LinearProgress,
} from "@mui/material";
import  { useContext, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import { FetchValue, useFetchKeys } from "./actions";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import { json } from "@codemirror/lang-json";
import { instanceOf } from "prop-types";
import EmptyPage from "~/components/EmptyPage";

export default function KV() {
  const { app } = useContext(AppContext);
  const { environment } = useContext(EnvironmentContext);
  const [selectedKey, setSelectedKey] = useState(null);
  const [viewData, setViewData] = useState<string | object | null>(null);
  const { error, loading, keys } = useFetchKeys({
    appId: app.id,
    environmentId: environment.id!,
  });
  const curlCommand = `curl -X POST \
  https://kv.stormkit.io/exec \

  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \

  -H "Content-Type: application/json" \

  -d '["SET", "myKey", "Hello, Redis!"]'`;

  const handleViewClick = (key: string) => {
    FetchValue({ appId: app.id, environmentId: environment.id, key: key }).then(
      res => {
        if (typeof res === "string") {
          // Use typeof for type checking strings
          setViewData(res);
        } else {
          setViewData(JSON.stringify(res, null, 2));
        }
      }
    );
    setSelectedKey(key);
  };

  const renderDataViewer = () => {
    return (
      <Box>
        {viewData ? (
          <>
            <Box sx={{ marginLeft: "10px" }}>
              <CodeMirror
                value={viewData}
                extensions={[json()]}
                theme="dark"
                readOnly={true}
                minWidth="100%"
                maxWidth="100%"
              />
            </Box>
          </>
        ) : (
          <Box display={"grid"} sx={{ placeItems: "center", color: "white" }}>
            <ManageSearchIcon style={{ fontSize: "2rem" }} />
            <Typography>Select a key from the list</Typography>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <>
      <Accordion sx={{ marginBottom: "10px" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="info-box-content"
          id="info-box-header"
          color="white"
        >
          <Typography>
            <LightbulbIcon />
            Quick Start
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ color: "white" }}>
          <Typography sx={{ marginBottom: "10px" }}>
            Create API key from settings and send POST request to
            https://kv.stormkit.io/exec with JSON array to use Redis commands.
          </Typography>
          <CodeMirror
            extensions={[json()]}
            theme="dark"
            readOnly={true}
            value={curlCommand}
            minWidth="100%"
            maxWidth="100%"
          />
          <Typography sx={{ marginTop: "10px" }}>
            Please check our documentation for further details
          </Typography>
        </AccordionDetails>
      </Accordion>

      {loading && <LinearProgress color="secondary" />}
      {error && (
        <Box marginBottom={1}>
          <Alert color="error">
            <Box>{error}</Box>
          </Alert>
        </Box>
      )}

      {keys.length == 0 ? (
        <EmptyPage>No key is set yet</EmptyPage>
      ) : (
        <Grid container>
          <Grid item xs={6}>
            <TableContainer
              style={{
                height: "400px",
                overflowY: "auto",
                backgroundColor: "rgba(0,0,0,0.3)",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Keys</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {keys.map((key, idx) => (
                    <TableRow
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                        },
                        borderBottom: "1px dotted black",
                        backgroundColor:
                          selectedKey == key
                            ? "rgba(255, 255, 255, 0.1)"
                            : "transparent",
                      }}
                      key={`${idx}row`}
                      onClick={() => handleViewClick(key)}
                    >
                      <TableCell>
                        <Box
                          key={idx}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {key}
                          </Box>
                          <Box sx={{ alignItems: "right" }}>
                            <Button sx={{ color: "white" }}>
                              <ArrowForwardIosIcon fontSize="small" />
                            </Button>
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={6}>
            {renderDataViewer()}
          </Grid>
        </Grid>
      )}
    </>
  );
}
