# 爪巴

这是一个主要二次元图床的爬虫程序，爬取pixiv/donmai等图床的图片，并返回base64编码的图片

---

#### 使用方法

##### 修改app.js以改变监听端口

+ cd到目录
+ npm install
+ npm start(建议使用pm2 start app.js --name "*name*")

---

#### 请求参数

##### 方法:GET/POST

|参数名|必选|类型|描述| 
|:---|:---|:---|:---|
|type|是|string|图床名|
|id|是|string|图片id|
|manga|否|integer|pixiv多图id, 默认0|

####支持的图床
+ pixiv
+ donmai
+ pawoo
+ medibang
+ yande

#### 响应
###### *R18判定根据图床标签返回, 若无法判定返回null, 否则返回true/false*

+ 访问正常
```json
{
    "code": 200,
    "pic": "*PictureBase64Encode*",
    "message": "",
    "msg": "",
    "isR18": "null"
}
```

+ 访问错误
```json
{
    "code": 400,
    "pic": "",
    "message": "访问错误, 可能是参数错误或者图片不存在",
    "msg": "访问错误, 可能是参数错误或者图片不存在",
    "isR18": "null"
}
```

+ 访问拒绝
```json
{
    "code": 403,
    "pic": "",
    "message": "访问被拒绝",
    "msg": "访问被拒绝",
    "isR18": "null"
}
```

+ 服务错误
```json
{
    "code": 404,
    "pic": "",
    "message": "服务错误，请重试",
    "msg": "服务错误，请重试",
    "isR18": "null"
}
```