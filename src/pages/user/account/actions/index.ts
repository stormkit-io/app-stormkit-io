import { Subscription as Stype } from "./fetch_subscriptions";

export {
  useFetchSubscription,
  fetchCheckoutEndpoint,
} from "./fetch_subscriptions";

export { usePersonalAccessTokenState } from "./personal_access_token";
export type Subscription = Stype;
import api from "~/utils/api/Api";

export const deleteUser = async () => {
  return await api.delete(`/user`);
};
