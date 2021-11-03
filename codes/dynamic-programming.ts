const items1 = [[3000, 4], [2000, 3], [1500, 1]]

const totalVol1 = 4;

const items2 = [[10,3], [3,1], [9,2], [5,2], [6,1]];
const totalVol2 = 6;

// isZeroOne indicates if we can only take one item (true), or we have unlimited amount of each item (false)
function dpMaxValue(items: number[][], total: number, isZeroOne: boolean = true) {
  // The most important part here, is to LEFT-PADDING both the array length & total volumn length
  // Then in the loop we start both of them from 1 instead of 0
  // so we can say that result[i][j] represent the `ith` item with `j` volumn.
  const result: number[][] = Array(items.length + 1).fill(undefined).map(()=>Array(total + 1).fill(0));
  for (let i = 1; i <= items.length; i++) {
    const [value, vol] = items[i - 1];
    for (let j = 1; j <= total; j++) {
      if (j - vol < 0) {
        result[i][j] = result[i - 1][j]
      } else {
        // compare (the value of the last item for `j` volumn) vs (current item value + the value of last item for `j-vol` volumn),
        result[i][j] = Math.max(result[i - 1][j], value + (result[isZeroOne ? (i - 1) : i][j - vol]));
      }
    }
  }
  console.log({result, res: result[items.length][total]});
  return result[items.length][total];
}

// dpMaxValue(items1, totalVol1);

// dpMaxValue(items1, totalVol1, false);

dpMaxValue(items2, totalVol2);

const coins1 = [1, 2, 5, 10, 20] // ordered array

const coins2 = [2, 3, 6, 7];

const total = 12

// bottom up
function coinChanges(coins: number[], amount: number) {
  if (amount === 0) {
    return 0;
  }
  // we initialize all coins counts to `amount + 1`
  // because if we have 1 as the minimal coin, then `amount + 1` will surely be greater than the max ways
  const result = Array(coins.length + 1).fill(undefined).map(() => Array(amount + 1).fill({coinCount: amount + 1, path: []}));
  for (let i = 1; i <= coins.length; i++ ) {
    const coinValue = coins[i - 1];
    for (let j = 1; j <= amount; j++) {
      if (j < coinValue ) {
        // the j sum is smaller than the coin value, so we cannot use this coin
        // let's just copy the previous coin value for the same sum `j`
        result[i][j] = result[i-1][j];
      } else if ( j === coinValue) {
        // as we didn't set the start to be 0, we need to set it when loop
        result[i][j] = { coinCount: 1, path: [coinValue]}
      } else {
        /*---------To makeup a sum of `j`, we have 2 ways--------*/
        // 1st is divide `j` with the current coin value, to get how many (n) current coin we need
        // and for the reminder of the sum, find in the previous row of table, with the remaining value, which is already the min
        // const n = Math.floor(j / coinValue); // max current coin to take to make the sum
        // const remainingAmount = j % coinValue // what's left
        // // if the reminder cannot be divided by the smallest value ?
        // const {coinCount: previousCoinsCount, path: previousCoinsPath } = remainingAmount ? result[i-1][remainingAmount] : {coinCount: 0, path: []};

        /*---------if you use the 1st way, then you need to count from top down, that is, for j, going reversely--------*/

        // 2nd is look at the (j-currentValue) column of the same row (coin value), and add 1 coin of currentValue to it
        const {coinCount, path} = result[i][j - coinValue];
        if (coinCount + 1 < result[i-1][j].coinCount) {
          result[i][j] = {
            coinCount: coinCount + 1,
            path: [...path, coinValue]
          }
        } else {
          result[i][j] = result[i-1][j]
        }
      }
    }
    // console.dir({i, result}, {depth: null})
  }
  const res = result[coins.length][amount].path.reduce((acc: number, p: number) => acc + p, 0) !== amount ? -1 : result[coins.length][amount].coinCount
  console.dir({result, answer: res}, {depth: null});
  return res;
}
coinChanges(coins2, total);

// The above solution will have out of heap error for large amount
// as we're creating a matrix with columns from [0....amount]
// if you check the previous matrix, we want to keep track of amount (j), but i maybe unnecessary
function coinChanges1(coins: number[], amount: number) {
  // we initialize all coins counts to `amount + 1`
  // because if we have 1 as the minimal coin, then `amount + 1` will surely be greater than the max ways
  const result = Array(amount + 1).fill(amount + 1);
  // then we set the first cost to 0
  result[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (let j = 0; j < coins.length; j++) {
      if (i >= coins[j]) {
        result[i] = Math.min(result[i], result[i-coins[j]] + 1)
      }
    }
  }
  const res = result[amount] === amount + 1 ? -1 : result[amount];
  console.dir({result, answer: res}, {depth: null});
  return res;
}

coinChanges1(coins2, total);

