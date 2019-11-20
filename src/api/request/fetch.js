import axios from 'axios'
import { Loading,Message } from 'element-ui';
import Vue from 'vue'
import {imgjoin} from '~/api/utils'

import { Decrypt , Encrypt } from '~/api/utils'

// let version = "1.0.1"

function fetch (options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : localStorage.authorization,
        'Encryption' : 'encryption'
      },
      timeout: 60 * 1000 // 30秒超时
    })
    instance.interceptors.request.use(config => {
      // let loadingInstance = Loading.service({text:'正在努力的加载中!'});
      return config
    }, error => {
      Message({
        message: '加载超时',
        type: 'error'
      });
      // Vue.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
      //   loadingInstance.close();
      // });
      return Promise.reject(error)
    })
    instance(options)
      .then(response => { // then 请求成功之后进行什么操作

        // console.log(response.headers.version)
        // if(version!==response.headers.version){
        //   window.location.reload()
        // }
        if(response.data.data){
          response.data.data = JSON.parse('{ "data":' + Decrypt(response.data.data) + '}')
          response.data.data = response.data.data.data
        }
        resolve(response) // 把请求到的数据发到引用请求的地方
      })
      .catch(error => {
        console.log('请求异常信息：' + error)
        // Vue.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
        //   loadingInstance.close();
        // });
        Message({
          message: '访问服务器出错!',
          type: 'error'
        });
        reject(error)
      })
  })
}

export function CoreRequest (options) {

  // console.log("options")
  // console.log(options.params)

  return fetch({
    url: options.url,
    method: options.hasOwnProperty('method') ? options.method : 'get' ,
    data: options.hasOwnProperty('data') ? { data : Encrypt(JSON.stringify(options.data)) } : {"data":{}},
    // params : options.hasOwnProperty('params') ? { JSON.stringify(options.params) } : { data : {}}
    params : options.hasOwnProperty('params') ? { data : Encrypt(JSON.stringify(options.params)) } : {"data":{}}
    // params : options.hasOwnProperty('params') ? options.params : {}
  }).then((res) => {

    if (res && res.data.rescode === '900001' ){
      localStorage.clear()
      window.location.href= imgjoin("/#/login")
    }else if (res && res.data.rescode !== '10000') {

      if (typeof options.errorcallback === 'function') {
        options.errorcallback(res)
      }
      // valert({content: res.data.msg,confirm:options.confirm,cancel:options.cancel})
      Message({
        message: res.data.msg,
        type: 'error'
      });
    } else {
      if (typeof options.callback === 'function') {
        options.callback(res)
      }
    }
  }).catch((res) => {
    if (typeof options.errorcallback === 'function') {
      options.errorcallback(res)
    }
    Message({
      message: '访问服务器出错!',
      type: 'error'
    });
  })
}
