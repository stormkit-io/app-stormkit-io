import React, { useState } from "react";
import { useNavigate } from "react-router";
import PropTypes from "prop-types";
import cn from "classnames";
import InfoBox from "~/components/InfoBox";
import Button from "~/components/Button";
import Spinner from "~/components/Spinner";
import { insertRepo } from "../actions";
import { CSSTransition, TransitionGroup } from "react-transition-group";

const RepoList = ({
  api,
  loading,
  repositories,
  provider,
  hasNextPage,
  onNextPageClick,
}) => {
  const navigate = useNavigate();
  const [state, setState] = useState({ error: null, loadingInsert: null });

  if (loading && repositories.length === 0) {
    return (
      <div className="mt-4 flex w-full justify-center">
        <Spinner primary />
      </div>
    );
  }

  return (
    <>
      {state.error && (
        <InfoBox type={InfoBox.ERROR} toaster dismissable>
          {state.error}
        </InfoBox>
      )}
      {repositories.length > 0 ? (
        <TransitionGroup>
          {repositories.map(r => (
            <CSSTransition
              timeout={350}
              classNames="fade-in"
              unmountOnExit
              appear
              key={r.id || r.name}
            >
              <Button
                as="div"
                styled={false}
                className="flex items-center w-full p-4 hover:bg-gray-75 rounded cursor-pointer"
                onClick={() => {
                  insertRepo({
                    repo: r.full_name || r.path_with_namespace,
                    api,
                    provider,
                    setState,
                  }).then(app => {
                    navigate(`/apps/${app.id}`);
                  });
                }}
              >
                <div>
                  <span
                    className={`fab fa-${provider} text-4xl text-${provider} mr-4 rounded-full`}
                    alt={`${provider}-logo`}
                  />
                </div>
                <div className="flex-auto text-sm font-bold">{r.name}</div>
                <div className="uppercase text-xs font-bold text-pink-50 items-center inline-flex">
                  <span
                    className={cn({
                      invisible:
                        state.loadingInsert ===
                        (r.full_name || r.path_with_namespace),
                    })}
                  >
                    Select
                  </span>
                  {state.loadingInsert ===
                    (r.full_name || r.path_with_namespace) && (
                    <Spinner primary width={6} height={6} />
                  )}
                </div>
              </Button>
            </CSSTransition>
          ))}
        </TransitionGroup>
      ) : (
        <div>
          <InfoBox type={InfoBox.ERROR} className="mb-12">
            We could not fetch any repository. Please make sure Stormkit has the
            necessary permissions granted.
          </InfoBox>
        </div>
      )}
      {hasNextPage && (
        <div className="text-center mt-12">
          <Button secondary loading={loading} onClick={onNextPageClick}>
            Load more
          </Button>
        </div>
      )}
    </>
  );
};

RepoList.propTypes = {
  api: PropTypes.object,
  loading: PropTypes.bool,
  provider: PropTypes.string,
  repositories: PropTypes.array,
  hasNextPage: PropTypes.bool,
  onNextPageClick: PropTypes.func,
};

export default RepoList;
