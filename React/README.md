# jsx 语法注意点

1. 引入 Fragment，作为 return 函数的外部包裹元素，相当于 vue 的 template。

```javascript
import React, { Component, Fragment } from "react";
```

2. 通过 this.setState()，修改 this.state 中的值。如果是 state 中的值是引用类型时，需要创建一个副本再将副本通过 this.setState()设置

```javascript
const list = Object.assign([], this.state.list);
list.splice(index, 1);
this.setState({
  list
});
```

另外 setState 可以传入一个 callback 作为参数：

```javascript
this.setState(
  preState => {
    return {
      // 异步渲染
    };
  },
  () => {
    // 渲染之后获取页面上更新后的dom元素操作，相当于vue中的this.$nextTick()
  }
);
```

例子：

```javascript
<ul
  ref={ul => {
  this.ul = ul;
  }}
  >
  {this.loopListItem()}
</ul>


handleBtnClick(e) {
    // 同步渲染
    // this.setState({
    //   list: [...this.state.list, this.state.inputValue],
    //   inputValue: ""
    // });
    this.setState(
      preState => {
        return {
          list: [...preState.list, preState.inputValue],
          inputValue: ""
        };
      },
      () => {
        console.log(this.ul.querySelectorAll("div").length);
      }
    );
  }
```

3. 绑定事件注意：

（1）时间命名采用驼峰命名法
（2）事件绑定时需要使用.bind(this),改变 this 指向

```javascript
<button onClick={this.handleBtnClick.bind(this)}>提交</button>

<input
  value={this.state.inputValue}
  onChange={this.handleInputChange.bind(this)}
></input>
```

当然本人并不建议你采用以上的方法，如果每次调用函数都要重新 bind 一次，太过于麻烦

可以采用在构造函数中一次 bind，后续只需要 this.方法名就 ok 啦：

```javascript
// TodoList组件
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "Eric",
      list: ["学英语", "学React"]
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleBtnClick = this.handleBtnClick.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

// ListItem组件
  constructor(props) {
  super(props);
  this.state = {
    index: props.index,
    content: props.content
  };
  this.handleClick = this.handleClick.bind(this, this.state.index);
}
```

4. 通过 label 的 htmlFor 属性绑定相应 input 的 id 值达到点击标签 focus 到 input 上

```javascript
<label htmlFor="insertArea">输入内容</label>
<input
  id="insertArea"
  value={this.state.inputValue}
  onChange={this.handleInputChange.bind(this)}
></input>
```

5. 单向数据流：父组件向子组件传值，子组件不可以改变父组件传过来的值；

只可以将父组件的改变值得方法传给子组件，子组件间接的调用父组件的方法，改变父组件的值。

6. 父组件传给子组件的 props 校验：

```javascript
import PropTypes from "prop-types"; // 导入prop-types包

ListItem.propTypes = {
  text: PropTypes.string.isRequired, // text属性是必须的
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // 既可以是string又可以是number，传入的参数必须是一个数组
  deleteItem: PropTypes.func,
  index: PropTypes.number
};

ListItem.defaultProps = {
  text: "hello" // text的默认值是"hello"
};

export default ListItem;
```
