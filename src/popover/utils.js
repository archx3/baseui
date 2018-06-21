// @flow
/* eslint-disable import/prefer-default-export */
import type {PopoverPlacement, PositionStyles} from './types';
import {ARROW_SIZE, POPOVER_MARGIN} from './constants';

const OPPOSITE_POSITIONS = {
  top: 'bottom',
  bottom: 'top',
  right: 'left',
  left: 'right',
};

/**
 * Returns the opposite of the specified position. Useful for tooltip
 * positioning logic.
 * Examples:
 * top -> bottom
 * left -> right
 */
export function getOppositePosition(position: string): string {
  return OPPOSITE_POSITIONS[position];
}

/**
 * Simple utility function for capitalizing the first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Converts our placement prop to a Popper.js placement
 * See docs: https://popper.js.org/popper-documentation.html
 * auto, top, right, bottom, left are the same
 * but things like 'rightTop' must be converted to 'right-start'
 */
export function toPopperPlacement(placement: PopoverPlacement): string {
  return placement
    .replace(/(Top|Left)$/, '-start')
    .replace(/(Right|Bottom)$/, '-end');
}

/**
 * Opposite of function above, converts from Popper.js placement
 * to our placement prop
 */
export function fromPopperPlacement(placement: string): PopoverPlacement {
  // eslint-disable-next-line flowtype/no-weak-types
  let popoverPlacement: any = placement
    .replace(/(top|bottom)-start$/, '$1Left')
    .replace(/(top|bottom)-end$/, '$1Right')
    .replace(/(left|right)-start$/, '$1Top')
    .replace(/(left|right)-end$/, '$1Bottom');
  (popoverPlacement: PopoverPlacement);
  return popoverPlacement;
}

/**
 * Splits something like 'topLeft' to ['top', 'left'] for easier usage
 */
export function splitPlacement(placement: PopoverPlacement) {
  const matches = placement.match(/^([a-z]+)([A-Z][a-z]+)?/) || [];
  return matches
    .slice(1, 3)
    .filter(Boolean)
    .map(s => s.toLowerCase());
}

/**
 * Popper returns css style objects (for popover & arrow) with positioning
 * information, but top/left don't have units. This helper function
 * creates a new style object with units.
 */
export function preparePopoverPositionStyles(styles?: PositionStyles = {}) {
  const {left, top, ...restStyles} = styles;
  return {
    ...restStyles,
    // Convert top/left from number to string with unit
    top: `${styles.top || 0}px`,
    left: `${styles.left || 0}px`,
  };
}

/**
 * Returns the CSS rules necessary to position the arrow next to its anchor
 * Popper.js provides us with a rule to align to the center of the anchor,
 * but does not supply a rule to place the arrow on a specific side of the
 * popover, so we add that ourselves based on the placement.
 */
export function prepareArrowPositionStyles(
  popperArrowStyles?: PositionStyles,
  placement: PopoverPlacement,
) {
  if (!popperArrowStyles) {
    return {left: '0px', top: '0px'};
  }
  const styles = {};
  const [position] = splitPlacement(placement);

  // Use Popper's rule that aligns to center of anchor
  if (position === 'top' || position === 'bottom') {
    styles.left = `${popperArrowStyles.left || 0}px`;
  } else {
    styles.top = `${popperArrowStyles.top || 0}px`;
  }

  // And supply our own rule to show arrow on a specific side
  styles[getOppositePosition(position)] = `${-(ARROW_SIZE - 1)}px`;

  return styles;
}

/**
 * Converts popover placement to transform origin for animation
 *
 * Examples:
 * topLeft -> left bottom
 * top -> center bottom
 * rightBottom -> left bottom
 */
export function getTransformOrigin(placement: PopoverPlacement) {
  const [position, alignment = 'center'] = splitPlacement(placement);
  if (position === 'top' || position === 'bottom') {
    return `${alignment} ${getOppositePosition(position)} 0px`;
  }
  return `${getOppositePosition(position)} ${alignment} 0px`;
}

/**
 * Returns margin styles to add spacing between the popover
 * and its anchor.
 *
 * We may eventually want to make margin a prop that can be overridden.
 */
export function getPopoverMarginStyles(
  showArrow: boolean,
  placement: PopoverPlacement,
) {
  const [position] = splitPlacement(placement);
  const opposite = getOppositePosition(position);
  if (!opposite) {
    return null;
  }
  const property = `margin${capitalize(opposite)}`;
  return {
    [property]: `${showArrow ? ARROW_SIZE : POPOVER_MARGIN}px`,
  };
}