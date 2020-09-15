import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import FormContext from "./context";
import * as styled from "./FormWrapper.styles";

// Stack together the radio elements so that
// we can control the group state whenever needed.
const radioGroup = {};

export default Wrapped => {
  const isCheckbox = Wrapped.displayName === "Checkbox";
  const isRadio = Wrapped.displayName === "Radio";
  const isButton = Wrapped.displayName === "Button";
  const propTypes = Wrapped.propTypes || Wrapped.target.propTypes;

  class FormWrapper extends PureComponent {
    static displayName = `FormWrapper(${Wrapped.displayName})`;

    static defaultProps = {
      Label: styled.Label,
      InlineLabel: styled.InlineLabel
    };

    static propTypes = {
      /**
       * The error message.
       */
      error: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          text: PropTypes.string
        })
      ]),

      /**
       * The label properties.
       */
      label: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.shape({
          text: PropTypes.string,
          inline: PropTypes.bool
        })
      ]),

      /**
       * Handler to reset errors.
       */
      resetErrors: PropTypes.func,

      /**
       * The styled label.
       */
      Label: PropTypes.object,

      /**
       * The styled label.
       */
      InlineLabel: PropTypes.object
    };

    static getDerivedStateFromProps(nextProps, state) {
      let newState = null;
      const value = nextProps.value || nextProps.selected;

      if (value !== state.initialValue) {
        newState = {};
        newState.value = value;
        newState.initialValue = nextProps.value;
      }

      if (nextProps.checked !== state.initialChecked) {
        newState = newState || {};
        newState.checked = nextProps.checked;
        newState.initialChecked = nextProps.checked;
      }

      return newState;
    }

    state = {
      // Checkbox and radio
      checked: this.props.checked,
      initialChecked: this.props.checked,

      // Input, Textarea
      value: this.props.value || this.props.selected,
      initialValue: this.props.value || this.props.selected
    };

    constructor(props) {
      super(props);

      // We have to collect the radio elements with same name into
      // groups so that we can manipulate the checked state of the
      // whole group.
      if (isRadio) {
        radioGroup[props.name] = radioGroup[props.name] || [];
        radioGroup[props.name].push(this);
      }
    }

    /**
     * Empty the radio group on unmount.
     */
    componentWillUnmount() {
      const index = (radioGroup[this.props.name] || []).indexOf(this);

      if (index > -1) {
        if (radioGroup[this.props.name].length === 1) {
          delete radioGroup[this.props.name];
        } else {
          radioGroup[this.props.name].splice(index, 1);
        }
      }
    }

    /**
     * Handler to change the value. It will update the state
     * and the wrapped components will read the new value from the prop.
     *
     * @param value
     */
    onChangeWrapper = value => {
      this.props.resetErrors(this.props.name);

      this.setState({ value }, () => {
        this.notify(value, {
          initialValue: this.state.initialValue
        });
      });
    };

    /**
     * Handler to control the checked state.
     *
     * @param checked
     */
    onCheckWrapper = checked => {
      if (isRadio) {
        radioGroup[this.props.name].forEach(radio => {
          // Uncheck the previous ones.
          if (radio.state.checked) {
            radio.setState({ checked: false });
            radio.notify(undefined, {
              initialChecked: radio.state.initialChecked
            });
          }
        });
      }

      this.setState({ checked }, () => {
        this.notify(checked ? this.props.value : undefined, {
          initialChecked: this.state.initialChecked
        });
      });
    };

    /**
     * Notify the parent when something changes.
     *
     * @param value
     * @param opts
     */
    notify = (value, opts) => {
      if (typeof this.props.onChange === "function") {
        opts.name = this.props.name;
        this.props.onChange(value, opts);
      }
    };

    /**
     * Event handler for label click.
     **/
    onLabelClick = () => {
      // eslint-disable-next-line
      const input = ReactDOM.findDOMNode(this).querySelector("input");

      if (isCheckbox || isRadio) {
        input.click();
      } else {
        input.focus();
      }
    };

    /**
     * Normalize the label object.
     *
     * @return {*}
     */
    labelObject = () => {
      const { label } = this.props;

      if (typeof label === "string") {
        return { text: label };
      }

      if (label && label.text) {
        return label;
      }

      return { text: label };
    };

    /**
     * Normalize the props we are passing down the tree.
     *
     * @param props
     */
    normalizeProps = props => {
      // We don't want to pass these props down to the child.
      // They are used in this HOC.
      ["value", "onChange", "resetErrors", "Label", "InlineLabel"].forEach(
        p => delete props[p]
      );

      // Means the component doesn't really need this state
      if (typeof propTypes.loading === "undefined") {
        delete props.loading;
      }

      // Wrap the onChange callback.
      if (isCheckbox || isRadio) {
        props.handler = this.onCheckWrapper;
        props.checked = this.state.checked;
      } else if (isButton === false) {
        props.handler = this.onChangeWrapper;
      }
    };

    renderLabel = () => {
      const label = this.labelObject();
      const isInline = isCheckbox || isRadio || label.inline;

      if (!label) {
        return null;
      }

      const Label = isInline ? this.props.InlineLabel : this.props.Label;

      return (
        <Label
          fontSize={this.props.fontSize}
          onClick={this.onLabelClick}
          hasValue={!!this.props.placeholder || !!this.state.value}
        >
          {label.text}
        </Label>
      );
    };

    render() {
      const { error, ...props } = this.props;
      this.normalizeProps(props);

      return (
        <styled.Wrapper {...props}>
          <Wrapped {...props} value={this.state.value} />
          {this.renderLabel()}
          {error && <styled.Error>{error || error.text}</styled.Error>}
        </styled.Wrapper>
      );
    }
  }

  return Object.assign(
    props => (
      <FormContext.Consumer>
        {({ errors = {}, loading, resetErrors }) => (
          <FormWrapper
            {...props}
            resetErrors={resetErrors}
            error={errors[props.name] || props.error}
            loading={loading}
          />
        )}
      </FormContext.Consumer>
    ),
    { displayName: `FormContext(${Wrapped.displayName})` }
  );
};
