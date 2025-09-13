import React, { useState, useEffect } from 'react';

function App() {
  const [clients, setClients] = useState([]);
  const [selectedClientIndex, setSelectedClientIndex] = useState(0);
  const [notes, setNotes] = useState('');
  const [comments, setComments] = useState([]);
  const selectedClient = clients[selectedClientIndex];

  // Webhook URL from secure Netlify environment variable
  const WEBHOOK_URL = process.env.REACT_APP_WEBHOOK_URL;

  // Load client list from Netlify Function
  useEffect(() => {
    fetch('/.netlify/functions/getClients')
      .then(res => res.json())
      .then(data => setClients(data))
      .catch(() => setClients([]));
  }, []);

  // Fetch Notion comments from secure Netlify Function
  useEffect(() => {
    async function fetchComments() {
      if (!selectedClient || !selectedClient.notionPageId) {
        setComments([]);
        return;
      }
      try {
        const res = await fetch(
          `/.netlify/functions/getComments?pageId=${selectedClient.notionPageId}`
        );
        const data = await res.json();
        setComments(data);
      } catch (error) {
        setComments([]);
      }
    }
    fetchComments();
  }, [selectedClientIndex, selectedClient]);

  // Submit form to webhook
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { client: selectedClient, notes };
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setNotes('');
      alert('Message sent!');
    } catch (err) {
      alert('Failed to send message.');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      {/* Left Column */}
      <div style={{ flex: 1, borderRight: '1px solid #eee', padding: '32px' }}>
        <h2>Select Client</h2>
        <select
          style={{ width: '100%', marginBottom: 24, fontSize: '1em', padding: '8px' }}
          value={selectedClientIndex}
          onChange={e => setSelectedClientIndex(Number(e.target.value))}
        >
          {clients.map((client, idx) => (
            <option key={client.name} value={idx}>
              {client.name}
            </option>
          ))}
        </select>
        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 8 }}>
            Your Notes:
          </label>
          <textarea
            required
            value={notes}
            onChange={e => setNotes(e.target.value)}
            style={{
              width: '100%',
              height: '180px',
              fontSize: '1.2em',
              marginBottom: '24px',
              padding: '12px',
              border: '1px solid #ccc',
              borderRadius: '6px'
            }}
            placeholder="Type your notes here..."
          />
          <button type="submit" style={{ padding: '12px 22px', fontSize: '1em' }}>
            Submit
          </button>
        </form>
      </div>
      {/* Right Column */}
      <div style={{ flex: 1, padding: '32px' }}>
        <h2>Notion Comments</h2>
        {comments.length === 0 ? (
          <p>No comments found for this client.</p>
        ) : (
          <ul style={{ paddingLeft: 0 }}>
            {comments.map((comment) => (
              <li key={comment.id} style={{ marginBottom: 18, listStyle: 'none', background: '#f7f7fa', padding: '16px', borderRadius: '6px' }}>
                {/* Notion comments: display all plain text parts */}
                {comment.rich_text?.map((r) => r.plain_text).join(' ') || 'No text'}
                <div style={{ fontSize: '0.85em', color: '#888', marginTop: '8px' }}>
                  {comment.created_time
                    ? new Date(comment.created_time).toLocaleString()
                    : ''}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
