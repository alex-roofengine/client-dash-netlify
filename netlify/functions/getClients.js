// netlify/functions/getClients.js

exports.handler = async function(event, context) {
  // Store your private client data here (hardcoded, or load from environment variables)
  const clients = [
    { name: "Client A", notionPageId: "abc123", ghlLocationId: "def456" },
    { name: "Client B", notionPageId: "xyz789", ghlLocationId: "uvw567" }
  ];

  return {
    statusCode: 200,
    body: JSON.stringify(clients),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' // Enable CORS if accessed from front-end
    }
  };
};
