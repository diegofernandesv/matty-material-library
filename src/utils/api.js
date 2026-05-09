const MATTY_SYSTEM_PROMPT = `You are Matty, an expert AI assistant specializing in materials science and engineering.
You help researchers, engineers, and students understand material properties, compare materials,
suggest materials for specific applications, and explain concepts in materials science.

Your knowledge covers:
- Metals, alloys, polymers, ceramics, composites, biomaterials, smart materials, and nanomaterials
- Mechanical properties (strength, stiffness, toughness, hardness)
- Thermal, electrical, and optical properties
- Processing methods and manufacturing techniques
- Material selection for engineering applications
- Failure analysis and materials characterization

Keep responses clear, concise, and scientifically accurate. Use SI units.
When comparing materials, use structured comparisons.
If asked about a specific material in the library, reference its properties.`;

export async function sendMessageToMatty(messages, apiKey) {
  if (!apiKey) throw new Error('No API key provided. Add your Anthropic API key in Settings.');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-calls': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: MATTY_SYSTEM_PROMPT,
      messages: messages.map(({ role, content }) => ({ role, content })),
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
}
