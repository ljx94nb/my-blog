# vue 实现自定义组件的 v-model

App.vue 组件：

```vue
<template>
  <div id="app">
    <div>{{ msg }}</div>
    <HelloWorld v-model="msg" />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "App",
  components: {
    HelloWorld
  },
  data() {
    return {
      msg: "Eric"
    };
  },
  methods: {
    changeValue(e) {
      this.msg = e.target.value;
    }
  }
};
</script>

<style></style>
```

自定义子组件：

```vue
<template>
  <div class="hello">
    <input type="text" :value="msg" @input="onChange" />
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  model: {
    prop: "msg",
    event: "change"
  },
  props: {
    msg: String
  },
  methods: {
    onChange(e) {
      this.$emit("change", e.target.value);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
```

# vue 动态绑定 class

:class="{'btn-class':btn1}"

btn-class：类名，在样式表中写入

btn1：对应的 data 值，是一个 bool 值

# vuex 中为什么要用 Action 管理异步操作

mutation 去改变 state 的值，其实 mutation 中也可以写异步函数。

但是是局限于一个异步操作，没有其他异步的依赖情况下。

比如：一个 setTimeout。

但是使用 action 的话就可以写一个 promise，使得可以依赖上一个异步任务的执行

在 mutation 中使用 setTimeout 异步：

```javascript
// mutation.js
const increment = state => {
  setTimeout(() => {
    state.count++;
  }, 1000);
};
const decrement = state => {
  setTimeout(() => {
    state.count--;
  }, 2000);
  state.count--;
};
export { increment, decrement };
```

```vue
<template>
  <div>
    <button @click="decrement">-</button>
    <span>{{ count }}</span>
    <button @click="increment">+</button>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  computed: {
    ...mapState(["count"])
  },
  methods: {
    ...mapMutations(["increment", "decrement"])
  }
};
</script>

<style></style>
```

在 action 中写入 promise 异步：

```javascript
// Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象
let incrementAsync = content => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      content.commit("increment");
      resolve();
    }, 1000);
  });
};
let decrementAsync = content => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      content.commit("decrement");
      resolve();
    }, 1000);
  });
};
export { incrementAsync, decrementAsync };
```

```vue
<template>
  <div>
    <button @click="dec">-</button>
    <span>{{ count }}</span>
    <button @click="add">+</button>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  computed: {
    ...mapState(["count"])
  },
  methods: {
    ...mapMutations(["increment", "decrement"]),
    ...mapActions(["incrementAsync", "decrementAsync"]),
    add() {
      this.incrementAsync().then(() => {
        this.increment();
      });
    },
    dec() {
      this.decrementAsync().then(() => {
        // do something
      });
    }
  }
};
</script>

<style></style>
```

**最后做一个重点声明：尽管 mutation 中可以写入一个异步操作，但是还是要使用 action 去触发 mutation，mutation 去改变 state 中的值！！！**
