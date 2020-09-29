import React from "react";
import Link from "~/components/Link";

export const login = ({ loginOauth, updateState, init }) => async () => {
  const { accessToken } = await loginOauth();

  if (accessToken) {
    updateState({ requiresLogin: false });
    init();
  }
};

export const insertRepo = ({
  api,
  provider,
  history,
  setState,
  repo,
}) => () => {
  setState({ loadingInsert: repo, error: null });

  return api
    .post("/app", { provider, repo })
    .then(() => {
      history.push("/", { repoInsert: true });
    })
    .catch((res) => {
      if (res.status === 400) {
        return res.json().then((errors) => {
          this.setState({ errors, loadingInsert: false });
        });
      }

      if (res.status === 402) {
        return setState({
          loadingInsert: false,
          error: (
            <div className="flex-auto">
              You'll need to{" "}
              <Link
                to="/user/account"
                className="font-bold text-white hover:text-white hover:underline"
              >
                upgrade
              </Link>{" "}
              in order to create more applications.
            </div>
          ),
        });
      }

      return setState({
        loadingInsert: false,
        error: (
          <div>
            <h3 className="font-bold">Whoops!</h3>
            <p>
              Something went wrong, please get in touch with us to get help. You
              can see your contact options by clicking on the menu on the top
              right of the page.
            </p>
          </div>
        ),
      });
    });
};
