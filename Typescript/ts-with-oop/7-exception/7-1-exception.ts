// Java: Exception
// Javascript: Error
const array = new Array(100000000); //  RangeError

function move(direction: 'up' | 'down' | 'left' | 'right' | 'he') {
  switch (direction) {
    case 'up':
      break;
    case 'down':
      break;
    case 'left':
      break;
    case 'right':
      break;
    case 'he':
      break;
    default:
      const invalid: never = direction; // Ok
      throw new Error('unknown direction: ' + invalid);
  }
}
