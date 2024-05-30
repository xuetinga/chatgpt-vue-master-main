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
export const getkbChat = params => {
  return axios({
    method: 'post',
    url: `http://121.43.126.21:8001/chat/new_kb_chat`,
    data: params
  }).then(res => res.data)
}
export const getclauseChat = params => {
  return axios({
    method: 'post',
    url: `http://121.43.126.21:8001/chat/new_clause_chat`,
    data: params
  }).then(res => res.data)
}
export const getChat = params => {
  return axios({
    method: 'post',
    url: `http://121.43.126.21:8001/chat/new_chat`,
    data: params
  }).then(res => res.data)
}
// 获取单个聊天信息
export const getChatchat = params => {
  return axios({
    method: 'post',
    url: `http://121.43.126.21:8001/chat/${params.dialogue_id}/chat?query=${params.query}&config=${params.config}`,
    data: params
  }).then(res => res.data)
}



// 获取聊天信息
export const chatgpt = params => {
  return axios({
    method: 'post',
    // url: `http://121.43.126.21:8001/chat/knowledge_base_chat`,

    url: `http://121.43.126.21:8001/chat/${params.dialogue_id}/knowledge_base_chat?query=${params.query}&config=${params.config}`,
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
    url: `http://121.43.126.21:8001/upload/img`,
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
    url: `http://121.43.126.21:8001/history/chat_history`,
    data: params,
  }).then(res => {
    return res
  })
}
// 获取history
export const getkbhistory = params => {
  return axios({
    method: 'get',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: `http://121.43.126.21:8001/history/kb_chat_history`,
    data: params,
  }).then(res => {
    return res
  })
}
// 获取history
export const getclausehistory = params => {
  return axios({
    method: 'get',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: `http://121.43.126.21:8001/history/clause_chat_history`,
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
    url: `http://121.43.126.21:8001/exam`,
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
    url: `http://121.43.126.21:8001/static`,
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
    url: `http://121.43.126.21:8001/chat/${params.dialogue_id}/clause_check?query=${params.query}&config=${params.config}`,
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
    url: `http://121.43.126.21:8001/chat/delete_chat/${params.dialogue_id}`,
    data: params,
  }).then(res => {
    return res
  })
}

export const chatkbStreamgpt = async (params, handleChunk, handleReferences) => {
  const response = await fetch(`http://121.43.126.21:8001/chat/${params.dialogue_id}/knowledge_base_stream_chat?query=${params.query}&config=${params.config}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify(params)
  });

  const readableStream = response.body;
  if (readableStream) {
    const reader = readableStream.getReader();
    let first = true;
    let isReferences = false;
    let references = '';
    
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      const chunkValue = new TextDecoder().decode(value);
      const lines = chunkValue.split('\n').filter(line => line.startsWith('data: '));
      lines.forEach(line => {
        const content = line.slice(6).trim(); // Remove 'data: ' prefix and trim whitespace
        if (isReferences) {
          references = content;
        } else if (content.startsWith('{"response"')) {
          
          isReferences = true;
          references = content;
        } else {
          handleChunk(first, content);
        }
        first = false;
      });
    }
    
    reader.releaseLock();
    
    if (isReferences && references) {
      handleReferences(references);
    }
  }
};

export const chatclauseStreamgpt = async (params, handleChunk, handleReferences) => {
  const response = await fetch(`http://121.43.126.21:8001/chat/${params.dialogue_id}/clause_stream_check?query=${params.query}&config=${params.config}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify(params)
  });

  const readableStream = response.body;
  if (readableStream) {
    const reader = readableStream.getReader();
    let first = true;
    let isReferences = false;
    let references = '';
    let hasdata = false;
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      const chunkValue = new TextDecoder().decode(value);
      const lines = chunkValue.split('\n').filter(line => line.startsWith('data: '));
      lines.forEach(line => {
        const content = line.slice(6).trim(); // Remove 'data: ' prefix and trim whitespace
        if (isReferences) {
          references = content;
        } else if (content.startsWith('{"response"')) {
          isReferences = true;
          references = content;
        } else {
          hasdata =true
          handleChunk(first, content);
        }
        first = false;
      });
      if(hasdata == false){
        handleChunk(true, "");
      }
    }
    
    reader.releaseLock();
    
    if (isReferences && references) {
      handleReferences(references);
    }
  }
};
export const chatStreamgpt = async (params, handleChunk, handleReferences) => {
  const response = await fetch(`http://121.43.126.21:8001/chat/${params.dialogue_id}/stream_chat?query=${params.query}&config=${params.config}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify(params)
  });

  const readableStream = response.body;
  if (readableStream) {
    const reader = readableStream.getReader();
    let first = true;
    let isReferences = false;
    let references = '';
    
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      const chunkValue = new TextDecoder().decode(value);
      const lines = chunkValue.split('\n').filter(line => line.startsWith('data: '));
      lines.forEach(line => {
        const content = line.slice(6).trim(); // Remove 'data: ' prefix and trim whitespace
        if (isReferences) {
          references = content;
        } else if (content.startsWith('{"response"')) {
          isReferences = true;
          references = content;
        } 
        else if (content.startsWith('"markdown"')) {
          handleChunk(first, "");
        } 
        else {
          handleChunk(first, content);
        }
        first = false;
      });
    }
    
    reader.releaseLock();
    
    if (isReferences && references) {
      handleReferences(references);
    }
  }
};