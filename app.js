/**
 * 十年编程两茫茫，工期短，需求长。
 * 千行代码，Bug何处藏。
 * 纵使上线又如何，新版本，继续忙。
 * 黑白颠倒没商量，睡地铺，吃食堂。
 * 夜半梦醒，无人在身旁。
 * 最怕灯火阑珊时，手机响，心里慌。
 */


const Koa = require("koa");

const bodyParser = require("koa-bodyparser");

const router = require("koa-router")();

const controller = require('./controller');

const app = new Koa();

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});


app.use(bodyParser());

app.use(controller());

app.use(router.routes);

app.listen(3000);
console.log('app started at port 3000...');