 # Integrazione ChatGPT (AI) per Dieta Personalizzata

Questa guida spiega come configurare e utilizzare il backend AI che consente alla web app di inviare le note dei pazienti e ricevere un piano personalizzato da ChatGPT.

## Avvio locale

1. Assicurati di avere Node.js installato.
2. Installa le dipendenze necessarie eseguendo:

   ```bash
   npm install express cors node-fetch
   ```

3. Esporta la tua chiave API OpenAI in una variabile di ambiente:

   ```bash
   export OPENAI_API_KEY=your_openai_key   # sostituisci con la tua chiave
   ```

4. Avvia il server backend:

   ```bash
   node server.js
   ```

   Il server ascolterà sulla porta 3000 (o quella definita dalla variabile `PORT`).

## Esempio di richiesta

Per testare manualmente l'endpoint AI, puoi inviare una richiesta POST a `/api/ai-suggest`:

```json
{
  "notes": "intolleranza lattosio, vegetariano, post workout la sera",
  "patient": {
    "name": "Emanuela",
    "kcal": 2000
  },
  "planDraft": { "meals": [...], "totalKcal": 2000 }
}
```

L'endpoint risponderà con un oggetto JSON contenente:

- `summary`: breve riepilogo delle note interpretate.
- `patch`: un oggetto con `exclusions`, `inclusions` e una nuova distribuzione `distro` (array con le percentuali per colazione, spuntino, pranzo, spuntino pomeridiano e cena).

## Deploy su Vercel o Render

Per pubblicare il backend:

1. Crea un nuovo progetto in Vercel o Render e collega questo repository.
2. Imposta la variabile d'ambiente `OPENAI_API_KEY` dal pannello di configurazione.
3. Specifica `server.js` come file di ingresso (entry).
4. Aggiorna il frontend: aggiungi in `index.html` una riga come

   ```html
   <script>
     window.AI_API_URL = 'https://TUO-PROGETTO.onrender.com';
   </script>
   ```

   Sostituisci l'URL con quello del tuo backend.

## Sicurezza

Non committare mai la tua chiave OpenAI nel repository. Utilizza le variabili d'ambiente sia in locale che in produzione.
