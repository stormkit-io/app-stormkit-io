import React, { PureComponent } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import cn from "classnames";
import Button from "~/components/Button";
import ModalContext from "./Modal.context";
import { timeout } from "./constants";
import "./Modal.css";

let _root;

class Modal extends PureComponent {
  static Context = ModalContext;
  static timeout = timeout;

  static propTypes = {
    children: PropTypes.node,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    margin: PropTypes.string,
    fullScreen: PropTypes.bool,
  };

  // Initially we assume the state is always that it is closed gracefully.
  isClosedGracefully = !this.props.isOpen;

  componentDidUpdate({ isOpen: oldIsOpen }) {
    const newIsOpen = this.props.isOpen;

    if (newIsOpen) {
      this.isClosedGracefully = false;
      this.isMouseClicked = false;

      this.onEscape = (e) => {
        if (e.key === "Escape") {
          this.isMouseClicked = true;
          this.gracefulClose();
        }
      };

      window.addEventListener("keyup", this.onEscape);
    }

    if (oldIsOpen && !newIsOpen) {
      this.isAboutToClose = true;
      this.forceUpdate();

      setTimeout(() => {
        this.isAboutToClose = false;
        this.isClosedGracefully = true;
        this.forceUpdate();
        window.removeEventListener("keyup", this.onEscape);
      }, timeout);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.onEscape);
  }

  gracefulClose = (e) => {
    if (this.isMouseClicked !== true) {
      return;
    }

    e && e.preventDefault();
    this.isAboutToClose = true;
    this.isClosedGracefully = true;
    this.forceUpdate();

    setTimeout(() => {
      this.props.onClose && this.props.onClose();
      this.isAboutToClose = false;
      this.isClosedGracefully = true;
    }, timeout);
  };

  render() {
    const { children, isOpen, className } = this.props;

    if (isOpen !== true && this.isClosedGracefully) {
      return null;
    }

    if (!_root) {
      document.body.appendChild((_root = document.createElement("div")));
    }

    return createPortal(
      <div
        className={cn("modal-overlay fixed inset-0 bg-black-o-75 z-50", {
          "opacity-0": this.isAboutToClose,
        })}
        onMouseUp={this.gracefulClose}
        onMouseDown={() => {
          this.isMouseClicked = true;
        }}
      >
        <div className="flex items-center w-full h-full">
          <div
            className={cn(
              "modal-content flex-auto md:max-w-1/2 sm:m-12 md:m-auto h-full sm:h-auto w-full sm:w-auto",
              className
            )}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Button
              styled={false}
              className="absolute top-0 right-0 -mt-4 -mr-4"
              onMouseUp={this.gracefulClose}
              onMouseDown={() => {
                this.isMouseClicked = true;
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
