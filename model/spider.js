const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const axios = require('axios-https-proxy-fix'); // 墙外使用axios并去除代理

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36';
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/config.json'), 'utf-8'));

module.exports = {
    pixiv: async function (id, manga = 0) {
        let code = 500;
        let pic = '';
        let isR18 = false;

        try {
            const proxy = {
                host: '127.0.0.1',
                port: 1080
            };

            const pixivResponse = await axios({
                proxy: proxy,
                method: 'get',
                url: config['pixiv_ajax_url'] + id.toString()
            });

            let pixivJson = pixivResponse.data;
            let pageCount = pixivJson['body']['illust_details']['page_count'];

            if (pixivJson['body']['illust_details']['tags'][0] === 'R18') {
                isR18 = true;
            }

            if (parseInt(manga) + 1 <= parseInt(pageCount)) {
                let url;
                if (parseInt(pageCount) === 1) {
                    url = pixivJson['body']['illust_details']['url_big'];
                } else {
                    url = pixivJson['body']['illust_details']['manga_a'][parseInt(manga)]['url_big'];
                }

                const obj = await downloader(url, true);

                if (obj.code === 200) {
                    code = 200;
                    pic = obj.pic;
                } else {
                    //console.log(obj);
                    code = 400;
                }
            } else {
                code = 400;
            }
        } catch (e) {
            //console.log(e);
            code = 400;
        }

        if (code === 200) {
            return {code: code, pic: pic, message: '', isR18: isR18};
        } else if (code === 500) {
            return {code: code, pic: '', message: '服务错误，请重试'};
        } else {
            return {code: code, pic: '', message: '访问错误, 可能是参数错误或者图片不存在'};
        }
    },
    donmai: async function (id) {
        let code = 500;
        let pic = '';

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

            const obj = await downloader(url, false);

            if (obj.code === 200) {
                code = 200;
                pic = obj.pic;
            } else {
                //console.log(obj);
                code = 400;
            }
        } catch (e) {
            //console.log(e);
            code = 400;
        }

        if (code === 200) {
            return {code: code, pic: pic, message: ''};
        } else if (code === 500) {
            return {code: code, pic: '', message: '服务错误，请重试'};
        } else {
            return {code: code, pic: '', message: '访问错误, 可能是参数错误或者图片不存在'};
        }
    },
    pawoo: async function (id) {
        let code = 500;
        let pic = '';

        try {

            const res = await axios({
                method: 'get',
                url: config['pawoo_pic_url'] + id.toString()
            });

            const $ = cheerio.load(res.data);
            let url = $('meta[property$=image]').attr('content');

            console.log(url.toString());

            const obj = await downloader(url, false);

            if (obj.code === 200) {
                code = 200;
                pic = obj.pic;
            } else {
                //console.log(obj);
                code = 400;
            }
        } catch (e) {
            //console.log(e);
            code = 400;
        }

        if (code === 200) {
            return {code: code, pic: pic, message: ''};
        } else if (code === 500) {
            return {code: code, pic: '', message: '服务错误，请重试'};
        } else {
            return {code: code, pic: '', message: '访问错误, 可能是参数错误或者图片不存在'};
        }
    },
    medibang: async function (id) {
        let code = 500;
        let pic = '';

        try {
            const medibangResponse = await axios({
                method: 'get',
                url: config['medibang_ajax_url'] + id.toString()
            });

            //console.log(medibangResponse.data);

            let medibangJson = medibangResponse.data;
            let url = medibangJson['pictureDetailBean']['imageUrlOriginal'];

            const obj = await downloader(url, true);

            if (obj.code === 200) {
                code = 200;
                pic = obj.pic;
            } else {
                //console.log(obj);
                code = 400;
            }
        } catch (e) {
            //console.log(e);
            code = 400;
        }

        if (code === 200) {
            return {code: code, pic: pic, message: ''};
        } else if (code === 500) {
            return {code: code, pic: '', message: '服务错误，请重试'};
        } else {
            return {code: code, pic: '', message: '访问错误, 可能是参数错误或者图片不存在'};
        }
    },
    yande: async function (id) {
        let code = 500;
        let pic = '';

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

            const obj = await downloader(url, false);

            if (obj.code === 200) {
                code = 200;
                pic = obj.pic;
            } else {
                //console.log(obj);
                code = 400;
            }
        } catch (e) {
            //console.log(e);
            code = 400;
        }

        if (code === 200) {
            return {code: code, pic: pic, message: ''};
        } else if (code === 500) {
            return {code: code, pic: '', message: '服务错误，请重试'};
        } else {
            return {code: code, pic: '', message: '访问错误, 可能是参数错误或者图片不存在'};
        }
    }
};


