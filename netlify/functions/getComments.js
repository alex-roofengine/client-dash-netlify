import { Client } from '@notionhq/client';

export const handler = async (event) => {
  try {
    const { pageId } = event.queryStringParameters || {};
    if (!pageId) {
      throw new Error('Missing required parameter: pageId');
    }

    // Initialize Notion SDK with your token
    const notion = new Client({ auth: process.env.NOTION_TOKEN });

    // Get comments using the correct API method
    const response = await notion.comments.list({ block_id: pageId });

    // Format: show the 5 most recent comments in a friendly format
    const comments = response.results
      .sort((a, b) => new Date(b.created_time) - new Date(a.created_time))
      .slice(0, 5)
      .map(comment => ({
        author: comment.created_by?.person?.name || 'Unknown',
        date: comment.created_time,
        text: comment.rich_text?.map(rt => rt.plain_text).join('') || ''
      }));

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