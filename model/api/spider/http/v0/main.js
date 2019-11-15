msg = require("../../../../../common/message");

module.exports = {
    getBase64EncodedJson: async function (query) {
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
        } else {
            return msg.ERROR400MSG;
        }
    }
};