
export const ifElse = `// array => [5,4,3,2,1]
const ifElse = (array) => {
 const len = 5;
 let result;

 for (let i = 0; i < array.length; i++) {
  const item = array[i];
  if (item === len) {
    // is len
    result = 1;
  } else if (item > 2) {
    // is too big
    result = 0;
  } else {
    // is just right
    result = -1;
  }
 }
 
 

 return result;
}`;

export const whatHappensWhenYouCompareAnArray = `// array => [5,4,3,2,1]
const whatHappensWhenYouCompareAnArray = array => {
  const huh = array > 0;

  return huh;
}
`

export const sumWithBasicForLoop = `// array => [5,4,3,2,1]
const sumWithBasicForLoop = (array) => {
  let sum = 0;
  
  for (let i = 0; i < array.length; i++) {
    sum += i;
  }

  return sum;
}
`;

export const insertionSort = `// // array => [5,4,3,2,1]
const insertionSort = (array) => {
  // main loop
  for (let j = 1; j < array.length; j++) {
    const key = array[j];

    // Insert array[j] into the sorted sequence array[0..j-1]
    let i = j - 1;
    // look back
    while (i > -1 && array[i] > key) {
  
      array[i + 1] = array[i];
      i = i - 1;
    }

    array[i + 1] = key;
  }
}`