export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  const API_KEY = '42d875f1-0ec9-41e0-83a6-600bc132ab38';
  const ASSISTANT_ID = 'bbfe1819-66c2-4acf-951a-2ae260387f94';
  const FROM_NUMBER_ID = '2268095634';

  const payload = {
    recipient_phone: phone,
    assistant_id: ASSISTANT_ID,
    from_number_id: FROM_NUMBER_ID,
    custom_args: { lead_name: name }
  };

  try {
    const response = await fetch('https://api.ringg.ai/calling/outbound/individual', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to connect to Ringg AI' });
  }
}
