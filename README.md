# vite

1. 利用浏览器自带的module import 功能，来实现文件的加载
如果是以"/", "./", or "../"开头的路径，现在浏览器会当做一次请求进行处理。
但是如果是以import vue from 'vue'这种import 那么浏览器就无法识别了。
需要我们从node_modules中进行查找。

2. 支持import vue  (原理：从node_modules中获取)
   * 需要将import xx from 'vue'改造成 import xx from '/@modules/vue/'，这样的话浏览器才能够发出请求。
   * 拦截@modules开头的请求，然后去node_modules中进行查找。
   vue -> package.json   -> modules(对应的dist/vue.runtime.esm.js)

3. 支持.vue单文件组件(主要是处理template和script)
    * 解析.vue文件，把script拿出来

    ```javascript
   // vite的实现思路
      const __script = {}
      import "/src/views/docs/aside.vue?type=style&index=0"
      import { render as __render } from "/src/views/docs/aside.vue?type=template"
      __script.render = __render
      __script.__hmrId = "/src/views/docs/aside.vue"
      __script.__file = "H:\\study\\Y-UI\\src\\views\\docs\\aside.vue"
      export default __script
    ```
   创建一个__script变量，所有的js都放在变量中，然后template和style都放入变量中，最后导出这个变量。
   
## 缺点
目前只要适用于开发环境，如果是线上环境的话，可能还是需要使用webpack或者rollup打包成ES5。
毕竟支持ES Module的浏览器还是比较少。