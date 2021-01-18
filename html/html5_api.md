# html5 新兴 API

## 1 网络状态

我们可以通过 window.navigator.onLine 来检测，用户当前的网络状况，返回一个布尔值， 但是不同浏览器会存在差异

所以 HTML5 给我们提供了 2 个事件 online 和 offline

online 用户网络连接时被调用

offline 用户网络断开时被调用

他们监听的对象都是 window

## 2 全屏

HTML5 规范允许用户自定义网页上任一元素全屏显示。

1、Node.requestFullScreen() 开启全屏显示

2、Node.cancelFullScreen() 关闭全屏显示

由于其兼容性原因，不同浏览器需要添加前缀如：

webkit 内核浏览器：webkitRequestFullScreen、webkitCancelFullScreen，如 chrome 浏览器。

Gecko 内核浏览器：mozRequestFullScreen、mozCancelFullScreen，如火狐浏览器。

ms 微软 msRequestFullscreen

3、document.fullScreen 检测当前是否处于全屏

不同浏览器需要添加前缀

document.webkitIsFullScreen、document.mozFullScreen

全屏伪类选择器 也有兼容性问题 需要添加前缀思密达

:full-screen 、:-webkit-full-screen {}、:moz-full-screen {}

## 3 文件读取

我们想： 可以吧上传的文件，内容显示到页面？ 或者 上传完毕图片显示缩略图到页面上。。。

