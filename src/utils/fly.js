import Fly from 'flyio/dist/npm/wx'
import api from '../config/index'
import {localStorage} from '../utils/multiStore'

let flyio = new Fly()
// 链接超时时间
flyio.config.timeout = 35000
// 链接基本地址
flyio.config.baseURL = process.env.BASE_URL
flyio.config.headers = {
  Authorization: getToken()
}

//添加请求拦截器
flyio.interceptors.request.use(request => {
  //公共参数
  return request
})

//添加响应拦截器
flyio.interceptors.response.use(
  response => {
    if (response.statusCode == 401) {
      console.err('用户身份过期,请重新登录!')
      localStorage.removeItem('token')
    } else {
      return response.data //请求成功之后将返回值返回
    }
  },
  err => {
    //请求出错，根据返回状态码判断出错原因
    console.log(err)
    if (err) {
      return '请求失败: ' + err
    }
  }
)

function getToken() {
  let token = localStorage.getItem('token')
  if (token == '' || token == undefined) {
    refreshToken()
    return localStorage.getItem('token')
  }
  return token
}

function refreshToken() {
  const url = api.GET_TOKEN + '?corpId=' + process.env.CORPID
  flyio
    .post(
      url,
      {},
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then(result => {
      if (result.statusCode == 200) {
        localStorage.setItem('token', result.data.data)
      }
    })
    .catch(error => {
      console.log(error)
    })
}

export default flyio
