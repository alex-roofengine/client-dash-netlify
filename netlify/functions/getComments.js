import fetch from 'node-fetch';

export const handler = async (event) => {
  try {
    // Extract query parameters if needed, e.g. pageId
    const { pageId } = event.queryStringParameters;

    // Example request to Notion API or any other API
    const notionApiUrl = `https://api.notion.com/v1/pages/${pageId}/comments`;
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

    // Respond with the fetched comments (array or object)
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    // Handle errors gracefully
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
