import nock from "nock";

const endpoint = process.env.API_DOMAIN || "";

interface MockFetchFunctionTriggersProps {
  appId: string;
  envId: string;
  status?: number;
  response: FunctionTrigger[];
}

export const mockFetchFunctionTriggers = ({
  appId,
  envId,
  status = 200,
  response = [],
}: MockFetchFunctionTriggersProps) => {
  return nock(endpoint)
    .get(`/apps/${appId}/envs/${envId}/function-triggers`)
    .reply(status, response);
};

interface mockDeleteFunctionTriggerProps {
  appId: string;
  tfid: string;
}

export const mockDeleteFunctionTrigger = ({
  appId,
  tfid,
}: mockDeleteFunctionTriggerProps) => {
  return nock(endpoint)
    .delete(`/apps/function-trigger/${tfid}`, { appId })
    .reply(200, { ok: true });
};

interface MockUpdateFunctionTriggerProps {
  tfid: string;
  appId: string;
  status: boolean;
  cron: string;
  options: any;
}

export const mockUpdateFunctionTrigger = ({
  tfid,
  appId,
  status,
  cron,
  options,
}: MockUpdateFunctionTriggerProps) => {
  return nock(endpoint)
    .patch(`/apps/function-trigger`, {
      id: tfid,
      appId,
      status,
      cron,
      options,
    })
    .reply(201, { ok: true });
};

interface MockCreateFunctionTriggerProps {
  appId: string;
  envId: string;
  status: boolean;
  cron: string;
  options: any;
}

export const mockCreateFunctionTrigger = ({
  appId,
  envId,
  status,
  cron,
  options,
}: MockCreateFunctionTriggerProps) => {
  return nock(endpoint)
    .post(`/apps/function-trigger`, {
      appId,
      envId,
      status,
      cron,
      options,
    })
    .reply(201, { ok: true });
};
