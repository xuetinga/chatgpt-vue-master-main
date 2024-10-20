import axios from "axios";

const instance = axios.create({
  baseURL: "",
  timeout: 1000 * 60 * 2,
  headers: { "Content-Type": "application/json" },
});
// instance.defaults.headers.common["Authorization"] = `Bearer ${OPENAI_API_KEY}`;

export const chatgpt = (content) => {
  return instance.post("v1/chat/completions", { content: content });
};
