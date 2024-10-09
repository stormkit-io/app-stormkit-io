import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import { useFetchInstanceDetails } from "./actions";

const LS_UPDATE_KEY = "STORMKIT_UPDATE";

export default function UpdateSnackbar() {
  const [isToasterOpen, setIsToasterOpen] = useState(false);
  const { details } = useFetchInstanceDetails();
  const navigate = useNavigate();

  useEffect(() => {
    if (details?.update) {
      setIsToasterOpen(true);
    }
  }, [details?.update]);

  const previouslyDismissed =
    localStorage.getItem(LS_UPDATE_KEY)?.replace(/"/g, "") ===
    `${details?.latest?.apiVersion}${details?.latest?.uiCommit}`;

  if (!details || !details.stormkit?.selfHosted || previouslyDismissed) {
    return <></>;
  }

  const handleCloseUpdate = () => {
    setIsToasterOpen(false);
    localStorage.setItem(
      LS_UPDATE_KEY,
      `${details?.latest?.apiVersion}${details?.latest?.uiCommit}`
    );
  };

  const updateBoth = details?.update?.ui && details?.update?.api;
  const uiOnly = !details?.update?.api && details?.update?.ui;
  const apiOnly = !details?.update?.ui && details?.update?.api;

  const updateMessage = updateBoth
    ? "Stormkit UI and API has newer versions"
    : uiOnly
    ? "Stormkit UI has a newer version"
    : apiOnly
    ? "Stormkit API has a newer version"
    : "";

  if (updateMessage === "") {
    return <></>;
  }

  return (
    <Snackbar
      open={isToasterOpen}
      message={updateMessage}
      action={
        <>
          {uiOnly && (
            <Button
              color="secondary"
              variant="contained"
              size="small"
              onClick={() => {
                const el = document.getElementById("deploy-now");

                if (el) {
                  el.click();
                } else {
                  navigate("/apps/1/environments/1?deploy");
                }

                handleCloseUpdate();
              }}
            >
              Deploy
            </Button>
          )}
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseUpdate}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </>
      }
    />
  );
}
