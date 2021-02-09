# 树的 DFS、BFS 以及遍历

```js
let tree = {
  value: 1,
  left: {
    value: 2,
    left: {
      value: 3
    },
    right: {
      value: 4
    }
  },
  right: {
    value: 5,
    left: {
      value: 6
    },
    right: {
      value: 7
    }
  }
};

let childrentree = {
  value: 'a',
  children: [
    {
      value: 'b',
      children: [
        {
          value: 'c'
        },
        {
          value: 'd'
        },
        {
          value: 'e'
        }
      ]
    },
    {
      value: 'f',
      children: [
        {
          value: 'g'
        },
        {
          value: 'h'
        },
        {
          value: 'i'
        }
      ]
    }
  ]
};

// 深度优先遍历树
function dfs(tree) {
  console.log(tree.value);
  tree.children && tree.children.forEach(dfs);
}

// 广度优先遍历树
function bfs(root) {
  // 创建一个队列
  let arr = [root];
  let target = [];

  while (arr.length) {
    // 对头出队并且访问它
    const node = arr.shift();
    target.push(node.value);
    // 对头的children挨个入队
    node.children &&
      node.children.forEach(item => {
        arr.push(item);
      });
  }

  return target;
}

// 先序遍历非递归版
const preLoad = root => {
  if (!root) return;
  const stack = [root];
  const tmp = [];

  while (stack.length) {
    const n = stack.pop();
    tmp.push(n.value);
    if (n.right) stack.push(n.right);
    if (n.left) stack.push(n.left);
  }

  return tmp;
};

// 中序遍历非递归版
const midLoad = function(root) {
  // 存储节点value的数组
  const res = [];
  // 构造存储节点的栈，中序遍历初始栈为空
  const stack = [];
  // 这里的循环条件需要加上一个stack.length
  while (root || stack.length) {
    // 先一个一个把左子树的节点入栈
    while (root) {
      stack.push(root);
      root = root.left;
    }
    // 遍历完最后一个左子树的节点后，开始将最后一个左子树的节点的值加入数组内
    // 之后开始遍历右子树
    const temp = stack.pop();
    res.push(temp.value);
    root = temp.right;
  }
  return res;
};

// 后序遍历非递归版
const afterLoad = root => {
  if (!root) return;
  const stack = [root];
  const tmp = [];

  while (stack.length) {
    const n = stack.pop();
    tmp.push(n.value);
    if (n.left) stack.push(n.left);
    if (n.right) stack.push(n.right);
  }

  return tmp.reverse();
};

console.log(preLoad(tree));
console.log(midLoad(tree));
console.log(afterLoad(tree));
console.log(dfs(childrentree));
console.log(bfs(childrentree));
```
