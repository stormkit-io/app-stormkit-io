import React, { PureComponent, ReactNode, SyntheticEvent } from "react";
import { createPortal } from "react-dom";
import cn from "classnames";
import ModalContext from "./Modal.context";
import { timeout } from "./constants";
import "./Modal.css";

let _root: HTMLDivElement | undefined;

type Props = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  fullScreen?: boolean;
  className?: string;
};

class Modal extends PureComponent<Props> {
  static Context = ModalContext;
  static timeout = timeout;
  isMouseClicked = false;
  isAboutToClose = false;

  // Initially we assume the state is always that it is closed gracefully.
  isClosedGracefully = !this.props.isOpen;

  onEscape = (e: KeyboardEvent): void => {
    if (e.key === "Escape") {
      this.isMouseClicked = true;
      this.gracefulClose();
    }
  };

  componentDidUpdate({ isOpen: oldIsOpen }: Props): void {
    const newIsOpen = this.props.isOpen;

    if (newIsOpen) {
      this.isClosedGracefully = false;
      this.isMouseClicked = false;

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

  componentWillUnmount(): void {
    window.removeEventListener("keyup", this.onEscape);
  }

  gracefulClose = (e?: SyntheticEvent<HTMLDivElement, MouseEvent>): void => {
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

  render(): ReactNode {
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
          "opacity-0": this.isAboutToClose
        })}
        onMouseUp={e => this.gracefulClose(e)}
        onMouseDown={() => {
          this.isMouseClicked = true;
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
