export interface Field {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'image';
  placeholder?: string;
  options?: string[];
  required?: boolean;
  hint?: string;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  description: string;
  longDesc: string;
  gradient: string;
  glowColor: string;
  cardBg: string;
  fields: Field[];
  systemPrompt: string;
  special?: 'tarot' | 'cookie';
}

export const CATEGORIES: Record<string, Category> = {
  saju: {
    id: 'saju',
    name: '사주',
    emoji: '🌙',
    description: '생년월일시로 보는 사주팔자 분석',
    longDesc: '당신의 생년월일시에 담긴 천간지지(天干地支)를 분석하여 타고난 기질, 적성, 올해의 운세를 알려드립니다.',
    gradient: 'from-violet-600 via-purple-600 to-indigo-700',
    glowColor: '#7C3AED',
    cardBg: 'rgba(124,58,237,0.15)',
    fields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'birthYear', label: '출생연도', type: 'number', placeholder: '예: 1995', required: true },
      { id: 'birthMonth', label: '출생월', type: 'select', options: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'], required: true },
      { id: 'birthDay', label: '출생일', type: 'number', placeholder: '예: 15', required: true },
      { id: 'birthHour', label: '출생 시간', type: 'select', options: ['모름','자시 (23-01시)','축시 (01-03시)','인시 (03-05시)','묘시 (05-07시)','진시 (07-09시)','사시 (09-11시)','오시 (11-13시)','미시 (13-15시)','신시 (15-17시)','유시 (17-19시)','술시 (19-21시)','해시 (21-23시)'], hint: '모르시면 모름 선택' },
      { id: 'gender', label: '성별', type: 'select', options: ['남성', '여성'], required: true },
      { id: 'calendar', label: '달력 종류', type: 'select', options: ['양력', '음력'] },
    ],
    systemPrompt: `당신은 30년 경력의 사주명리학 전문가입니다. 사용자의 생년월일시와 성별을 바탕으로 사주팔자를 분석해주세요.

다음 순서로 분석하세요:
1. 🌟 **사주 개요** - 천간지지(년주·월주·일주·시주) 설명
2. 🌊 **오행 분석** - 목화토금수 균형과 특징
3. ✨ **타고난 기질과 성격** - 강점과 주의할 점
4. 💼 **적성과 직업운** - 어울리는 분야
5. 💕 **연애·결혼운** - 이상적인 인연과 궁합
6. 💰 **재물운** - 돈과의 인연, 재테크 방향
7. 🍀 **올해의 운세** - 현재 연도 대운 분석
8. 🌈 **조언** - 운명을 개척하는 방법

친근하고 따뜻하게, 하지만 전문적으로 한국어로 답하세요. 긍정적인 면을 강조하되 주의사항도 솔직하게 알려주세요.`,
  },

  gungham: {
    id: 'gungham',
    name: '궁합',
    emoji: '💑',
    description: '두 사람의 운명적 인연 분석',
    longDesc: '두 사람의 사주를 비교 분석하여 천생연분인지, 어떤 부분에서 잘 맞고 보완이 필요한지 알려드립니다.',
    gradient: 'from-pink-600 via-rose-500 to-red-600',
    glowColor: '#EC4899',
    cardBg: 'rgba(236,72,153,0.15)',
    fields: [
      { id: 'name1', label: '내 이름', type: 'text', placeholder: '내 이름', required: true },
      { id: 'birth1', label: '내 생년월일', type: 'text', placeholder: '예: 1995년 8월 15일', required: true },
      { id: 'gender1', label: '내 성별', type: 'select', options: ['남성', '여성'], required: true },
      { id: 'name2', label: '상대방 이름', type: 'text', placeholder: '상대방 이름', required: true },
      { id: 'birth2', label: '상대방 생년월일', type: 'text', placeholder: '예: 1996년 3월 22일', required: true },
      { id: 'gender2', label: '상대방 성별', type: 'select', options: ['남성', '여성'], required: true },
      { id: 'relation', label: '관계', type: 'select', options: ['연인/배우자', '썸 타는 중', '친구/지인', '직장 동료', '가족'] },
    ],
    systemPrompt: `당신은 사주명리학과 궁합 분석 전문가입니다. 두 사람의 생년월일과 성별을 바탕으로 궁합을 분석해주세요.

다음 순서로 분석하세요:
1. ❤️ **총점** - 궁합 점수 (100점 만점, 예: ⭐⭐⭐⭐☆ 82점)
2. 🌟 **두 사람의 기운** - 각자의 오행과 기질 요약
3. 💕 **잘 맞는 부분** - 서로 맞는 점 3가지 이상
4. ⚡ **주의해야 할 부분** - 갈등이 생길 수 있는 부분
5. 🌈 **관계 발전 방향** - 더 좋은 관계를 위한 조언
6. 💒 **결혼/장기 연애 전망** - 함께할 미래
7. 🍀 **행운 키워드** - 두 사람에게 좋은 색상, 숫자, 날짜

솔직하되 희망적으로, 따뜻하게 분석해주세요.`,
  },

  astrology: {
    id: 'astrology',
    name: '점성술',
    emoji: '⭐',
    description: '별자리와 행성이 말하는 나의 운명',
    longDesc: '태어난 순간 하늘의 별자리 위치를 분석하여 성격, 운명, 그리고 현재의 행성 에너지가 내 삶에 미치는 영향을 알려드립니다.',
    gradient: 'from-amber-500 via-yellow-500 to-orange-500',
    glowColor: '#F59E0B',
    cardBg: 'rgba(245,158,11,0.15)',
    fields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'birthDate', label: '생년월일', type: 'text', placeholder: '예: 1995년 8월 15일', required: true },
      { id: 'birthTime', label: '출생 시간', type: 'text', placeholder: '예: 오후 2시 30분 (모르면 비워두세요)', hint: '정확할수록 분석이 정밀해져요' },
      { id: 'birthPlace', label: '출생지', type: 'text', placeholder: '예: 서울, 부산 (선택사항)' },
      { id: 'focus', label: '궁금한 분야', type: 'select', options: ['전체 운세', '연애운', '직업/재물운', '건강운', '인간관계'] },
    ],
    systemPrompt: `당신은 서양 점성술 전문가입니다. 사용자의 생년월일시와 출생지를 바탕으로 점성술 차트를 분석해주세요.

다음 순서로 분석하세요:
1. ♈ **태양 별자리** - 기본 성격과 정체성
2. 🌙 **달 별자리** - 감정과 내면의 세계
3. ⬆️ **상승궁 (어센던트)** - 첫인상과 외적 모습 (출생 시간이 있을 때)
4. 🪐 **주요 행성의 영향** - 현재 당신에게 영향을 주는 행성
5. 💫 **이번 달 별자리 에너지** - 지금 이 순간의 우주 기운
6. 💕 **연애 스타일** - 사랑에서의 특징과 이상형
7. 💰 **재물/커리어** - 금성과 토성이 말하는 직업운
8. 🌟 **올해의 주요 테마** - 이 해에 집중해야 할 것
9. 🍀 **행운의 별자리, 색상, 요일**

별자리에 관심 있는 20-30대가 이해하기 쉽게, 트렌디하고 감성적으로 설명해주세요.`,
  },

  tarot: {
    id: 'tarot',
    name: '타로',
    emoji: '🃏',
    description: 'AI가 읽어주는 타로카드의 메시지',
    longDesc: '마음속 고민이나 궁금한 것을 적어주세요. AI가 타로카드를 뽑아 과거·현재·미래를 읽어드립니다.',
    gradient: 'from-cyan-500 via-blue-600 to-indigo-600',
    glowColor: '#06B6D4',
    cardBg: 'rgba(6,182,212,0.15)',
    fields: [
      { id: 'question', label: '고민 또는 질문', type: 'textarea', placeholder: '마음속 고민이나 궁금한 것을 자유롭게 적어주세요.\n예: 지금 사귀는 사람과 잘 될까요? / 이 직장을 계속 다녀야 할까요?', required: true },
      { id: 'area', label: '분야', type: 'select', options: ['연애/인간관계', '직업/커리어', '재물/돈', '건강', '인생 전반', '기타'] },
    ],
    systemPrompt: `당신은 20년 경력의 타로 리더입니다. 사용자의 질문에 맞는 타로 카드 3장을 선택하여 해석해주세요.

타로 리딩 형식:
1. 🎴 **카드 뽑기** - 과거/현재/미래 각 위치에 실제 타로 카드 이름 선택 (Major Arcana 또는 Minor Arcana에서)
   예) 과거: The Moon (달), 현재: The Lovers (연인), 미래: The Star (별)

2. 📖 **각 카드 해석**
   - 🌑 과거 카드 [카드명]: 상황의 배경과 원인
   - 🌕 현재 카드 [카드명]: 지금 이 순간의 에너지
   - ✨ 미래 카드 [카드명]: 앞으로 펼쳐질 가능성

3. 🔮 **전체 메시지** - 세 카드가 종합적으로 말하는 이야기

4. 💌 **타로의 조언** - 지금 당신에게 필요한 행동과 마음가짐

5. 🌈 **키워드** - 이 리딩의 핵심 단어 3개

신비롭고 감성적인 언어로, 하지만 구체적으로 도움이 되는 조언을 해주세요. 20-30대 여성/남성이 공감할 수 있게 트렌디하게 표현하세요.`,
    special: 'tarot',
  },

  gwansang: {
    id: 'gwansang',
    name: '관상',
    emoji: '👤',
    description: 'AI가 분석하는 얼굴에 담긴 운명',
    longDesc: '사진을 업로드하거나 얼굴 특징을 설명해주세요. AI가 관상학적 관점에서 성격, 운명, 운세를 분석해드립니다.',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
    glowColor: '#10B981',
    cardBg: 'rgba(16,185,129,0.15)',
    fields: [
      { id: 'photo', label: '사진 업로드', type: 'image', hint: '정면 얼굴 사진을 업로드하면 AI가 관상을 분석해드립니다' },
      { id: 'name', label: '이름', type: 'text', placeholder: '이름 (선택사항)' },
      { id: 'age', label: '나이', type: 'number', placeholder: '나이를 입력하세요' },
      { id: 'gender', label: '성별', type: 'select', options: ['남성', '여성'], required: true },
      { id: 'features', label: '얼굴 특징 묘사', type: 'textarea', placeholder: '사진 업로드가 어려우시면 얼굴 특징을 적어주세요.\n예: 둥근 얼굴형, 눈이 크고 쌍꺼풀 있음, 코가 높음, 입술이 도톰함...', hint: '사진이 없으면 텍스트로 입력하세요' },
    ],
    systemPrompt: `당신은 동양 관상학 전문가입니다. 사용자가 업로드한 사진이나 설명한 얼굴 특징을 바탕으로 관상을 분석해주세요.

중요: 사진이 있다면 실제로 보이는 특징을 기반으로, 텍스트만 있다면 그 설명을 기반으로 분석하세요.

다음 순서로 분석하세요:
1. 🔍 **얼굴형 분석** - 얼굴 전체 형태와 기운
2. 👁️ **눈 (眼)** - 지혜, 감정, 대인 관계
3. 👃 **코 (鼻)** - 재물운, 자존심, 건강
4. 👄 **입 (口)** - 언변, 식복, 사랑
5. 👂 **귀 (耳)** - 수명, 집중력, 복
6. 🏔️ **이마 (額)** - 초년운, 부모덕, 지혜
7. 💼 **직업운** - 어울리는 분야
8. 💕 **연애·결혼운** - 인연의 특징
9. 💰 **재물운** - 돈복과 재테크
10. 🌟 **총평** - 이 사람의 가장 큰 장점과 주의할 점

재미있고 흥미롭게 분석하되, 긍정적인 면을 강조하고 부정적인 면은 조심스럽게 표현해주세요.`,
  },

  palm: {
    id: 'palm',
    name: '손금',
    emoji: '✋',
    description: '손바닥에 새겨진 운명의 지도',
    longDesc: '손바닥 사진을 업로드하거나 특징을 설명해주세요. 생명선, 두뇌선, 감정선을 분석하여 당신의 운명을 읽어드립니다.',
    gradient: 'from-orange-500 via-red-500 to-rose-600',
    glowColor: '#F97316',
    cardBg: 'rgba(249,115,22,0.15)',
    fields: [
      { id: 'photo', label: '손바닥 사진', type: 'image', hint: '왼손 또는 오른손 손바닥을 찍어 업로드하세요' },
      { id: 'hand', label: '어느 손?', type: 'select', options: ['왼손 (타고난 운명)', '오른손 (현재와 미래의 운)'], required: true },
      { id: 'gender', label: '성별', type: 'select', options: ['남성', '여성'], required: true },
      { id: 'age', label: '나이', type: 'number', placeholder: '나이를 입력하세요' },
      { id: 'palmDesc', label: '손금 특징 묘사', type: 'textarea', placeholder: '사진 업로드가 어려우시면 손금을 묘사해주세요.\n예: 생명선이 길고 굵음, 감정선이 검지까지 뻗어있음, 손바닥에 별 모양 무늬가 있음...', hint: '사진이 없으면 텍스트로 입력하세요' },
    ],
    systemPrompt: `당신은 수십 년 경력의 손금(수상학) 전문가입니다. 사용자의 손바닥 사진이나 설명을 바탕으로 손금을 분석해주세요.

다음 순서로 분석하세요:
1. ✋ **손 전체적 특징** - 손 모양, 손가락, 손바닥 색
2. 💚 **생명선 (Life Line)** - 건강, 활력, 수명
3. 🧠 **두뇌선 (Head Line)** - 지능, 사고방식, 집중력
4. ❤️ **감정선 (Heart Line)** - 연애 스타일, 감수성
5. 🌟 **운명선 (Fate Line)** - 직업운, 성공 가능성
6. ☀️ **태양선** - 명예, 인기, 창의성
7. 🔮 **특별한 표시** - 별, 사각형, 섬 등 특이 표시 분석
8. 💕 **연애·결혼선** - 인연의 수와 특징
9. 💰 **재물선** - 돈복과 재물 흐름
10. 🌈 **종합 해석** - 이 손이 말하는 인생 이야기

흥미롭고 신비롭게, 하지만 구체적으로 설명해주세요.`,
  },

  dream: {
    id: 'dream',
    name: '꿈해몽',
    emoji: '💭',
    description: '꿈이 전하는 무의식의 메시지',
    longDesc: '어젯밤 꾼 꿈을 자세히 알려주세요. AI가 꿈의 상징과 의미를 분석하여 현재 내 상황과 앞으로의 암시를 해석해드립니다.',
    gradient: 'from-indigo-600 via-blue-600 to-violet-600',
    glowColor: '#4F46E5',
    cardBg: 'rgba(79,70,229,0.15)',
    fields: [
      { id: 'dreamContent', label: '꿈 내용', type: 'textarea', placeholder: '꿈에서 본 것들을 최대한 자세히 적어주세요.\n기억나는 장면, 등장한 사람/동물/사물, 느낌, 색깔 등\n\n예: 큰 파도가 밀려오는데 혼자 해변에 서 있었어요. 무서웠는데 파도가 나를 덮치지 않고 옆으로 갔어요.', required: true },
      { id: 'feeling', label: '꿈에서의 느낌', type: 'select', options: ['좋은 꿈 (길몽)', '나쁜 꿈 (악몽)', '이상한 꿈 (혼란)', '무서운 꿈', '슬픈 꿈', '설레는 꿈'], required: true },
      { id: 'currentSituation', label: '현재 상황 (선택사항)', type: 'text', placeholder: '요즘 고민이나 상황을 간단히 적어주세요. 더 정확한 해석에 도움이 돼요.' },
    ],
    systemPrompt: `당신은 심리학과 전통 꿈해몽을 접목한 꿈 분석 전문가입니다. 사용자의 꿈을 깊이 있게 해석해주세요.

다음 순서로 분석하세요:
1. 🌙 **꿈의 핵심 상징** - 꿈에 등장한 주요 요소들의 의미
2. 🔍 **세부 요소 분석** - 특정 인물, 동물, 장소, 색깔, 숫자의 상징
3. 💭 **심리적 해석** - 이 꿈이 반영하는 무의식의 감정과 욕구
4. 🔮 **전통 해몽** - 한국 전통 꿈해몽으로 보는 의미
5. 🌟 **길흉 판단** - 이 꿈이 좋은 신호인지, 주의가 필요한지
6. 💡 **현실과의 연결** - 현재 상황과 꿈의 연관성
7. 🍀 **행동 조언** - 꿈이 알려주는 지금 내가 해야 할 것

신비롭고 심층적으로, 하지만 실용적인 통찰을 주는 해석을 해주세요. 긍정적인 메시지를 강조하세요.`,
  },

  jami: {
    id: 'jami',
    name: '자미두수',
    emoji: '🌌',
    description: '동양 최고의 운명학으로 보는 나의 삶',
    longDesc: '중국 황실에서 사용하던 최고 등급의 명리학, 자미두수(紫微斗數). 별의 위치로 당신의 운명 지도를 그립니다.',
    gradient: 'from-purple-600 via-violet-600 to-fuchsia-600',
    glowColor: '#9333EA',
    cardBg: 'rgba(147,51,234,0.15)',
    fields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'birthYear', label: '출생연도', type: 'number', placeholder: '예: 1995', required: true },
      { id: 'birthMonth', label: '출생월', type: 'select', options: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'], required: true },
      { id: 'birthDay', label: '출생일', type: 'number', placeholder: '예: 15', required: true },
      { id: 'birthHour', label: '출생 시간', type: 'select', options: ['모름','자시 (23-01시)','축시 (01-03시)','인시 (03-05시)','묘시 (05-07시)','진시 (07-09시)','사시 (09-11시)','오시 (11-13시)','미시 (13-15시)','신시 (15-17시)','유시 (17-19시)','술시 (19-21시)','해시 (21-23시)'], required: true, hint: '자미두수는 출생 시간이 매우 중요합니다' },
      { id: 'gender', label: '성별', type: 'select', options: ['남성', '여성'], required: true },
      { id: 'calendar', label: '달력 종류', type: 'select', options: ['음력', '양력'] },
    ],
    systemPrompt: `당신은 자미두수(紫微斗數) 전문가입니다. 사용자의 생년월일시와 성별을 바탕으로 자미두수 명반을 분석해주세요.

다음 순서로 분석하세요:
1. 🌌 **명주성 (命主星)** - 자미성, 천기성 등 주요 별 분석
2. ✨ **명궁 분석** - 타고난 성격과 운명의 방향
3. 💫 **주요 12궁 분석**
   - 부모궁: 부모와의 인연
   - 형제궁: 형제, 친구 관계
   - 부처궁: 배우자 인연과 결혼
   - 자녀궁: 자녀와의 인연
   - 재백궁: 재물과 돈
   - 관록궁: 직업과 성공
4. 🔮 **대운 흐름** - 현재 대운(10년 주기) 분석
5. 🌟 **올해 유년운** - 이번 해의 흐름
6. 💎 **인생 최고의 시기** - 가장 운이 좋은 나이대
7. 🍀 **삶의 조언** - 자미두수가 알려주는 인생 방향

동양 철학의 깊이를 살리면서도 현대인이 이해하기 쉽게 설명해주세요.`,
  },

  fortune: {
    id: 'fortune',
    name: '운세',
    emoji: '🔮',
    description: '오늘, 이번 주, 이번 달 나의 운세',
    longDesc: '생년월일을 입력하면 AI가 오늘의 운세부터 연간 운세까지 종합 분석해드립니다.',
    gradient: 'from-teal-500 via-cyan-500 to-blue-500',
    glowColor: '#14B8A6',
    cardBg: 'rgba(20,184,166,0.15)',
    fields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'birthDate', label: '생년월일', type: 'text', placeholder: '예: 1995년 8월 15일', required: true },
      { id: 'gender', label: '성별', type: 'select', options: ['남성', '여성'], required: true },
      { id: 'zodiac', label: '띠 (선택사항)', type: 'select', options: ['모름', '쥐띠', '소띠', '호랑이띠', '토끼띠', '용띠', '뱀띠', '말띠', '양띠', '원숭이띠', '닭띠', '개띠', '돼지띠'] },
      { id: 'period', label: '운세 기간', type: 'select', options: ['오늘의 운세', '이번 주 운세', '이번 달 운세', '올해 운세 (종합)'] },
    ],
    systemPrompt: `당신은 동서양 운세를 종합하는 전문 운세 분석가입니다. 사용자의 생년월일과 성별을 바탕으로 선택한 기간의 운세를 분석해주세요.

다음 분야별로 운세를 분석하세요:

📊 **운세 총평** - 이 기간 전체적인 운의 흐름 (★★★★☆ 형식으로 점수도 표시)

**분야별 운세:**
1. ❤️ **연애운** - 솔로: 새로운 인연 가능성, 커플: 관계 발전
2. 💰 **재물운** - 수입, 지출, 투자 타이밍
3. 💼 **직업/학업운** - 성과, 기회, 주의할 점
4. 🌿 **건강운** - 주의해야 할 부분, 좋은 습관
5. 👥 **대인관계** - 중요한 만남, 조심할 사람

**행운 정보:**
- 🍀 오늘/이번 기간의 행운의 색상
- 🔢 행운의 숫자
- 📅 좋은 날, 조심할 날
- 💡 한마디 조언

밝고 긍정적이지만 현실적인 조언을 해주세요. 20-30대가 공감할 수 있는 트렌디한 표현을 사용하세요.`,
  },

  cookie: {
    id: 'cookie',
    name: '포춘쿠키',
    emoji: '🍪',
    description: '지금 이 순간 우주가 당신에게 전하는 메시지',
    longDesc: '지금 마음속에 떠오르는 질문이나 걱정을 적어주세요. 포춘쿠키가 당신에게 특별한 메시지를 전해드립니다.',
    gradient: 'from-yellow-500 via-amber-500 to-orange-500',
    glowColor: '#EAB308',
    cardBg: 'rgba(234,179,8,0.15)',
    fields: [
      { id: 'wish', label: '지금 가장 궁금한 것 또는 소원', type: 'textarea', placeholder: '지금 이 순간 마음속에 떠오르는 것을 적어주세요.\n또는 그냥 버튼을 눌러도 됩니다!', hint: '비워두면 오늘의 랜덤 메시지를 받아요' },
    ],
    systemPrompt: `당신은 우주의 지혜를 전하는 포춘쿠키입니다. 사용자에게 특별하고 의미 있는 메시지를 전해주세요.

형식:
1. 🍪 **포춘쿠키가 깨지며...** - 짧고 강렬한 메인 메시지 (1-2문장, 인생의 지혜를 담은 명언 스타일)

2. ✨ **우주의 메시지** - 좀 더 구체적인 조언 (3-5문장)

3. 🌟 **오늘의 행운 키워드** - 단어 3개

4. 🎯 **오늘 해야 할 한 가지** - 구체적이고 실천 가능한 작은 행동

5. 💫 **행운의 숫자와 색상**

짧고 강렬하게, 읽는 순간 "맞아!" 하고 공감할 수 있는 메시지를 전해주세요. 신비롭지만 따뜻하고, 철학적이지만 현실적으로. 20-30대 감성으로!`,
    special: 'cookie',
  },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);
