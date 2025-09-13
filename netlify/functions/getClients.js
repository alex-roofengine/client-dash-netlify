// netlify/functions/getClients.js

exports.handler = async function(event, context) {
  const clients = [
    {
      "name": "United Contracting & Roofing",
      "notionPageId": "82594b6db4244babaff0004102717f29",
      "ghlLocationId": "Pz0AyuL7ZZd3lpLwgHeo",
      "slackID": "C03TZ5NJZPF",
      "ghlAPIKey": "pit-fda69e70-abec-4047-a56e-6d92d1bf9ab5",
      "stripeCustomerID": "cus_MJlDkoKaj5PSj8"
    }
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
