import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const WindowContext = ({ render }) => {
  const [height, setHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const listener = () => {
      setHeight(window.innerHeight);
      setWidth(window.innerWidth);
    };

    listener(); // Force invoke
    window.addEventListener("resize", listener);

    return () => {
      window.removeEventListener("resize", listener);
    };
  }, []);

  return render({ height, width });
};

WindowContext.propTypes = {
  render: PropTypes.func
};

export default WindowContext;
