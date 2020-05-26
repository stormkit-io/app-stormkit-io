import React, * as ReactUtils from "react";
import PropTypes from "prop-types";
import FormWrapper from "./FormWrapper";
import * as StyledSelect from "~/components/Form/Select.styles";
import * as actions from "./Select.actions";

const { useScroll, onSelect, useOnKeyDown, useOptions, useSyncSelected, useOnBlur } = actions; // prettier-ignore
const { useRef, useState, useEffect, Children } = ReactUtils;

/** * The API permits passing the selected value as a string separated by commas or * as an array of values. This function normalizes this value and return always
 * an array of selected values.
 *
 * @param selected
 * @return {*}
 */
const normalize = (selected) => {
  if (typeof selected === "string") {
    return selected.split(",");
  }

  return Array.isArray(selected) ? selected : [selected].filter((i) => i);
};

/**
 * Find the highlighted value.
 */
const findHighlighted = ({ children, selected }) => {
  const arr = Children.toArray(children);

  for (let i = 0; i < arr.length; i++) {
    if (selected.indexOf(arr[i].props.value) > -1) {
      return i;
    }
  }
};

/**
 * Form Select.
 *
 * @usage
 *
 * <Form.Select name="my-select" selected={['val-2']}>
 *   <Form.Option value="val" text="text" />
 *   <Form.Option value="val-2">
 *     <img src="" /> My select option with icon
 *   </Form.Option>
 * </Form.Select>
 */
const Select = ({
  name,
  multiple,
  selected: selectedPropStringOrArray,
  children,
  dropdownStyles,
  handler,
  disabled,
  ...rest
}) => {
  const ref = useRef(null);
  const selectedProp = normalize(selectedPropStringOrArray);

  // State variables
  const [selected, setSelected] = useState(selectedProp);
  const [placeholders, setPlaceholders] = useState([]);
  const [options, setOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(findHighlighted({ children, selected })); // prettier-ignore

  // Helper methods
  const closeDropdown = () => setIsDropdownOpen(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const scrollIntoView = useScroll({ isDropdownOpen, highlighted, ref });
  const onValueSelect = value => onSelect({ selected, setSelected, value, closeDropdown, multiple, handler }); // prettier-ignore
  const onInitialRender = useOptions({ setPlaceholders, setOptions, children, selected,  highlighted, onValueSelect }); // prettier-ignore
  const handleKeyDown = useOnKeyDown({ highlighted, setHighlighted, toggleDropdown, isDropdownOpen, children, ref, onSelect: onValueSelect }); // prettier-ignore
  const syncSelected = useSyncSelected({ selectedProp, selected, setSelected, findHighlighted, children, setHighlighted }); // prettier-ignore
  const onBlur = useOnBlur({ onBlur: closeDropdown, ref });

  // Effects
  useEffect(scrollIntoView, [isDropdownOpen, highlighted]);
  useEffect(handleKeyDown, [highlighted, isDropdownOpen]);
  useEffect(onInitialRender, [highlighted, selected, children]);
  useEffect(syncSelected, [selected, selectedProp, highlighted]);
  useEffect(onBlur, []);

  return (
    <StyledSelect.Wrapper tabIndex={0} ref={ref} disabled={disabled} {...rest}>
      <StyledSelect.Selected onClick={!disabled ? toggleDropdown : undefined}>
        {placeholders}
      </StyledSelect.Selected>
      <StyledSelect.Dropdown {...dropdownStyles} open={isDropdownOpen}>
        {isDropdownOpen && options}
      </StyledSelect.Dropdown>
      <input
        type="hidden"
        value={selected.join(",")}
        name={name}
        disabled={disabled}
      />
    </StyledSelect.Wrapper>
  );
};

Select.propTypes = {
  /**
   * Input name.
   */
  name: PropTypes.string.isRequired,

  /**
   * Whether this is a multi-select or not.
   */
  multiple: PropTypes.bool,

  /**
   * The selected value/values.
   */
  selected: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),

  /**
   * Array of Form.Option elements.
   */
  children: PropTypes.node,

  /**
   * Styles for the dropdown.
   */
  dropdownStyles: PropTypes.object,

  /**
   * The callback handler when input value changes.
   */
  handler: PropTypes.func.isRequired,
};

export default FormWrapper(Select);
