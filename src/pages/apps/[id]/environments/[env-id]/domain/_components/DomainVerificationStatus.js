import React, { useState } from "react";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import Button from "~/components/Button";
import InfoBox from "~/components/InfoBox";

const DomainVerificationStatus = ({ domain, onVerify }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
                      {domain.dns.txt.name}
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
                  onVerify({
                    setLoading,
                    setError
                  }).then(() => {
                    if (isVerified === false) {
                      setError(
                        "TXT records still do not match. Please give it a bit time before the DNS records propagate."
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

DomainVerificationStatus.propTypes = {
  domain: PropTypes.object,
  onVerify: PropTypes.func
};

export default DomainVerificationStatus;
