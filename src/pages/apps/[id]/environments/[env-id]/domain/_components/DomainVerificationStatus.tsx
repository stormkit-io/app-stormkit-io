import React, { useState } from "react";
import { parse } from "tldts";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import Button from "~/components/Button";
import InfoBox from "~/components/InfoBox";

interface Props {
  domain: Domain;
  onVerifyClick: (arg0: {
    setLoading: SetLoading;
    setError: SetError;
  }) => Promise<void>;
}

const recordName = (domain: Domain): string => {
  const parsed = parse(domain.domainName);
  return `${domain.dns.txt.name}.${parsed.subdomain || parsed.domain}`;
};

const DomainVerificationStatus: React.FC<Props> = ({
  domain,
  onVerifyClick,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);
  const isVerified = domain.dns?.verified;

  return (
    <TableRow>
      <TableCell className="w-1/4 border-b border-solid border-gray-83 align-top">
        Domain verification status
      </TableCell>
      <TableCell className="border-b border-solid border-gray-83">
        {isVerified ? (
          <span className="text-green-50">
            <span className="fas fa-check-circle" /> Verified
          </span>
        ) : (
          <div>
            <p>
              <span className="text-blue-40">
                <span className="fas fa-running" /> Pending verification
              </span>
            </p>
            <p className="mt-2">
              Login to your external DNS provider and create the following TXT
              record.
            </p>
            <TableContainer className="bg-white rounded mt-4">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="w-1/3">
                      TXT Record Name/Host
                    </TableCell>
                    <TableCell className="font-bold">
                      {recordName(domain)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>TXT Record Value</TableCell>
                    <TableCell className="font-bold">
                      {domain.dns.txt.value}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            {error && (
              <InfoBox type={InfoBox.ERROR} className="mt-4">
                {error}
              </InfoBox>
            )}
            <div className="flex justify-end mt-4">
              <Button
                type="button"
                className="py-2"
                secondary
                loading={loading}
                onClick={() => {
                  setError(null);
                  onVerifyClick({
                    setLoading,
                    setError,
                  }).then(() => {
                    if (isVerified === false) {
                      setError(
                        `TXT records still do not match. Please give it a bit time before the DNS records propagate. The record we are trying to match is: ${domain.dns.txt.lookup}`
                      );
                    }
                  });
                }}
              >
                Verify now
              </Button>
            </div>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};

export default DomainVerificationStatus;
