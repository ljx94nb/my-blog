# react 基础

## react 实现 Vue 中的 v-model：

原理：每次组件中的 state 和 props 发生改变时，render 函数都会再被执行一次，即重新渲染

**_但是尤其要注意一点严格模式内的组件会导致生命周期函数的双调，即 render 会被双次调用。_**

TodoList 组件：

```javascript
render() {
  return (
    // 类似于Vue的template
    <Fragment>
      <div>
        <label htmlFor="insertArea">输入内容</label>
        <input
          id="insertArea"
          value={this.state.inputValue}
          onChange={this.handleInputChange} // input输入时触发，改变state中的值，使得render执行
        ></input>
        <button onClick={this.handleBtnClick}>提交</button>
      </div>
      <Vmodel content={this.state.inputValue}></Vmodel>
      <div>
        <ul>{this.loopListItem()}</ul>
      </div>
    </Fragment>
  );
}
```

Vmodel 组件：

```javascript
import React, { Component } from "react";

class Vmodel extends Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return <div>{this.props.content}</div>; // props改变，render执行渲染到页面上，实现了v-model
  }
}
export default Vmodel;
```

## react 的生命周期

![react生命周期](http://q7lqboz0i.bkt.clouddn.com/react%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F.png "react生命周期")

对以上的生命周期函数做一些解释：

1. Initialization 阶段（相当于 vue 的 created）：constructor 执行，做一些数据的初始化

2. Mounting 阶段：componentWillMount 和 componentDidMount 在组件加载时执行一次，而 render 会在 state 或者 props 改变后执行多次，并且是必须存在的，其他生命周期函数都可以不写。

（1）shouldComponentUpdate：当父组件中 state 频繁改变会触发 render 函数，导致子组件频繁触发 render 函数。此时我们需要在子组件的 shouldComponentUpdate 中判断是否需要 render 子组件

**相同防止不必要组件的重新渲染还可以让组件继承 pureComponent 实现，或者是使用 const zujian=memo（函数是组件），此时的组件便不会被重新渲染**

```javascript
// ListItem子组件中
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.content !== this.props.content) {
      return true;
    } else {
      return false;
    }
  }
```

（2）componentDidMount（相当于 vue 的 mounted）：发起 Ajax 请求

3. Updating 阶段：componentWillReceiveProps 的执行需要满足两个条件：

（1）这个组件要从父组件接收 props

（2）如果这个组件第一次存在于父组件中，不会执行；

如果这个组件之前已经存在于父组件中，才会执行。

```javascript
  componentWillReceiveProps(nextProps, nextState) {
    console.log(nextProps.content);
  }
```

## react 中的样式写法—采用 styled-components

1. 全局样式的引入

```javascript
import { createGlobalStyle } from "styled-components";

// 注意使用createGlobalStyle替代injectGlobal使用全局样式
export const GlobalStyle = createGlobalStyle`
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}
`;
```

在全局的 index.js 中使用全局组件样式：

```js
import { GlobalStyle } from "./styled-css";

// 1. 使用全局样式组件必须是非封闭式
// 2. 在这个非封闭式的标签下的组件样式都会采用这个全局样式
  <GlobalStyle />
  <App />
```

1. 基本组件式样式

```javascript
import styled from "styled-components";
import LogoPng from "../../statics/logo.png";

// 头部的盒子
export const HeaderWrapper = styled.div`
  z-index: 1;
  position: relative;
  height: 56px;
  border-bottom: 1px solid #f0f0f0;
`;

// 头部简书logo的盒子
export const Logo = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 100px;
  height: 56px;
  background: url(${LogoPng});
  background-size: contain;
`;
```

3. styled-components 结合阿里 iconfont 图标库的一些坑

在项目中引入阿里 iconfont 图标：

- 在阿里官网创建一个新的图标项目
- 选中中意的图标，并添加到项目中
- 下载到本地
- 选择相应的文件放到自己项目的 iconfont 文件夹下：

**iconfont.eot，iconfont.svg，iconfont.ttf，iconfont.woff，iconfont.css（后会改成 iconfont.js）**

将 iconfont.css 改成 iconfont.js：

```js
import { createGlobalStyle } from "styled-components";

