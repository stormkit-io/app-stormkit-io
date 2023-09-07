import { useContext, useState } from "react";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import TabEnvironmentConfig from "./_components/TabEnvironmentConfig";
import TabCustomStorage from "./_components/TabCustomStorage";
import TabDomainConfig from "./_components/TabDomainConfig/TabDomainConfig";

type Tab = "config" | "custom storage" | "custom domain";

export default function EnvironmentConfig() {
  const { app, setRefreshToken } = useContext(AppContext);
  const { environment } = useContext(EnvironmentContext);
  const [tab, setTab] = useState<Tab>(
    window.location.hash?.indexOf("custom-storage") > -1
      ? "custom storage"
      : window.location.hash?.indexOf("custom-domain") > -1
      ? "custom domain"
      : "config"
  );

  return (
    <>
      <ToggleButtonGroup
        value={tab}
        exclusive
        onChange={(_, val) => {
          setTab(val as Tab);
        }}
        aria-label="active tab"
        sx={{
          borderRadius: 0,
          bgcolor: "container.paper",
          mb: 2,
        }}
      >
        <ToggleButton
          value="config"
          aria-label="Environment config"
          className="hover:text-gray-80"
          sx={{
            border: "none",
            borderRight: "1px solid black",
            textTransform: "capitalize",
          }}
        >
          <span className="text-gray-80">Configuration</span>
        </ToggleButton>
        <ToggleButton
          value="custom storage"
          aria-label="Custom storage"
          sx={{
            border: "none",
            borderRight: "1px solid black",
            textTransform: "capitalize",
          }}
        >
          <span className="text-gray-80">Custom Storage</span>
          {environment.customStorage?.integration && (
            <span className="w-2 h-2 rounded-full bg-green-50 ml-2 inline-block" />
          )}
        </ToggleButton>
        <ToggleButton
          value="custom domain"
          aria-label="Custom domain"
          sx={{
            border: "none",
            textTransform: "capitalize",
          }}
        >
          <span className="text-gray-80">Custom Domain</span>
        </ToggleButton>
      </ToggleButtonGroup>
      {tab === "config" && (
        <TabEnvironmentConfig
          app={app}
          environment={environment}
          setRefreshToken={setRefreshToken}
        />
      )}
      {tab === "custom storage" && (
        <TabCustomStorage
          app={app}
          environment={environment}
          setRefreshToken={setRefreshToken}
        />
      )}
      {tab === "custom domain" && (
        <TabDomainConfig
          app={app}
          environment={environment}
          setRefreshToken={setRefreshToken}
        />
      )}
    </>
  );
}
