import React, { useState } from "react";
import cn from "classnames";
import OutsideClick from "~/components/OutsideClick";

const FeedbackModal: React.FC = (): React.ReactElement => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <OutsideClick handler={() => setIsMenuOpen(false)}>
      <nav>
        <div>
          <button className="p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#f9e8e8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </button>
        </div>
        <span className="hidden">Menu</span>
        <section
          role="menu"
          className={cn(
            "flex flex-col absolute shadow-2xl p-8 rounded bg-white border border-black z-10",
            {
              hidden: !isMenuOpen,
            }
          )}
        >
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLScmM-GfJwab1Ajq0WOyM5whFSEZuJtOE4fzWPn94QfcPRY5Fg/viewform?embedded=true"
            width="640"
            height="407"
          ></iframe>
        </section>
      </nav>
    </OutsideClick>
  );
};

export default FeedbackModal;