export const IconFontStyle = createGlobalStyle`
@font-face {font-family: "iconfont";
  src: url('./iconfont.eot?t=1586619949271'); /* IE9 */
  src: url('./iconfont.eot?t=1586619949271#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAOcAAsAAAAAB4wAAANOAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDBgqCcIJbATYCJAMMCwgABCAFhG0HOhulBsieA247POY00gt/b8qbyslQBNmwzd7dt0pxoEp3+B5fqkKiQOFwSFQxugqJQ6MJuhvB4ByaNQMGVgjsCiN2u7v8uzCnGaCcxbi5sSI+sS6lQFmBtDta+wQIGDbgcvpTfJ5luYy5bA9+DDAOKNC9rE1WgBhww9gFLfE0gaZJiii2TndvUFWYkwJxZmgiVDNepaE11IVqxcoibgGVerpGbgA3wffjj3q0JJXMPGv79KjA5pP95xuWkqUCcxkonS4Mto6MJUAhTiqjxwpRfgnUVK3F5tqqIqSpUiRJoNXs1Y3+8BJRZTa3wRwsJD7ZHQXB5/cqCWRQ9RjFc+AesaO7ZandLsuSETjuTRA+GOaFosG22TNUp3fC8TzvtVdBfQz1HFkQbNuir5fdiJ+BolxcO7KKLZ1crQwNPO3HJgyjMtinD/EozFM2FYu+ebdwD8u2d7eNcU6iinYnCIN2nlWMi6GdUCAIrta7g8BWePoKWy3X6Tl0tUBPq3WetTSWIlPTSCmumJoqhSUFpEWV0xweDG8ftfa/AIaXQtd/KUPXgF33VpRTKLx3YUkv37CdeV+Hw9kwzXaSFVllusx5NpGzN0cqqfTz7anVaK8eNfczl93+KmecWentzsz9bzfFkRrznBWJ9p8r5m7VZr1y7fTJKfvqBW6NYByZo+6gjJz+ER8M8HsCAeD/DQ5AUfI/WVpgvvpNl3m+FdIOYTH8W2Uo4H2DRikwdosD9ZuIBT/FXUAD8c+oGUxfLopFo9aIZzs3GE5ANU/4B2Zy6GW4bWxyrRevG0uQ1Ewgq5siC7uEipYVVNWtommRzfqWEekKojSwoAog9M0j6XpB1ndLFvYZFeN+UdUPoukwOHZsmSmubuGTGJKC4XkYF8GuagfCetj6Qlpki37aEHAf5AdGCtWUVfOlM7nkTzEnI1sbZ2aqGJ3ODlqD88i2GVPT2SQ57MdmhpeZikp01Zv6ESkO1G3yEVGIKFC4DIojYy7V6x2qFz7/gmgiNpHfIKsqfyC+gDE4UqNMtQN5trqdZLdyTYaYZixTSIWi+ZgDWYMwsa08Q6nVw0xEFuqLHZC9mFFB3aK7WvvL25332wdN5uE5UuQoqhccBRFX8iJHZMkAAAAA') format('woff2'),
  url('./iconfont.woff?t=1586619949271') format('woff'),
  url('./iconfont.ttf?t=1586619949271') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
  url('./iconfont.svg?t=1586619949271#iconfont') format('svg'); /* iOS 4.1- */
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
`;
```

在项目的组件结构下引入全局样式 iconfont 组件：

```js
import { IconFontStyle } from "../../statics/iconfont/iconfont";

<IconFontStyle />
......
// 必须是非封闭的标签
// 下面的组件都会使用这个iconfont的样式
<Button className="writting">
  <i className="iconfont">&#xe6e5;</i>
  &nbsp;&nbsp;写文章
</Button>
```

## react 使用动画（react-transtion-group）

- 组件部分

```js
import { CSSTransition } from "react-transition-group";

<CSSTransition in={this.state.focused} timeout={300} classNames="focus">
  <NavSearch
    className={this.state.focused ? "focused" : ""}
    onFocus={this.handleInputFocus}
    onBlur={this.handleInputBlur}
  ></NavSearch>
</CSSTransition>;
```

- 样式部分

```js
// search搜索框
export const NavSearch = styled.input.attrs({
  placeholder: "搜索",
})`
  &.focused {
    width: 240px;
  }

  // 使用CSSTranstion标签包裹的单个标签上会加上以下
  // 这几个className
  &.focus-enter {
    width: 160px;
  }
  &.focus-enter-active {
    width: 240px;
    transition: all 0.3s ease-out;
  }
  &.focus-exit {
    width: 240px;
  }
  &.focus-exit-active {
    width: 160px;
    transition: all 0.3s ease-out;
  }
`;
```

## react 使用路由

使用 react-router-dom 管理路由：

```js
// BrowserRouter使用history路由
// HashRouter使用hash路由
// 用Switch包裹Route
// 注意route的组件里还可以在使用route，通过props.match.path获取到上一级路由
import { BrowserRouter, HashRouter, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Detail from "./pages/Detail";

<div className="App">
  <BrowserRouter>
    // BrowserRouter内必须是一个标签，需要包裹一个外部的空标签
    <>
      // Header组件中的logo加了一层Link用于页面的跳转
      <Header />
      // 有了switch可以不用exact，会从上往下只匹配一次，匹配到了就不匹配了
      <Switch>
        // 匹配id的路由，在详情页通过this.props.match.params.id获取
        <Route path="/detail/:id" exact component={Detail}></Route>
        // 必须加上exact，否则路由为/detail的时候会显示两个页面！
        <Route path="/" exact component={Home}></Route>
      </Switch>
    </>
  </BrowserRouter>
</div>;
```

Header 组件中

```js
import { Link } from "react-router-dom";

function Header(props) {
  return(
    ...
      // 传递参数id
      <Link to={"./detail"+id}>
        <Logo />
      </Link>
    ...
  )
}
```

## react 异步加载组件—使用 react-loadable

1. 在需要异步加载的组件目录下创建一个 loadable.js:

```js
import React from "react";
import Loadable from "react-loadable";

const LoadableComponent = Loadable({
  loader: () => import("./"),
  loading() {
    return <div>loading</div>;
  },
});

export default () => <LoadableComponent />;
```

2. 在组件目录下的 index.jsx 文件中导出组件时使用 withRouter(组件名):

**目的是使用 router 的时候可以通过 this.props.match 获得路由对象**。

```js
import { withRouter } from "react-router-dom";
...
export default withRouter(Detail);
```

3. 在路由页面导入：

```js
import Detail from "./pages/Detail/loadable";
...
<Route path="/detail/:id" exact component={Detail}></Route>
```
