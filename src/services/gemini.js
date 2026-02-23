import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let ai = null;
if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
}

export const callGeminiAPI = async (systemInstruction, userText, additionalDocs = []) => {
    if (!ai) {
        throw new Error('Gemini API 설정이 누락되었습니다. .env 파일을 확인해주세요.');
    }

    // Requested model
    const modelName = 'gemini-3.1-pro';

    const parts = [];

    // Attach any PDF docs or extra parts
    for (const doc of additionalDocs) {
        if (doc.type === 'document' && doc.source?.type === 'base64') {
            parts.push({
                inlineData: {
                    mimeType: doc.source.media_type,
                    data: doc.source.data
                }
            });
        }
    }

    parts.push({ text: userText });

    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: parts,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7,
            }
        });

        return response.text;
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error(`API 오류: ${error.message || '알 수 없는 오류'}`);
    }
};
