> GET /api/spider/v0

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
|pic|否|string|picture的Base64编码|
|isR18|否|string|能判定R18返回true/false, 否则返回null|

```json
{
    "code": 200,
    "message": "ok",
    "pic": "*PictureBase64Encode*",
    "isR18": "false"
}
```