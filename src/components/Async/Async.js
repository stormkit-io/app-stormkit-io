import React, { Component } from "react";
import styled, { keyframes } from "styled-components";

const config = {};

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const Fader = styled.div`
  animation: ${fadeIn} 1s;
  min-width: 100%;
`;

const Async = (getComponent) => {
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
          <Fader>
            <Component {...this.props} />
          </Fader>
        );
      }

      return <Loader {...props} />;
    }
  }

  return AsyncComponent;
};

export default Object.assign(Async, {
  configure: (c) => Object.assign(config, c),
});
