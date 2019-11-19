> GET /api/spider/urlAnalyzer

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
|url|否|string|若无正确url, 无返回|
|isR18|否|string|能判定R18返回true/false, 否则返回null|
|referer|否|string|原地址, 需要referer头的时候可以使用|

```json
{
    "code": 200,
    "message": "ok",
    "url": "*pictureUrl*",
    "isR18": "false"
}
```