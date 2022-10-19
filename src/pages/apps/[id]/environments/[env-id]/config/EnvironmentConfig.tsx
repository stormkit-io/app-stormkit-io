import React, { useContext, useState } from "react";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import TabEnvironmentConfig from "./_components/TabEnvironmentConfig";
import TabCustomStorage from "./_components/TabCustomStorage";
import TabDomainConfig from "./_components/TabDomainConfig/TabDomainConfig";

type Tab = "config" | "custom storage" | "custom domain";

const EnvironmentConfig: React.FC = () => {
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
        className="bg-pink-10 mb-4"
      >
        <ToggleButton
          value="config"
          aria-label="Environment config"
          className="bg-blue-50 hover:text-gray-80"
          classes={{
            root: "border-t-0 border-b-0 border-l-0 border-r-2 border-solid border-blue-10 capitalize",
          }}
        >
          <span className="text-gray-80">Configuration</span>
        </ToggleButton>
        <ToggleButton
          value="custom storage"
          aria-label="Custom storage"
          className="bg-blue-50 hover:text-gray-80"
          classes={{
            root: "border-t-0 border-b-0 border-l-0 border-r-2 border-solid border-blue-10 capitalize",
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
          className="bg-blue-50 hover:text-gray-80"
          classes={{
            root: "border-t-0 border-b-0 border-l-0 border-r-2 border-solid border-blue-10 capitalize",
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
};

export default EnvironmentConfig;
