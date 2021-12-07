import React, { useEffect, useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import Link from "~/components/Link";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBox";

interface Props {
  domain: Domain;
  onVerifyClick: (arg0: {
    setLoading: SetLoading;
    setError: SetError;
  }) => Promise<void>;
}

const DomainUsageStatus: React.FC<Props> = ({ domain, onVerifyClick }) => {
  const [retry, setRetry] = useState(0);
  const isVerified = domain.dns?.verified;
  const cert = domain?.tls;

  useEffect(() => {
    let unmounted = false;

    // Allow a bit time to issue a certificate.
    setTimeout(() => {
      if (cert === null && isVerified && !unmounted) {
        setRetry(retry + 1);

        onVerifyClick({
          setLoading: () => {
            // do nothing
          },
          setError: (e: null) => {
            // do nothing
          },
        });
      }
    }, 5000);

    return () => {
      unmounted = true;
    };
  }, [cert, isVerified, onVerifyClick]);

  if (!isVerified) {
    return null;
  }

  return (
    <TableRow>
      <TableCell className="w-1/4 align-top">TLS Settings</TableCell>
      <TableCell>
        {cert !== null ? (
          <TableContainer className="bg-white rounded">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Issuer</TableCell>
                  <TableCell>{cert?.issuer?.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Issued at</TableCell>
                  <TableCell>
                    {new Date(cert.startDate * 1000).toLocaleDateString("en", {
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                    })}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Valid until</TableCell>
                  <TableCell>
                    {new Date(cert.endDate * 1000).toLocaleDateString("en", {
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                    })}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Serial no</TableCell>
                  <TableCell>{cert.serialNo}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Signature Algorithm</TableCell>
                  <TableCell>{cert.signatureAlgorithm}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <>
            <InfoBox className="mb-4">
              For the TLS certificate to be issued, you have to publish a
              deployment in this environment.
            </InfoBox>
            {retry > 2 && (
              <InfoBox className="mb-4">
                Issueing certificate is taking longer than expected. Have you
                set the CNAME properly and published a deployment to this
                environment?
              </InfoBox>
            )}
            <div className="text-blue-40 flex items-center">
              <span className="fas fa-running mr-1" />
              Certificate is being issued, if it takes a while visit the domain:{" "}
              <Link
                to={`https://${domain.domainName}`}
                className="ml-1"
                secondary
              >
                {domain.domainName}
              </Link>{" "}
              <Spinner className="flex ml-2" primary width={6} height={6} />
            </div>
          </>
        )}
      </TableCell>
    </TableRow>
  );
};

export default DomainUsageStatus;
