import Api from "~/utils/api/Api";
import { History } from "history";

type RemoveCardProps = {
  api: Api;
  history: History;
  cardId: string;
  setError: (value: string | null) => void;
  setLoading: (value: boolean) => void;
};

export const removeCard = async ({
  api,
  history,
  cardId,
  setError,
  setLoading,
}: RemoveCardProps): Promise<void> => {
  try {
    await api.delete("/user/subscription/card", { cardId });
    setLoading(false);
    history.push({ state: { cards: Date.now() } });
  } catch (e) {
    setLoading(false);

    if (e.status === 401) {
      return setError(
        "Please downgrade your subscription to free plan in order to remove a card."
      );
    } else {
      console.log(e.message || e);
      return setError(
        "Something went wrong while removing card. Please try again later."
      );
    }
  }
};
