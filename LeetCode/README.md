# 快慢指针对已排序的数组去重

```javascript
// 利用快慢指针对数组去重，每项只能出现一次
var removeDuplicates = function(nums) {
  var p1 = 0;
  var p2 = 1;
  while (p2 < nums.length) {
    if (nums[p1] === nums[p2]) {
      nums.splice(p2, 1);
      // splice删除数组元素时index会变，所以这里的p2指针不用再+1，
      // 删除p2所指的项的时候，此时的p2指向的就是下一个元素了
    } else {
      p1++;
      p2++;
    }
  }
  return nums.length;
};

// 利用快慢指针对数组去重，每项最多出现两次
var removeDuplicates = function(nums) {
  var p1 = 0;
  var p2 = 2;
  while (p2 < nums.length) {
    if (nums[p1] == nums[p2]) {
      nums.splice(p2, 1);
      // splice删除数组元素时index会变，所以这里的p2指针不用再+1，
      // 删除p2所指的项的时候，此时的p2指向的就是下一个元素了
    } else {
      p1++;
      p2++;
    }
  }
  return nums.length;
};

const arr = [0, 0, 1, 2, 3, 3, 3, 4, 4, 5, 6, 7, 8];
const len = removeDuplicates(arr);
console.log(arr, len);
```
