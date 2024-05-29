import api from "~/utils/api/Api";

export { fetchCheckoutEndpoint } from "./fetch_subscriptions";
export { usePersonalAccessTokenState } from "./personal_access_token";

export const deleteUser = async () => {
  return await api.delete(`/user`);
};
