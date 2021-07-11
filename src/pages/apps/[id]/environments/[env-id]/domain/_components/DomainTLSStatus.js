import React from "react";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import Spinner from "~/components/Spinner";
import { useCertificatePoll } from "../actions";

const DomainUsageStatus = ({ domain, onVerify }) => {
  const isVerified = domain.dns?.verified;
  const isInUse = domain.dns?.domainInUse;
  const cert = domain?.tls;
  useCertificatePoll({ cert, isInUse, onVerify });

  if (!isVerified || !isInUse) {
    return null;
  }

  return (
    <TableRow>
      <TableCell className="w-1/4 align-top">TLS Settings</TableCell>
      <TableCell>
        {cert !== null ? (
          <>
            <div>
              <span className="text-green-50">
                <span className="fas fa-check-circle" /> Certificate issued
                successfully
              </span>
            </div>
            <TableContainer className="bg-white rounded mt-4">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Issuer</TableCell>
                    <TableCell>{cert.issuer.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Issued at</TableCell>
                    <TableCell>
                      {new Date(cert.startDate * 1000).toLocaleDateString(
                        "en",
                        {
                          year: "numeric",
                          month: "long",
                          day: "2-digit",
                        }
                      )}
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
          </>
        ) : (
          <div className="text-blue-40 flex items-center">
            <span className="fas fa-running mr-1" />
            Certificate is being issued{" "}
            <Spinner className="flex ml-2" primary width={6} height={6} />
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};

DomainUsageStatus.propTypes = {
  domain: PropTypes.object,
  onVerify: PropTypes.func,
};

export default DomainUsageStatus;
