
export interface Routine {
  id: string;
  title: string;
  duration: number; // in minutes
  icon: string;
}

export const INITIAL_ROUTINES: Routine[] = [
  { id: '1', title: '책상 정리', duration: 5, icon: 'Layout' },
  { id: '2', title: '단어 암기 50개', duration: 20, icon: 'BookOpen' },
  { id: '3', title: '스트레칭 5분', duration: 5, icon: 'Activity' },
];

export const UNIVERSITY_RANKING = [
  { rank: 1, name: '서울대학교', count: '72,400회', color: '#1D3557' },
  { rank: 2, name: '연세대학교', count: '68,100회', color: '#003399' },
  { rank: 3, name: '고려대학교', count: '59,800회', color: '#8B0029' },
  { rank: 4, name: '성균관대학교', count: '48,200회', color: '#006B3F' },
  { rank: 5, name: '한양대학교', count: '45,000회', color: '#003366' },
];

export const MOCK_FRIENDS = [
  { id: 'f1', name: '김희수', status: 'Peptide Absorbing...', avatar: '😊' },
  { id: 'f2', name: '이지원', status: '루틴 대기 중', avatar: '😎' },
  { id: 'f3', name: '박민지', status: '오늘의 루틴 완료!', avatar: '✨' },
];

export const MOCK_FEED = [
  { 
    id: 'p1', 
    user: '최지호', 
    content: '오늘도 아이패치 붙이고 코딩 공부 20분 완료! #코스알엑스 #20분챌린지', 
    time: '10분 전', 
    likes: 24,
    comments: [
      { id: 'c1', user: '정유진', text: '대단해요! 저도 방금 시작했어요.' },
      { id: 'c2', user: '이민수', text: '화이팅입니다!' }
    ]
  },
  { 
    id: 'p2', 
    user: '정유진', 
    content: '시험기간엔 역시 루틴이 중요해. 눈가가 촉촉해지니까 집중도 더 잘 되네요.', 
    time: '2시간 전', 
    likes: 12,
    comments: []
  },
];

export const MOCK_MESSAGES: Record<string, { sender: string, text: string, time: string }[]> = {
  'f1': [
    { sender: '김희수', text: '오늘 20분 챌린지 했어?', time: '오전 10:30' },
    { sender: 'me', text: '응! 방금 끝냈지 ㅎㅎ', time: '오전 10:32' },
    { sender: '김희수', text: '나도 지금 붙이고 시작하려구!', time: '오전 10:33' }
  ],
};

export const COLORS = {
  pink: {
    primary: '#FF6B9B',
    light: '#FFF0F5',
    dark: '#E05585',
  },
  gray: {
    text: '#4A4A4A',
    muted: '#9E9E9E',
    background: '#F9F9F9',
  }
};
