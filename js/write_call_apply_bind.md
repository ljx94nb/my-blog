# 手写 call、apply、bind 系列

```js
Function.prototype.bind = function(obj, ...args) {
  const fn = this;
  return function() {
    return fn.call(obj, ...args);
  };
};

Function.prototype.call = function(obj, ...args) {
  obj._fn = this;
  const res = obj._fn(...args);
  delete obj._fn;
  return res;
};

Function.prototype.apply = function(obj, args) {
  obj._fn = this;
  const res = obj._fn(...args);
  delete obj._fn;
  return res;
};

const obj = { a: 1 };
function test() {
  console.log(this.a);
}
test.call(obj);
```
