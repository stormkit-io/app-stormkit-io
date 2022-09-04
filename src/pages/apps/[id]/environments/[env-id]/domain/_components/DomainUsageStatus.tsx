import React from "react";
import { parse } from "tldts";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

interface Props {
  domain: Domain;
  app: App;
  onVerifyClick: (props: {
    setLoading: SetLoading;
    setError: SetError;
  }) => Promise<void>;
}

const recordName = (domain: Domain): string => {
  const parsed = parse(domain.domainName);
  return `${parsed.subdomain || "@"}`;
};

const DomainUsageStatus: React.FC<Props> = ({ domain, app, onVerifyClick }) => {
  const isVerified = domain.dns?.verified;

  if (!isVerified) {
    return null;
  }

  return (
    <TableRow>
      <TableCell className="w-1/4 border-b border-solid border-gray-83 align-top">
        Nameservers
      </TableCell>
      <TableCell className="border-b border-solid border-gray-83">
        <div>
          <div>
            Point your DNS settings to Stormkit to start using your domain.
            Allow up to 24 hours for changes to propagate.
            <h4 className="font-bold mt-4 mb-2">
              Recommended: Setting up CNAME
            </h4>
            <div className="mt-2">
              Name: <span className="font-bold">{recordName(domain)}</span>
              <br />
              Value:{" "}
              <span className="font-bold">{app.displayName}.stormkit.dev</span>
            </div>
            <h4 className="font-bold mt-4 mb-2">
              Alternative: Setting up A Record
            </h4>
            If for some reason you can't use a CNAME record, you can use the IP
            of our Load Balancer:
            <div className="mt-2">
              Name: <span className="font-bold">{recordName(domain)}</span>
              <br />
              Value: <span className="font-bold">3.64.188.62</span>
            </div>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default DomainUsageStatus;
