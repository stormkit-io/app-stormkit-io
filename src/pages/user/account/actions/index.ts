import { Subscription as Stype } from "./fetch_subscriptions";

export { handleRemovePaymentMethod } from "./handle_remove_payment_method";
export { useFetchSubscription } from "./fetch_subscriptions";
export { useFetchCards } from "./fetch_cards";
export { usePersonalAccessTokenState } from "./personal_access_token";
export type Subscription = Stype;
import api from "~/utils/api/Api";

export const deleteUser = async () => {
  return await api.delete(`/user`);
};
