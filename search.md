## Binary search

If we have a **sorted** list ( array in js ), instead of simple search start from beginning, it's much more efficient to use binary search, as each time you can rule out half of the remaining items.

```typescript
// input: array: [1,3,6,7,9,10], target: 10
// output: index of the target, which will be 5

// simple search would take O(n) steps
function simpleSearch(arr: number[], target: number): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] = target) {
      return i;
    }
  }
  return null;
}

// binary search would take O(log n) steps, we always talks about log2(n) actually
function binarySearch(arr: number[], target: number): number {
  let low = 0;
  let high = arr.length - 1;
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] > target) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return null;
}

// Binary search is also a D&C algo, let's rewrite it in recursion, which is almost the same idea as quickSort
function recBinarySearch(arr, target) {
  function search(inputArr, target, prevIndex) {
    if (inputArr.length === 1) {
      return inputArr[0] === target ? 0 + prevIndex : null;
    }
    const mid = Math.floor((inputArr.length - 1) / 2);
    if (inputArr[mid] === target) {
      return mid + prevIndex;
    }
    return inputArr[mid] > target ? search(inputArr.slice(0, mid), target, prevIndex) : search(inputArr.slice(mid + 1), target, mid + 1 + prevIndex)
  }
  return search(arr, target, 0);
}
```

N.B. The big O notation always talks about the worst-case scenario, but more practically we'll think about average-case scenario.

We have 5 common big O runtime

- O(log<sub>n</sub>), also known as *log time.* Example: Binary search.
- O(*n*), also known as *linear time*. Example: Simple search.
- O(*n* * log<sub>n</sub>). Example: A fast sorting algorithm, like quicksort.
- O(*n*<sup>2</sup>). Example: A slow sorting algorithm, like selection sort.
- O(*n*!). Example: A really slow algorithm, like the traveling salesperson.