通过 FileReader 对象我们可以读取本地存储的文件，使用 [File ](https://developer.mozilla.org/zh-CN/docs/DOM/File)对象来指定所要读取的文件或数据。其中 File 对象可以是来自用户在一个 [ ](https://developer.mozilla.org/zh-CN/docs/HTML/Element/input)元素上选择文件后返回的[FileList ](https://developer.mozilla.org/zh-CN/docs/DOM/FileList)对象，也可以来自由拖放操作生成的 [DataTransfer](https://developer.mozilla.org/zh-CN/DragDrop/DataTransfer)

### 3.1 Files 对象

由于 HTML5 中我们可以通过为表单元素添加 multiple 属性，因此我们通过`<input>`上传文件后得到的是一个 Files 对象（伪数组形式）。

### 3.2FileReader 对象

HTML5 新增内建对象，可以读取本地文件内容。

var reader = new FileReader; 可以实例化一个对象

实例方法

1、[readAsDataURL](<#readAsDataURL()>)() 以 DataURL 形式读取文件

事件监听

onload 当文读取完成时调用

属性

result 文件读取结果

[参考资料](#toc)

https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader

参考代码

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
  </head>
  <body>
    <input type="file" name="" id="" multiple />
    <div></div>
    <script>
      // 1. 上传我们的文件  借助于 文件域  input file
      var file = document.querySelector("input");
      var div = document.querySelector("div");
      file.onchange = function() {
        //  onchange 当发生改变的时候   下拉菜单 select 也是这个事件
        // 迭代file这个input节点中的属性
        // console.log(file);
        // for( var k in file) {
        // 	console.log( k + "~~~~" + file[k]);
        // }
        console.log(this.files); // 上传文件的集合 可以是一个文件也可以是很多

        // 2. 选择我们要的文件， 进行 读取  fileReader  文件里面的内容
        // 初始化了一个 reader 对象
        var reader = new FileReader();

        // reader.readAsText(文件对象);
        // 读取 this.files[0] 文件里面的内容
        reader.readAsText(this.files[0]);
        // 实现读取图片，this.result为一个base64编码
        reader.readAsDataURL(this.files[0]);

        // 当这个文件的内容读取完毕之后 ，会把内容存放到  result里面

        // 3. 把读取的内容显示到 页面中..
        // reader 已经读取完毕 而且读取的内容 存放到了  result里面了
        reader.onload = function() {
          div.innerHTML = this.result;
        };
      };
    </script>
  </body>
</html>
```

## 4 地理定位

在 HTML 规范中，增加了获取用户地理信息的 API，这样使得我们可以基于用户位置开发互联网应用，即基于位置服务 (Location Base Service)

### 4.1 API 详解

1、获取当前地理信息

navigator.geolocation.getCurrentPosition(successCallback, errorCallback)

2、重复获取当前地理信息

navigator. geolocation.watchPosition(successCallback, errorCallback)

当成功获取地理信息后，会调用 succssCallback，并返回一个包含位置信息的对象 position。

position.coords.latitude 纬度

position.coords.longitude 经度

position.coords.accuracy 精度

position.coords.altitude 海拔高度

当获取地理信息失败后，会调用 errorCallback，并返回错误信息 error

http://www.w3school.com.cn/html5/html_5_geolocation.asp

### 4.2 应用

在现实开发中，通过调用第三方 API（如百度地图）来实现地理定位信息，这些 API 都是基于用户当前位置的，并将用位置位置（经/纬度）当做参数传递，就可以实现相应的功能。

http://lbsyun.baidu.com/ 百度地图 api

## 5 拖拽

在 HTML5 中，拖放是标准的一部分，任何元素都能够拖放。

### 5.1 拖拽和释放

拖拽：Drag

释放：Drop

拖拽指的是鼠标点击源对象后一直移动对象不松手，一但松手即释放了

### 5.2 设置元素为可拖放

draggable 属性：就是标签元素要设置 draggable=true，否则不会有效果

注意： 链接和图片默认是可拖动的，不需要 draggable 属性。

### 5.2 拖拽 API 的相关事件

**被拖动的源对象可以触发的事件：**

(1)ondragstart：源对象开始被拖动

(2)ondrag：源对象被拖动过程中(鼠标可能在移动也可能未移动)

(3)ondragend：源对象被拖动结束

**拖动源对象可以进入到上方的目标对象可以触发的事件：**

(1)ondragenter：目标对象被源对象拖动着进入

(2)ondragover：目标对象被源对象拖动着悬停在上方

(3)ondragleave：源对象拖动着离开了目标对象

(4)ondrop：源对象拖动着在目标对象上方释放/松手(**_需要在 ondragover 函数中 return false 或者是 e.preventDefault() 才可以触发此函数_**)

**在目标对象中 appendChild 时不用删除源对象，源对象会被自动删除**

拖拽 API 总共就是 7 个函数！！

### 5.3 DataTransfer

在进行拖放操作时，`DataTransfer` 对象用来保存被拖动的数据。它可以保存一项或多项数据、一种或者多种数据类型

## 6 Web 存储

随着互联网的快速发展，基于网页的应用越来越普遍，同时也变的越来越复杂，为了满足各种各样的需求，会经常性在本地存储大量的数据，HTML5 规范提出了相关解决方案。

### 6.1 特性

1、设置、读取方便、页面刷新不丢失数据

2、容量较大，sessionStorage 约 5M、localStorage 约 20M

4、只能存储字符串，可以将对象 JSON.stringify() 编码后存储

### 6.2 window.sessionStorage

1、生命周期为关闭浏览器窗口

2、在同一个窗口(页面)下数据可以共享

### 6.3 window.localStorage

1、永久生效，除非手动删除 关闭页面也会存在

2、可以多窗口（页面）共享（同一浏览器可以共享）

### 6.4 方法详解

setItem(key, value) 设置存储内容

getItem(key) 读取存储内容

removeItem(key) 删除键值为 key 的存储内容

clear() 清空所有存储内容

### 6.5 其它

WebSQL、IndexDB

#### 6.5.1 indexedDB 基本使用

```javascript
var request = indexedDB.open("test");
var db; // test数据库对象

request.onerror = function() {
  console.log("连接数据库失败");
};

request.onsuccess = function(e) {
  // 连接成功之后会创建一个test的db数据库对象放在e.target.result中
  db = e.target.result;
  console.log("连接数据库成功");
};

// 要创建一个对象仓库必须在upgradeneeded事件中，
// 而upgradeneeded事件只会在版本号更新的时候触发，
// 这是因为IndexedDB API中不允许数据库中的数据仓库在同一版本中发生变化
request.onupgradeneeded = function(e) {
  // 创建objectStore
  db.createObjectStore("person", {
    keyPath: "id",
    autoIncrement: true // 允许主键id自增
  });
  // 创建事务，用来对store中的数据进行操作的
  var transaction = db.transaction("person", "readwrite");
  // 将事务与objectStore相关联，获得一个操作对象
  var store = transaction.objectStore("person");
  // 利用操作对象操作数据：返回一个promise，利用promise的onsuccess方法判断是否操作成功
  store.put({
    id: 1,
    name: "Eric",
    age: 22,
    gender: "male"
  }).onsuccess = function() {
    console.log("保存成功");
  };
};
```

## 7 应用缓存

HTML5 中我们可以轻松的构建一个离线（无网络状态）应用，只需要创建一个 cache manifest 文件。

### 7.1 优势

1、可配置需要缓存的资源

2、网络无连接应用仍可用

3、本地读取缓存资源，提升访问速度，增强用户体验

4、减少请求，缓解服务器负担

### 7.2 缓存清单

一个普通文本文件，其中列出了浏览器应缓存以供离线访问的资源，推荐使用.appcache 为后缀名

例如我们创建了一个名为 demo.appcache 的文件，然后在需要应用缓存在页面的根元素(html)添加属性 manifest="demo.appcache"，路径要保证正确。

### 7.3 manifest 文件格式\*

1、顶行写 CACHE MANIFEST

2、CACHE: 换行 指定我们需要缓存的静态资源，如.css、image、js 等

3、NETWORK: 换行 指定需要在线访问的资源，可使用通配符

4、FALLBACK: 换行 当被缓存的文件找不到时的备用资源

### 7.4 其它

1、CACHE: 可以省略，这种情况下将需要缓存的资源写在 CACHE MANIFEST

2、可以指定多个 CACHE: NETWORK: FALLBACK:，无顺序限制

3、#表示注释，只有当 demo.appcache 文件内容发生改变时或者手动清除缓存后，才会重新缓存。

4、chrome 可以通过 chrome://appcache-internals/工具和离线（offline）模式来调试管理应用缓存

## 8 多媒体

方法：load()、play()、pause()

属性：currentSrc、currentTime、duration

事件：oncanplay， ontimeupdate，onended 等

[**参考文档**](http://www.w3school.com.cn/tags/html_ref_audio_video_dom.asp)

http://www.w3school.com.cn/tags/html_ref_audio_video_dom.asp

## 9 requestAnimationFrame

使用 requestAnimationFrame 的好处：

按照系统的刷新频率达到每帧只在页面上渲染一次，没有多余的渲染，也不会丢帧，节省 cpu，gpu，内存的消耗

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Document</title>
    <style>
      #box {
        width: 100px;
        height: 100px;
        background-color: red;
        position: absolute;
        left: 0;
        top: 0;
      }
      #button {
        position: absolute;
        top: 150px;
      }
    </style>
  </head>

  <body>
    <div id="box"></div>
    <button id="button">点击</button>

    <script>
      var box = document.getElementById("box");
      var button = document.getElementById("button");

      var step = 1;

      // 1. 使用requestAnimationFrame时传入的参数为一个回调，此回调会按照系统的刷新频率渲染动画
      // 回调函数中利用递归实现每帧的动画
      function raf() {
        box.style.left = step + "px";
        step += 1;
        if (step < 200) {
          requestAnimationFrame(raf);
        }
      }

      // 2. 使用setInterval
      function timeAnimation() {
        return (timer = setInterval(() => {
          box.style.left = step + "px";
          step += 1;
          if (step >= 200) {
            clearInterval(timer);
          }
        }, 1000 / 60));
      }

      button.addEventListener("click", () => {
        requestAnimationFrame(raf);
        // timeAnimation();
      });
    </script>
  </body>
</html>
```
