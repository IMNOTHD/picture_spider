module.exports = {
    'GET /api/spider/v1': async (ctx, next) => {
        const spider = require('../model/api/spider/v1/main');

        let query = ctx.request.query;

        let resultObject = {
            code: 400,
            pic: '',
            message: '访问错误, 可能是参数错误或者图片不存在'
        };

        if (query['type'] != null && query['type'] !== '') {
            switch (query['type'].toLowerCase()) {
                case 'pixiv':
                    resultObject = await spider.pixiv(query['id'], query['manga']);
                    break;
                case 'donmai':
                    resultObject = await spider.donmai(query['id']);
                    break;
                case 'pawoo':
                    resultObject = await spider.pawoo(query['id']);
                    break;
                case 'medibang':
                    resultObject = await spider.medibang(query['id']);
                    break;
                case 'yande':
                    resultObject = await spider.yande(query['id']);
                    break;
                default:
                    break;
            }
        }

        if (typeof (resultObject.isR18) === 'undefined') {
            resultObject.isR18 = 'null';
        }

        ctx.response.type = 'application/json';
        ctx.response.body = {
            'code': resultObject.code,
            'pic': resultObject.pic,
            'message': resultObject.message,
            'msg': resultObject.message,
            'isR18': resultObject.isR18
        };
    },
    'POST /api/spider/v1': async (ctx, next) => {
        const spider = require('../model/api/spider/v1/main');

        let query = ctx.request.query;

        let resultObject = {
            code: 400,
            pic: '',
            message: '访问错误, 可能是参数错误或者图片不存在'
        };

        if (query['type'] != null && query['type'] !== "") {
            switch (query['type'].toLowerCase()) {
                case 'pixiv':
                    resultObject = await spider.pixiv(query['id'], query['manga']);
                    break;
                case 'donmai':
                    resultObject = await spider.donmai(query['id']);
                    break;
                case 'pawoo':
                    resultObject = await spider.pawoo(query['id']);
                    break;
                case 'medibang':
                    resultObject = await spider.medibang(query['id']);
                    break;
                case 'yande':
                    resultObject = await spider.yande(query['id']);
                    break;
                default:
                    break;
            }
        }

        if (typeof (resultObject.isR18) === 'undefined') {
            resultObject.isR18 = 'null';
        }

        ctx.response.type = 'application/json';
        ctx.response.body = {
            'code': resultObject.code,
            'pic': resultObject.pic,
            'message': resultObject.message,
            'msg': resultObject.message,
            'isR18': resultObject.isR18
        };
    },
    'GET /api/spider/v2': async (ctx, next) => {
        const spider = require('../model/api/spider/v2/main');
    },
    'POST /api/spider/v2': async (ctx, next) => {
        const spider = require('../model/api/spider/v2/main');
    }
};