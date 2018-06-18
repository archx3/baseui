// @flow
import React from 'react';
import {STATE_TYPE} from './constants';
import type {
  StatefulProps,
  StateReducer,
  DefaultStatefulProps,
  StateType,
  State,
} from './types';

const defaultStateReducer: StateReducer = (type, nextState) => nextState;

class StatefulCheckboxContainer extends React.Component<StatefulProps, State> {
  static defaultProps: DefaultStatefulProps = {
    initialState: {},
    stateReducer: defaultStateReducer,
    onChange: () => {},
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    onFocus: () => {},
    onBlur: () => {},
  };

  constructor(props: StatefulProps) {
    super(props);
    this.state = {
      ...this.props.initialState,
    };
  }

  onChange = (e: any) => {
    this.stateReducer(STATE_TYPE.change, e);
    if (this.props.onChange) {
      this.props.onChange(e);
    }
  };

  onMouseEnter = (e: any) => {
    this.stateReducer(STATE_TYPE.hover, e);
    if (this.props.onMouseEnter) {
      this.props.onMouseEnter(e);
    }
  };

  onMouseLeave = (e: any) => {
    this.stateReducer(STATE_TYPE.unhover, e);
    if (this.props.onMouseLeave) {
      this.props.onMouseLeave(e);
    }
  };

  onFocus = (e: any) => {
    this.stateReducer(STATE_TYPE.focus, e);
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  };

  onBlur = (e: any) => {
    this.stateReducer(STATE_TYPE.blur, e);
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  };

  stateReducer = (type: StateType, e: any) => {
    let nextState;
    switch (type) {
      case STATE_TYPE.change:
        nextState = {checked: e.target.checked};
        break;
      case STATE_TYPE.focus:
        nextState = {$isFocused: true};
        break;
      case STATE_TYPE.blur:
        nextState = {$isFocused: false};
        break;
      case STATE_TYPE.hover:
        nextState = {$isHovered: true};
        break;
      case STATE_TYPE.unhover:
        nextState = {$isHovered: false};
        break;
      default:
        nextState = this.state;
    }
    let newState = nextState;
    if (this.props.stateReducer) {
      newState = this.props.stateReducer(type, nextState, this.state, e);
    }
    this.setState(newState);
  };

  render() {
    const {
      children = (childProps?: any) => {}, // eslint-disable-line no-unused-vars
      initialState,
      stateReducer,
      ...rest
    } = this.props;
    const {onChange, onMouseEnter, onMouseLeave, onFocus, onBlur} = this;
    return children({
      ...rest,
      ...this.state,
      onChange,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
    });
  }
}

export default StatefulCheckboxContainer;