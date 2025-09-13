// netlify/functions/getComments.js
const fetch = require('node-fetch'); // Netlify supports node-fetch

exports.handler = async function(event, context) {
  const notionToken = process.env.NOTION_TOKEN; // set as env variable in Netlify
  const { pageId } = event.queryStringParameters;
  if (!pageId) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing pageId" }) };
  }

  try {
    const res = await fetch(
      `https://api.notion.com/v1/comments?block_id=${pageId}`,
      {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${notionToken}`,
          "Notion-Version": "2025-09-03"
        }
      }
    );
    const data = await res.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data.results || [])
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to fetch comments" }) };
  }
};
