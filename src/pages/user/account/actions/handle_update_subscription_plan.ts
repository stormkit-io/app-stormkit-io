import Api from "~/utils/api/Api";
import { History } from "history";
import { SubscriptionName } from "./fetch_subscriptions";

type HandleUpdateSubscriptionPlanProps = {
  api: Api;
  name: SubscriptionName;
  setError: (err: string | null) => void;
  setLoading: (val: boolean) => void;
  closeModal: () => void;
  history: History;
};

export const handleUpdateSubscriptionPlan = async ({
  api,
  name,
  history,
  setError,
  setLoading,
  closeModal
}: HandleUpdateSubscriptionPlanProps): Promise<void> => {
  setLoading(true);

  try {
    await api.put("user/subscription", { name });
    closeModal();
    history.push({ state: { subscription: Date.now() } });
    return;
  } catch (res) {
    if (res.status === 401) {
      setError(
        "Selected package is too small for current usage. " +
          "Please first remove some of your apps from your account to " +
          "continue with the package selection."
      );
    } else if (res.status === 402) {
      setError(
        "Seems like your payment method is missing. Please first provide a payment menthod below."
      );
    } else {
      setError(
        "Something wrong happened while updating your subscription. Please reach out to us using Discord or email."
      );
    }

    setLoading(false);
  }
};
