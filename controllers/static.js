module.exports = {
    'GET /static/*': async (ctx, next) => {
        console.log(ctx.url);
        console.log(`${__dirname}/../`);
    }
};