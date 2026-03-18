export const config = {
  api: { bodyParser: { sizeLimit: "2mb" } }
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const body      = req.body || {};
    const model     = typeof body.model === "string" ? body.model : "gpt-5.4-2026-03-05";
    const input     = typeof body.input === "string" ? body.input : "hello";
    const maxTokens = typeof body.max_output_tokens === "number" ? body.max_output_tokens : 4096;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ model, input, max_output_tokens: maxTokens })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
