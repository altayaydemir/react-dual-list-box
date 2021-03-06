import React, { Component, PropTypes } from 'react';
import isEqual from 'lodash.isequal';

import style from './style.scss';
import ListBox from '../ListBox';

const { array, func, shape, arrayOf, string, any, node, bool } = PropTypes;
const propTypes = {
  initialValue: array,
  valueType: string,
  options: arrayOf(shape({
    value: any,
    label: node,
  })),
  onChange: func,
  disabled: bool,
  leftButtonContent: node,
  rightButtonContent: node,
  texts: shape({
    item: string,
    items: string,
    noItem: string,
    search: string,
  }),
};

const defaultProps = {
  initialValue: [],
  valueType: 'string',
  disabled: false,
  leftButtonContent: '>',
  rightButtonContent: '<',
  texts: {
    item: 'Item',
    items: 'Items',
    noItem: 'No Items',
    search: 'Search...',
  },
};

class DualListBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.initialValue || [],
      options: props.options || [],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { initialValue, options } = this.props;

    if (!isEqual(initialValue, nextProps.initialValue) || !isEqual(options, nextProps.options)) {
      this.setState({
        value: nextProps.initialValue || [],
        options: nextProps.options || [],
      });
    }
  }

  addSelectedValues = (selectedValues) => {
    const updatedValue = [...this.state.value, ...selectedValues];
    this.setState({ value: updatedValue }, () => this.props.onChange(updatedValue));
  }

  removeSelectedValues = (selectedValues) => {
    const { value } = this.state;
    const updatedValue = value.filter(valueItem => selectedValues.indexOf(valueItem) < 0);

    this.setState({ value: updatedValue }, () => this.props.onChange(updatedValue));
  }

  render() {
    const {
      disabled,
      leftButtonContent,
      rightButtonContent,
      texts,
    } = this.props;

    const {
      options,
      value,
    } = this.state;

    const optionsLeft = options.filter(option => value.indexOf(option.value) < 0);
    const optionsRight = options.filter(option => value.indexOf(option.value) !== -1);

    return (
      <div className={style.Wrapper}>
        <ListBox
          options={optionsLeft}
          onTransfer={this.addSelectedValues}
          buttonContent={leftButtonContent}
          valueType={this.props.valueType}
          disabled={disabled}
          texts={texts}
        />

        <ListBox
          options={optionsRight}
          onTransfer={this.removeSelectedValues}
          buttonContent={rightButtonContent}
          valueType={this.props.valueType}
          disabled={disabled}
          texts={texts}
        />
      </div>
    );
  }
}

DualListBox.propTypes = propTypes;
DualListBox.defaultProps = defaultProps;

export default DualListBox;
