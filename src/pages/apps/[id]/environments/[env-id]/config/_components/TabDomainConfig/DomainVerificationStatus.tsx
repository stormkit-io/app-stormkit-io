import React, { useState } from "react";
import Button from "~/components/ButtonV2";
import InfoBox from "~/components/InfoBoxV2";
import { fetchDomainsInfo } from "./actions";

interface Props {
  domain: Domain;
  app: App;
  environment: Environment;
  setDomainsInfo: (val: Domain[]) => void;
}

const DomainVerificationStatus: React.FC<Props> = ({
  app,
  environment,
  domain,
  setDomainsInfo,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);
  const isVerified = domain.dns?.verified;

  if (!domain || !domain.domainName) {
    return <></>;
  }

  return (
    <div className="">
      <div className="flex items-center mb-4 border-b border-blue-20 mt-4">
        <div className="bg-black p-4 md:min-w-56">
          Domain verification status
        </div>
        <div className="p-4">
          {isVerified ? (
            <span className="text-green-50">
              <span className="fas fa-check-circle mr-1" /> Verified
            </span>
          ) : (
            <span className="text-blue-40">
              <span className="fas fa-running mr-1" /> Pending verification
            </span>
          )}
        </div>
      </div>
      {!isVerified && (
        <>
          {error && (
            <InfoBox type={InfoBox.ERROR} className="my-4">
              {error}
            </InfoBox>
          )}
          <InfoBox baseline>
            <p className="py-4">
              Login to your external DNS provider and create the following TXT
              record.
            </p>
            <div className="text-gray-80 w-full">
              <div className="flex items-center mb-4 border-b border-blue-20">
                <div className="bg-black py-4 md:min-w-56">
                  TXT Record Name/Host
                </div>
                <div className="p-4">{domain.dns.txt.name}</div>
              </div>
              <div className="flex items-center border-b border-blue-20">
                <div className="bg-black py-4 md:min-w-56">
                  TXT Record Value
                </div>
                <div className="p-4">{domain.dns.txt.value}</div>
              </div>
              <div className="flex justify-end mt-4 mb-2">
                <Button
                  type="button"
                  category="button"
                  loading={loading}
                  onClick={() => {
                    setError(null);
                    setLoading(true);
                    fetchDomainsInfo({
                      app,
                      environment,
                    })
                      .then(val => {
                        setDomainsInfo([val]);

                        if (!val?.dns?.verified) {
                          setError(
                            `TXT records still do not match. Please give it a bit time before the DNS records propagate. The record we are trying to match is: ${domain.dns.txt.lookup}`
                          );
                        }
                      })
                      .finally(() => {
                        setLoading(false);
                      });
                  }}
                >
                  Verify now
                </Button>
              </div>
            </div>
          </InfoBox>
        </>
      )}
    </div>
  );
};

export default DomainVerificationStatus;
