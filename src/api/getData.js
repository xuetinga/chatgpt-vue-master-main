import base from './index'
let axios = base.axios
let baseUrl = base.baseUrl

// 获取好友
export const getFriend = params => {
    return axios({
      method: 'post',
      baseURL: `${baseUrl}/friend/friendList`,
      data: params
    }).then(res => res.data)
  }

  // 获取聊天信息
export const getChatMsg = params => {
  return axios({
    method: 'post',
    baseURL: `${baseUrl}/friend/chatMsg`,
    data: params
  }).then(res => res.data)
}

  // 获取聊天信息
  export const chatgpt = params => {
    return axios({
      method: 'post',
      url: `http://172.20.10.2:8000/kb_chat/${params.chat_id}`,
      data: params,
 
    }).then(res =>{
      return res
    } )
  }
  // 获取聊天信息
  export const chatupload = params => {
    return axios({
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      url: `http://172.20.10.2:8000/upload`,
      data: params,
    }).then(res =>{
      return res
    } )
  }