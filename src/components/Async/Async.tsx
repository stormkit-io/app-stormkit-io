import React, { Component } from "react";
import "./Async.css";

interface Config {
  Loader?: React.FC;
  props?: Record<string, unknown>;
}

const config: Config = {};

const Async = (getComponent: () => Promise<{ default: unknown }>) => {
  class AsyncComponent extends Component {
    static Component: React.FC | null = null;

    static Import = async () => {
      const Component = await getComponent();
      AsyncComponent.Component = Component.default as React.FC;
      return Component.default;
    };

    unmounted = false;
    state = { Component: AsyncComponent.Component };

    async componentDidMount() {
      if (!this.state.Component) {
        const Component = await AsyncComponent.Import();

        if (this.unmounted !== true) {
          this.setState({ Component });
        }
      }
    }

    componentWillUnmount() {
      this.unmounted = true;
    }

    render() {
      const { Component } = this.state;
      const { Loader, props } = config;

      if (Component) {
        return (
          <div className="w-full faded duration-1000">
            <Component {...this.props} />
          </div>
        );
      }

      if (!Loader) {
        throw new Error(
          "[Async]: Missing a loader. Please use Async.configure to use a loading component."
        );
      }

      return <Loader {...props} />;
    }
  }

  return AsyncComponent;
};

export default Object.assign(Async, {
  configure: (c: Record<string, unknown>) => Object.assign(config, c),
});
