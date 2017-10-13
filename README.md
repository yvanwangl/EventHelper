# EventHelper
![](https://travis-ci.org/yvanwangl/EventHelper.svg?branch=master)
[![coverage](https://codecov.io/gh/yvanwangl/EventHelper/branch/master/graph/badge.svg)](https://codecov.io/gh/yvanwangl/EventHelper)
[![npm version](https://badge.fury.io/js/eventhelper.svg)](https://badge.fury.io/js/eventhelper)
[![NPM downloads](http://img.shields.io/npm/dy/eventhelper.svg?style=flat)](https://www.npmjs.com/package/eventhelper)

一个基于事件机制的异步事件处理工具。<br>
EventHelper只做一件事，就是将使用者从异步回调的地狱中解脱出来！<br>

EventHelper具有以下几个特征：<br>
1、解耦异步事件与数据处理逻辑<br>
2、让使用者彻底远离异步编程的回调地狱<br>
3、将多个串行回调处理的异步事件变为并行处理，提升业务执行效率<br>
4、统一处理异步事件错误的机制<br>
5、Web前端与Node后端均可使用<br>

#### [中文文档](https://yvanwangl.gitbooks.io/eventhelper/content/)

### 如何安装
1、如果你使用npm
```
npm install eventhelper
```
2、如果你直接引入
```
<script type='text/javascript' src="https://cdn.rawgit.com/yvanwangl/EventHelper/master/lib/eventhelper.js"></script>
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

1、on/addListener/subscribe/bind：<br>
用途：绑定一个自定义事件监听函数<br>
参数：on(eventType:String, handler:Function)<br>
返回值：EventHelper实例对象<br>
使用方式：<br>
```
let emmiter = new EventHelper();
emmiter.on('read', (content)=> console.log(content));
搭配emit方法使用才有效果:)
let fs = require('fs');
fs.readFile('demo.txt', 'utf-8', (err, data)=> emmiter.emit('read', data));
```

2、emit/trigger/fire：<br>
用途：触发一个自定义事件<br>
参数：emit(eventType:String, data:Any)<br>
返回值：EventHelper实例对象<br>
使用方式，搭配on使用效果才好:)<br>
```
let emmiter = new EventHelper();
emmiter.on('read', (content)=> console.log(content));
let fs = require('fs');
fs.readFile('demo.txt', 'utf-8', (err, data)=> emmiter.emit('read', data));
```

3、all/assign：<br>
用途：监听多个自定义事件，并对数据结果进行处理<br>
参数：all(eventType1:String, eventType2:String, eventType2:String, handler:Function)<br>
返回值：EventHelper实例对象<br>
使用方式：
```
let emmiter = new EventHelper();
emmiter.all('read', 'write', (read, write)=>{
    console.log(read);
    console.log(write)
});
fs.readFile('./mock/read.txt', 'utf-8', (err, data)=> emmiter.emit('read', data));
fs.readFile('./mock/write.txt', 'utf-8', (err, data)=> emmiter.emit('write', data));
```
all会监听多个自定义事件，直到所有事件都触发之后才会触发回调函数，回调函数的参数会按照自定义事件的顺序进行排列。<br>

4、race：<br>
用途：多个自定义事件的竞争<br>
参数：race(eventType1:String, eventType2:String, handler:Function)<br>
返回值：EventHelper实例对象<br>
使用方式：
```
let emmiter = new EventHelper();
emmiter.race('time300', 'time500', ({eventType, data})=>{
    console.log(eventType); //'time300'
    console.log(data);     //300
});
setTimeout(()=> emmiter.emit('time300', 300), 300);
setTimeout(()=> emmiter.emitLater('time500', 500), 500);
```
race用于多个竞态异步事件的处理，回调函数参数为一个封装的对象，会返回竞争成功的事件类型及数据。
```
{eventType: 'eventType1', data:'data'}
```

5、tail/combineLastest：<br>
用途：持续触发多个自定义事件数据更新<br>
参数：tail(eventType1:String, eventType2:String, handler:Function)<br>
返回值：EventHelper实例对象<br>
使用方式：
```
let times = 0;
let time300Values = [];
let time500Values = [];
let interval300;
let interval500;
emmiter.tail('time300', 'time500', (time300, time500)=>{
    time300Values.push(time300);
    time500Values.push(time500);
    times++;
    if(times==2){
        console.log(time300Values.length);   //2
        console.log(time300Values)           //[300, 600]
        console.log(time500Values.length);   //2
        console.log(time500Values);          //[500, 500]
        clearInterval(interval300);
        clearInterval(interval500);
    }
});
interval300 = setInterval(()=> emmiter.emit('time300', (times+1)*300), 300);
interval500 = setInterval(()=> emmiter.emit('time500', (times+1)*500), 500);        
  ```
tail必须多个自定义事件均完成至少一次，才会触发回调函数的执行，后续每个自定义事件数据的更新均会触发回调函数的执行，回调函数中数据的顺序按照自定义事件的顺序排列<br>

6、headbind：<br>
用途：将一个自定义事件的回调函数绑定到该事件回调执行队列的头部<br>
参数：headbind(eventType:String, handler:Function)<br>
返回值：EventHelper实例对象<br>
使用方式：
```
let emmiter = new EventHelper();
emmiter.on('read', (content)=> console.log(`${on}:content`))
emmiter.bindhead('read', (content)=> console.log(`${bindhead}:content`));
let fs = require('fs');
fs.readFile('demo.txt', 'utf-8', (err, data)=> emmiter.emit('read', data));
```
headbind将一个回调处理函数放置到eventType事件队列的头部，优先执行<br>

7、un/removeListener/unsubscribe/unbind：<br>
用途：移除一个自定义事件的一个或全部监听函数<br>
参数：un(eventType:String[,handler:Function])<br>
返回值：EventHelper实例对象<br>
使用方式：
```
let emmiter = new EventHelper();
let handler = ()=> console.log('test handler');
emmiter.on('test', handler);
emmiter.emit('test');           //'test handler'
emmiter.un('test', handler);
emmiter.emit('test');           //
```
hanlder参数非必填<br>
FBI WARNING: 如果不传递handler参数，将会移除自定义事件的所有监听函数<br>

8、unAllListeners/removeAllListeners/unbindAllListeners：<br>
用途：移除一个自定义事件的全部监听函数<br>
参数：un(eventType:String)<br>
返回值：EventHelper实例对象<br>
使用方式：
```
let emmiter = new EventHelper();
let handler = ()=> console.log('test handler');
emmiter.on('test', handler);
emmiter.emit('test');           //'test handler'
emmiter.un('test');
emmiter.emit('test');           //
```
unAllListeners内部调用un方法，所以un(eventType)等同于unAllListeners(eventType)<br>

9、once：<br>
用途：绑定一个自定义事件监听函数，仅会触发一次执行<br>
参数：once(eventType:String, handler:Function)<br>
返回值：EventHelper实例对象<br>
使用方式：
```
let emmiter = new EventHelper();
emmiter.once('test', (content)=> {
    console.log(content);         //'firstEmit'
});
emmiter.emit('test', 'firstEmit');
emmiter.emit('test', 'secondEmit');
```

10、emitLater：<br>
用途：异步触发一个自定义事件<br>
参数：emitLater(eventType:String, data:Any)<br>
返回值：EventHelper实例对象<br>
使用方式：
```
let emmiter = new EventHelper();
let fs = require('fs');
emmiter.on('read', (data)=> console.log(data));
fs.readFile('./mock/readMore.txt', 'utf-8', (err, data)=> emmiter.emitLater('readMore', data));
```
emitLater的功能和emit几乎一样，但是emitLater是异步触发一个自定义事件。<br>

11、immediate/asap：<br>
用途：监听并马上触发一个自定义事件<br>
参数：emitLater(eventType:String, handler:Function, data:Any)<br>
返回值：EventHelper实例对象<br>
使用方式：
```
emmiter.immediate('read', (result)=> {
    console.log(result);        //'read10'
}, 'read10');
```

12、fail：<br>
用途：fail允许你统一处理错误<br>
参数：fail(errorMap:Object)<br>
返回值：EventHelper实例对象<br>
使用方式：
```
let emmiter = new EventHelper();
let fs = require('fs');
emmiter.fail({
    read: function(err){
        console.log(err);
    },
    readMore: function(err){
        console.log(err);
    }
});
fs.readFile('./mock/read.txt', 'utf-8', (err, data)=>{
  if(err) {
    emmiter.emit('error', 'read', err);
  }
});
fs.readFile('./mock/read.txt', 'utf-8', (err, data)=>{
  if(err) {
    emmiter.emit('error', 'readMore', err);
  }
});
```
fail方法允许你将所有的错误处理方法集中在一起，方便统一管理。

13、after：<br>
用途：监听一个自定义事件，并在该事件被触发n/2n/3n/...次之后，执行回调函数<br>
参数：after(eventType:String, times:Number, handler:Function)<br>
返回值：EventHelper实例对象<br>
使用方式：
```
let emmiter = new EventHelper();
let count = 1;
emmiter.after('times', 3, (result)=>{
  if(count=1){
    console.log(result);        //[2,4,6]
    count++;
  }else {
    console.log(result);        //[8,10,12]
  }
});

emmiter.emit('times', 2);
emmiter.emit('times', 4);
emmiter.emit('times', 6);
emmiter.emit('times', 8);
emmiter.emit('times', 10);
emmiter.emit('times', 12);
```
after方法会在被监听的自定义事件触发n/2n/3n/...次之后执行一次回调函数，回调函数的参数为一个数组，记录最后n次触发的数据<br>

14、afterOnce：<br>
用途：监听一个自定义事件，并在该事件被触发n次之后，仅执行一次回调函数<br>
参数：afterOnce(eventType:String, times:Number, handler:Function)<br>
返回值：EventHelper实例对象<br>
使用方式：
```
let emmiter = new EventHelper();
emmiter.afterOnce('times', 3, (result)=>{
  console.log(result);        //[2,4,6]
});

emmiter.emit('times', 2);
emmiter.emit('times', 4);
emmiter.emit('times', 6);
```
afterOnce方法会在被监听的自定义事件触发n次之后仅执行一次回调函数，回调函数的参数为一个数组，为n次触发的数据<br>

15、group：<br>
用途：group方法是after或afterOnce的助手方法，将同一个事件多次触发进行分组<br>
参数：group(eventType:String[,handler:Function])<br>
返回值：EventHelper实例对象<br>
使用方式：
```
let emmiter = new EventHelper();
let fs = require('fs');
let files = ['./mock/read.txt', './mock/read20.txt', './mock/read30.txt'];
emmiter.after('content', files.length, (result)=>{
    console.log(result);        //['read10', 'read20','read30']
});
files.map(file=> fs.readFile(file, 'utf-8', emmiter.group('content')));
```
group方法会在内部对错误进行处理，或者触发监听的事件，handler方法选填，主要用于对原始数据的加工处理，例如：
```
files.map(file=> fs.readFile(file, 'utf-8', emmiter.group('content', (data)=> `${data}!`)));
```
这样after的回调方法中参数的最终结果将会变为：
```
['read10!', 'read20!','read30!']
```

16、not：<br>
用途：当触发的事件不是not方法指定的事件时，执行回调方法<br>
参数：not(eventType:String, handler:Function)<br>
返回值：EventHelper实例对象<br>
使用方式：
```
let emmiter = new EventHelper();
emmiter.not('not', (result)=>{
    console.log(result);     //'read10'
});
emmiter.emit('read', 'read10');
emmiter.emit('not', 'not10');
```

17、done：<br>
用途：done返回一个error first风格的回调函数，内部进行错误处理及事件触发<br>
参数：done(eventType:String[, handler:Function])<br>
返回值：EventHelper实例对象<br>
使用方式：
```
let emmiter = new EventHelper();
let fs = require('fs');
emmiter.on('read', (result)=> {
    console.log(result);      //'read10'
});
fs.readFile('./mock/read.txt', 'utf-8', emmiter.done('read'));
```
done方法在内部会返回一个error first风格的回调函数，会触发一个错误事件或eventType事件，其中handler参数非必须，主要用于对数据的加工处理。<br>

18、doneLater：<br>
用途：done方法的异步触发版本<br>
参数：doneLater(eventType:String, handler:Function)<br>
返回值：EventHelper实例对象<br>
使用方式：
```
let emmiter = new EventHelper();
let fs = require('fs');
emmiter.on('read', (result)=> {
    console.log(result);      //'read10'
});
fs.readFile('./mock/read.txt', 'utf-8', emmiter.doneLater('read'));
```
doneLater方法与done几乎一样，唯一的区别是doneLater是异步触发事件。<br>

19、concurrent：<br>
用途：concurrent 用于处理异步事件队列的并发<br>
参数：concurrent(eventType:String, limit:Number, asyncHandler:Function, asyncParams:Array)<br>
返回值：EventHelper实例对象<br>
使用方式：
```
let images = [
    "https://www.baidu.com/img/bd_logo1.png", 
    "https://www.baidu.com/img/baidu_jgylogo3.gif",
    "https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=265704898,674087460&fm=58", 
    "https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3105518379,1723849651&fm=58", 
    "https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=2292095202,1784829557&fm=58", 
    "https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=1219708893,1812014204&fm=58",
    "https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3669175269,2356096679&fm=58", 
    "https://ss3.baidu.com/-rVXeDTa2gU2pMbgoY3K/it/u=154063165,2016512383&fm=202&mola=new&crop=v1", 
    "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3536541845,739399450&fm=27&gp=0.jpg", 
    "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=594559231,2167829292&fm=27&gp=0.jpg", 
    "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3138365389,851751545&fm=27&gp=0.jpg", 
    "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3965705221,2010595691&fm=27&gp=0.jpg", 
    "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1742626185,2547278809&fm=27&gp=0.jpg", 
    "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1060387669,1498970204&fm=27&gp=0.jpg", 
    "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=4271053251,2424464488&fm=27&gp=0.jpg", 
    "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=4140230371,1584894266&fm=27&gp=0.jpg", 
    "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2710025438,2030209695&fm=27&gp=0.jpg", 
    "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3432487329,2901563519&fm=27&gp=0.jpg", 
    "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2993396273,3023277058&fm=27&gp=0.jpg", 
    "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2838934065,571280381&fm=27&gp=0.jpg"
];
let emmiter = new EventHelper();
let loadImg = (url, callback)=>{
    let img = document.createElement('img');
    img.onload = ()=> callback(null, img);
    img.onerror = (error)=> callback(error, null);
    img.src = url;
};
emmiter.concurrent('load', 5, loadImg, images);
emmiter.on('loadFinish', (result)=> {
    console.log(result);
});
```
concurrent方法主要用于处理异步事件队列的并发管理，传递参数：eventType为自定义异步事件名称；limit为异步并发数；asyncHandler为异步事件处理函数，注意该函数需要接收一个error first风格的回调函数作为参数，该回调函数为concurrent内部自动生成，用于接收异步事件处理成功后的数据或错误信息，例如上面例子中的loadImg函数；asyncParams 为异步事件队列的参数集合。该方法调用成功后，会触发一个 eventType+'Finish' 事件，通过该事件即可监听并发完成的事件，例如上例中的 load 事件完成后会出发 loadFinish 事件， 该事件注册的监听函数的参数为一个数组，即异步事件队列的结果集合，结果顺序与asyncParams 参数集合的顺序一致。<br>

以上即为EventHelper这个工具库的全部api方法及使用说明，后续会补充一些典型的应用场景，如果你有好的想法请联系我:)












