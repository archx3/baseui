// @flow
/* global document */
import React from 'react';
import ReactDOM from 'react-dom';
import Popper from 'popper.js';
import {mount} from 'enzyme';
import {Popover} from './index';

jest.useFakeTimers();

// Mock popper.js (see __mocks__ directory for impl)
jest.mock('popper.js');

// Mock React 16 portals in a way that makes them easy to test
const originalCreatePortal = ReactDOM.createPortal;

// Mock document.addEventListener
const originalDocumentAddListener = document.addEventListener;

beforeAll(() => {
  // $FlowFixMe
  ReactDOM.createPortal = jest.fn(e => (
    <div is-portal="true" key="portal">
      {e}
    </div>
  ));
  // $FlowFixMe
  document.addEventListener = jest.fn();
});

afterEach(() => {
  ReactDOM.createPortal.mockClear();
  document.addEventListener.mockClear();
});

afterAll(() => {
  ReactDOM.createPortal = originalCreatePortal;
  // $FlowFixMe
  document.addEventListener = originalDocumentAddListener;
});

test('Popover - basic click functionality', () => {
  const onClick = jest.fn();
  const onMouseEnter = jest.fn();
  const content = <strong>Hello world</strong>;
  const button = <button>Click me</button>;
  const wrapper = mount(
    <Popover
      content={content}
      isOpen={false}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      {button}
    </Popover>,
  );

  // Should render single button child to begin
  expect(wrapper.children().length).toBe(1);
  const renderedButton = wrapper.childAt(0);
  expect(renderedButton).toHaveTagName('button');
  expect(renderedButton).toHaveText('Click me');

  // Test click handling (and hover events ignored)
  renderedButton.simulate('mouseenter');
  expect(onMouseEnter).not.toBeCalled();
  renderedButton.simulate('click');
  expect(onClick).toBeCalled();

  // Show the popover
  wrapper.setProps({isOpen: true});

  // Should now have the portal as the second child
  expect(wrapper.children().length).toBe(2);
  expect(wrapper.childAt(0)).toHaveTagName('button');
  const portal = wrapper.childAt(1);
  expect(portal).toMatchSelector('[is-portal]');

  // Portal should have the popover body and content
  let popoverBody = portal.childAt(0);
  expect(popoverBody).toMatchSelector('MockStyledComponent');
  expect(popoverBody).toHaveProp({
    $showArrow: false,
    $placement: 'auto',
    $positionStyles: {top: '0px', left: '0px'},
    $arrowStyles: {top: '0px', left: '0px'},
    $isAnimating: false,
    $isOpen: true,
  });
  const renderedContent = popoverBody.find('strong');
  expect(renderedContent).toExist();
  expect(renderedContent).toHaveText('Hello world');

  // Popper library should have been initialized
  expect(Popper).toHaveBeenCalled();

  // Manually emit a popper update (normally popper does this by itself)
  wrapper.instance().popper._callOnPopperUpdate();
  jest.runAllTimers();
  wrapper.update();

  popoverBody = wrapper.childAt(1).childAt(0);
  expect(popoverBody).toHaveProp({
    $placement: 'left-top',
    $positionStyles: {top: '10px', left: '10px'},
    $arrowStyles: {top: '10px', right: '-5px'},
    $isAnimating: true,
    $isOpen: true,
  });
});

test('Popover - basic mouseenter/mouseleave functionality', () => {
  const onClick = jest.fn();
  const onMouseEnter = jest.fn();
  const onMouseLeave = jest.fn();
  const content = <strong>Hello world</strong>;
  const button = <button>Click me</button>;
  const wrapper = mount(
    <Popover
      content={content}
      isOpen={false}
      triggerType="hover"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseLeaveDelay={200}
    >
      {button}
    </Popover>,
  );

  // Test click handling (and hover events ignored)
  const renderedButton = wrapper.childAt(0);
  expect(renderedButton).toHaveTagName('button');
  renderedButton.simulate('mouseenter');
  expect(onMouseEnter).toBeCalled();
  expect(onMouseLeave).not.toBeCalled();

  // Show the popover
  wrapper.setProps({isOpen: true});

  // Portal should have the popover body and content
  let popoverBody = wrapper.childAt(1).childAt(0);
  popoverBody.simulate('mouseleave');
  expect(onMouseLeave).not.toBeCalled();
  jest.runAllTimers();
  expect(onMouseLeave).toBeCalled();

  // Click should still work actually
  renderedButton.simulate('click');
  expect(onClick).toBeCalled();
});

test('Popover - dismiss on esc', () => {
  const onClick = jest.fn();
  const onEsc = jest.fn();
  const content = <strong>Hello world</strong>;
  const button = <button>Click me</button>;
  mount(
    <Popover isOpen content={content} onClick={onClick} onEsc={onEsc}>
      {button}
    </Popover>,
  );

  const calls = document.addEventListener.mock.calls;
  expect(calls[0][0]).toBe('mousedown');
  expect(calls[1][0]).toBe('keyup');

  calls[1][1]({
    key: 'Escape',
    code: 27,
    keyCode: 27,
  });

  expect(onEsc).toHaveBeenCalled();
});