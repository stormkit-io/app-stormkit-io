import React, { Component } from "react";
import "./Async.css";

const config = {};

const Async = getComponent => {
  class AsyncComponent extends Component {
    static Component = null;

    static Import = async () => {
      const Component = await getComponent();
      AsyncComponent.Component = Component.default;
      return Component.default;
    };

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

      return <Loader {...props} />;
    }
  }

  return AsyncComponent;
};

export default Object.assign(Async, {
  configure: c => Object.assign(config, c)
});
