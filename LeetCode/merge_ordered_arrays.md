# 合并两个有序数组

```javascript
// 利用归并排序的思想
function both(left, right) {
  var l = (r = 0); // 让左右指针都先指向左右数组的第一项
  var res = []; // 创建一个空的临时数组
  while (l < left.length && r < right.length) {
    if (left[l] < right[r]) {
      // 进行左右指针的比较，较小的那一项添加进res数组中，并让指针++
      res.push(left[l++]);
    } else {
      res.push(right[r++]);
    }
  }
  res = res.concat(left.slice(l, left.length), right.slice(r, right.length)); // 合并左右数组余下的部分
  return res;
}

console.log(both([1, 2, 3], [2, 5, 6]));
```
