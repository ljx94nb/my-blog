# 小米二面

小米二面只有一道 css 的布局题，太失败了我，先是理解题意就花了一点时间。

后续的布局利用 flex 和 absolute 混合在一起搞得特别混乱。

**所以个人建议，最好不要使用脱离文档流的方式布局！！！**

现在上题！！

![xiaomi](http://q7lqboz0i.bkt.clouddn.com/xiaomi.png "xiaomi")

整个布局宽度为屏幕宽度，最小高度为屏幕高度（根据文章标题多少高度自适应）

红色区域需要用边距实现

Logo 区域：高度 120px，宽度为屏幕剩余宽度

Home、Archives、About 区域：高度 120px，宽度 200px

Post 区域：高度为屏幕剩余高度，宽度为屏幕剩余宽度

Search 区域：,高度为 200px，宽度为 360px

Category 区域：高度为 Post 高度减去 Search 区域的高度，宽度为 360px

copyright 区域：高度为 120px，宽度为 100%

代码实现：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <style>
    * {
      margin: 0;
      padding: 0;
    }
    html,
    body {
      width: 100%;
      height: 100%;
    }
    .header {
      height: 120px;
      display: flex;
    }
    .home,
    .archives,
    .about {
      width: 200px;
    }
    .home {
      background-color: cornflowerblue;
    }
    .archives {
      background-color: darkseagreen;
    }
    .about {
      background-color: deeppink;
    }
    .logo {
      flex: 1;
      background-color: crimson;
    }
    .search {
      height: 200px;
      width: 360px;
      background-color: darkgreen;
    }
    .footer {
      height: 120px;
      width: 100%;
      background-color: darkgoldenrod;
    }
    .container {
      display: flex;
      justify-content: flex-end;
      margin: 0 100px;
      background-color: darkkhaki;
    }
    .all {
      display: flex;
      flex-direction: column;
    }
    .post {
      min-height: calc(
        755.2px - 240px
      ); /* 注意使用calc函数时运算符的左右两边都要留出一个空格 */
      flex: auto;
      background-color: cyan;
    }
    .category {
      width: 360px;
      flex: auto;
      background-color: darkmagenta;
    }
    .right {
      display: flex;
      flex-direction: column;
    }
  </style>
  <body>
    <div class="all">
      <div class="header">
        <div class="logo"></div>
        <div class="home"></div>
        <div class="archives"></div>
        <div class="about"></div>
      </div>
      <div class="container">
        <div class="post">
          <h1>hhh</h1>
          <h1>hhh</h1>
          <h1>hhh</h1>
          <h1>hhh</h1>
          <h1>hhh</h1>
          <h1>hhh</h1>
          <h1>hhh</h1>
          <h1>hhh</h1>
          <h1>hhh</h1>
          <h1>hhh</h1>
          <h1>hhh</h1>
        </div>
        <div class="right">
          <div class="search"></div>
          <div class="category"></div>
        </div>
      </div>
      <div class="footer"></div>
    </div>
  </body>
</html>
```

效果图：

![布局效果](http://q7lqboz0i.bkt.clouddn.com/buju.png "布局效果")
