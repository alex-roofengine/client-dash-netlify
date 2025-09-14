import { Client } from '@notionhq/client';

export const handler = async (event) => {
  try {
    // Get block_id from query params (should be the Notion pageId)
    const { pageId } = event.queryStringParameters || {};
    if (!pageId) {
      throw new Error('Missing required parameter: pageId');
    }

    // Initialize Notion SDK
    const notion = new Client({ auth: process.env.NOTION_TOKEN });

    // List comments from Notion API
    const notionResponse = await notion.comments.list({ block_id: pageId });

    // Take up to 5 most recent comments, sorted by time desc
    const comments = (notionResponse.results || [])
      .sort((a, b) => new Date(b.created_time) - new Date(a.created_time))
      .slice(0, 5)
      .map(comment => ({
        author: comment.created_by?.person?.name || "Unknown",
        date: comment.created_time,
        text: comment.rich_text?.map(rt => rt.plain_text).join('') || ""
      }));

    // Respond with direct comments array
    return {
      statusCode: 200,
      body: JSON.stringify(comments)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
