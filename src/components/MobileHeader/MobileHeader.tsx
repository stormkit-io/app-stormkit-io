import React, { useState } from "react";
import Button from "~/components/ButtonV2";
import Link from "~/components/Link";
import UserMenu from "~/components/UserMenu";

type SectionLink = { path: string; icon: string; text: string };

interface Item {
  sectionTitle: string;
  sectionLinks: SectionLink[];
}

interface Props {
  menuItems: Item[];
  RightButtons?: React.ReactNode;
}

const renderMenuItem = (
  item: SectionLink,
  setIsMenuOpen: (val: boolean) => void
) => {
  return (
    <Link
      key={item.path}
      to={item.path}
      onClick={() => setIsMenuOpen(false)}
      className="flex items-center p-3 px-5 border-b border-blue-20"
    >
      <span className={item.icon}></span>
      <span className="ml-4">{item.text}</span>
    </Link>
  );
};

const MobileHeader: React.FC<Props> = ({ RightButtons, menuItems: items }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header
        className="p-3 bg-black flex md:hidden justify-between items-center sticky top-0 z-50"
        style={{ minHeight: "64px" }}
      >
        <Button
          type="button"
          styled={false}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="bg-blue-50 rounded-full w-8 h-8 flex items-center justify-center"
        >
          <span className="text-gray-80 fas fa-bars text-xs" />
        </Button>
        {RightButtons}
      </header>
      {isMenuOpen && (
        <div className="fixed top-0 bottom-0 left-0 right-0 bg-blue-50 z-50 text-gray-80 overflow-y-auto mt-16">
          {items.map(item => (
            <div key={item.sectionTitle}>
              <h3 className="font-bold uppercase text-xs p-5 bg-blue-20">
                {item.sectionTitle}
              </h3>
              <div className="flex flex-col">
                {item.sectionLinks.map(i => renderMenuItem(i, setIsMenuOpen))}
              </div>
            </div>
          ))}
          <h3 className="font-bold uppercase text-xs p-5 bg-blue-20">User</h3>
          <div className="p-5">
            <UserMenu />
          </div>
        </div>
      )}
    </>
  );
};

export default MobileHeader;
