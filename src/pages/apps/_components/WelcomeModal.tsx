import React from "react";
import { LocalStorage } from "~/utils/storage";
import Modal from "~/components/Modal";
import Button from "~/components/ButtonV2";
import Container from "~/components/Container";

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
    <Modal open={isOpen} onClose={close}>
      <Container className="p-4 md:p-8 justify-center h-full md:h-auto flex md:block flex-col md:flex-none">
        <h1 className="font-bold text-xl md:text-3xl text-center mb-8">
          Welcome to Stormkit 🎉
        </h1>
        <Button
          styled={false}
          category="button"
          type="button"
          href="https://discord.gg/6yQWhyY"
          className="flex justify-between items-center shadow w-full p-4 md:p-8 bg-blue-10 hover:bg-black text-gray-80 mb-8"
        >
          <span className="text-3xl mr-8">
            <i
              className="fa-brands fa-discord"
              style={{ color: "#5865F2" }}
            ></i>
          </span>
          <span className="flex flex-col flex-grow">
            <span className="font-bold">Join our Discord community</span>
            <span className="text-sm">Ask questions and join discussions.</span>
          </span>
          <span className="fas fa-chevron-right text-base ml" />
        </Button>
        <Button
          styled={false}
          type="button"
          category="button"
          href="https://twitter.com/stormkitio"
          className="flex justify-between items-center shadow w-full p-4 md:p-8 bg-blue-10 hover:bg-black text-gray-80"
        >
          <span className="text-3xl mr-8">
            <i
              className="fa-brands fa-twitter"
              style={{ color: "#00acee" }}
            ></i>
          </span>
          <span className="flex flex-col flex-grow">
            <span className="font-bold">Follow us on Twitter</span>
            <span className="text-sm">
              Stay tuned about latest developments on Stormkit.
            </span>
          </span>
          <span className="fas fa-chevron-right text-base ml" />
        </Button>
        <div className="mt-8 flex justify-end w-full">
          <Button type="button" category="button" onClick={close}>
            Close
          </Button>
        </div>
      </Container>
    </Modal>
  );
};

export default Welcome;
