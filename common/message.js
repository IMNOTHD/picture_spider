const ERROR400MSG = {
    code: 400,
    message: '访问错误, 可能是参数错误或者图片不存在',
    msg: '访问错误, 可能是参数错误或者图片不存在',
};

const ERROR403MSG = {
    code: 403,
    message: '访问被拒绝',
    msg: '访问被拒绝',
};

const ERROR404MSG = {
    code: 404,
    message: '资源未找到',
    msg: '资源未找到',
};

const ERROR500MSG = {
    code: 500,
    message: '服务错误，请重试',
    msg: '服务错误，请重试',
};

module.exports = {
    ERROR400MSG: ERROR400MSG,
    ERROR403MSG: ERROR403MSG,
    ERROR404MSG: ERROR404MSG,
    ERROR500MSG: ERROR500MSG
};