import React, { PureComponent, ReactNode } from "react";
import { createPortal } from "react-dom";
import cn from "classnames";
import Button from "~/components/Button";
import ModalContext from "./Modal.context";
import { timeout } from "./constants";
import "./Modal.css";

let _root: any;

type Props = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  fullScreen?: boolean;
  className: string;
}

type State = {
  isMouseClicked: boolean;
  isAboutToClose: boolean;
  isClosedGracefully: boolean;
}

class Modal extends PureComponent<Props, State> {
  static Context = ModalContext;
  static timeout = timeout;

  state = {
    isMouseClicked: false,
    isAboutToClose: false,

    // Initially we assume the state is always that it is closed gracefully.
    isClosedGracefully: !this.props.isOpen
  }

  onEscape = (e: KeyboardEvent): void => {
    if (e.key === "Escape") {
      this.setState({
        isMouseClicked: true
      });
      this.gracefulClose(e);
    }
  };

  componentDidUpdate({ isOpen: oldIsOpen }: any): void {
    const newIsOpen = this.props.isOpen;

    if (newIsOpen) {
      this.setState({
        isClosedGracefully: false,
        isMouseClicked: false
      });

      window.addEventListener("keyup", this.onEscape);
    }

    if (oldIsOpen && !newIsOpen) {
      this.setState({
        isAboutToClose: true
      });
      this.forceUpdate();

      setTimeout(() => {
        this.setState({
          isAboutToClose: false,
          isClosedGracefully: true
        });

        this.forceUpdate();
        window.removeEventListener("keyup", this.onEscape);
      }, timeout);
    }
  }

  componentWillUnmount(): void {
    window.removeEventListener("keyup", this.onEscape);
  }

  gracefulClose = (e: any): void => {
    if (this.state.isMouseClicked !== true) {
      return;
    }

    e && e.preventDefault();

    this.setState({
      isAboutToClose: true,
      isClosedGracefully: true
    });

    this.forceUpdate();

    setTimeout(() => {
      this.props.onClose && this.props.onClose();
      this.setState({
        isAboutToClose: false,
        isClosedGracefully: true
      });
    }, timeout);
  };

  render(): ReactNode {
    const { children, isOpen, className } = this.props;
    const { isClosedGracefully, isAboutToClose } = this.state;

    if (isOpen !== true && isClosedGracefully) {
      return null;
    }

    if (!_root) {
      document.body.appendChild((_root = document.createElement("div")));
    }

    return createPortal(
      <div
        className={cn("modal-overlay fixed inset-0 bg-black-o-75 z-50", {
          "opacity-0": isAboutToClose
        })}
        onMouseUp={(e) => this.gracefulClose(e)}
        onMouseDown={() => {
          this.setState({ isMouseClicked: true });
        }}
      >
        <div className="flex items-center w-full h-full">
          <div
            className={cn(
              "modal-content flex-auto sm:m-12 md:m-auto h-full sm:h-auto w-full sm:w-auto",
              className
            )}
            onClick={e => e.stopPropagation()}
            onMouseDown={e => e.stopPropagation()}
          >
            <Button
              styled={false}
              className="absolute top-0 right-0 -mt-4 -mr-4"
              onMouseUp={(e) => this.gracefulClose(e)}
              onMouseDown={() => {
                this.setState({ isMouseClicked: true });
              }}
            >
              <i className="fas fa-times" />
            </Button>
            <div
              className="bg-white sm:rounded-lg overflow-y-auto p-12 h-full w-full"
              style={{ maxHeight: "90vh" }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>,
      _root
    );
  }
}

export default Modal;
