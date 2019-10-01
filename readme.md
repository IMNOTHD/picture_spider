# 爪巴

这是一个主要二次元图床的爬虫程序，爬取pixiv/donmai等图床的图片，并返回base64

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

+ 访问正常
```json
{
    "code": 200,
    "pic": "*PictureBase64Encode*",
    "message": ""
}
```

+ 访问错误
```json
{
    "code": 400,
    "pic": "",
    "message": "访问错误, 可能是参数错误或者图片不存在"
}
```

+ 访问拒绝
```json
{
    "code": 403,
    "pic": "",
    "message": "访问被拒绝"
}
```

+ 服务错误
```json
{
    "code": 404,
    "pic": "",
    "message": "服务错误，请重试"
}
```