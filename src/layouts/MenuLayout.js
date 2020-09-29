import React from "react";
import PropTypes from "prop-types";

const MenuLayout = ({ menu, children }) => {
  return (
    <main className="flex min-h-screen m-auto items-center app-layout">
      <div className="w-64 fixed left-0 top-0 bottom-0">{menu}</div>
      <div className="flex flex-col flex-auto w-full ml-64 px-4 min-h-screen">
        {children}
      </div>
    </main>
  );
};

MenuLayout.propTypes = {
  menu: PropTypes.node,
  children: PropTypes.node
};

export default MenuLayout;
