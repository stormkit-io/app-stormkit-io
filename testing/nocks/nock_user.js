import nock from "nock";
import * as data from "../data";

export const mockFetchUser = ({
  status = 200,
  response = data.mockUserResponse(),
}) => nock(process.env.API_DOMAIN).get("/user").reply(status, response);
