# base_framework

> Basically WeChat mini program framework with MpVue+Vuex+FlyIO
> 请仔细阅读下文，部分组件由于经过二次封装，不再适用于原版 API

# 在开始之前，请先配置好如下文件内容：

* [ ] 配置开发环境的请求域名

> 修改 `config\evenv.js` 下的 BASE_URL 和 CORPID

* [ ] 配置生产环境的请求域名和 CORPID

> 修改 `config\prod.env.js` 下的 BASE_URL 和 CORPID

* [ ] 配置相关的请求路径

> 在 `src\config\index.js` 下新增内容

# 安装依赖

npm install

# 开发时构建

npm dev

# 打包构建

npm build

# 指定平台的开发时构建(微信、百度、头条、支付宝)

npm dev:wx

npm dev:swan

npm dev:tt

npm dev:my

# 指定平台的打包构建

npm build:wx

npm build:swan

npm build:tt

npm build:my

# 切换不同环境下的配置信息

使用 dev 和 build 命令切换开发环境和生产环境的配置信息。如果还需要其他环境请自行添加相应的配置，具体步骤较多请自行查阅相关资料。

# 生成 bundle 分析报告

npm run build --report

# 项目已内嵌框架的常用 API：

## 存储

> 调用本地缓存时，请使用 MpVue 的原生接口，便于区分不同的运行平台

### 常用 API

`mpvue.setStorageSync(key,value)`

`mpvue.getStorageSunc(key)`

`mpvue.setStorage(key,value)`

`mpvue.getStorage(key)`

`mpvue.setStorageSync({key,data})`

`mpvue.getStorageSync({key})`

`mpvue.setStorage({key,value})`

`mpvue.getStorage({key})`

## 请求

> 本框架使用 FlyIO 作为网络请求框架，已进行二次封装用于对请求和响应作相应拦截，API 部分保持不变。可使用 this.$fly 引用 flayio 实例。

### 请求配置

## 拦截器

> Fly 支持请求／响应拦截器，可以通过它在请求发起之前和收到响应数据之后做一些预处理。框架中已经封装实例配置，在此仅作为文本，要使用不同的配置请在请求中使用单次配置。

### 实例配置

```javascript
//添加请求拦截器
this.$fly.interceptors.request.use(request => {
  //给所有请求添加自定义header
  request.headers['X-Tag'] = 'flyio'
  //打印出请求体
  console.log(request.body)
  //终止请求
  //var err=new Error("xxx")
  //err.request=request
  //return Promise.reject(new Error(""))

  //可以显式返回request, 也可以不返回，没有返回值时拦截器中默认返回request
  return request
})

//添加响应拦截器，响应拦截器会在then/catch处理之前执行
this.$fly.interceptors.response.use(
  response => {
    //只将请求结果的data字段返回
    return response.data
  },
  err => {
    //发生网络错误后会走到这里
    //return Promise.resolve("ssss")
  }
)
```

**请求拦截器**中的 request 对象结构如下：

```javascript
{
  baseURL,  //请求的基地址
  body, //请求的参数
  headers, //自定义的请求头
  method, // 请求方法
  timeout, //本次请求的超时时间
  url, // 本次请求的地址
  params, //url get参数(post请求或默认的get参数)
  withCredentials, //跨域请求是否发送第三方cookie
  ... //options中自定义的属性
}
```

**响应拦截器**中的 response 对象结构如下：

```javascript
{
  data, //服务器返回的数据
    engine, //请求使用的http engine(见下面文档),浏览器中为本次请求的XMLHttpRequest对象
    headers, //响应头信息
    request //本次响应对应的请求信息，即上面的request结构
}
```

### 单次请求配置

需要对单次请求配置时，配置只对当次请求有效。

```javascript
this.$fly.request(
  '/test',
  {hh: 5},
  {
    method: 'post',
    timeout: 5000 //超时设置为5s
  }
)
```

### 请求配置选项

可配置选项：

```javascript
{
  headers:{}, //http请求头，
  baseURL:"", //请求基地址
  timeout:0,//超时时间，为0时则无超时限制
  //是否自动将Content-Type为“application/json”的响应数据转化为JSON对象，默认为true
  parseJson:true,
  params:{}, //默认公共的url get参数
  withCredentials:false //跨域时是否发送cookie
}
```

**注：若单次配置和实例配置冲突，则会优先使用单次请求配置**

### 移除拦截器

如果你想移除拦截器，只需要将拦截器设为 null 即可：

```javascript
this.$fly.interceptors.request.use(null)
this.$fly.interceptors.response.use(null, null)
```

### 错误处理

请求失败之后，`catch` 捕获到的 err 是一个对象，它的字段如下：

```javascript
{
  message:"Not Find 404", //错误消息
  status:404, //如果服务器可通，则为http请求状态码。网络异常时为0，网络超时为1
  request:{...}, //对应的请求信息
  response:{}, //响应信息
  engine:{}//请求使用的http engine(见下面文档),浏览器中为本次请求的XMLHttpRequest对象
}
```

**错误码**

