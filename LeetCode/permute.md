# 46. 全排列

给定一个 没有重复 数字的序列，返回其所有可能的全排列。

示例:

输入: [1,2,3]

输出:
[
[1,2,3],
[1,3,2],
[2,1,3],
[2,3,1],
[3,1,2],
[3,2,1]
]

```js
var permute = function(nums) {
  const res = [];
  const stack = [];

  function digui(stack) {
    if (stack.length === nums.length) {
      res.push(stack);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (stack.includes(nums[i])) continue;
      stack.push(nums[i]);
      // 注意这里一定要拷贝一下，否则就一直是stack的引用导致最后res数组里都是一样的子项
      digui([...stack]);
      stack.pop();
    }
  }
  digui(stack);
  return res;
};

console.log(permute([1, 2, 3]));
```

# 17. 电话号码的字母组合

给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。答案可以按 任意顺序 返回。

给出数字到字母的映射如下（与电话按键相同）。注意 1 不对应任何字母。

示例 1：
输入：digits = "23"
输出：["ad","ae","af","bd","be","bf","cd","ce","cf"]

示例 2：
输入：digits = ""
输出：[]

示例 3：
输入：digits = "2"
输出：["a","b","c"]

```js
/**
 * @param {string} digits
 * @return {string[]}
 */
var letterCombinations = function(digits) {
  if (digits === '') return [];
  const temp = digits.split('');
  // 保存结果的数组
  const result = [];
  // 每种可能的数组，如‘23’的['a', 'd']这种可能
  const stack = [];
  const map = {
    '2': ['a', 'b', 'c'],
    '3': ['d', 'e', 'f'],
    '4': ['g', 'h', 'i'],
    '5': ['j', 'k', 'l'],
    '6': ['m', 'n', 'o'],
    '7': ['p', 'q', 'r', 's'],
    '8': ['t', 'u', 'v'],
    '9': ['w', 'x', 'y', 'z']
  };

  digui(stack, 0);
  // console.log(result);
  return result.map(item => item.join(''));

  // 递归的函数
  // stack：每种可能的数组
  // j：temp数组的下标
  function digui(stack, j) {
    if (stack.length === temp.length) {
      result.push(stack);
      return;
    }
    // for (let j = 0; j < temp.length; j++) {
    // 先从temp数组的第一项开始添加第一个可能的字母，如：'a'
    for (let i = 0; i < map[temp[j]].length; i++) {
      stack.push(map[temp[j]][i]);
      // 递归下一个map对应的key的数组，添加下一个可能的字母
      digui([...stack], j + 1);
      stack.pop();
    }
    // }
  }
};
```

# 47. 全排列 II

给定一个可包含重复数字的序列 nums ，按任意顺序 返回所有不重复的全排列。

示例 1：
输入：nums = [1,1,2]
输出：
[[1,1,2],[1,2,1],[2,1,1]]

示例 2：
输入：nums = [1,2,3]
输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ef6ca8a013504d59a995b6b3b33cf132~tplv-k3u1fbpfcp-zoom-1.image '解题思路')

```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permuteUnique = function(nums) {
  // 先给数组排序
  nums.sort();
  let res = [];
  // 存放每个结果数组下标的使用情况的map
  let vis = {};
  let dfs = t => {
    if (t.length === nums.length) {
      res.push(t);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      // 当前下标使用过了，防止一个数被使用两次
      if (vis[i]) continue;
      // 同一层有相同的数时（nums[i] == nums[i - 1]），前一个数使用完成vis[i - 1] === false，且i - 1存在
      if (i - 1 >= 0 && nums[i] == nums[i - 1] && !vis[i - 1]) continue;
      vis[i] = true;
      t.push(nums[i]);
      dfs([...t]);
      t.pop();
      vis[i] = false;
    }
  };
  dfs([]);
  return res;
};
```

# ** 最后总结回溯算法的万能公式 **

```js
var permuteUnique = function(nums) {
  // 先给数组排序，字符串数组也一样
  nums.sort();
  // 存放最终结果的数组
  let res = [];
  // 存放每个结果数组下标的使用情况的map
  let visit = {};
  dfs([]);
  return res;

  function dfs(t) {
    if (t.length === nums.length) {
      res.push(t);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      // 当前下标使用过了，防止一个数被使用两次
      if (visit[i]) continue;
      // 处理有相同项的情况如nums = [1, 1, 2]：
      // 同一层有相同的数时（nums[i] === nums[i - 1]），前一个数使用完成visit[i - 1] === false，且i - 1存在
      if (i - 1 >= 0 && nums[i] == nums[i - 1] && !visit[i - 1]) continue;
      // 以下为固定写法：
      visit[i] = true;
      t.push(nums[i]);
      dfs([...t]);
      t.pop();
      visit[i] = false;
    }
  }
};
```
