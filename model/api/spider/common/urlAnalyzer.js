const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const axios = require('axios'); // 墙内需要代理则使用axios-https-proxy-fix
const message = require('../../../../common/message');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../../config/config.json'), 'utf-8'));

module.exports = {
    pixiv: async function (id, manga = 0) {
        let isR18 = 'false';

        try {
            const proxy = {
                host: '127.0.0.1',
                port: 1080
            };

            const pixivResponse = await axios({
                // proxy: proxy,
                // 墙内视情况使用proxy
                method: 'get',
                url: config['pixiv_ajax_url'] + id.toString()
            });

            let pixivJson = pixivResponse.data;
            let pageCount = pixivJson['body']['illust_details']['page_count'];

            if (pixivJson['body']['illust_details']['tags'][0] === 'R-18') {
                isR18 = 'true';
            }

            if (parseInt(manga) + 1 <= parseInt(pageCount)) {
                let url;
                if (parseInt(pageCount) === 1) {
                    url = pixivJson['body']['illust_details']['url_big'];
                } else {
                    url = pixivJson['body']['illust_details']['manga_a'][parseInt(manga)]['url_big'];
                }

                if (url === '' || url == null) {
                    return message.ERROR400MSG;
                } else {
                    return {
                        'code': 200,
                        'message': 'ok',
                        'url': url,
                        'isR18': isR18,
                        'referer': config['pixiv_ajax_url'] + id.toString()
                    };
                }
            } else {
                return message.ERROR400MSG;
            }
        } catch (e) {
            //console.log(e);
            return message.ERROR400MSG;
        }

        return message.ERROR500MSG;
    },
    donmai: async function (id) {
        try {
            const res = await axios({
                method: 'get',
                url: config['donmai_pic_url'] + id.toString()
            });

            const $ = cheerio.load(res.data);
            let url = $('a#image-resize-link').attr('href');

            if (url === '' || url == null) {
                url = $('img#image').attr('src');
            }

            if (url === '' || url == null) {
                return message.ERROR400MSG;
            } else {
                return {
                    'code': 200,
                    'message': 'ok',
                    'url': url,
                    'isR18': 'null',
                    'referer': config['donmai_pic_url'] + id.toString()
                };
            }
        } catch (e) {
            //console.log(e);
            return message.ERROR400MSG;
        }

        return message.ERROR500MSG;
    },
    pawoo: async function (id) {
        try {
            const res = await axios({
                method: 'get',
                url: config['pawoo_pic_url'] + id.toString()
            });

            const $ = cheerio.load(res.data);
            let url = $('meta[property$=image]').attr('content');

            //console.log(url.toString());

            if (url === '' || url == null) {
                return {code: 400, pic: ''};
            }

            if (url === '' || url == null) {
                return message.ERROR400MSG;
            } else {
                return {
                    'code': 200,
                    'message': 'ok',
                    'url': url,
                    'isR18': 'null',
                    'referer': config['pawoo_pic_url'] + id.toString()
                };
            }
        } catch (e) {
            //console.log(e);
            return message.ERROR400MSG;
        }

        return message.ERROR500MSG;
    },
    medibang: async function (id) {
        try {
            const medibangResponse = await axios({
                method: 'get',
                url: config['medibang_ajax_url'] + id.toString()
            });

            //console.log(medibangResponse.data);

            let medibangJson = medibangResponse.data;
            let url = medibangJson['pictureDetailBean']['imageUrlOriginal'];

            if (url === '' || url == null) {
                return {code: 400, pic: ''};
            }

            if (url === '' || url == null) {
                return message.ERROR400MSG;
            } else {
                return {
                    'code': 200,
                    'message': 'ok',
                    'url': url,
                    'isR18': 'null',
                    'referer': config['medibang_ajax_url'] + id.toString()
                };
            }
        } catch (e) {
            //console.log(e);
            return message.ERROR400MSG;
        }

        return message.ERROR500MSG;
    },
    yande: async function (id) {
        try {
            const res = await axios({
                method: 'get',
                url: config['yande_pic_url'] + id.toString()
            });

            const $ = cheerio.load(res.data);
            let url = $('a#png').first().attr('href');

            if (url === '' || url == null) {
                url = $('a#highres').first().attr('href');
            }

            if (url === '' || url == null) {
                url = $('img#image').first().attr('src');
            }

            if (url === '' || url == null) {
                return message.ERROR400MSG;
            } else {
                return {
                    'code': 200,
                    'message': 'ok',
                    'url': url,
                    'isR18': 'null',
                    'referer': config['yande_pic_url'] + id.toString()
                };
            }
        } catch (e) {
            //console.log(e);
            return message.ERROR400MSG;
        }

        return message.ERROR500MSG;
    }
};