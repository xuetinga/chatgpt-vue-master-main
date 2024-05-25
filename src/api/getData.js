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
// 获取最初聊天信息
export const getChat = params => {
  return axios({
    method: 'post',
    url: `http://43.140.220.187:8001/chat/new_chat`,
    data: params
  }).then(res => res.data)
}
// 获取单个聊天信息
export const getChatchat = params => {
  return axios({
    method: 'post',
    url: `http://43.140.220.187:8001/chat/${params.dialogue_id}/chat?query=${params.query}&config=${params.config}`,
    data: params
  }).then(res => res.data)
}



// 获取聊天信息
export const chatgpt = params => {
  return axios({
    method: 'post',
    // url: `http://43.140.220.187:8001/chat/knowledge_base_chat`,

    url: `http://43.140.220.187:8001/chat/${params.dialogue_id}/knowledge_base_chat?query=${params.query}&config=${params.config}`,
    data: params,

  }).then(res => {
    return res
  })
}
// 获取聊天信息
export const chatupload = params => {
  return axios({
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: `http://43.140.220.187:8001/upload/img`,
    data: params,
  }).then(res => {
    return res
  })
}

// 获取history
export const gethistory = params => {
  return axios({
    method: 'get',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: `http://43.140.220.187:8001/history/chat_history`,
    data: params,
  }).then(res => {
    return res
  })
}
// 获取exam
export const getexam = params => {
  return axios({
    method: 'get',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: `http://43.140.220.187:8001/exam`,
    data: params,
  }).then(res => {
    return res
  })
}
// 获取static
export const getstatic = params => {
  return axios({
    method: 'get',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: `http://43.140.220.187:8001/static`,
    data: params,
  }).then(res => {
    return res
  })
}
// 条款检查
export const setclause_check = params => {
  return axios({
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: `http://43.140.220.187:8001/chat/${params.dialogue_id}/clause_check?query=${params.query}&config=${params.config}`,
    data: params,
  }).then(res => {
    return res
  })
}
// 删除对应id的对话
export const delete_dialogue = params => {
  return axios({
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: `http://43.140.220.187:8001/chat/delete_chat/${params.dialogue_id}`,
    data: params,
  }).then(res => {
    return res
  })
}
// 获取聊天信息
export const chatStreamgpt = params => {
  return axios({
    method: 'post',
    // url: `http://43.140.220.187:8001/chat/knowledge_base_chat`,

    url: `http://43.140.220.187:8001/stream-chat?dialogue_id=${params.dialogue_id}&query=${params.query}&config=${params.config}`,
    data: params,

  }).then(res => {
    return res
  })
}
