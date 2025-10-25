// Backend AI server for Dieta Personalizzata
// Uses Express and OpenAI API to process diet notes and return suggestions
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// POST /api/ai-suggest
// Expects body: { notes: string, patient: {name: string, kcal: number}, planDraft: any }
// Returns: { summary: string, patch: { exclusions?: string[], inclusions?: string[], distro?: number[] } }
app.post('/api/ai-suggest', async (req, res) => {
  const { notes, patient, planDraft } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OPENAI_API_KEY environment variable' });
  }
  const prompt = `Sei un dietista professionista. Analizza le note fornite e suggerisci modifiche al piano dietetico. Produci un oggetto JSON con due campi: \"summary\" e \"patch\". Il campo \"patch\" può contenere \"exclusions\" (array di alimenti da escludere), \"inclusions\" (array di alimenti da includere) e \"distro\" (array di 5 frazioni che sommano a 1 per colazione, spuntino mattutino, pranzo, spuntino pomeridiano, cena).\nNote: ${notes}\nPaziente: ${patient?.name || ''}, kcal: ${patient?.kcal || ''}\nPiano: ${JSON.stringify(planDraft)}\n`;
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Sei un assistente dietistico.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3
      })
    });
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '{}';
    let result;
    try {
      const match = content.match(/\{[\s\S]*\}/);
      result = match ? JSON.parse(match[0]) : { summary: content, patch: {} };
    } catch (err) {
      result = { summary: content, patch: {} };
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

app.listen(PORT, () => {
  console.log(`AI server running on port ${PORT}`);
});
