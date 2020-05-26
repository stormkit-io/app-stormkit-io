import { Children, cloneElement } from "react";

/**
 * Scrolls the highlighted element into view.
 */
export const useScroll = ({ isDropdownOpen, highlighted, ref }) => () => {
  if (isDropdownOpen !== true) {
    return;
  }

  const root = (ref && ref.current) || {};

  if (highlighted > -1 && typeof window !== "undefined") {
    window.requestAnimationFrame(() => {
      const selected = document.querySelector("[data-highlighted=true]");

      if (selected) {
        root.scrollTop = selected.offsetTop;
      }
    });
  }
};

/**
 * Change the selected value.
 *
 * @param {*} value The selected option value.
 */
export const onSelect = props => e => {
  e && e.preventDefault();

  const {
    value,
    multiple,
    handler,
    closeDropdown,
    setSelected,
    selected
  } = props;

  // If it is not multiple, we simply replace the selected value.
  if (!multiple) {
    setSelected([value]);
    closeDropdown();
    handler([value]);
    return;
  }

  // Otherwise we handle a multi select.
  const values = multiple ? selected.splice(0) : [];
  const vindex = selected.indexOf(value);

  // Remove value if its already selected.
  vindex > -1 ? values.splice(vindex, 1) : values.push(value);

  setSelected(values);
  closeDropdown();
  handler(values.length ? values : undefined);
};

/**
 * Event handler for key downs.
 */
export const useOnKeyDown = props => () => {
  if (typeof document === "undefined") {
    return;
  }

  const handleKeyDown = e => {
    const {
      highlighted,
      setHighlighted,
      toggleDropdown,
      isDropdownOpen,
      children,
      ref,
      onSelect: onValueSelect
    } = props;

    const root = ref.current;

    // If this element has no focus, do not proceed.
    if (root !== document.activeElement) {
      return;
    }

    const index = highlighted;
    const mod = children.length;

    // Highlight prev
    if (e.key === "ArrowDown") {
      e.preventDefault();
      return setHighlighted((index + 1) % mod);
    }

    // Highlight next.
    if (e.key === "ArrowUp") {
      e.preventDefault();
      return setHighlighted((index > 0 ? index : mod) - 1);
    }

    // Toggle dropdown when the user hits on space
    if (e.key === "Space" || e.key === " ") {
      e.preventDefault();
      return toggleDropdown();
    }

    if (e.key === "Enter") {
      e.preventDefault();

      if (index >= 0 && isDropdownOpen) {
        const { value } = children[index].props || {};
        return onValueSelect(value)();
      }
    }
  };

  document.addEventListener("keydown", handleKeyDown);
  return () => document.removeEventListener("keydown", handleKeyDown);
};

/**
 * Maps children with the relevant properties.
 */
export const useOptions = props => () => {
  const {
    setPlaceholders,
    setOptions,
    children,
    highlighted,
    selected,
    onValueSelect
  } = props;

  const ph = [];

  setOptions(
    Children.map(children, (child, i) => {
      const { value, text, children } = child.props;
      const selectedValue = selected.indexOf(value) > -1;

      if (selectedValue) {
        ph.push(text || children);
      }

      return cloneElement(child, {
        highlighted: highlighted === i,
        onClick: onValueSelect(value)
      });
    })
  );

  setPlaceholders(ph);
};

/**
 * Effect to sync the state and the prop.
 */
export const useSyncSelected = props => () => {
  const {
    selected,
    selectedProp,
    setSelected,
    findHighlighted,
    children,
    setHighlighted
  } = props;

  if (JSON.stringify(selected) === JSON.stringify(selectedProp)) {
    return;
  }

  setSelected(selectedProp);
  setHighlighted(findHighlighted({ children, selected: selectedProp }));
};

/**
 * Event handler for blurs.
 */
export const useOnBlur = ({ onBlur, ref }) => () => {
  if (typeof document === "undefined" || !onBlur) {
    return;
  }

  if (!ref || !ref.current) {
    return;
  }

  const onBlurHandler = () => {
    onBlur();
  };

  ref.current.addEventListener("blur", onBlurHandler);
  return () => ref.current.removeEventListener("blur", onBlurHandler);
};
