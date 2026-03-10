import Anthropic from "@anthropic-ai/sdk";

const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

const client = apiKey
  ? new Anthropic({
      apiKey,
      dangerouslyAllowBrowser: true,
    })
  : null;

const MODEL = "claude-sonnet-4-20250514";

export async function generateContent(prompt, type = "general") {
  if (!client) {
    throw new Error("API 키가 설정되지 않았습니다. .env 파일을 확인하세요.");
  }

  const systemPrompts = {
    general: "당신은 창의적인 콘텐츠 생성 AI 어시스턴트입니다. 사용자의 요청에 맞는 고품질 콘텐츠를 생성해주세요. 한국어로 응답하세요.",
    blog: "당신은 전문 블로그 작가입니다. SEO에 최적화된 매력적인 블로그 글을 작성해주세요. 제목, 소제목, 본문을 포함하세요. 한국어로 응답하세요.",
    email: "당신은 비즈니스 이메일 전문가입니다. 전문적이고 명확한 이메일을 작성해주세요. 한국어로 응답하세요.",
    social: "당신은 소셜 미디어 마케팅 전문가입니다. 관심을 끌 수 있는 소셜 미디어 게시물을 작성해주세요. 해시태그도 포함하세요. 한국어로 응답하세요.",
  };

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system: systemPrompts[type] || systemPrompts.general,
    messages: [{ role: "user", content: prompt }],
  });

  return response.content[0].text;
}
