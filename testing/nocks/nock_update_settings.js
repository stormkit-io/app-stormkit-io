import nock from "nock";
import * as data from "../data";

export const mockUpdateSettingsCall = ({
  payload,
  status = 200,
  response = data.mockDeploymentResponse()
}) =>
  nock(process.env.API_DOMAIN)
    .put("/app", payload)
    .reply(status, response);
