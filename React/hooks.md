# react hooks 基本使用

## hook 实例

- 父组件

```javascript
import React, {
  useState,
  useEffect,
  createContext,
  lazy,
  Suspense,
} from "react";

// 预加载
// import ZiZujian from "./component/ZiZujian";

// lazy懒加载
const ZiZujian = lazy(() => import("./component/ZiZujian"));

export const Context = createContext();

function App() {
  const [count, setCount] = useState(() => {
    // 只在组件第一次渲染时执行，后续改变count的值不会重新初始值
    // console.log("render");
    return 0;
  });

  // 相当于componentDidMount，componentDidUpdate，componentWillUnmount合并
  useEffect(() => {
    // 空数组就不会执行里面的代码，里面填一个state的值就是监听这个值的改变，一改变就执行里面的代码
    document.title = `${count}`;
    console.log("rerender");
  }, [count]);

  return (
    <div className="App">
      // 只有一个value属性，如果有多个值要传递，可以传一个对象
      <Context.Provider value={count}>
        <Suspense fallback={<div>loading</div>}>
          <ZiZujian></ZiZujian>
        </Suspense>
      </Context.Provider>
      <p>{count}</p>
      <button
        onClick={() => {
          setCount((count) => {
            // 如果返回相同的count值，组件是不会重新渲染的！
            return ++count;
          });
        }}
      >
        +1
      </button>
    </div>
  );
}

export default App;
```

- 子组件

```javascript
import React, { useContext } from "react";
import { Context } from "../App";

function Zi() {
  const count = useContext(Context);
  console.log("子组件被渲染了");
  return (
    <div>
      <h3>这是子组件：{count}</h3>
    </div>
  );
}

export default Zi;
```

## 自定义一个获取改变浏览器窗口后的大小的 hook

```javascript
export const useWindow = () => {
  const [size, setSize] = useState(() => {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    };
  });

  const onSize = useCallback(() => {
    setSize(() => {
      return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
      };
    });
  });

  // 相当于componentDidMount，componentDidUpdate，componentWillUnmount合并
  useEffect(() => {
    window.addEventListener("resize", onSize);
    return () => {
      window.removeEventListener("resize", onSize);
    };
  }, []);
  // 空数组表示只在组件首次渲染绑定事件，通过return返回一个解绑事件（在componentWillUnmount中执行）

  return size;
};
```

## 使用 useRef()创造类成员 static 变量，即组件重新渲染，成员变量不会初始化

```javascript
const [count, setCount] = useState(() => {
  return 0;
});

// 通过useRef声明一个类成员变量
const refCount = useRef();
// 更新组件的时候记录一次count的pre值
useEffect(() => {
  refCount.current = count;
});

// 创造了一个自增的id
const id = useRef(0);
useEffect(() => {
  id.current = id.current + 1;
});

console.log(`${refCount.current}+${count}`);
```

## 使用 uesReducer 创建 store

- 只用创建一个 reduer.js 就好了

```javascript
// reducer.js
export default (state, action) => {
  let newState = JSON.parse(JSON.stringify(state));
  switch (action.type) {
    case "add_item":
      newState.list.push(action.obj);
      return newState;
    case "delete_item":
      let newList = newState.list.filter((item) => {
        return item.id !== action.id;
      });
      newState.list = newList;
      return newState;
  }
  return state;
};
```

- app.jsx 的 TodoList 组件

```javascript
import reducer from "./store/reducer";

const [state, dispatch] = useReducer(reducer, {
  inputValue: "Eric",
  list: [],
});

// 改变inputValue的值
const changeInputValue = useCallback((e) => {
  let action = {
    type: "change_inputValue",
    value: e.target.value,
  };
  dispatch(action);
}, []);

// 增加列表项
const addItem = useCallback((obj) => {
  let action = {
    type: "add_item",
    obj,
  };
  dispatch(action);
}, []);

// 删除列表项
const deleteItem = useCallback((id) => {
  let action = {
    type: "delete_item",
    id,
  };
  dispatch(action);
}, []);

return (
  <div>
    <Context.Provider value={{ state, dispatch }}>
      <Todo
        value={state.inputValue}
        addItem={addItem}
        changeInputValue={changeInputValue}
      ></Todo>
      <List list={state.list} deleteItem={deleteItem}></List>
    </Context.Provider>
  </div>
);
```

```javascript
// 在app.jsx的全局作用域下（即组件外部）创建一个全局的context
const Context = createContext();

// 这样在每个被<Context.Provider></Context.Provider>包裹下的组件

// 内部可以通过以下访问{state,dispatch}
const { state, dispatch } = useContext(Context);
```

**注意：以上的仅仅使用 useReducer 还不可以实现一个真正的 redux 数据共享仓库，需要搭配 useContext 使用**

## useCallback 使用场景

一般会觉得使用 useCallback 的性能会比普通重新定义函数的性能好， 如下面例子：

```js
function App() {
  const [val, setVal] = useState("");

  const onChange = (evt) => {
    setVal(evt.target.value);
  };

  return <input val={val} onChange={onChange} />;
}
```

将 onChange 改为：

```js
const onChange = useCallback((evt) => {
  setVal(evt.target.value);
}, []);
```

实际性能会更差。究其原因，上面的写法几乎等同于下面：

```js
const temp = (evt) => {
  setVal(evt.target.value);
};

const onChange = useCallback(temp, []);
```

可以看到 onChange 的定义是省不了的，而且额外还要加上调用 useCallback 产生的开销，性能怎么可能会更好？

真正有助于性能改善的，有 2 种场景：

- 函数定义时需要进行大量运算， 这种场景极少
- **需要比较引用的场景，如上文提到的 useEffect，又或者是配合 React.Memo 使用**：

```js
const Child = React.memo(function({ val, onChange }) {
  console.log("render...");

  return <input value={val} onChange={onChange} />;
});

function App() {
  const [val1, setVal1] = useState("");
  const [val2, setVal2] = useState("");

  const onChange1 = useCallback((evt) => {
    setVal1(evt.target.value);
  }, []);

  const onChange2 = useCallback((evt) => {
    setVal2(evt.target.value);
  }, []);

  return (
    <>
      <Child val={val1} onChange={onChange1} />
      <Child val={val2} onChange={onChange2} />
    </>
  );
}
```

上面的例子中，如果不用 useCallback, 任何一个输入框的变化都会导致另一个输入框重新渲染。
