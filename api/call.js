export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  phone = phone.trim();
  if (!phone.startsWith('+')) {
    phone = '+91' + phone;
  }

  const API_KEY = '42d875f1-0ec9-41e0-83a6-600bc132ab38';
  const ASSISTANT_ID = 'bbfe1819-66c2-4acf-951a-2ae260387f94';
  const FROM_NUMBER_ID = 'ffc7dd03-3a4d-46ef-9aab-5aba0699ad36';

  const payload = {
    name: name,
    mobile_number: phone,
    agent_id: ASSISTANT_ID,
    from_number_id: FROM_NUMBER_ID,
    custom_args_values: {
      callee_name: name,
      mobile_number: phone
    }
  };

  try {
    const response = await fetch('https://prod-api.ringg.ai/ca/api/v0/calling/outbound/individual', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY
      },
      body: JSON.stringify(payload)
    });

    const rawText = await response.text();

    let data;
    try { data = JSON.parse(rawText); }
    catch { data = { raw: rawText }; }

    console.log('Ringg AI status:', response.status);
    console.log('Ringg AI response:', rawText);

    return res.status(response.status).json(data);

  } catch (err) {
    console.error('Fetch error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
