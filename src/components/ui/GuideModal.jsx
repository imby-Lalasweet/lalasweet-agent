import React, { useState } from 'react';
import { C } from '../../utils/constants';

const TABS = [
    { k: 'overview', icon: '🏠', label: '시작하기' },
    { k: 'members', icon: '👥', label: '구성원 관리' },
    { k: 'mode1', icon: '🚀', label: '이니셔티브' },
    { k: 'mode2', icon: '📅', label: '성과 1on1' },
    { k: 'mode3', icon: '📝', label: '미팅노트' },
    { k: 'mode4', icon: '☕️', label: '라포 1on1' },
    { k: 'admin', icon: '⚙️', label: '관리자' },
];

const Section = ({ title, children }) => (
    <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.p, marginBottom: 10, paddingBottom: 6, borderBottom: `2px solid ${C.pl}` }}>
            {title}
        </div>
        {children}
    </div>
);

const Step = ({ num, title, desc }) => (
    <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <div style={{ width: 26, height: 26, borderRadius: '50%', background: C.p, color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {num}
        </div>
        <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.g800, marginBottom: 2 }}>{title}</div>
            <div style={{ fontSize: 12, color: C.g500, lineHeight: 1.6 }}>{desc}</div>
        </div>
    </div>
);

const Tip = ({ children }) => (
    <div style={{ background: C.pl, border: `1px solid ${C.ps}`, borderRadius: 10, padding: '10px 14px', marginTop: 10, marginBottom: 10 }}>
        <div style={{ fontSize: 12, color: C.pd, lineHeight: 1.6 }}>
            <span style={{ fontWeight: 700 }}>💡 TIP  </span>{children}
        </div>
    </div>
);

const Warn = ({ children }) => (
    <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: 10, padding: '10px 14px', marginTop: 10, marginBottom: 10 }}>
        <div style={{ fontSize: 12, color: '#92400E', lineHeight: 1.6 }}>
            <span style={{ fontWeight: 700 }}>⚠️ 주의  </span>{children}
        </div>
    </div>
);

const Badge = ({ children, color = C.p }) => (
    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 6, background: color + '1A', color, fontSize: 11, fontWeight: 700, marginRight: 4 }}>
        {children}
    </span>
);

