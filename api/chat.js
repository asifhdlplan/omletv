export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { message } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        messages: [
          { role: "system", content: "Reply like a real anonymous stranger. Short and natural." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    // 🔍 Debug log (important)
    console.log("API RESPONSE:", data);

    // ✅ Safe return
    if (data.choices && data.choices.length > 0) {
      return res.status(200).json({
        reply: data.choices[0].message.content
      });
    } else {
      return res.status(200).json({
        reply: "⚠️ AI not responding properly"
      });
    }

  } catch (error) {
    return res.status(500).json({
      reply: "⚠️ Server error"
    });
  }
}
