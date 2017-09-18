# EventHelper
![](https://travis-ci.org/yvanwangl/EventHelper.svg?branch=master)
[![coverage](https://codecov.io/gh/yvanwangl/EventHelper/branch/master/graph/badge.svg)](https://codecov.io/gh/yvanwangl/EventHelper)

一个基于事件机制的异步事件处理工具。<br>
EventHelper只做一件事，就是将使用者从异步回调的地狱中解脱出来！

EventHelper具有以下几个特征：
1、解耦异步事件与数据处理逻辑
2、让使用者彻底远离异步编程的回调地狱
3、将多个串行回调处理的异步事件变为并行处理，提升业务执行效率
4、统一处理异步事件错误的机制
5、Web前端与Node后端均可使用

##API


