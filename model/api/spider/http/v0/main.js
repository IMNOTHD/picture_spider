const message = require('../../../../../common/message');
const urlAnalyzer = require('../../common/urlAnalyzer');
const axios = require('axios');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36';

module.exports = {
    getBase64EncodedJson: async function (query) {
        let resultObject = message.ERROR400MSG;

        if (query['type'] != null && query['type'] !== '') {
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
        } else {
            return message.ERROR400MSG;
        }

        if (resultObject.code !== 200 || resultObject.url === '' || resultObject.url == null) {
            return resultObject;
        }

        let config;

        if (query['type'].toLowerCase() === 'pixiv' || query['type'].toLowerCase() === 'medibang') {
            config = {
                referer: resultObject.referer,
                headers: {
                    'Referer': resultObject.referer,
                    'User-Agent': USER_AGENT
                },
                responseType: 'arraybuffer'
            }
        } else {
            config = {
                headers: {
                    'User-Agent': USER_AGENT
                },
                responseType: 'arraybuffer'
            }
        }

        try {
            let obj = message.ERROR400MSG;

            try {
                await axios.get(resultObject.url, config)
                    .then(res => new Buffer.from(res.data, 'binary').toString('base64'))
                    .then(data => {
                        obj.code = 200;
                        obj.pic = data;
                    });
            } catch (e) {
            }

            if (obj.code !== 200 || obj.pic === '' || obj.pic == null) {
                return message.ERROR400MSG;
            }

            return {
                'code': obj.code,
                'message': 'ok',
                'pic': obj.pic,
                'isR18': resultObject.isR18
            };
        } catch (e) {
            return message.ERROR404MSG;
        }
    }
};