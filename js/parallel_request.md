# 控制最大并行请求量

某页面有 m 个请求，同一时间最多只能 maxNum 个请求并行，实现一个最短时间内执行完所有请求的算法

urls = [url1, url2, url3, url4, url5, url6, url7, url8, url9, url10]

fn=将 url 封装成返回 promise 的请求处理函数

```js
function fetch(limit, urls, fn) {
  // 请求总数量
  const len = urls.length;
  // 根据请求数量创建一个数组来保存请求的结果
  const result = new Array(len).fill(false);
  // 当前完成的数量
  let count = 0;

  return new Promise((resolve, reject) => {
    // 在limit的限制下，并行执行请求函数（next函数）
    // 在请求函数成功后只要没有达到请求总数量就继续递归请求函数
    while (count < limit) {
      next();
    }
    // 递归函数
    function next() {
      // 当前要发起请求的url下标
      let current = count++;
      // 递归结束的条件
      if (current >= len) {
        !result.includes(false) && resolve(result);
        return;
      }
      // 找到url通过fn函数生成promise
      const url = urls[current];
      fn(url)
        .then(res => {
          result[current] = res;
          // 在请求的过程中如果处理完成，判断一下是否还有url，如果有继续递归
          if (current < len) {
            next();
          }
        })
        .catch(err => {
          result[current] = err;
          // 在请求的过程中如果处理完成，判断一下是否还有url，如果有继续递归
          if (current < len) {
            next();
          }
        });
    }
  });
}

async function test() {
  // 模拟根据url生成promise的函数
  const timeout = time => new Promise(resolve => setTimeout(() => resolve(time), time));
  // 拿到请求完成按顺序排列结果（包括如果失败的结果）的数组
  const results = await fetch(2, [1000, 4000, 3000, 2000], timeout);
  console.log(results);
}

test();
```
