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
    url: `http://121.43.126.21:8001/dialog/add_dialog`,
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
    method: 'get',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: `http://121.43.126.21:8001/dialog/list_dialog?token=${params.access_token}`,
  
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

    url: `http://121.43.126.21:8001/chat/${params.dialogue_id}/chat?query=${params.query}&config=${params.config}`,
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
    url: `http://121.43.126.21:8001/dialog/delete_dialog`,
    data: params,
  }).then(res => {
    return res
  })
}
// 获取对话下所有会话
export const list_conversion = params => {
  return axios({
    method: 'get',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: `http://121.43.126.21:8001/dialog/list_conversion?token=${params.token}&dialog_id=${params.id}`,
    data: params,
  }).then(res => {
    return res
  })
}
// 获取history
// export const getclausehistory = params => {
//   return axios({
//     method: 'get',
//     headers: {
//       'Content-Type': 'multipart/form-data'
//     },
//     url: `http://121.43.126.21:8001/clause/list_standard_clause`,
//     data: params,
//   }).then(res => {
//     return res
//   })
// }
export const list_standard_clause = params => {
  return axios({
    method: 'get',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: `http://121.43.126.21:8001/clause/list_standard_clause?token=${params.token}`,
    data: params,
  }).then(res => {
    return res
  })
}

export const compare_clause = params => {
  return axios({
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    url: `http://121.43.126.21:8001/clause/compare_clause`,
    data: params,
  }).then(res => {
    return res
  })
}
export const list_compare_history = params => {
  return axios({
    method: 'get',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: `http://121.43.126.21:8001/clause/list_compare_history?token=${params.token}`,
    data: params,
  }).then(res => {
    return res
  })
}


export const upload_new_clause = async (file, handleChunk) => {
    const formData = new FormData();
    formData.append('file', file.file);
    formData.append('token', file.token);
    // val params ={

    // }
    // 发送文件上传请求并逐条处理返回的数据流
    const response = await axios.post('http://121.43.126.21:8001/clause/upload_new_clause', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      responseType: 'stream' // 使用流式响应
    });
  
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
  
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
  
      buffer += decoder.decode(value, { stream: true });
  
      let boundaryIndex;
      while ((boundaryIndex = buffer.indexOf('"content":')) !== -1) {
        const start = boundaryIndex + 10;
        const end = buffer.indexOf('}', start);
        if (end === -1) break;
  
        const chunk = buffer.substring(start, end).trim();
        buffer = buffer.substring(end + 1);
  
        const contentMatch = chunk.match(/"(.*?)"/);
        if (contentMatch) {
          const content = contentMatch[1];
          handleChunk(content);
        }
      }
    }
  
    reader.releaseLock();
  };

export const chatkbStreamgpt = async (params, handleChunk, handleReferences) => {
  const response = await fetch(`http://121.43.126.21:8001/chat/knowledge`, {
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
// 条款检查上传

export const upload_exam = async (file, handleChunk) => {
  

  try {
    const response = await fetch('http://121.43.126.21:8001/exam/upload_exam', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const readableStream = response.body;
    if (readableStream) {
      const reader = readableStream.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let boundaryIndex;
        while ((boundaryIndex = buffer.indexOf('data: ')) !== -1) {
          const lineEndIndex = buffer.indexOf('\n', boundaryIndex);
          if (lineEndIndex === -1) break;

          const chunkValue = buffer.substring(boundaryIndex + 6, lineEndIndex).trim(); // Remove 'data: ' prefix and trim whitespace
          buffer = buffer.substring(lineEndIndex + 1);

          if (chunkValue) {
            handleChunk(chunkValue);
          }
        }
      }

      // Process any remaining buffered data
      // if (buffer.length > 0) {
      //   handleChunk(buffer);
      // }

      reader.releaseLock();
    }
  } catch (error) {
    console.error('Error uploading file', error);
  }
};



export const upload_kg = async (file, handleChunk) => {
  const formData = new FormData();
  formData.append('file', file.file);

  // 发送文件上传请求并逐条处理返回的数据流
  const response = await axios.post('http://121.43.126.21:8001/knowledge/upload_kg', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    responseType: 'stream' // 使用流式响应
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    let boundaryIndex;
    while ((boundaryIndex = buffer.indexOf('"content":')) !== -1) {
      const start = boundaryIndex + 10;
      const end = buffer.indexOf('}', start);
      if (end === -1) break;

      const chunk = buffer.substring(start, end).trim();
      buffer = buffer.substring(end + 1);

      const contentMatch = chunk.match(/"(.*?)"/);
      if (contentMatch) {
        const content = contentMatch[1];
        handleChunk(content);
      }
    }
  }

  reader.releaseLock();
};

// 获取聊天信息
export const clause_doc_stream_check1 = params => {
  return axios({
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: `http://121.43.126.21:8001/chat/${params.dialogue_id}/clause_doc_stream_check?config=${params.config}`,
    data: params.file,

  }).then(res => {
    return res
  })
}
export const clause_doc_stream_check = async (params, handleChunk, handleReferences) => {
  const formData = new FormData();
  // Assuming params.file is already a FormData object, if not, add the fields manually
  formData.append('file', params.file);

  // Ensure config is URL encoded

  const response = await fetch(`http://121.43.126.21:8001/chat/${params.dialogue_id}/clause_doc_stream_check?config=${params.config}`, {
    method: 'post',
    body: formData
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

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
export const chatFileStreamgpt = async (params, handleChunk, handleReferences) => {
  const response = await fetch(`http://121.43.126.21:8001/chat/${params.dialogue_id}/stream_doc_chat?query=${params.query}&config=${params.config}`, {
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
// 获取聊天信息
export const upload_doc = params => {
  return axios({
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: `http://121.43.126.21:8001/upload/doc?config=${params.config}`,
    data: params.file,

  }).then(res => {
    return res
  })
}
export const chatImgStreamgpt = async (params, handleChunk, handleReferences) => {
  const response = await fetch(`http://121.43.126.21:8001/chat/${params.dialogue_id}/stream_img_chat?query=${params.query}&config=${params.config}`, {
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
export const upload_img = params => {
  return axios({
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: `http://121.43.126.21:8001/upload/img`,
    data: params.file,

  }).then(res => {
    return res
  })
}
export const login = params => {
  return axios({
    method: 'post',
    url: `http://121.43.126.21:8001/login`,
    data: {
      "username": "test1",
      "password": "111111"
    }
      
  }).then(res => {
    return res
  })
}