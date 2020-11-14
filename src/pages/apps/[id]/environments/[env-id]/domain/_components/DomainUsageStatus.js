import React, { useState } from "react";
import PropTypes from "prop-types";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Button from "~/components/Button";
import InfoBox, { ERROR } from "~/components/InfoBox";

const DomainUsageStatus = ({ domain, app, onVerify }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const isVerified = domain.dns?.verified;
  const isInUse = domain.dns?.domainInUse;

  if (!isVerified) {
    return null;
  }

  return (
    <TableRow>
      <TableCell className="w-1/4 border-b border-solid border-gray-83 align-top">
        Nameservers
      </TableCell>
      <TableCell className="border-b border-solid border-gray-83">
        {isInUse ? (
          <span className="text-green-50">
            <span className="fas fa-check-circle" /> Domain is in use and
            pointing to our servers
          </span>
        ) : (
          <div>
            <div>
              <span className="text-blue-40">
                <span className="fas fa-running" /> Domain is not yet pointing
                to our servers
              </span>
            </div>
            <div className="mt-4">
              Your domain does not seem to be in use. Point your DNS settings to
              Stormkit to start using your domain. Allow up to 24 hours for
              changes to propagate.
              <h4 className="font-bold mt-4 mb-2">
                Recommended: Setting up CNAME
              </h4>
              Create a CNAME record with the following value:{" "}
              <span className="font-bold">{app.displayName}.stormkit.dev</span>
              <h4 className="font-bold mt-4 mb-2">
                Alternative: Setting up A Record
              </h4>
              If for some reason you can't use a CNAME record, you can use the
              IP of our Load Balancer.{" "}
              <span className="font-bold">35.156.69.62</span>
            </div>
            {error && (
              <InfoBox type={ERROR} className="mt-4">
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
                    setError,
                  }).then(() => {
                    if (isInUse === false) {
                      setError(
                        "DNS records are still not pointing to our servers. Please give it a bit time before the changes propagate."
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

DomainUsageStatus.propTypes = {
  domain: PropTypes.object,
  app: PropTypes.object,
  onVerify: PropTypes.func,
};

export default DomainUsageStatus;
