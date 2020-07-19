// @flow
import React, { Component } from 'react';
import { Form, Input } from 'semantic-ui-react';
import debounce from 'lodash/debounce';

export default class GlobalFormFieldRam extends Component<Props> {
  constructor(props) {
    super(props);

    const {
      readOnly
    } = props;

    this.state = {
      value: props.defaultValue,
      readOnly
    };
  }
  onChange = debounce((e, { name, value }) => {
    const valid = !!(value.match(/^[0-9]{1,9}?$/g));
    this.setState({
      value
    }, () => {
      this.props.onChange(e, { name, value, valid });
    });
  }, 300)

  render() {
    const {
      autoFocus,
      icon,
      label,
      loading,
      name,
      readOnly
    } = this.props;
    const {
      value
    } = this.state;

    return (
      <Form.Field
        autoFocus={autoFocus}
        control={Input}
        defaultValue={value}
        icon={icon}
        label={label}
        loading={loading}
        name={name}
        onChange={this.onChange}
        placeholder="0"
        readOnly={readOnly}
      />
    );
  }
}
