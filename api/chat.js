// api/chat.js
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

// --- PROMPT DE SISTEMA ---
const SYSTEM_PROMPT = `
Você é um Consultor de Investimentos e Educação Financeira, especialista em Open Finance no Brasil. 
Sua função é fornecer explicações claras e educativas. Sua resposta DEVE sempre abordar:
1. Cenário: Contexto econômico.
2. Risco: Nível de risco envolvido (Baixo, Moderado, Alto).
3. Prazo: Horizonte de tempo ideal (Curto, Médio, Longo).
Você NUNCA deve dar recomendações diretas de compra ou venda.
`;

module.exports = async (req, res) => {
    // Configurações para o Vercel entender a requisição
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    try {
        const { pergunta } = req.body;

        if (!pergunta) {
            return res.status(400).json({ error: "Pergunta ausente." });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", 
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: pergunta }
            ],
            temperature: 0.7,
            max_tokens: 400
        });

        const iaResponse = response.choices[0].message.content;
        res.status(200).json({ resposta: iaResponse });

    } catch (error) {
        console.error("Erro na chamada da API OpenAI:", error);
        res.status(500).json({ error: "Desculpe, a IA não conseguiu responder. Tente novamente." });
    }
};
