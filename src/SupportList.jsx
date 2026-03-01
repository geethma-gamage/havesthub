import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SupportList() {
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState({}); // track reply per message

  // Fetch all support messages
  const fetchMessages = () => {
    axios.get('http://localhost:8081/support')
      .then(res => setMessages(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Handle sending reply
  const handleReply = (id) => {
    const reply = replyText[id];
    if (!reply || !reply.trim()) return alert('Enter a reply!');

    axios.post(`http://localhost:8081/support/reply/${id}`, { reply })
      .then(res => {
        alert(res.data.message);
        setReplyText({ ...replyText, [id]: '' }); // clear input
        fetchMessages(); // refresh table
      })
      .catch(err => {
        console.error(err);
        alert(err.response?.data?.message || 'Failed to send reply');
      });
  };

  return (
    <div>
      <h2>Support Messages</h2>
      <table border="1" cellPadding="5" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
            <th>Reply</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {messages.map(msg => (
            <tr key={msg.id}>
              <td>{msg.id}</td>
              <td>{msg.customer_name}</td>
              <td>{msg.customer_email}</td>
              <td>{msg.message}</td>
              <td>
                {msg.status === 'Replied' ? (
                  <div>{msg.reply}</div>
                ) : (
                  <textarea
                    rows="2"
                    value={replyText[msg.id] || ''}
                    onChange={(e) =>
                      setReplyText({ ...replyText, [msg.id]: e.target.value })
                    }
                  />
                )}
              </td>
              <td>{msg.status}</td>
              <td>{msg.created_at}</td>
              <td>
                {msg.status !== 'Replied' && (
                  <button onClick={() => handleReply(msg.id)}>Send Reply</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SupportList;
