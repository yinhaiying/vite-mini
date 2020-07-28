# vite

1. 利用浏览器自带的module import 功能，来实现文件的加载
如果是以"/", "./", or "../"开头的路径，现在浏览器会当做一次请求进行处理。
但是如果是以import vue from 'vue'这种import 那么浏览器就无法识别了。
需要我们从node_modules中进行查找。

2. 支持import vue  (原理：从node_modules中获取)
需要将import xx from 'vue'改造成 import xx from '/@modules/vue/'，这样的话浏览器才能够发出请求。


## 缺点
目前只要适用于开发环境，如果是线上环境的话，可能还是需要使用webpack或者rollup打包成ES5。
毕竟支持ES Module的浏览器还是比较少。