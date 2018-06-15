import {styled} from '../styles';

function getBorderColor(props) {
  const {checked, $error, $isIndeterminate} = props;
  return $error ? 'red' : $isIndeterminate || checked ? '#1B6DE0' : '#999999';
}

function getLabelPadding(props) {
  const {$placement} = props;
  switch ($placement) {
    case 'left':
      return '0 4px 0 0';
    case 'top':
      return '0 0 4px 0';
    case 'bottom':
      return '4px 0 0 0';
    case 'right':
    default:
      return '0 0 0 4px';
  }
}

function getBackgroundColor(props) {
  const {disabled, checked, $isIndeterminate, $isFocused} = props;
  return disabled
    ? '#F0F0F0'
    : $isIndeterminate || checked ? '#1B6DE0' : $isFocused ? '#CCCCCC' : '';
}

function getLabelColor(props) {
  const {disabled, $error} = props;
  return disabled ? '#B3B3B3' : $error ? 'red' : '#000000';
}

export const Root = styled('label', () => {
  return {
    color: 'red',
  };
});

export const Checkmark = styled('span', props => {
  const {checked, disabled, $isIndeterminate} = props;
  return {
    width: '16px',
    height: '16px',
    left: '4px',
    top: '4px',
    borderStyle: 'solid',
    borderWidth: '2px',
    borderColor: getBorderColor(props),
    borderRadius: '2px',
    display: 'inline-block',
    verticalAlign: 'middle',
    backgroundImage: $isIndeterminate
      ? 'url(\'data:image/svg+xml;utf8,<svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="1" y1="-1" x2="11" y2="-1" transform="translate(0 2)" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>\');'
      : checked
        ? 'url(\'data:image/svg+xml;utf8,<svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.6 0.200059C11.0418 0.53143 11.1314 1.15823 10.8 1.60006L4.8 9.60006C4.62607 9.83197 4.36005 9.97699 4.07089 9.99754C3.78173 10.0181 3.49788 9.91215 3.29289 9.70717L0.292893 6.70717C-0.0976311 6.31664 -0.0976311 5.68348 0.292893 5.29295C0.683417 4.90243 1.31658 4.90243 1.70711 5.29295L3.89181 7.47765L9.2 0.400059C9.53137 -0.0417689 10.1582 -0.131312 10.6 0.200059Z" fill="white"/></svg>\');'
        : '',
    backgroundColor: getBackgroundColor(props),
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    ':hover': {
      backgroundColor:
        !disabled && !$isIndeterminate && !checked ? '#E5E5E5' : '',
    },
  };
});

export const Label = styled('div', props => {
  const {$placement} = props;
  return {
    display:
      $placement === 'left' || $placement === 'right'
        ? 'inline-block'
        : 'block',
    verticalAlign: 'middle',
    fontWeight: 'bolder',
    fontFamily: 'Clan Pro For UBER',
    textTransform: 'capitalize',
    padding: getLabelPadding(props),
    fontSize: '14px',
    color: getLabelColor(props),
  };
});