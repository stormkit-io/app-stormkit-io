import { useEffect, useState } from "react";

/**
 * Submits a request to the api. The user will be inserted to our referral
 * table, and from then on they start using stormkit directly. No token needed
 * as providers like github or bitbucket already take care of verifying a user.
 */
export const handleSubmit = ({ api, onRefer, setError, setLoading }) => ({
  displayName,
  provider,
}) => {
  if (!displayName) {
    return setError("Username is a required field.");
  }

  setLoading(true);

  api
    .post("/user/referral", { displayName, provider })
    .then(() => {
      setLoading(false);
      return onRefer?.({ displayName, provider, success: true });
    })
    .catch((e) => {
      if (e.status === 409) {
        return setError("This user seems like has already been invited.");
      }

      if (e.status === 400) {
        return setError("Username is invalid");
      }

      return setError(
        "Something unexpected occurred. Please try again and if the problem persists contact us from Discord or email."
      );
    });
};

export const useFetchList = ({ api }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    let unmounted = false;

    setLoading(true);

    api
      .fetch("/user/referrals")
      .then((res) => {
        if (unmounted !== true) {
          setLoading(false);
          setReferrals(res.referrals);
        }
      })
      .catch(() => {
        if (unmounted !== true) {
          setLoading(false);
          setError(
            "Something unexpected occurred. Please try again and if the problem persists contact us from Discord or email."
          );
        }
      });

    return () => {
      unmounted = true;
    };
  }, [api]);

  return { referrals, loading, error };
};
