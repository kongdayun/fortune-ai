export const runtime = 'edge';

import Anthropic from '@anthropic-ai/sdk';
import type { MessageParam } from '@anthropic-ai/sdk/resources/messages';
import { CATEGORIES } from '@/lib/categories';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const VALID_MIME = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const;
type ValidMime = typeof VALID_MIME[number];

function isValidMime(m: string): m is ValidMime {
  return (VALID_MIME as readonly string[]).includes(m);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { category, inputs, imageBase64, imageMime } = body;

    const cat = CATEGORIES[category];
    if (!cat) {
      return Response.json({ error: '잘못된 카테고리입니다.' }, { status: 400 });
    }

    const userText = buildUserText(category, inputs);

    const content: MessageParam['content'] = [];

    if (imageBase64 && (category === 'gwansang' || category === 'palm')) {
      const mime: ValidMime = isValidMime(imageMime) ? imageMime : 'image/jpeg';
      content.push({
        type: 'image',
        source: { type: 'base64', media_type: mime, data: imageBase64 },
      });
    }
    content.push({ type: 'text', text: userText });

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 2500,
      system: cat.systemPrompt,
      messages: [{ role: 'user', content }],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              const data = JSON.stringify({ text: chunk.delta.text });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'AI 분석 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

function buildUserText(category: string, inputs: Record<string, string>): string {
  const lines: string[] = [];

  switch (category) {
    case 'saju':
      lines.push(`이름: ${inputs.name || '비공개'}`);
      lines.push(`생년월일: ${inputs.birthYear}년 ${inputs.birthMonth} ${inputs.birthDay}일`);
      lines.push(`출생 시간: ${inputs.birthHour || '모름'}`);
      lines.push(`성별: ${inputs.gender}`);
      lines.push(`달력: ${inputs.calendar || '양력'}`);
      lines.push('\n위 정보를 바탕으로 사주팔자를 분석해주세요.');
      break;

    case 'gungham':
      lines.push(`[나] 이름: ${inputs.name1}, 생년월일: ${inputs.birth1}, 성별: ${inputs.gender1}`);
      lines.push(`[상대] 이름: ${inputs.name2}, 생년월일: ${inputs.birth2}, 성별: ${inputs.gender2}`);
      lines.push(`관계: ${inputs.relation || '연인/배우자'}`);
      lines.push('\n두 사람의 궁합을 분석해주세요.');
      break;

    case 'astrology':
      lines.push(`이름: ${inputs.name || '비공개'}`);
      lines.push(`생년월일: ${inputs.birthDate}`);
      if (inputs.birthTime) lines.push(`출생 시간: ${inputs.birthTime}`);
      if (inputs.birthPlace) lines.push(`출생지: ${inputs.birthPlace}`);
      lines.push(`관심 분야: ${inputs.focus || '전체 운세'}`);
      lines.push('\n위 정보로 점성술 분석을 해주세요.');
      break;

    case 'tarot':
      lines.push(`질문/고민: ${inputs.question}`);
      lines.push(`분야: ${inputs.area || '인생 전반'}`);
      lines.push('\n이 질문에 맞는 타로 카드 3장을 뽑고 해석해주세요.');
      break;

    case 'gwansang':
      lines.push(`성별: ${inputs.gender}`);
      if (inputs.name) lines.push(`이름: ${inputs.name}`);
      if (inputs.age) lines.push(`나이: ${inputs.age}세`);
      if (inputs.features) lines.push(`얼굴 특징: ${inputs.features}`);
      lines.push('\n관상을 분석해주세요. 사진이 있다면 사진을 보고, 없다면 설명된 특징으로 분석해주세요.');
      break;

    case 'palm':
      lines.push(`손: ${inputs.hand}`);
      lines.push(`성별: ${inputs.gender}`);
      if (inputs.age) lines.push(`나이: ${inputs.age}세`);
      if (inputs.palmDesc) lines.push(`손금 특징: ${inputs.palmDesc}`);
      lines.push('\n손금을 분석해주세요. 사진이 있다면 사진을 보고, 없다면 설명된 특징으로 분석해주세요.');
      break;

    case 'dream':
      lines.push(`꿈 내용: ${inputs.dreamContent}`);
      lines.push(`꿈의 느낌: ${inputs.feeling}`);
      if (inputs.currentSituation) lines.push(`현재 상황: ${inputs.currentSituation}`);
      lines.push('\n이 꿈을 해몽해주세요.');
      break;

    case 'jami':
      lines.push(`이름: ${inputs.name || '비공개'}`);
      lines.push(`생년월일: ${inputs.birthYear}년 ${inputs.birthMonth} ${inputs.birthDay}일`);
      lines.push(`출생 시간: ${inputs.birthHour}`);
      lines.push(`성별: ${inputs.gender}`);
      lines.push(`달력: ${inputs.calendar || '음력'}`);
      lines.push('\n자미두수 명반을 분석해주세요.');
      break;

    case 'fortune':
      lines.push(`이름: ${inputs.name || '비공개'}`);
      lines.push(`생년월일: ${inputs.birthDate}`);
      lines.push(`성별: ${inputs.gender}`);
      if (inputs.zodiac && inputs.zodiac !== '모름') lines.push(`띠: ${inputs.zodiac}`);
      lines.push(`운세 기간: ${inputs.period || '오늘의 운세'}`);
      lines.push('\n운세를 분석해주세요.');
      break;

    case 'cookie':
      if (inputs.wish) {
        lines.push(`현재 고민/소원: ${inputs.wish}`);
      } else {
        lines.push('특별한 질문 없이 오늘의 포춘쿠키 메시지를 요청합니다.');
      }
      break;

    default:
      Object.entries(inputs).forEach(([k, v]) => {
        if (v) lines.push(`${k}: ${v}`);
      });
  }

  return lines.join('\n');
}
