DP可以被归纳为对所有小的subset of problem, 对他们的结果做一个memorization,这样之后你就有了对于每一个最基础的空间的计算结果。

在之后的计算中，你可以使用这个已经计算出的最优解。



在所有可以用dynamic programming解决的问题里，每一种类型的关键是找到**transform function**, 即找到如何根据*已有的结果*计算下一个cell的结果。

### knapsack problem

Imagine you have a backpack with a volumn of 4L, and you have `item1($3000, 4L), item2($2000, 3L), item3($1500, 1L),` find the combination that gives you the most value which fit in the volumn.

Let's create a table which **left-padding** both items & capacities



|       |              | 1L           | 2L           | 3L           | 4L           |
| ----- | ------------ | ------------ | ------------ | ------------ | ------------ |
|       | `cell[0][0]` | `cell[0][1]` | `cell[0][2]` | `cell[0][3]` | `cell[0][4]` |
| item1 | `cell[1][0]` |              |              |              |              |
| item2 | `cell[2][0]` |              |              |              |              |
| item3 | `cell[3][0]` |              |              |              |              |



Then for calculate first row

`cell[i][j] = max{(the previous value cell[i-1][j]), (value of current item + the max value of remaining space cell[i-1][i-currentItemWeight])}`

> why the max value of remaining space is at the row `i-1` ? 注意此处为不完全背包问题，即每个item的数量只有一个，所以我们寻找remaining max value的时候直接在上一行`i-1`找. 如果每个item的数量不限，则需要在自己这行`i`寻找.



|         |                  | 1L                                                         | 2L                                           | 3L                                           | 4L                                                           |
| ------- | ---------------- | ---------------------------------------------------------- | -------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------ |
|         | `cell[0][0] = 0` | `cell[0][1] = 0`                                           | `cell[0][2] = 0`                             | `cell[0][3] = 0`                             | `cell[0][4] = 0`                                             |
| ➡️ item1 | `cell[1][0] = 0` | `cell[1][1] = (j = 1) - 4 < 0` So we take `cell[0][1]` = 0 | `(j = 2) - 4 <0` So we take `cell[0][2]` = 0 | `(j = 3) - 4 <0` So we take `cell[0][3]` = 0 | `(j = 4) - 4 = 0` So we take `Max(cell[0][4], 3000 + cell[0][4-4])` = 3000 |
| item2   | `cell[2][0] = 0` |                                                            |                                              |                                              |                                                              |
| item3   | `cell[3][0] = 0` |                                                            |                                              |                                              |                                                              |



Repeat the process for 2nd row

|        |                  | 1L                                           | 2L                                           | 3L                                                           | 4L                                                           |
| ------ | ---------------- | -------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
|        | `cell[0][0] = 0` | `cell[0][1] = 0`                             | `cell[0][2] = 0`                             | `cell[0][3] = 0`                                             | `cell[0][4] = 0`                                             |
| ✅item1 | `cell[1][0] = 0` | `(j = 1) - 4 <0` So we take `cell[0][1]` = 0 | `(j = 2) - 4 <0` So we take `cell[0][2]` = 0 | `(j = 3) - 4 <0` So we take `cell[0][3]` = 0                 | `(j = 4) - 4 = 0` So we take `Max(cell[0][4], 3000 + cell[0][4-4])` = 3000 |
| ➡️item2 | `cell[2][0] = 0` | `(j = 1) - 3 <0` So we take `cell[1][1]` = 0 | `(j = 2) - 3 <0` So we take `cell[1][2]` = 0 | `(j = 3) - 3 = 0` So we take `Max(cell[1][3]= 0, 2000 + cell[1][3-3] = 0)` = 2000 | `(j = 4) - 3 > 0` So we take `Max(cell[1][4]= 3000, 2000 + cell[1][4-3] = 0)` = 3000 |
| item3  | `cell[3][0] = 0` |                                              |                                              |                                                              |                                                              |



Repeat the process for 3rd row

|        |                  | 1L                                                           | 2L                                                           | 3L                                                           | 4L                                                           |
| ------ | ---------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
|        | `cell[0][0] = 0` | `cell[0][1] = 0`                                             | `cell[0][2] = 0`                                             | `cell[0][3] = 0`                                             | `cell[0][4] = 0`                                             |
| ✅item1 | `cell[1][0] = 0` | `(j = 1) - 4 <0` So we take `cell[0][1]` = 0                 | `(j = 2) - 4 <0` So we take `cell[0][2]` = 0                 | `(j = 3) - 4 <0` So we take `cell[0][3]` = 0                 | `(j = 4) - 4 = 0` So we take `Max(cell[0][4], 3000 + cell[0][4-4])` = 3000 |
| ✅item2 | `cell[2][0] = 0` | `(j = 1) - 3 <0` So we take `cell[1][1]` = 0                 | `(j = 2) - 3 <0` So we take `cell[1][2]` = 0                 | `(j = 3) - 3 = 0` So we take `Max(cell[1][3]= 0, 2000 + cell[1][3-3] = 0)` = 2000 | `(j = 4) - 3 > 0` So we take `Max(cell[1][4]= 3000, 2000 + cell[1][4-3] = 0)` = 3000 |
| ➡️item3 | `cell[3][0] = 0` | `(j = 1) - 1 = 0` So we take `Max(cell[2][1]= 0, 1500 + cell[2][1-1] = 0)` = 1500 | `(j = 2) - 1 > 0` So we take `Max(cell[2][2]= 0, 1500 + cell[2][2-1] = 0)` = 1500 | `(j = 3) - 1 > 0` So we take `Max(cell[2][3]= 2000, 1500 + cell[2][3-1] = 0)` = 2000 | `(j = 4) - 1 > 0` So we take `Max(cell[2][4]= 3000, 1500 + cell[2][4-1] = 2000)` = 3500 |

- the order of rows doesn't matter, we'll arrive at the max value in any order
- in this particular case, you can switch the rows & columns in the table (就是说哪个循环放在外面，哪个循环放在里面不要紧)

```typescript
const items1 = [[3000, 4], [2000, 3], [1500, 1]]

const totalVol1 = 4

function backpackMaxValue(items: number[][], total: number) {
  // The most important part here, is to LEFT-PADDING both the array length & total length, and populate the matrix with all 0
  // Then in the loop we start both of them from 1 instead of 0
  // so we can say that result[i][j] represent the `ith` item with `j` weight.
  const result: number[][] = Array(items.length + 1).fill(undefined).map(() => Array(total + 1).fill(0));
  for (let i = 1; i <= items.length; i++) {
    // Note here we need to use `i-1` because we starting from 1, and exceed the items'array length by 1.
    const [value, vol] = items[i - 1];
    for (let j = 1; j <= total; j++) {
      // same here, start from 1
      // j-vol < 0 is for checking if the current item vol is exceeding the total vol or not
      // if yes, just grab the previous one
      // otherwise, add the current item value with the max value of previous line that fit in the `j-vol` volumn
      result[i][j] = j - vol < 0 ? result[i - 1][j] : Math.max(result[i - 1][j], value + (result[i - 1][j - vol]));
    }
  }
  console.log(result, result[items.length][total]);
  return result[items.length][total];
}

backpackMaxValue(items1, totalVol1);
```

