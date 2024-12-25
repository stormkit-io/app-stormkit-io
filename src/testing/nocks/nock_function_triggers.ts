import nock from "nock";

const endpoint = process.env.API_DOMAIN || "";

interface MockFetchFunctionTriggersProps {
  appId: string;
  envId: string;
  status?: number;
  response: { triggers: FunctionTrigger[] };
}

export const mockFetchFunctionTriggers = ({
  appId,
  envId,
  status = 200,
  response = { triggers: [] },
}: MockFetchFunctionTriggersProps) => {
  return nock(endpoint)
    .get(`/apps/triggers?appId=${appId}&envId=${envId}`)
    .reply(status, response);
};

interface mockDeleteFunctionTriggerProps {
  appId: string;
  envId: string;
  tfid: string;
}

export const mockDeleteFunctionTrigger = ({
  appId,
  envId,
  tfid,
}: mockDeleteFunctionTriggerProps) => {
  return nock(endpoint)
    .delete(`/apps/trigger?triggerId=${tfid}&appId=${appId}&envId=${envId}`)
    .reply(200, { ok: true });
};

interface MockUpdateFunctionTriggerProps {
  tfid: string;
  appId: string;
  envId: string;
  status: boolean;
  cron: string;
  options: any;
}

export const mockUpdateFunctionTrigger = ({
  tfid,
  appId,
  envId,
  status,
  cron,
  options,
}: MockUpdateFunctionTriggerProps) => {
  return nock(endpoint)
    .patch(`/apps/trigger`, {
      id: tfid,
      envId,
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
    .post(`/apps/trigger`, {
      appId,
      envId,
      status,
      cron,
      options,
    })
    .reply(201, { ok: true });
};

interface MockFetchTriggerLogsProps {
  appId: string;
  envId: string;
  triggerId: string;
  status?: number;
  response: { logs?: TriggerLog[] };
}

export const mockFetchTriggerLogs = ({
  appId,
  envId,
  triggerId,
  status = 200,
  response = {},
}: MockFetchTriggerLogsProps) => {
  return nock(endpoint)
    .get(
      `/apps/trigger/logs?appId=${appId}&envId=${envId}&triggerId=${triggerId}`
    )
    .reply(status, response);
};

interface mockDeleteFunctionTriggerProps {
  appId: string;
  tfid: string;
}
