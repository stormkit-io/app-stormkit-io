import { ReactNode, PureComponent } from "react";
import ReactDOM from "react-dom";

interface Props {
  handler: (arg0: any) => void;
  children: React.ReactNode;
}

class OutsideClick extends PureComponent<Props, any> {
  componentDidMount() {
    document.addEventListener("click", this.handleClick);
  }

  componentWillUnmount() {
    if (typeof document !== "undefined") {
      document.removeEventListener("click", this.handleClick);
    }
  }

  handleClick = (event: any) => {
    const root = ReactDOM.findDOMNode(this);
    const { handler } = this.props;

    if (root && !root.contains(event.target)) {
      handler(event);
    }
  };

  render(): ReactNode {
    return this.props.children;
  }
}

export default OutsideClick;
