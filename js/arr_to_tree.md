# 将数组转化为树形结构

初始时，数组中的每个元素具有 4 个属性，其中有 id 和 pid，现在我们需要根据这两个 id 之间的关系，添加一个 children 属性，使之成为一棵树的结构。

比如有如下数据：

```js
// 对于这样的结构对象进行一个反扁平化
let arr = [{ id: 1 }, { id: 2, pid: 1 }, { id: 3, pid: 2 }];
```

代码:

```js
// 对于这样的结构对象进行一个反扁平化
let arr = [{ id: 1 }, { id: 2, pid: 1 }, { id: 3, pid: 2 }];

function change(arr) {
  // temp对象用来将arr数组转换成对象形式进行存储
  // res为输出的结果
  const temp = {},
    res = {};

  for (const i of arr) {
    temp[i.id] = i;
  }

  Object.keys(temp).forEach(key => {
    const parentId = temp[key].pid;
    // 先判断是否有父id
    if (parentId) {
      // 如果父id上没有children，那就创建一个新的对象
      if (!temp[parentId].children) {
        temp[parentId].children = {};
      }
      // 为父id的children添加相应的key的对象
      temp[parentId].children[key] = temp[key];
    } else {
      // 如果没有父id说明是根节点，直接赋值给res对象
      res[key] = temp[key];
    }
  });

  console.log(JSON.stringify(res));
  return res;
}

change(arr);

// 结果
res = {
  1: {
    id: 1,
    children: {
      2: {
        id: 2,
        pid: 1,
        children: {
          3: {
            id: 3,
            pid: 2
          }
        }
      }
    }
  }
};
```
