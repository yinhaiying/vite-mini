const fs = require('fs');
const path = require('path');
const koa = require('koa');

const app = new koa();

// 解析vue文件
const compilerSfc = require('@vue/compiler-sfc');



app.use(async (ctx) => {
    const { request: { query, url } } = ctx;
    console.log('url:', url)
    if (url == '/') {
        let content = fs.readFileSync('./index.html', 'utf-8');
        ctx.body = content;
    } else if (url.endsWith('.js')) {
        const p = path.resolve(__dirname, url.slice(1));
        const content = fs.readFileSync(p, 'utf-8');
        ctx.type = "application/javascript";
        // 需要将js文件中的import xxx from 'vue' 改造成import xxx from '@modules/vue'
        ctx.body = rewriteimport(content);
    } else if (url.startsWith('/@modules/')) {
        if (!url.endsWith('.vue')) {
            // 去node_modules中进行查找
            // console.log('url:', url)    /@modules/vue
            const prefix = path.resolve(__dirname, 'node_modules', url.replace('/@modules/', ''));
            // console.log('prefix:', prefix);  // 找到node_modules/vue
            const module = require(prefix + '\\package.json').module;   // 获取到module路径
            // console.log('module:', module);
            const _path = path.resolve(prefix, module)
            // console.log('_path:', _path);  // H:\study\vite-mini\node_modules\vue\dist\vue.runtime.esm.js
            const content = fs.readFileSync(_path, 'utf-8');
            ctx.type = "application/javascript";
            ctx.body = rewriteimport(content)
        } else {
            // 解析vue文件  使用@vue/compiler-sfc
            console.log('vue');

            const p = path.resolve(__dirname, 'src', url.replace('/@modules/', ''));
            // console.log('p', p)
            const { descriptor } = compilerSfc.parse(fs.readFileSync(p, 'utf-8'));
            // console.log(descriptor);
            ctx.type = "application/javascript";
            const __script = rewriteimport(descriptor.script.content).replace('export default', 'const __script=')
            // console.log(__script)
            ctx.body = __script;
        }

    }
})

/* 
将import xxx from 'vue'  改写成 import xxx from '@modules/vue'

*/
function rewriteimport(content) {
    // console.log(/from ['"]([^'"]+)['"]/g.test(content))
    return content.replace(/from ['"]([^'"]+)['"]/g, function (s0, s1) {
        // console.log('s0', s0);
        // console.log('s1', s1);
        if (s1[0] !== '.' && s1[0] !== '/' && s1[0] !== '../') {
            return `from '/@modules/${s1}'`
        }
        return s1;
    });
}


app.listen(3000, () => {
    console.log('server is running in 3000')
})