/**
 * 图片下载并转码
 * @param url 图片链接
 * @param isNeedReferer 是否需要在Header中加Referer
 * @returns {Promise<{code: number, pic: string}>} 返回base64编码
 */
async function downloader(url, isNeedReferer) {

    if (url === '' || url == null) {
        return {code: 400, pic: ''};
    }

    let config;

    if (isNeedReferer === true) {
        config = {
            referer: url,
            headers: {
                'Referer': url,
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
        let obj = {
            code: 400,
            pic: ''
        };

        try {
            await axios.get(url, config)
                .then(res => new Buffer.from(res.data, 'binary').toString('base64'))
                .then(data => {
                    obj.code = 200;
                    obj.pic = data;
                });
        } catch (e) {
        }

        if (obj.pic === '' || obj.pic == null) {
            obj.code = 400;
        }

        return obj;
    } catch (e) {
        return {code: 400, pic: ''};
    }
}


// pixiv登录部分, 已弃用
/*
        let code = 200;
        let pic = '';

        const proxy = {
            host: '127.0.0.1',
            port: 1080
        }

        // 获取post_key
        async function getKey() {
            try {
                const res = await axios({
                    proxy: proxy,
                    method: 'get',
                    url: config['pixiv_login_url'],
                    headers: {
                        'User-Agent': USER_AGENT
                    }
                });

                const $ = cheerio.load(res.data);
                const postKey = $('input[name=post_key]').val();
                const recaptchaV3Token = $('#recaptcha-v3-token').attr('value');
                const postCookie = res.headers['set-cookie'].join('; ');
                console.log(res.data);
                console.log(postKey);
                console.log(recaptchaV3Token);

                return {postKey, recaptchaV3Token, postCookie};
            } catch (e) {
                code = 404;
                console.log(e);
            }
        }

        // 登录
        async function login(postKey, recaptchaV3Token, postCookie) {
            if (code === 404) {
                return;
            }
            try {
                const res = await axios({
                    proxy: proxy,
                    method: 'post',
                    url: config['pixiv_login_api'],
                    headers: {
                        'User-Agent': USER_AGENT,
                        'Content_Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'Origin': 'https://accounts.pixiv.net',
                        'Referer': 'https://accounts.pixiv.net/login?lang=zh&source=pc&view_type=page&ref=wwwtop_accounts_index',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Referer': config['pixiv_login_url'],
                        'Cookie': postCookie
                    },
                    data: querystring.stringify({
                        pixiv_id: config['pixiv_account_username'],
                        password: config['pixiv_account_password'],
                        post_key: postKey,
                        captcha: '',
                        g_recaptcha_response: '',
                        source: 'pc',
                        return_to: 'https://www.pixiv.net/',
                        'recaptcha_v3_token': recaptchaV3Token
                    })
                });

                //console.log(res.data);

                const $ = cheerio.load(res.data);

                console.log(res.headers);
                console.log(res.status);
                console.log(res.data);

                const cookie = res.headers['set-cookie'].join('; ');
                //console.log(res.headers);
                return cookie;
            } catch (e) {
                code = 404;
                console.log(e);
            }
        }

        // 主程序
        async function start() {
            const obj = await getKey();

            //console.log(obj.postCookie);

            const cookie = await login(obj.postKey, obj.recaptchaV3Token, obj.postCookie);

            console.log(cookie);
        }

        await start();

        if (code === 200) {
            return {code: code, pic: pic, message: ''};
        } else if (code === 404) {
            return {code: code, pic: '', message: '服务错误，请重试'};
        } else {
            return {code: code, pic: '', message: '访问错误, 可能是参数错误或者图片不存在'};
        }

         */