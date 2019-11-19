const message = require('../common/message');

module.exports = {
    'GET /api/spider/v0': async (ctx, next) => {
        const spider = require('../model/api/spider/http/v0/main');

        let query = ctx.request.query;

        const resultObject = await spider.getBase64EncodedJson(query);

        if (typeof (resultObject.isR18) === 'undefined') {
            resultObject.isR18 = 'null';
        }

        ctx.response.type = 'application/json';
        ctx.response.body = resultObject;
    },
    'GET /api/spider/v1': async (ctx, next) => {
        const spider = require('../model/api/spider/http/v1/main');

        let query = ctx.request.query;

        const resultObject = await spider.getPictureCacheUrl(query);

        if (typeof (resultObject.isR18) === 'undefined') {
            resultObject.isR18 = 'null';
        }

        ctx.response.type = 'application/json';
        ctx.response.body = resultObject;
    },
    'GET /api/spider/urlAnalyzer': async (ctx, next) => {
        const urlAnalyzer = require('../model/api/spider/common/urlAnalyzer');

        let query = ctx.request.query;

        let resultObject = message.ERROR400MSG;

        if (query['type'] != null && query['type'] !== "") {
            switch (query['type'].toLowerCase()) {
                case 'pixiv':
                    resultObject = await urlAnalyzer.pixiv(query['id'], query['manga']);
                    break;
                case 'donmai':
                    resultObject = await urlAnalyzer.donmai(query['id']);
                    break;
                case 'pawoo':
                    resultObject = await urlAnalyzer.pawoo(query['id']);
                    break;
                case 'medibang':
                    resultObject = await urlAnalyzer.medibang(query['id']);
                    break;
                case 'yande':
                    resultObject = await urlAnalyzer.yande(query['id']);
                    break;
                default:
                    break;
            }
        }

        ctx.response.type = 'application/json';
        ctx.response.body = resultObject;
    }
};