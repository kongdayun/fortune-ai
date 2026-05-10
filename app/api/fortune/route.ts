export const runtime = 'edge';

import { CATEGORIES } from '@/lib/categories';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { category, inputs, imageBase64, imageMime } = body;

    const cat = CATEGORIES[category];
    if (!cat) {
      return Response.json({ error: '잘못된 카테고리입니다.' }, { status: 400 });
    }

    const userText = buildUserText(category, inputs);

    type ContentBlock =
      | { type: 'text'; text: string }
      | { type: 'image'; source: { type: 'base64'; media_type: string; data: string } };

    const content: ContentBlock[] = [];

    if (imageBase64 && (category === 'gwansang' || category === 'palm')) {
      const mime = ['image/jpeg','image/png','image/gif','image/webp'].includes(imageMime)
        ? imageMime : 'image/jpeg';
      content.push({ type: 'image', source: { type: 'base64', media_type: mime, data: imageBase64 } });
    }
    content.push({ type: 'text', text: userText });

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY ?? '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2500,
        stream: true,
        system: cat.systemPrompt,
        messages: [{ role: 'user', content }],
      }),
    });

    if (!anthropicRes.ok) {
      const err = await anthropicRes.text();
      return Response.json({ error: `Anthropic API 오류: ${err}` }, { status: 500 });
    }

    // Transform Anthropic SSE → our SSE format
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        const text = decoder.decode(chunk, { stream: true });
        for (const line of text.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') {
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            return;
          }
          try {
            const parsed = JSON.parse(data);
            if (
              parsed.type === 'content_block_delta' &&
              parsed.delta?.type === 'text_delta' &&
              parsed.delta?.text
            ) {
              const out = JSON.stringify({ text: parsed.delta.text });
              controller.enqueue(encoder.encode(`data: ${out}\n\n`));
            }
          } catch { /* skip malformed lines */ }
        }
      },
      flush(controller) {
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      },
    });

    anthropicRes.body!.pipeTo(writable);

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
      if (inputs.selectedCards) lines.push(`선택한 카드: ${inputs.selectedCards}`);
      lines.push('\n이 질문에 맞는 타로 카드 3장을 뽑고 해석해주세요.');
      break;
    case 'gwansang':
      lines.push(`성별: ${inputs.gender}`);
      if (inputs.name) lines.push(`이름: ${inputs.name}`);
      if (inputs.age) lines.push(`나이: ${inputs.age}세`);
      if (inputs.features) lines.push(`얼굴 특징: ${inputs.features}`);
      lines.push('\n관상을 분석해주세요.');
      break;
    case 'palm':
      lines.push(`손: ${inputs.hand}`);
      lines.push(`성별: ${inputs.gender}`);
      if (inputs.age) lines.push(`나이: ${inputs.age}세`);
      if (inputs.palmDesc) lines.push(`손금 특징: ${inputs.palmDesc}`);
      lines.push('\n손금을 분석해주세요.');
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
      lines.push(inputs.wish
        ? `현재 고민/소원: ${inputs.wish}`
        : '오늘의 포춘쿠키 메시지를 요청합니다.');
      break;
    default:
      Object.entries(inputs).forEach(([k, v]) => { if (v) lines.push(`${k}: ${v}`); });
  }

  return lines.join('\n');
}
