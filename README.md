# EventHelper
![](https://travis-ci.org/yvanwangl/EventHelper.svg?branch=master)
[![coverage](https://codecov.io/gh/yvanwangl/EventHelper/branch/master/graph/badge.svg)](https://codecov.io/gh/yvanwangl/EventHelper)

一个基于事件机制的异步事件处理工具。<br>
EventHelper只做一件事，就是将使用者从异步回调的地狱中解脱出来！<br>

EventHelper具有以下几个特征：<br>
1、解耦异步事件与数据处理逻辑<br>
2、让使用者彻底远离异步编程的回调地狱<br>
3、将多个串行回调处理的异步事件变为并行处理，提升业务执行效率<br>
4、统一处理异步事件错误的机制<br>
5、Web前端与Node后端均可使用<br>

### 如何安装
1、如果你使用npm
```
npm install eventhelper
```
2、如果你直接引入
```
<script type='text/script' src="https://github.com/yvanwangl/EventHelper/blob/master/lib/eventhelper.js"></script>
```

### 如何创建一个EventHelper对象：
new 关键字调用:
```
let emmiter = new EventHelper();
```
或者可以调用静态方法：
```
let emmiter = EventHelper.create();
```

### API:

1、on/addListener/subscribe/bind:<br>
用途：绑定一个自定义事件监听函数<br>
参数：on(eventType:String, handler:Function)<br>
使用方式：<br>
```
let emmiter = new EventHelper();
emmiter.on('read', (content)=> console.log(content));
搭配emit方法使用才有效果:)
let fs = require('fs');
fs.readFile('demo.txt', 'utf-8', (err, data)=> emmiter.emit('read', data));
```

2、emit/trigger/fire:<br>
用途：触发一个自定义事件<br>
参数：emit(eventType:String, data:Any)<br>
使用方式，搭配on使用效果才好:)<br>
```
let emmiter = new EventHelper();
emmiter.on('read', (content)=> console.log(content));
let fs = require('fs');
fs.readFile('demo.txt', 'utf-8', (err, data)=> emmiter.emit('read', data));
```

3、




