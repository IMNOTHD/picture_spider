const message = require('../../../../../common/message');
const urlAnalyzer = require('../../common/urlAnalyzer');
const axios = require('axios');
const fs = require('fs');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36';

module.exports = {
    getPictureCacheUrl: async function (query) {
        if (!fs.existsSync(`${__dirname}/../../../../../static/image/cache/`)) {
            fs.mkdirSync(`${__dirname}/../../../../../static/`);
            fs.mkdirSync(`${__dirname}/../../../../../static/image/`);
            fs.mkdirSync(`${__dirname}/../../../../../static/image/cache/`);
        }

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
                    .then(res => new Buffer.from(res.data, 'binary'))
                    .then(data => {
                        obj.code = 200;
                        const imageTypeCheck = data.toString('hex', 0, 10).toUpperCase();
                        //console.log(imageTypeCheck);
                        let imageType = '.jpg';
                        if (/FFD8FF*/.test(imageTypeCheck)) {
                            imageType = '.jpg';
                        } else if (/89504E47*/.test(imageTypeCheck)) {
                            imageType = '.png';
                        } else if (/47494638*/.test(imageTypeCheck)) {
                            imageType = '.gif';
                        } else if (/424D*/.test(imageTypeCheck)) {
                            imageType = '.bmp';
                        }
                        const filePath = `${__dirname}/../../../../../static/image/cache/${query['type']}_${query['id']}_${query['manga']}${imageType}`;
                        //console.log(filePath);
                        try {
                            fs.writeFileSync(filePath, data);
                            obj.picUrl = `/image/cache/${query['type']}_${query['id']}${imageType}`;
                        } catch (e) {
                            return message.ERROR400MSG;
                        }
                    });

            } catch (e) {
            }

            if (obj.code !== 200 || obj.picUrl === '' || obj.picUrl == null) {
                return message.ERROR400MSG;
            }

            return {
                'code': obj.code,
                'message': 'ok',
                'picUrl': obj.picUrl,
                'isR18': resultObject.isR18
            };
        } catch (e) {
            return message.ERROR404MSG;
        }
    }
};