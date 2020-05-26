import React, { Component } from "react";

export default (WrappedComponent, Layout, layoutProps = {}) => {
  const name = WrappedComponent.displayName || WrappedComponent.name;

  return class withLayout extends Component {
    static displayName = `Layout(${name})`;

    render() {
      return (
        <Layout {...layoutProps}>
          <WrappedComponent {...this.props} />
        </Layout>
      );
    }
  };
};
