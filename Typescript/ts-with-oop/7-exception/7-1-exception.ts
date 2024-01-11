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

// Error(Exception) Handling: try -> catch -> finally
function readFile(fileName: string): string {
  if (fileName === 'not exist!💩') {
    throw new Error(`file not exist! ${fileName}`);
  }
  return 'file contents 📃';
}

function closeFile(file: string) {
  // ..
}

const fileName = 'file';
// const fileName = 'not exist!💩';
try {
  console.log(readFile(fileName));
} catch (e) {
  console.log('catched!');
} finally {
  closeFile(fileName);
  console.log('finally!');
}
console.log('!!!');

function run() {
  // const fileName = 'file';
  const fileName = 'not exist!💩';

  try {
    console.log(readFile(fileName));
  } catch (e) {
    console.log('catched!');
    return; // catch 안에서 돌아가는 로직으로 인해 하단 closeFile이 수행되지 않을 수 있음
  } finally {
    closeFile(fileName);
    console.log('finally!');
  }
}

run();
