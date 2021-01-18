# vue 实现响应式监听

```javascript
// 触发更新视图
function updateView() {
  console.log("视图更新");
}

// 重新定义数组原型
const oldArrayProperty = Array.prototype;
// 创建新对象，原型指向 oldArrayProperty ，再扩展新的方法不会影响原型
const arrProto = Object.create(oldArrayProperty);
["push", "pop", "shift", "unshift", "splice"].forEach(methodName => {
  arrProto[methodName] = function() {
    updateView(); // 触发视图更新
    oldArrayProperty[methodName].call(this, ...arguments);
    // Array.prototype.push.call(this, ...arguments)
  };
});

// 重新定义属性，监听起来
function defineReactive(target, key, value) {
  // 深度监听
  observer(value);

  // 核心 API
  Object.defineProperty(target, key, {
    get() {
      return value;
    },
    set(newValue) {
      if (newValue !== value) {
        // 深度监听
        observer(newValue);

        // 设置新值
        // 注意，value 一直在闭包中，此处设置完之后，再 get 时也是会获取最新的值
        value = newValue;

        // 触发更新视图
        updateView();
      }
    }
  });
}

// 监听对象属性
function observer(target) {
  if (typeof target !== "object" || target === null) {
    // 不是对象或数组
    return target;
  }

  // 污染全局的 Array 原型
  // Array.prototype.push = function () {
  //     updateView()
  //     ...
  // }

  if (Array.isArray(target)) {
    target.__proto__ = arrProto;
  }

  // 重新定义各个属性（for in 也可以遍历数组）
  for (let key in target) {
    defineReactive(target, key, target[key]);
  }
}

// 准备数据
const data = {
  name: "zhangsan",
  age: 20,
  info: {
    address: "北京" // 需要深度监听
  },
  nums: [10, 20, 30]
};

// 监听数据
observer(data);

// 测试
// data.name = 'lisi'
// data.age = 21
// // console.log('age', data.age)
// data.x = '100' // 新增属性，监听不到 —— 所以有 Vue.set
// delete data.name // 删除属性，监听不到 —— 所有已 Vue.delete
// data.info.address = '上海' // 深度监听
data.nums.push(4); // 监听数组
```

所以 Vue2 版本下的实现数组的响应式监听是可以的，但是必须使用 Arrays 的一些内置方法，不可以通过索引改变数组的值，这样是监听不到的。

当然这些方法都是在 Vue 的源码中通过

Object.create(Arrays.prototype)新建的对象的原型上重写了这些方法

```javascript
// 重新定义数组原型
const oldArrayProperty = Array.prototype;
// 创建新对象，原型指向 oldArrayProperty ，再扩展新的方法不会影响原型
const arrProto = Object.create(oldArrayProperty);
["push", "pop", "shift", "unshift", "splice"].forEach(methodName => {
  arrProto[methodName] = function() {
    updateView(); // 触发视图更新
    oldArrayProperty[methodName].call(this, ...arguments);
    // Array.prototype.push.call(this, ...arguments)
  };
});
```

具体在实际应用中如下：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Title</title>
  </head>

  <body>
    <div id="app">
      <ul>
        <li v-for="i in letters">{{i}}</li>
      </ul>

      <button @click="btnClick">按钮</button>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.1.8/vue.min.js"></script>
    <script>
      const app = new Vue({
        el: "#app",
        data: {
          message: "",
          letters: ["a", "b", "d", "c"]
        },
        methods: {
          btnClick() {
            // 1. .push方法，在最后添加，可同时添加多个
            this.letters.push("A", "B");

            // 2. .pop() 删除数组中的最后一个元素
            this.letters.pop();

            // 3.  .shift()方法，删除数组中的第一个元素
            this.letters.shift();

            // 4.  .unshift()方法，在数组最前面添加元素
            this.letters.unshift("A", "B");

            // 5.  .splice方法，作用：删除元素/替换元素/插入元素
            //splice(start: number, deleteCount: number, ...items: T[]): T[];
            // 第一个参数：位置参数
            // 删除元素：第二个元素传入你要删除几个元素（如果没传，就删除位置后面的所有元素）
            // 替换元素：第二个参数，表示我们要替换几个元素，后面是用于替换前面的元素（可理解为前面删除，后面追加）
            // 插入元素：第二个参数，传入0，并且后面跟上要插入的元素
            this.letters.splice(1, 2);
            this.letters.splice(1, 2, "A", "B", "C");
            this.letters.splice(1, 0, "A", "B", "C");

            //  6.  .sort  排序
            this.letters.sort();

            // 7.  .reverse方法，反转
            this.letters.reverse();

            // 8.注意，通过索引值修改数组中的元素不是Vue的响应式 ！！！
            this.letters[0] = "bbbbbb";
            // 可以用splice纠正
            this.letters.splice(0, 1, "bbbbbb");

            //  9.  Vue内部方法：
            //  set（要修改的对象，key|index，修改后的值）
            //  delete(要删除的对象，要删除的key|index)
            Vue.set(this.letters, 0, "修改啦");
            Vue.delete(this.letters, 0);
          }
        }
      });
    </script>
  </body>
</html>
```
