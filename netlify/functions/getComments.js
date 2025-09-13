export const handler = async (event) => {
  try {
    // Extract pageId from query parameters (if provided)
    const { pageId } = event.queryStringParameters || {};

    // Build the Notion API URL or fallback to a safe endpoint if needed
    if (!pageId) {
      throw new Error('Missing required parameter: pageId');
    }
    const notionApiUrl = `https://api.notion.com/v1/pages/${pageId}/comments`;

    // Native fetch is available on Node 18+; no node-fetch needed
    const response = await fetch(notionApiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
        'Notion-Version': '2025-09-03',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Respond with the comments array or object
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    // Return a clear error message for client-side handling
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};