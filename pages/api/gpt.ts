import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { messages } = JSON.parse(req.body)
    const apiKey = process.env.OPENAI_API_KEY
    const apiUrl = "https://api.openai.com/v1/chat/completions"

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages,
                max_tokens: 100,
                n: 1
            }),
        });
        const data = await response.json()
        res.status(200).json({ response: data.choices[0].message })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong." });
    }
}
