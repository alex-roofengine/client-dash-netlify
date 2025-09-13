import React, { useState, useEffect } from "react";

// Sidebar component for clients
function Sidebar({ clients, selectedId, onSelect }) {
  return (
    <div style={{ padding: '16px', borderRight: '1px solid #ccc', minWidth: '240px', background: '#f8f8f8', height: '100vh' }}>
      <h2>Clients</h2>
      {Array.isArray(clients) && clients.length > 0 ? (
        clients.map((client) => (
          <div
            key={client.notionPageId}
            style={{
              padding: '8px',
              margin: '4px 0',
              background: selectedId === client.notionPageId ? '#d3eafd' : 'transparent',
              cursor: 'pointer'
            }}
            onClick={() => onSelect(client.notionPageId)}
          >
            {client.name || client.notionPageId}
          </div>
        ))
      ) : (
        <p>No clients found.</p>
      )}
    </div>
  );
}

// Comment display component
function Comment({ comment }) {
  return (
    <div style={{ marginBottom: '12px', padding: '8px', border: '1px solid #e5e5e5' }}>
      <strong>{comment.author}</strong>: {comment.text}
    </div>
  );
}

function App() {
  const [clients, setClients] = useState([]);                  // List of clients
  const [selectedId, setSelectedId] = useState("");            // Selected notionPageId
  const [comments, setComments] = useState([]);                // Comments for client
  const [error, setError] = useState("");                      // Error state
  const [loading, setLoading] = useState(false);               // Loading state
  const [message, setMessage] = useState("");                  // Webhook message input

  // Fetch clients on mount
  useEffect(() => {
    fetch("/.netlify/functions/getClients")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setClients(data);
          setSelectedId(data.notionPageId); // Auto-select first client
        } else if (data.notionPageId) {
          setClients([data]);
          setSelectedId(data.notionPageId);
        } else {
          setError("No clients found or invalid structure.");
        }
      })
      .catch(err => setError(err.message || "Failed to fetch clients."));
  }, []);

  // Fetch comments when notionPageId changes
  useEffect(() => {
    if (!selectedId) {
      setComments([]);
      return;
    }
    setLoading(true);
    fetch(`/.netlify/functions/getComments?pageId=${selectedId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
          setComments([]);
        } else if (Array.isArray(data)) {
          setComments(data);
          setError("");
        } else if (Array.isArray(data.comments)) {
          setComments(data.comments);
          setError("");
        } else {
          setComments([]);
          setError("No comments array found in response.");
        }
      })
      .catch(err => {
        setError(err.message || "Failed to fetch comments.");
        setComments([]);
      })
      .finally(() => setLoading(false));
  }, [selectedId]);

  // Handle webhook message send (replace with actual webhook integration)
  function sendMessage(e) {
    e.preventDefault();
    if (message.trim() === "") return;
    // TODO: Replace with your actual webhook call/integration
    alert(`Webhook Sent: "${message}" for Page ID: ${selectedId}`);
    setMessage("");
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Sidebar clients={clients} selectedId={selectedId} onSelect={setSelectedId} />
      <main style={{ flex: 1, padding: '24px' }}>
        <h1>Comments</h1>
        {loading && <p>Loading comments...</p>}
        {error && !loading && <p style={{ color: 'red' }}>Error: {error}</p>}
        {!loading && !error && Array.isArray(comments) && comments.length === 0 && (
          <p>No comments found.</p>
        )}
        {!loading && Array.isArray(comments) && comments.length > 0 && (
          comments.map(comment => (
            <Comment key={comment.id || comment.author} comment={comment} />
          ))
        )}
        {/* Webhook message form */}
        <form onSubmit={sendMessage} style={{ marginTop: '32px' }}>
          <h2>Send Message via Webhook</h2>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={3}
            style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
            placeholder="Type your message…"
          ></textarea>
          <button type="submit" style={{ padding: '8px 16px' }}>Send</button>
        </form>
      </main>
    </div>
  );
}

export default App;