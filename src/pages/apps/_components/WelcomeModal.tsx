import React from "react";
import { LocalStorage } from "~/utils/storage";
import Modal from "~/components/Modal";
import Button from "~/components/Button";

interface Props {
  isOpen: boolean;
  welcomeModalId: string;
  toggleModal: (val: boolean) => void;
}

const Welcome: React.FC<Props> = ({
  isOpen,
  toggleModal,
  welcomeModalId,
}): React.ReactElement => {
  const close = () => {
    toggleModal(false);
    LocalStorage.set(welcomeModalId, "shown");
  };

  return (
    <Modal isOpen={isOpen} onClose={close} className="max-w-screen-sm">
      <h1 className="font-bold text-xl text-center mb-8 mt-12 lg:mt-0">
        Welcome to Stormkit 🎉
      </h1>
      <Button
        as="div"
        href="https://discord.gg/6yQWhyY"
        className="flex justify-between shadow w-full bg-gray-90 hover:bg-gray-70 p-8 mb-8"
      >
        <div className="text-3xl mr-8">
          <i className="fa-brands fa-discord" style={{ color: "#5865F2" }}></i>
        </div>
        <div className="flex-grow">
          <h2 className="text-black mb-2 font-bold">
            Join our Discord community
          </h2>
          <p className="text-sm text-black">
            Ask questions and join discussions.
          </p>
        </div>
        <span className="fas fa-chevron-right text-base ml" />
      </Button>
      <Button
        as="div"
        href="https://twitter.com/stormkitio"
        className="flex justify-between shadow w-full bg-gray-90 hover:bg-gray-70 p-8"
      >
        <div className="text-3xl mr-8">
          <i className="fa-brands fa-twitter" style={{ color: "#00acee" }}></i>
        </div>
        <div className="flex-grow">
          <h2 className="text-black mb-2 font-bold">Follow us on Twitter</h2>
          <p className="text-sm text-black">
            Stay tuned about latest developments on Stormkit.
          </p>
        </div>
        <span className="fas fa-chevron-right text-base ml" />
      </Button>
      <div className="lg:hidden mt-8 flex justify-center w-full">
        <Button secondary onClick={close}>
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default Welcome;
