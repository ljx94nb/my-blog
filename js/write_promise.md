# 手撕 Promise

实现了 then、race 和 all

```js
class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.error = undefined;
    this.resolveFn = [];
    this.rejectFn = [];

    let resolve = value => {
      if (this.state === 'pending') {
        this.state = 'resolved';
        this.value = value;
        this.resolveFn.forEach(item => item(this.value));
      }
    };

    let reject = error => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.error = error;
        this.rejectFn.forEach(item => item(this.error));
      }
    };

    executor(resolve, reject);
  }

  then = (onResolve, onReject) => {
    //  queueMicrotask 创建一个微任务
    queueMicrotask(() => {
      switch (this.state) {
        case 'resolved':
          onResolve(this.value);
          break;
        case 'rejected':
          onReject(this.error);
          break;
        default:
          this.resolveFn.push(onResolve);
          this.rejectFn.push(onReject);
          break;
      }
    });
  };

  static race(promiseArr) {
    return new MyPromise((resolve, reject) => {
      promiseArr.forEach((item, index) => {
        item.then(
          value => {
            resolve(value);
          },
          err => {
            reject(err);
          }
        );
      });
    });
  }

  static all(promiseArr) {
    let values = new Array(promiseArr.length);
    let promiseSuccCount = 0;

    return new MyPromise((resolve, reject) => {
      promiseArr.forEach((item, index) => {
        item.then(
          value => {
            values[index] = value;
            promiseSuccCount++;

            if (promiseSuccCount === promiseArr.length) {
              resolve(values);
            }
          },
          err => {
            reject(err);
          }
        );
      });
    });
  }
}

const p = new MyPromise((resolve, reject) => {
  resolve('success');
});
const p1 = new MyPromise((resolve, reject) => {
  resolve(1);
});
const p2 = new MyPromise((resolve, reject) => {
  resolve(2);
});
const p3 = new MyPromise((resolve, reject) => {
  reject(3);
});
const p4 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(4);
  }, 1000);
});

MyPromise.all([p4, p1, p2]).then(
  values => {
    console.log(values);
  },
  err => {
    console.log(err);
  }
);

MyPromise.race([p4, p2, p1]).then(
  value => {
    console.log(value);
  },
  err => {
    console.log(err);
  }
);

// setTimeout(() => {
//   console.log('timeout');
// }, 0);

// p.then((value) => {
//   console.log(value);
// }, (error) => {
//   console.log(error);
// });
```
