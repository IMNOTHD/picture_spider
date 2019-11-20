> GET /api/spider/v1

> 下载图片到/static/image/cache中

### 请求参数

|参数名|必选|类型|描述|
|:---|:---|:---|:---|
|type|是|string||
|id|是|string||
|manga|否|integer|用于pixiv多图|

### 返回参数

|参数名|必选|类型|描述|
|:---|:---|:---|:---|
|code|是|integer|返回结果的状态码|
|message|是|string||
|picUrl|否|string|存储在服务端的缓存图片, 格式为/static/xx/*pic*, 需要用户自行添加hostname|
|isR18|否|string|能判定R18返回true/false, 否则返回null|

```json
{
    "code": 200,
    "message": "ok",
    "picUrl": "*PictureUrl*",
    "isR18": "false"
}
```