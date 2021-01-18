# redux

## redux 工作流

![redux flow](http://q7lqboz0i.bkt.clouddn.com/redux.png "redux flow")

## redux 设计原则

1. store 必须是唯一的！
2. 只有 store 可以修改 state，reducer 中只是修改了新的副本，返回给 store 进行修改！
3. reducer 必须是纯函数————给固定的输入，就一定会有固定的输出，而且不要对参数修改！

例如：不要在 reducer 中掺杂异步的操作：发 Ajax 请求，使用获取时间的 new Date()。

**核心 API：createStore(),store.dispatch(action),store.getState(),store.subscribe(函数)——监听 store 的 state 变化改变组件的 state**

## redux 基本使用

### 一个例子————todoList

App.js

```javascript
import React, { Component } from "react";
import "antd/dist/antd.css";
import store from "./store";
import {
  getInputValueAction,
  getListItemAction,
  getDeleteItemAction,
} from "./store/actionCreator.js";
// 导入UI的函数式无状态组件
import AppUI from "./AppUI.js";

class App extends Component {
  constructor(props) {
    super(props);
    // 当store中的state发生改变时，这里是获取不到改变的值得，
    // 必须通过下面的store.subscribe();去监听state的改变，从而触发this.storeChange方法
    this.state = store.getState();

    this.handleInputChange = this.handleInputChange.bind(this);
    this.storeChange = this.storeChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.deleteItem = this.deleteItem.bind(this);

    // 当store中的state发生变化时触发下面的storeChange方法
    store.subscribe(this.storeChange);
  }

  render() {
    return (
      <AppUI
        inputValue={this.state.inputValue}
        list={this.state.list}
        handleInputChange={this.handleInputChange}
        handleClick={this.handleClick}
        deleteItem={this.deleteItem}
      />
    );
  }

  // input输入改变store中state数据
  handleInputChange(e) {
    var action = getInputValueAction(e.target.value);
    store.dispatch(action);
  }

  // 添加列表项
  handleClick() {
    var action = getListItemAction();
    store.dispatch(action);
  }

  // 删除列表项
  deleteItem(index) {
    var action = getDeleteItemAction(index);
    store.dispatch(action);
  }

  // 当store中的state发生改变时，改变组件的state
  storeChange() {
    this.setState(store.getState());
  }
}

export default App;
```

AppUI.js（函数式无状态 UI 组件）

```jsx
import React from "react";
import { Input, Button, List } from "antd";

export default (props) => {
  return (
    <div className="App" style={{ padding: "10px" }}>
      <Input
        placeholder="请输入"
        value={props.inputValue}
        style={{ width: "300px" }}
        onChange={props.handleInputChange}
      />
      <Button
        type="primary"
        style={{ marginLeft: "10px" }}
        onClick={props.handleClick}
      >
        Add
      </Button>

      <List
        style={{ width: "300px", marginTop: "10px" }}
        bordered
        dataSource={props.list}
        renderItem={(item, index) => (
          <List.Item onClick={(index) => props.deleteItem(index)}>
            {item}
          </List.Item>
        )}
      />
    </div>
  );
};
```

store 文件夹下的 index.js:

```javascript
import { createStore } from "redux";
import state from "./reducer";

var store = createStore(
  state,
  // 使用redux-tools监测必须加上
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
```

store 文件夹下的 reducer.js:

```javascript
import {
  TYPE_INPUT_VALUE,
  TYPE_LIST_ITEM,
  DELETE_ITEM,
} from "./actionTypes.js";

const defaultState = {
  inputValue: "Eric",
  list: [1, 2],
};

// reducer可以接收state，但是绝不可以修改state，所以要深拷贝创建一个副本，然后再返回修改后新的副本
// reducer 必须是纯函数————给固定的输入，就一定会有固定的输出，而且不要对参数修改！
// 例如：不要在 reducer 中掺杂异步的操作：发 Ajax 请求，使用获取时间的 new Date()。
export default (state = defaultState, action) => {
  if (action.type === TYPE_INPUT_VALUE) {
    let newState = JSON.parse(JSON.stringify(state));
    newState.inputValue = action.value;
    return newState;
  }
  if (action.type === TYPE_LIST_ITEM) {
    let newState = JSON.parse(JSON.stringify(state));
    newState.list.push(newState.inputValue);
    newState.inputValue = "";
    return newState;
  }
  if (action.type === DELETE_ITEM) {
    let newState = JSON.parse(JSON.stringify(state));
    newState.list.splice(action.index, 1);
    return newState;
  }
  return state;
};
```

store 文件夹下的 actionTypes.js:

```javascript
export const TYPE_INPUT_VALUE = "type_input_value";
export const TYPE_LIST_ITEM = "type_list_item";
export const DELETE_ITEM = "delete_item";
```

store 文件夹下的 actionCreator.js:

```javascript
import {
  TYPE_INPUT_VALUE,
  TYPE_LIST_ITEM,
  DELETE_ITEM,
} from "./actionTypes.js";

export const getInputValueAction = (value) => ({
  type: TYPE_INPUT_VALUE,
  value,
});
export const getListItemAction = () => ({
  type: TYPE_LIST_ITEM,
});
export const getDeleteItemAction = (index) => ({
  type: DELETE_ITEM,
  index,
});
```

## react-redux 结合 redux 使用

这两个结合一起使用可以达到一个组件和 store 的一个映射，就不需要使用 store.subscribe()了

1. 首先在全局的 index.js 内写入：

```javascript
// 以下这样使用react-redux那么dispatch()可以派发到任意一个reducer中
import { Provider } from "react-redux";
import store from "./store";

<Provider store={store}>
  <App />
</Provider>;
```

2. 在 App.js 中写入：

```javascript
import { connect } from "react-redux";

// 在类组件的外部写入如下：
// 将接受store中的state映射到props上
const mapStateToProps = (state) => {
  return {
    inputValue: state.inputValue,
    list: state.list,
  };
};

// 将发射改变store中state的action函数映射到props上
const mapActionToProps = (dispatch) => {
  return {
    handleInputValue(e) {
      const action = {
        type: "type_input_value",
        value: e.target.value,
      };
      dispatch(action);
    },

    // 发起Ajax的异步操作
    handleAjaxData() {
      axios.get("/data/data.json").then((res) => {
        const data = res.data;
        const action = {
          type: "type_ajax_data",
          data,
        };
        dispatch(action);
      });
    },

    handleDeleteItem(index) {
      const action = {
        type: "type_delete_item",
        index,
      };
      dispatch(action);
      console.log(index);
    },

    addItem() {
      const action = {
        type: "type_add_item",
      };
      dispatch(action);
    },
  };
};

export default connect(mapStateToProps, mapActionToProps)(App);
```

## 使用 immutable 和 redux-immutable 管理 redux 中的 state

目的：使 state 是不可变的，实际上就是不用我们去操作这一步：

```js
let newState = JSON.parse(JSON.stringify(state));
```

食用方法：

1. 在总的 reducer 文件（总小册子）下：

```js
import { combineReducers } from "redux-immutable";
import headerReducer from "../common/header/store";

export default combineReducers({
  header: headerReducer,
});
```

2. 在分支的 reducer 文件（分支小册子）下（state.set()或是 state.merge()）：

```js
import { SEARCH_FOCUS, SEARCH_BLUR, CHANGE_HEADER_LIST } from "./actionTypes";
import { fromJS } from "immutable";

const defaultState = fromJS({
  focused: false,
  headerList: []
});

export default (state = defaultState, action) => {
  // let newState = JSON.parse(JSON.stringify(state));
  switch (action.type) {
    case SEARCH_FOCUS:
      return state.set("focused", true);
    case SEARCH_BLUR:
      return state.set("focused", false);
    case CHANGE_HEADER_LIST:
      return state.merge({
        headerList: fromJS(action.headerList),
        ...
      });
    default:
      return state;
  }
};
```

3. 获得 immutable 数据（通过 get()或者是 getIn()）:

```js
// 映射到props的state
const mapStateToProps = (state) => {
  return {
    focused: state.get("header").get("focused"),
    // toJS()是原生js的方法，这里将immutable对象转换为普通js对象
    headerList: state.getIn(["header", "headerList"]).toJS(),
  };
};
```

**_注意一点：当项目的组件是 pureComponent，则项目的数据一定要用 immutable 管理，否则可能会出一些潜在的 bug！！！_**

## 通过 redux-thunk 发起 Ajax 请求

**1. 创建总 store 的 js 文件如下（别问！问就是复制粘贴！）：**

```js
import { createStore, applyMiddleware, compose } from "redux";
import state from "./reducer.js";
import thunk from "redux-thunk";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
  : compose;

const enhancer = composeEnhancers(applyMiddleware(thunk));

const store = createStore(state, enhancer);

export default store;
```

2. 在 actionCreators.js 文件下写一个 action 返回一个发起 Ajax 的函数：

```js
const changeHeaderList = (headerList) => {
  return {
    type: CHANGE_HEADER_LIST,
    // 存储在reducer中的list数组也要是immutable类型，
    // 所以要做一次转换
    headerList,
  };
};

export const getList = () => {
  return (dispatch) => {
    axios
      .get("/api/headerList.json")
      .then((res) => {
        dispatch(changeHeaderList(res.data.data));
        console.log(res.data);
      })
      .catch((error) => {
        throw error;
      });
  };
};
```

3. 触发这个发起 Ajax 操作的 action 的函数：

```js
handleInputFocus: (headerList) => {
  // 派发一个改变focus的函数
  dispatch(searchFocus());
  // 派发一个发起ajax请求的函数，当列表为空才会请求推荐数据
  if (headerList.size === 0) {
    dispatch(getList());
  }
};
```

## 通过 redux-saga 发起 Ajax 请求

1. store.js

```js
import { createStore, applyMiddleware, compose } from "redux";
import state from "./modules";
import createSagaMiddleware from "redux-saga";
import mySaga from "./middleware/sagas";

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
  : compose;

const enhancer = composeEnhancers(applyMiddleware(sagaMiddleware));

const store = createStore(state, enhancer);

// then run the saga
sagaMiddleware.run(mySaga);

export default store;
```

2. 在 redux/middleware/saga.js 中写入：

```js
// 下面的这些call，put，takeEvery，takeLatest前都要加上yield
// put相当于dispatch发送到相应处理actionTypes的reducer去
// takeEvery拦截到所有的action request
import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { homeActionTypes, homeActionCreators } from "../modules/home/actions";
import axios from "axios";

// 在这个函数中发起ajax请求
function* getLikesList(action) {
  try {
    console.log(action);
    const res = yield axios.get("/mock/products/likes.json");
    // dispatch一个请求成功的action，到相应的reducer中处理
    yield put(homeActionCreators.fetchLikesSuccess(res.data));
  } catch (error) {
    // dispatch一个请求失败的action，到相应的reducer中处理
    yield put(homeActionCreators.fetchLikesFailure(error));
  }
}

// 在组件中dispatch 的request会在这里拦截到，然后执行getLikesList函数
function* mySaga() {
  yield takeEvery(homeActionTypes.FETCH_LIKES_REQUEST, getLikesList);
}

export default mySaga;
```

3. 在组件中 dispatch actionCreators 中的 request action：

```js
useEffect(() => {
  handleLikesList();
}, []);

const mapDisPatchToProps = (dispatch) => {
  return {
    handleLikesList() {
      dispatch(homeActionCreators.fetchLikesRequest());
    },
  };
};
```
