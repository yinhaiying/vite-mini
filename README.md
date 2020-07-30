# vite

1. 利用浏览器自带的 module import 功能，来实现文件的加载
   如果是以"/", "./", or "../"开头的路径，现在浏览器会当做一次请求进行处理。
   但是如果是以 import vue from 'vue'这种 import 那么浏览器就无法识别了。
   需要我们从 node_modules 中进行查找。

2. 支持 import vue (原理：从 node_modules 中获取)

   - 需要将 import xx from 'vue'改造成 import xx from '/@modules/vue/'，这样的话浏览器才能够发出请求。
   - 拦截@modules 开头的请求，然后去 node_modules 中进行查找。
     vue -> package.json -> modules(对应的 dist/vue.runtime.esm.js)

3. 支持.vue 单文件组件(主要是处理 template 和 script)

   - 解析.vue 文件，把 script 拿出来

   ```javascript
   // vite的实现思路
   const __script = {};
   import "/src/views/docs/aside.vue?type=style&index=0";
   import { render as __render } from "/src/views/docs/aside.vue?type=template";
   __script.render = __render;
   __script.__hmrId = "/src/views/docs/aside.vue";
   __script.__file = "H:\\study\\Y-UI\\src\\views\\docs\\aside.vue";
   export default __script;
   ```

   创建一个\_\_script 变量，所有的 js 都放在变量中，然后 template 和 style 都放入变量中，最后导出这个变量。

   - 解析 template

   1. 在文件后面添加 type = template

   ```javascript
   import { render as __render } from "/src/views/docs/aside.vue?type=template";
   ```

   2. 从 describe 中获取到 template 然后转换成 render

   ```javascript
   const template = descriptor.template;
   console.log("render转换之前", template.content);
   // const render = template;
   // 需要把template转换成render函数形式 使用@vue/compiler-dom
   const render = compilerDom.compile(template.content, { mode: "module" })
     .code;
   console.log("转换之后", render);
   ctx.body = rewriteimport(render);
   ```

4. 支持 css

```javascript
const p = path.resolve(__dirname, "src", url.replace("/@modules/", ""));
let file = fs.readFileSync(p, "utf-8");
const content = ` 
      const css = '${file.replace(/[ ]|[\r\n]/g, "")}';
      let link = document.createElement('style');
      link.setAttribute('type','text/css');
      document.head.appendChild(link);
      link.innerHTML = css;
      export default css;
    `;
ctx.type = "application/javascript";
ctx.body = rewriteimport(content);
```

## 对其他非 js 文件的支持

- 支持 ts
- 支持 css
- 支持 less

## 缺点

目前只要适用于开发环境，如果是线上环境的话，可能还是需要使用 webpack 或者 rollup 打包成 ES5。
毕竟支持 ES Module 的浏览器还是比较少。