const CONTENT = {
    overview: (
        <div>
            <Section title="📌 Lalasweet란?">
                <p style={{ fontSize: 13, color: C.g600, lineHeight: 1.8, marginBottom: 12 }}>
                    Lalasweet는 <strong>가치 기반 성과관리</strong>를 위한 AI 파트너입니다. 리더가 팀 구성원의 성장을 체계적으로 지원할 수 있도록, AI가 이니셔티브 설계·1on1 아젠다·미팅 노트 요약을 자동으로 생성해줍니다.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 4 }}>
                    {[
                        { icon: '🚀', label: '이니셔티브 도출', desc: '레벨·직무별 맞춤 이니셔티브 자동 설계' },
                        { icon: '📅', label: '성과 1on1', desc: 'GROW 모델 기반 1on1 아젠다 생성' },
                        { icon: '📝', label: '미팅노트 요약', desc: '회의 내용을 핵심만 구조화하여 정리' },
                        { icon: '☕️', label: '라포 1on1', desc: '심리적 안전감 중심 대화 아젠다 제공' },
                    ].map(f => (
                        <div key={f.label} style={{ background: C.g50, borderRadius: 10, padding: '12px 14px', border: `1px solid ${C.g200}` }}>
                            <div style={{ fontSize: 20, marginBottom: 4 }}>{f.icon}</div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: C.g800, marginBottom: 2 }}>{f.label}</div>
                            <div style={{ fontSize: 11, color: C.g400, lineHeight: 1.5 }}>{f.desc}</div>
                        </div>
                    ))}
                </div>
            </Section>
            <Section title="🔑 7가지 핵심 가치">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {['문제정의', '목표설정', '가설사고', '피드백', '주도성', '학습', '원팀'].map(v => (
                        <Badge key={v}>{v}</Badge>
                    ))}
                </div>
                <p style={{ fontSize: 12, color: C.g500, marginTop: 10, lineHeight: 1.7 }}>
                    모든 AI 결과물은 이 7가지 가치를 기반으로 생성됩니다. 관리자 메뉴에서 '일하는 방식' 문서를 등록하면 회사 고유의 가치 기준이 모든 답변에 반영됩니다.
                </p>
            </Section>
            <Section title="🚦 사용 흐름">
                <Step num="1" title="로그인" desc="아이디와 비밀번호를 입력하세요. 처음 로그인하면 자동으로 계정이 생성됩니다." />
                <Step num="2" title="구성원 추가" desc="'+ 새 구성원' 버튼으로 팀원 정보를 등록하고 이니셔티브를 설계합니다." />
                <Step num="3" title="모드 실행" desc="각 구성원 카드 또는 '빠른 실행'에서 원하는 AI 모드를 선택합니다." />
                <Step num="4" title="결과 저장·공유" desc="생성된 결과를 복사하거나 핀으로 고정해 다른 모드에 자동 연동합니다." />
            </Section>
        </div>
    ),

    members: (
        <div>
            <Section title="👤 구성원(Room)이란?">
                <p style={{ fontSize: 13, color: C.g600, lineHeight: 1.8 }}>
                    구성원은 리더가 관리하는 팀원 한 명을 의미합니다. 각 구성원마다 이름·소속팀·레벨·직무가 저장되며, AI 생성 결과(히스토리)가 축적됩니다.
                </p>
            </Section>
            <Section title="➕ 구성원 추가하기">
                <Step num="1" title="'+ 새 구성원' 클릭" desc="홈 화면 상단 '내 구성원' 영역의 버튼을 누르면 이니셔티브 모드로 이동합니다." />
                <Step num="2" title="기본 정보 입력" desc="팀명, 기간(반기/분기), 이름을 입력합니다." />
                <Step num="3" title="구성원 정보 입력" desc="레벨(L1~L5), 직무·역할, 리더 기대사항을 입력합니다." />
                <Step num="4" title="AI 생성 및 저장" desc="이니셔티브를 생성하고 나면 구성원이 자동으로 등록됩니다." />
                <Tip>기존 팀원에게 새 모드를 실행하려면 팀원 카드를 클릭해 Room 화면으로 이동하세요.</Tip>
            </Section>
            <Section title="🔍 구성원 검색 & 관리">
                <div style={{ fontSize: 13, color: C.g600, lineHeight: 1.8 }}>
                    <p>• <strong>검색:</strong> 이름 또는 팀명으로 실시간 필터링</p>
                    <p>• <strong>카드 클릭:</strong> 해당 구성원의 상세 히스토리 및 모드 실행</p>
                    <p>• <strong>✕ 버튼:</strong> 구성원과 모든 히스토리 삭제 (복구 불가)</p>
                    <p>• <strong>레벨 배지:</strong> <Badge>L1</Badge><Badge>L2</Badge> … 파란색으로 표시</p>
                </div>
            </Section>
            <Section title="📌 이니셔티브 고정(핀)">
                <p style={{ fontSize: 13, color: C.g600, lineHeight: 1.8 }}>
                    이니셔티브 결과를 구성원에 <strong>핀으로 고정</strong>하면, 성과 1on1·미팅노트·라포 1on1 실행 시 해당 이니셔티브가 AI에 자동으로 주입됩니다. 구성원 화면에서 금색 영역으로 표시됩니다.
                </p>
                <Tip>핀된 이니셔티브는 언제든 구성원 화면에서 해제할 수 있습니다.</Tip>
            </Section>
        </div>
    ),

    mode1: (
        <div>
            <Section title="🚀 이니셔티브 모드란?">
                <p style={{ fontSize: 13, color: C.g600, lineHeight: 1.8 }}>
                    구성원의 레벨·직무·조직목표·리더 기대사항을 입력하면 AI가 <strong>Core / Challenge / BAU</strong> 카테고리로 구분된 구체적인 이니셔티브를 생성합니다.
                </p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                    <Badge color={C.p}>Core</Badge>
                    <span style={{ fontSize: 12, color: C.g500 }}>핵심 업무 이니셔티브 (전체의 약 60%)</span>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                    <Badge color="#7C3AED">Challenge</Badge>
                    <span style={{ fontSize: 12, color: C.g500 }}>도전적 이니셔티브 (약 25%)</span>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                    <Badge color={C.g500}>BAU</Badge>
                    <span style={{ fontSize: 12, color: C.g500 }}>기본 운영 이니셔티브 (약 15%)</span>
                </div>
            </Section>
            <Section title="📋 입력 단계 (5단계)">
                <Step num="1" title="기본 정보" desc="팀명, 반기/분기, 구성원 이름을 입력합니다." />
                <Step num="2" title="구성원 정보" desc="레벨(L1~L5), 직무·역할을 선택하고 '리더 기대사항'을 입력합니다. 기대사항이 이니셔티브 방향을 결정하는 핵심입니다." />
                <Step num="3" title="개인 OKR (선택)" desc="개인 목표(OKR)가 있다면 입력하세요. 입력 시 더욱 정밀한 이니셔티브가 생성됩니다." />
                <Step num="4" title="조직목표" desc="팀·조직의 반기 목표를 입력합니다. 텍스트 또는 PDF로 전달된 목표를 붙여넣으세요." />
                <Step num="5" title="최종 확인 → 생성" desc="입력 내용을 확인하고 '이니셔티브 생성' 버튼을 누릅니다." />
                <Tip>리더 기대사항은 구체적으로 작성할수록 더 날카로운 이니셔티브가 생성됩니다. 예: "단순 운영이 아닌 체계화 관점으로 접근 필요"</Tip>
            </Section>
            <Section title="✏️ 결과 활용">
                <div style={{ fontSize: 13, color: C.g600, lineHeight: 1.8 }}>
                    <p>• <strong>복사:</strong> 결과를 클립보드로 복사해 문서에 바로 붙여넣기</p>
                    <p>• <strong>Flex 등록:</strong> 외부 성과관리 툴(Flex) 링크로 이동</p>
                    <p>• <strong>핀 고정 (📌):</strong> 구성원에 이니셔티브를 고정해 다른 모드에 자동 연동</p>
                    <p>• <strong>수정 (✏️):</strong> 결과물의 구체성 수준을 조절해 재생성 요청 가능</p>
                </div>
            </Section>
            <Section title="🔄 기존 이니셔티브 활용">
                <p style={{ fontSize: 13, color: C.g600, lineHeight: 1.8 }}>
                    구성원에게 이미 핀된 이니셔티브가 있는 경우, <strong>'기존 이니셔티브 사용'</strong> 또는 <strong>'새로 작성'</strong>을 선택할 수 있습니다. 또한 기존 이니셔티브를 직접 붙여넣어 AI에 입력으로 사용할 수도 있습니다.
                </p>
                <Warn>Pre-Level 설정 시 Core:Challenge 비율이 20:70으로 역전됩니다. 승급을 준비 중인 구성원에게 사용하세요.</Warn>
            </Section>
        </div>
    ),

    mode2: (
        <div>
            <Section title="📅 성과 1on1이란?">
                <p style={{ fontSize: 13, color: C.g600, lineHeight: 1.8 }}>
                    <strong>GROW 모델</strong>(Goal→Reality→Options→Will) 기반의 성과 1on1 아젠다를 자동 생성합니다. 리더의 고민과 관점을 반영한 질문을 포함해, 더 깊이 있는 대화를 이끌어냅니다.
                </p>
            </Section>
            <Section title="📋 입력 항목">
                <Step num="1" title="구성원 정보" desc="이름, 레벨, 직무·역할을 입력합니다. 핀된 이니셔티브가 있으면 자동으로 불러옵니다." />
                <Step num="2" title="이니셔티브 현황" desc="현재 이니셔티브 진행 상황이나 주요 내용을 붙여넣습니다." />
                <Step num="3" title="리더 고민·관점 (선택)" desc="이번 1on1에서 짚고 싶은 리더의 인사이트나 우려사항을 입력하면 해당 질문이 아젠다에 포함됩니다." />
                <Tip>이니셔티브를 핀으로 고정해두면 이 단계에서 자동으로 불러와져 매번 입력할 필요가 없습니다.</Tip>
            </Section>
            <Section title="📄 결과물 구성">
                <div style={{ fontSize: 13, color: C.g600, lineHeight: 1.8 }}>
                    <p>• <strong>📋 구성원 준비사항:</strong> 1on1 전 구성원이 준비해야 할 내용</p>
                    <p>• <strong>📋 리더 준비사항:</strong> 리더가 사전에 확인·준비할 사항</p>
                    <p>• <strong>1~4 세션 아젠다:</strong> 목표·현황·고민·리소스 순서로 구성</p>
                </div>
            </Section>
        </div>
    ),

    mode3: (
        <div>
            <Section title="📝 미팅노트란?">
                <p style={{ fontSize: 13, color: C.g600, lineHeight: 1.8 }}>
                    1on1 미팅에서 나눈 대화 내용을 붙여넣으면, AI가 <strong>600자 이내의 핵심 요약</strong>과 Next Action을 구조화하여 정리해줍니다.
                </p>
            </Section>
            <Section title="📋 사용 방법">
                <Step num="1" title="구성원 이름 입력" desc="미팅 대상 구성원의 이름을 입력합니다." />
                <Step num="2" title="미팅 내용 붙여넣기" desc="1on1에서 나눈 대화 내용, 메모, 녹취 텍스트 등을 그대로 붙여넣습니다. 형식 제한 없이 자유롭게 입력하세요." />
                <Step num="3" title="요약 생성" desc="'미팅노트 요약' 버튼을 클릭하면 즉시 구조화된 요약이 생성됩니다." />
                <Tip>긴 대화 내용도 괜찮습니다. AI가 핵심만 추려서 개조식으로 정리합니다.</Tip>
            </Section>
            <Section title="📄 결과물 구성">
                <div style={{ fontSize: 13, color: C.g600, lineHeight: 1.8 }}>
                    <p>• <strong>■ Core/Challenge:</strong> 이니셔티브 관련 핵심 내용과 Next Action</p>
                    <p>• <strong>■ 역량:</strong> 발휘된 가치와 역량에 대한 피드백</p>
                    <p>• <strong>■ Overall Feedback:</strong> 전체 종합 피드백 및 제안</p>
                </div>
            </Section>
        </div>
    ),

    mode4: (
        <div>
            <Section title="☕️ 라포 1on1이란?">
                <p style={{ fontSize: 13, color: C.g600, lineHeight: 1.8 }}>
                    업무 외 심리적 안전감과 팀 결속을 위한 <strong>라포(Rapport) 형성</strong> 중심의 1on1 아젠다를 생성합니다. 구성원의 개인적 상황과 팀 문화를 세심하게 살필 수 있습니다.
                </p>
            </Section>
            <Section title="📋 사용 방법">
                <Step num="1" title="구성원 정보 입력" desc="이름과 직무·역할을 입력합니다." />
                <Step num="2" title="추가 컨텍스트 (선택)" desc="최근 구성원의 상황(예: 업무 과부하, 팀 갈등, 커리어 고민 등)을 간략히 입력하면 더 맞춤화된 아젠다가 생성됩니다." />
                <Step num="3" title="아젠다 생성" desc="'라포 1on1 아젠다 생성'을 클릭합니다." />
            </Section>
            <Section title="📄 결과물 구성">
                <div style={{ fontSize: 13, color: C.g600, lineHeight: 1.8 }}>
                    <p>• <strong>1. Check-in:</strong> 현재 상태·감정 체크</p>
                    <p>• <strong>2. Value & Strength:</strong> 강점과 핵심 가치 발견</p>
                    <p>• <strong>3. Team:</strong> 팀 협업·문화 관련 대화</p>
                    <p>• <strong>4. Career:</strong> 성장과 커리어 방향 탐색</p>
                    <p>• <strong>5. Leader Memo:</strong> 리더가 기억할 사항</p>
                </div>
                <Tip>라포 1on1은 월 1~2회, 업무 성과보다는 '관계'와 '성장'에 초점을 맞춰 진행하는 것을 권장합니다.</Tip>
            </Section>
        </div>
    ),

    admin: (
        <div>
            <Section title="⚙️ 관리자 기능이란?">
                <p style={{ fontSize: 13, color: C.g600, lineHeight: 1.8 }}>
                    관리자 메뉴는 AI 품질을 높이는 설정과 사용 현황 모니터링 기능을 제공합니다. 홈 화면 하단의 <strong>⚙️ 관리자</strong> 버튼으로 접근합니다.
                </p>
                <Warn>관리자 메뉴는 별도 비밀번호로 보호됩니다. 팀 관리자만 접근하세요.</Warn>
            </Section>
            <Section title="📄 레벨 가이드">
                <p style={{ fontSize: 13, color: C.g600, lineHeight: 1.8 }}>
                    회사의 <strong>레벨제도 PDF</strong>를 업로드하면, 이니셔티브 생성 시 각 레벨(L1~L5)에 맞는 기대 행동과 역량 기준이 자동으로 반영됩니다.
                </p>
                <div style={{ fontSize: 13, color: C.g600, lineHeight: 1.8, marginTop: 8 }}>
                    <p>• 최대 4MB PDF 파일 지원</p>
                    <p>• 업로드 후 즉시 모든 모드에 반영</p>
                    <p>• 기존 파일 삭제 후 새 파일 업로드 가능</p>
                </div>
                <Tip>레벨 가이드를 등록하지 않으면 홈 화면에 '⚠️ 레벨 가이드 미등록' 경고가 표시됩니다.</Tip>
            </Section>
            <Section title="📋 일하는 방식">
                <p style={{ fontSize: 13, color: C.g600, lineHeight: 1.8 }}>
                    회사의 <strong>7가지 핵심 가치 정의·행동 기준</strong>을 텍스트로 등록합니다. 등록된 내용은 모든 모드의 AI 시스템 프롬프트에 자동으로 주입됩니다.
                </p>
                <Tip>가치별 헤드라인, 행동 기준, 도구·태도 구분 등을 포함할수록 AI 출력 품질이 높아집니다.</Tip>
            </Section>
            <Section title="📊 로그">
                <p style={{ fontSize: 13, color: C.g600, lineHeight: 1.8 }}>
                    모든 AI 호출 이력이 기록됩니다. 모드별 필터로 사용 현황을 모니터링하고, 상세 내용을 클릭해 확인할 수 있습니다.
                </p>
            </Section>
            <Section title="👥 사용자 관리">
                <p style={{ fontSize: 13, color: C.g600, lineHeight: 1.8 }}>
                    등록된 모든 사용자 목록 확인, 비밀번호 초기화(1234), 계정 삭제 기능을 제공합니다.
                </p>
                <Warn>계정 삭제 시 해당 사용자의 모든 구성원 데이터와 히스토리가 영구 삭제됩니다.</Warn>
            </Section>
        </div>
    ),
};

