import { useState } from "react";
import axios from "axios";
import "./App.css";

const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

function App() {
  const [messages, setMessages] = useState([]); // 聊天记录
  const [input, setInput] = useState('');        // 输入框内容
  const [loading, setLoading] = useState(false); // 加载状态

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: newMessages,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`, // 请替换成你的API密钥
          },
        }
      );

      const aiMessage = response.data.choices[0].message;
      setMessages([...newMessages, aiMessage]);
    } catch (error) {
      console.error('请求失败', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>智能对话机器人</h1>
      <div style={{ border: '1px solid #ccc', padding: '10px', height: '400px', overflowY: 'scroll' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <b>{msg.role === 'user' ? '你' : 'AI'}:</b> {msg.content}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '10px', display: 'flex' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, marginRight: '10px' }}
          placeholder="请输入你的问题..."
        />
        <button onClick={handleSend} disabled={loading}>
          {loading ? '发送中...' : '发送'}
        </button>
      </div>
    </div>
  );
}

export default App;
