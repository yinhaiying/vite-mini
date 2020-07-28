const fs = require('fs');
const path = require('path');
const koa = require('koa');
const { createContext } = require('vm');

const app = new koa();


app.use(async (ctx) => {
    const { request: { query, url } } = ctx;
    if (url == '/') {
        let content = fs.readFileSync('./index.html', 'utf-8');
        ctx.body = content;
    } else if (url.endsWith('.js')) {
        console.log(path.resolve(__dirname));
        console.log('url:', url)
        const p = path.resolve(__dirname, url.slice(1));
        console.log('p', p);
        const content = fs.readFileSync(p, 'utf-8');
        ctx.type = "application/javascript"
        ctx.body = content;
    }
    console.log('hello')
})


app.listen(3000, () => {
    console.log('server is running in 3000')
})