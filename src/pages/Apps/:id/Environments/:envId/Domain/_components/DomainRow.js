import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import DotDotDot from "~/components/DotDotDot";
import DomainVerificationStatus from "./DomainVerificationStatus";
import DomainUsageStatus from "./DomainUsageStatus";
import DomainTLSStatus from "./DomainTLSStatus";

const DomainRow = ({ domain, isLastRow, onDelete, onVerify, app }) => {
  return (
    <div className={cn("text-xs", { "mb-4": !isLastRow })}>
      <div className="p-8 border border-solid border-gray-85 rounded-tl rounded-tr flex items-center bg-white">
        <div className="flex-auto">
          <h2 className="mb-1 text-base font-bold">{domain.domainName}</h2>
        </div>
        <DotDotDot aria-label="Expand options">
          <DotDotDot.Item
            aria-label="Delete domain"
            onClick={() => onDelete(domain.domainName)}
          >
            <span className="fas fa-times text-red-50 mr-2" />
            Delete
          </DotDotDot.Item>
        </DotDotDot>
      </div>
      <TableContainer className="bg-gray-90 rounded-br rounded-bl px-4">
        <Table aria-label="Domain configuration">
          <TableBody>
            <DomainVerificationStatus domain={domain} onVerify={onVerify} />
            <DomainUsageStatus domain={domain} app={app} onVerify={onVerify} />
            <DomainTLSStatus domain={domain} onVerify={onVerify} />
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

DomainRow.propTypes = {
  app: PropTypes.object,
  domain: PropTypes.object,
  isLastRow: PropTypes.bool,
  onDelete: PropTypes.func,
};

export default DomainRow;
