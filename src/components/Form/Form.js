import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import FormContext from "./context";
import Input from "./Input";
import Button from "./Button";
import ButtonLink from "./ButtonLink";
import Checkbox from "./Checkbox";
import Radio from "./Radio";
import Select from "./Select";
import Option from "./Option";
import Toggler from "./Toggler";
import Switch from "./Switch";
import Success from "./Success";
import Section from "./components/Section";
import Description from "./components/Description";

const StyledForm = styled.form``;

StyledForm.defaultProps = {
  width: "100%"
};

export default class Form extends PureComponent {
  static defaultProps = {
    method: "GET",
    ignoreEmptyValues: false,
    autoComplete: "off"
  };

  static propTypes = {
    /**
     * Children to render.
     */
    children: PropTypes.node,

    /**
     * The form method.
     */
    method: PropTypes.string,

    /**
     * The submit handler.
     */
    handleSubmit: PropTypes.func,

    /**
     * If ignored empty element values (also unchecked) will be ignored.
     */
    ignoreEmptyValues: PropTypes.bool,

    /**
     * If ignored, disabled values will be ignored in returned form values.
     */
    ignoreDisabled: PropTypes.bool,

    /**
     * Whether autocomplete should be turned on or off.
     * Possible values are "on" or "off".
     */
    autoComplete: PropTypes.string
  };

  static ButtonLink = ButtonLink;
  static Button = Button;
  static Input = Input;
  static Checkbox = Checkbox;
  static Radio = Radio;
  static Select = Select;
  static Option = Option;
  static Toggler = Toggler;
  static Switch = Switch;
  static Success = Success;
  static Section = Section;
  static Description = Description;

  static getElementValue = el => {
    const type = el.getAttribute("type");

    if (type === "checkbox") {
      return el.checked ? el.value : false;
    }

    return el.value;
  };

  /**
   * Given the form element, collect all the values that are active.
   *
   * @param form
   * @param opts
   * @return {{}}
   */
  static collectFormValues = (form, opts) => {
    const values = {};

    for (let i = 0; i < form.elements.length; i++) {
      const el = form.elements[i];
      const name = el.name;
      const value = Form.getElementValue(el);

      // Do not continue if a name has not been specified.
      // Do not continue if ignoreEmptyValues is true and value is false-ish.
      // Do not continue if input is disabled and ignoreDisabled is true-ish.
      if (
        !name ||
        (opts.ignoreEmptyValues && !value) ||
        (el.disabled && opts.ignoreDisabled)
      ) {
        continue;
      }

      const type = el.getAttribute("type");

      if (type === "radio") {
        // Radios are special, we only return the selected value
        values[name] = el.checked ? value : values[name];
      } else if (typeof values[name] !== "undefined") {
        // Stack together inputs with same name
        values[name] = Array.isArray(values[name]) ? values[name] : [values[name]]; // prettier-ignore
        values[name].push(value);
      } else {
        // Otherwise just set the value
        values[name] = value;
      }
    }

    return values;
  };

  state = {
    loading: false,
    errors: {}
  };

  onSubmit = async e => {
    e.preventDefault();

    const { handleSubmit, ignoreEmptyValues, ignoreDisabled } = this.props;

    if (typeof handleSubmit !== "function") {
      return;
    }

    const form = ReactDOM.findDOMNode(this);
    const values = Form.collectFormValues(form, {
      ignoreEmptyValues,
      ignoreDisabled
    });

    this.setState({ loading: true });

    if (!handleSubmit) {
      return values;
    }

    let state = { loading: false };

    try {
      await handleSubmit(values);
    } catch (errors) {
      state.errors = errors;
    }

    if (!this.unmounted) {
      this.setState(state);
    }
  };

  resetErrors = name => {
    if (this.state.errors[name]) {
      const errors = { ...this.state.errors };
      delete errors[name];
      this.setState({ errors });
    }
  };

  componentWillUnmount() {
    this.unmounted = true;
  }

  render() {
    // eslint-disable-next-line
    const { children, handleSubmit, ignoreEmptyValues, ...props } = this.props;
    const { loading, errors } = this.state;
    const context = { loading, errors, resetErrors: this.resetErrors };

    return (
      <FormContext.Provider value={context}>
        <StyledForm {...props} onSubmit={this.onSubmit}>
          {children}
        </StyledForm>
      </FormContext.Provider>
    );
  }
}
