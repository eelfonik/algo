As binary search only works with sorted list, so let's look at how to sort list first

## Selection sort

It takes O(n<sup>2</sup>) to sort an array, as you need to go through the items one by one(`n`) for `n` times. 

In reality, as each time when we go through the array, we -1 from the previous one, so it should be `n + (n-1) + (n-2) +...+(n - (n -1)) `, that would be roughly 1/2 n<sup>2</sup>, but in big O notation, the `1/2` is called a *constant*, and we ignore it.

EX:

```javascript
// input: [5,7,9,10,6,8,0]
// output: [0,5,6,7,8,9,10]

function selectionSort(arr) {  
  for (let i = 0; i < arr.length; i++) {
    // find the smallest index
    let min = i;
    for (let j = i+1; j < arr.length; j++) {
      if (arr[j] < arr[min]) {
        min = j
      }
    }
    // if the current index is not the smallest, we swap them
    if (min !== i) {
      let temp = arr[i];
      arr[i] = arr[min];
      arr[min] = temp;
    }
  }
  return arr;
}

/* let's rewrit it in recursive mode, which is the same time complexity, but uses much more space */
function selectionSort(arr) {
  function insertIntoSortedArr(item, arr) {
    for (let i = 0; i < arr.length; i++) {
      if (item < arr[i]) {
        return [...arr.slice(0, i), item, ...arr.slice(i)]
      }
    }
    return [...arr, item];
  }
  function recSelectionSort(inputArr, previousArr) {
    // The base part
    if (inputArr.length === 0) {
      return previousArr;
    }
    // the recursive part
    const remainingArr = inputArr.slice(1);
    // N.B. Here it's already an optimized tail recursion, as the call of the function itself is at the tail, it has nothing left to call when finished, so the execute engine can optimize the stack, and reuse the existing parent stack instead of creating a new stack frame.
    return recSelectionSort(remainingArr, insertIntoSortedArr(inputArr[0], previousArr))
  }
  return recSelectionSort(arr, []);
}
```



## Quick sort

### Divide-and-conquer

The idea behind quick sort is **divide-and-conquer**. Which is a well-known recursive technique.

总的来说，对于D&C (divide-and-conquer), 可以分为两步：

1. 找到最简单可以直接得出解答的base case
2. 找到如何把原始问题reduce到base case的方法

A simple example to show D&C for sum

```javascript
// The unefficient way
function sum(arr) {
  // base case
  if (arr.length === 0) {
    return 0;
  }
  // reduce steps
  return arr[0] + sum(arr.slice(1))
}

// this is the optimized tail version
function sum(arr) {
  function recSum(input, prevSum) {
    if (input.length === 0) {
      return prevSum;
    }
    // input.slice() is how you reduce the arr
    // and prevSum + input[0] is the direct answer to the base case where array has only one item
    return recSum(input.slice(1), prevSum + input[0])
  }
  return recSum(arr, 0);
}

// it's basically the home-made version of a specific case of `Array.reduce`
function sum(arr) {
  return arr.reduce((acc, cur) => acc + cur, 0)
}
```



### Quick sort in action

1. as the D&C, figure out the base case, which is an array of 0 or 1 item, then we return the array itself
2. The different part is *how to* reduce, the main idea is choose the mid point as pivot, then reduce the array to a **left array**, which contains all items that are smaller than the pivot, and the **right array**, which contains all items that are greater than the pivot. Then we can recursively sort those 2 arrays & combine them together to get the final sorted array.

```javascript
function quickSort(arr) {
  // base case
  if (arr.length < 2) {
    return arr;
  }
  // choose the mid point as pivot
  let pivotIndex = Math.floor((arr.length - 1)/2);
  // partition
  let leftArr = [];
  let rightArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (i !== pivotIndex) {
      arr[i] < arr[pivotIndex] ? leftArr.push(arr[i]) : rightArr.push(arr[i]);
    }
  }
  // combine the results
  return [...quickSort(leftArr), arr[pivotIndex], ...quickSort(rightArr)]
}
```

> If we consider the time complexity of quick sort, 
>
> - worst case, it'll be O(n<sup>2</sup>) :  if you have an already sorted array, and you start from the 1st element as pivot. As the partition of array basically did nothing ( every time the right array will contain all the rest of elements ), so the depth of call stack will be `n`.
> - best case: it'll be O(n * log<sub>n</sub>) : if you have an already sorted array, and you start from the middle ( because you only have log<sub>n</sub> depth of call stack, be at each stack level, it will go through all `n` elements )
> - average case: it ALSO takes O(n * log<sub>n</sub>) time, as it doesn't matter if your array is sorted or not, if you start from middle, the partition will always be quite even.

#### comparing with mergeSort

MergeSort will always have O(n * log<sub>n</sub>) time. But we use quickSort alot in practice, because mergeSort has a large **constant** than quickSort's average case, which is ignored in big O notation, but in practice, it means quickSort is faster than mergeSort.

```javascript
// TODO: write the merge sort
```

