import nock from "nock";

const endpoint = process.env.API_DOMAIN || "localhost";

interface MockDomainsFetchProps {
  appId: string;
  envId: string;
  status?: number;
  response: { domains: Domain[] };
}

export const mockFetchDomains = ({
  appId,
  envId,
  status,
  response,
}: MockDomainsFetchProps) =>
  nock(endpoint)
    .get(`/domains?appId=${appId}&envId=${envId}`)
    .reply(status, response);

interface MockDomainInsertProps {
  appId: string;
  envId: string;
  domain: string;
  status?: number;
  response?: { ok: boolean };
}

export const mockDomainInsert = ({
  appId,
  envId,
  domain,
  status = 200,
  response = { ok: true },
}: MockDomainInsertProps) =>
  nock(endpoint)
    .post(`/domains`, { appId, envId, domain })
    .reply(status, response);

interface MockFetchDomainsInfoProps {
  appId: string;
  envId: string;
  domainId: string;
  status?: number;
  response: any;
}

export const mockFetchDomainsInfo = ({
  appId,
  envId,
  domainId,
  status = 200,
  response,
}: MockFetchDomainsInfoProps) =>
  nock(endpoint)
    .get(`/domains/lookup?appId=${appId}&envId=${envId}&domainId=${domainId}`)
    .reply(status, response);

interface MockDeleteDomainProps {
  appId: string;
  envId: string;
  domainId: string;
  status?: number;
  response: { ok: boolean };
}

export const mockDeleteDomain = ({
  appId,
  envId,
  domainId,
  status = 200,
  response = { ok: true },
}: MockDeleteDomainProps) => {
  return nock(endpoint)
    .delete(`/domains?appId=${appId}&domainId=${domainId}&envId=${envId}`)
    .reply(status, response);
};