export default function GuideModal({ onClose }) {
    const [tab, setTab] = useState('overview');

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 200,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
        }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div style={{
                background: C.w, borderRadius: 20, width: '100%', maxWidth: 560,
                maxHeight: '90vh', display: 'flex', flexDirection: 'column',
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }}>
                {/* Header */}
                <div style={{ padding: '20px 24px 0', borderBottom: `1px solid ${C.g100}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 800, color: C.g800 }}>📖 사용 가이드</div>
                            <div style={{ fontSize: 12, color: C.g400, marginTop: 2 }}>기능별 사용 방법을 확인하세요</div>
                        </div>
                        <button onClick={onClose} style={{ background: C.g100, border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: C.g500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                    </div>
                    {/* Tab bar */}
                    <div style={{ display: 'flex', gap: 2, overflowX: 'auto', paddingBottom: 0 }}>
                        {TABS.map(t => (
                            <button key={t.k} onClick={() => setTab(t.k)} style={{
                                padding: '8px 12px', border: 'none', borderRadius: '8px 8px 0 0', cursor: 'pointer',
                                background: tab === t.k ? C.w : 'transparent',
                                color: tab === t.k ? C.p : C.g400,
                                fontSize: 12, fontWeight: tab === t.k ? 700 : 500,
                                borderBottom: tab === t.k ? `2px solid ${C.p}` : '2px solid transparent',
                                whiteSpace: 'nowrap', flexShrink: 0,
                                transition: 'all 0.15s',
                            }}>
                                {t.icon} {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 24px' }}>
                    {CONTENT[tab]}
                </div>
            </div>
        </div>
    );
}
