import nock from "nock";

const endpoint = process.env.API_DOMAIN || "localhost";

interface MockDomainInsertProps {
  appId: string;
  envName: string;
  domain: string;
  status?: number;
  response?: { ok: boolean };
}

export const mockDomainInsert = ({
  appId,
  envName,
  domain,
  status = 200,
  response = { ok: true },
}: MockDomainInsertProps) =>
  nock(endpoint)
    .put(`/app/env/domain`, { appId: appId, env: envName, domain })
    .reply(status, response);

interface MockFetchDomainsInfoProps {
  appId: string;
  envName: string;
  status?: number;
  response: Domain;
}

export const mockFetchDomainsInfo = ({
  appId,
  envName,
  status = 200,
  response,
}: MockFetchDomainsInfoProps) =>
  nock(endpoint)
    .get(`/app/${appId}/envs/${envName}/lookup`)
    .reply(status, response);

interface MockDeleteDomainProps {
  appId: string;
  envName: string;
  domainName: string;
  status?: number;
  response: { ok: boolean };
}

export const mockDeleteDomain = ({
  appId,
  envName,
  domainName,
  status = 200,
  response = { ok: true },
}: MockDeleteDomainProps) => {
  return nock(endpoint)
    .delete("/app/env/domain", {
      appId,
      env: envName,
      domain: domainName,
    })
    .reply(status, response);
};
