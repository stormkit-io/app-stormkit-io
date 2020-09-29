import { PureComponent } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

export default class OutsideClick extends PureComponent {
  static propTypes = {
    handler: PropTypes.func.isRequired
  };

  componentDidMount() {
    document.addEventListener("click", this.handleClick);
  }

  componentWillUnmount() {
    if (typeof document !== "undefined") {
      document.removeEventListener("click", this.handleClick);
    }
  }

  handleClick = event => {
    const root = ReactDOM.findDOMNode(this);
    const { handler } = this.props;

    if (root && !root.contains(event.target)) {
      handler(event);
    }
  };

  render() {
    return this.props.children;
  }
}