| 错误码 | 含义                                               |
| ------ | -------------------------------------------------- |
| 0      | 网络错误                                           |
| 1      | 请求超时                                           |
| 2      | 文件下载成功，但保存失败，此错误只出现 node 环境下 |
| >=200  | http 请求状态码                                    |

> flyio 已支持在拦截器中执行异步任务，但是不建议在本框架中使用该特性。故不作特别说明。

## API

#### `this.$fly.get(url, data, options)`

发起 get 请求，url 请求地址，data 为请求数据，在浏览器环境下类型可以是:

```shell
String|Json|Object|Array|Blob|ArrayBuffer|FormData
```

options 为请求配置项。

#### `this.$fly.post(url, data, options)`

发起 post 请求，参数含义同 this.$fly.get。

#### `this.$fly.request(url, data, options)`

发起请求，参数含义同上，在使用此 API 时需要指定 options 的 method：

```javascript
//GET请求
fly.request("/user/8" null, {method:"get"})
//DELETE 请求
fly.request("/user/8/delete", null, {method:"delete"})
//PUT请求
fly.request("/user/register", {name:"doris"}, {method:"PUT"})
......
```

request 适合在 [RESTful API](http://en.wikipedia.org/wiki/Representational_state_transfer) 的场景下使用，为了方便使用，fly 提供了响应的别名方法

**别名方法**

`fly.put(url, data, options)`

`fly.delete(url,data,options)`

`fly.patch(url,data,options)`

#### `this.$fly.all([])`

#### `this.$fly.spread([])`

发起多个并发请求，参数是一个 promise 数组；当所有请求都成功后才会调用`then`，只要有一个失败，就会调 `catch`。

## 使用 application/x-www-form-urlencoded 编码

Fly 默认会将 JavaScript objects 序列化为 `JSON` 发送（RequestBody），如果想以 `application/x-www-form-urlencoded` 编码格式发送，你可以使用如下方式：

### 通过设置请求头

将请求头`content-type`设置为"application/x-www-form-urlencoded"后 fly 会自动对请求数据进行编码，如：

```javascript
this.$fly
  .post(
    '../package.json',
    {aa: 8, bb: 9, tt: {xx: 5}},
    {
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    }
  )
  .then(console.log)
```

这种方法是通用的，意味着在任何 JavaScript 运行环境下都能正常工作，还有一些其它特定平台的方法：

### 请求方式示例

下面示例如无特殊说明，则在所有支持的平台下都能执行。

### 发起 GET 请求

```javascript
//通过用户id获取信息,参数直接写在url中
this.$fly
  .get('/user?id=133')
  .then(function(response) {
    console.log(response)
  })
  .catch(function(error) {
    console.log(error)
  })

//query参数通过对象传递
this.$fly
  .get('/user', {
    id: 133
  })
  .then(function(response) {
    console.log(response)
  })
  .catch(function(error) {
    console.log(error)
  })
```

### 发起 POST 请求

```javascript
this.$fly.post('/user', {
    name: 'Doris',
    age: 24
    phone:"18513222525"
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
```

### Post 请求添加 Url 参数

```javascript
this.$fly.get('../package.json', 'xxx=5', {
  params: {
    c: 1
  }
})
```

最终的 URL 是“package.json?c=1&xxx=5”。

### 发起多个并发请求

```javascript
function getUserRecords() {
  return this.$fly.get('/user/133/records')
}

function getUserProjects() {
  return this.$fly.get('/user/133/projects')
}

this.$fly
  .all([getUserRecords(), getUserProjects()])
  .then(
    fly.spread(function(records, projects) {
      //两个请求都完成
    })
  )
  .catch(function(error) {
    console.log(error)
  })
```

### 直接通过 `request` 接口发起请求

```javascript
//直接调用request函数发起post请求
this.$fly
  .request(
    '/test',
    {hh: 5},
    {
      method: 'post',
      timeout: 5000 //超时设置为5s
    }
  )
  .then(d => {
    console.log('request result:', d)
  })
  .catch(e => console.log('error', e))
```

### 发送`URLSearchParams`

```javascript
const params = new URLSearchParams()
params.append('a', 1)
this.$fly.post('', params).then(d => {
  console.log('request result:', d)
})
```

注：Node 环境不存在 URLSearchParams。各个浏览器对 URLSearchParams 的支持程度也不同，使用时务必注意

### 发送 `FormData`

```javascript
var formData = new FormData()
var log = console.log
formData.append('username', 'Chris')
this.$fly
  .post('../package.json', formData)
  .then(log)
  .catch(log)
```

注：Fly 目前只在支持 `FormData` 的浏览器环境中支持 `FormData`，Node 环境下对 `FormData` 的支持方式稍有不同，详情戳这里 [Node 下增强的 API ](https://wendux.github.io/dist/#/doc/flyio/node)

### 请求二进制数据

```javascript
this.$fly
  .get('/Fly/v.png', null, {
    responseType: 'arraybuffer'
  })
  .then(d => {
    //d.data 为ArrayBuffer实例
  })
```

注：在浏览器中时 `responseType` 值可为 "arraybuffer" 或"blob"之一。在 node 下只需设为 "stream"即可。
