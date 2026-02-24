import { AI_MODELS } from '../utils/constants';

// API Key from environment
const anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

// ---------- Anthropic Claude ----------

async function callAnthropic(modelId, systemInstruction, userText, docs) {
    if (!anthropicKey) throw new Error('Anthropic API 키가 설정되지 않았습니다. .env에 VITE_ANTHROPIC_API_KEY를 추가해주세요.');

    const content = [];
    for (const doc of docs) {
        if (doc.type === 'document' && doc.source?.type === 'base64') {
            content.push({
                type: 'document',
                source: { type: 'base64', media_type: doc.source.media_type, data: doc.source.data }
            });
        }
    }
    content.push({ type: 'text', text: userText });

    const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'x-api-key': anthropicKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
            model: modelId,
            max_tokens: 4096,
            system: systemInstruction,
            messages: [{ role: 'user', content }],
            temperature: 0.7,
        }),
    });

    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(`Anthropic API 오류 (${res.status}): ${errData.error?.message || res.statusText}`);
    }

    const data = await res.json();
    return data.content?.map(b => b.text).join('') || '';
}

// ---------- Unified Entry Point ----------

export const callAI = async (modelId, systemInstruction, userText, docs = []) => {
    const model = AI_MODELS.find(m => m.id === modelId);
    if (!model) throw new Error(`알 수 없는 모델: ${modelId}`);

    try {
        if (model.provider === 'anthropic') {
            return await callAnthropic(modelId, systemInstruction, userText, docs);
        }
        throw new Error(`지원하지 않는 제공자: ${model.provider}`);
    } catch (error) {
        console.error(`${model.label} API Error:`, error);
        throw new Error(`${model.label} API 오류: ${error.message || '알 수 없는 오류'}`);
    }
};

// Check which providers have API keys configured
export const getAvailableModels = () => {
    return AI_MODELS.filter(m => {
        if (m.provider === 'anthropic') return !!anthropicKey;
        return false;
    });
};
