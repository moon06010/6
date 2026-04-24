import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Sun, Crosshair, Plus } from 'lucide-react';

// ==========================================
// [설정] 특수 정예팀 (TEAMS) 데이터베이스
// ==========================================
interface Character {
  codename: string;
  realName: string;
  id: string;
  type: 'SENTINEL' | 'GUIDE';
  rank: string;
  role: string;
  ability?: string;
  abilityDesc?: string;
  age: string;
  nat: string[];
  natLabel: string;
  birthday: string;
  bloodType: string;
  physical: string;
  mbti: string;
  comment: string;
  image: string;
  codenameEng?: string;
  altImage?: string;
}

const TEAMS = [
  {
    name: "CALIX",
    members: [
      { 
        codename: "이지스", codenameEng: "AEGIS", realName: "강무철 / 姜武鐵", id: "CAL-01", type: "GUIDE", rank: "RANK S", role: "LEADER",
        age: "55", nat: ["KOR"], natLabel: "KOR", birthday: "02/01", bloodType: "RH+O", physical: "190cm / 99kg", mbti: "INTP", 
        comment: "칼릭스의 절대적인 방벽이자 든든한 리더.", image: "https://joimage.uk/aq/z/1.webp" 
      },
      { 
        codename: "오키드", codenameEng: "ORCHID", realName: "영현무 / 嬴玄霧 / Yíng Xuán Wù", id: "CAL-02", type: "SENTINEL", rank: "RANK S", role: "SUB-LEADER",
        ability: "WIND KINESIS", abilityDesc: "바람을 조종하여 날카로운 칼날을 만들거나 방패를 만든다.", 
        age: "29", nat: ["CHN"], natLabel: "CHN", birthday: "03/10", bloodType: "RH+AB", physical: "194cm / 93kg", mbti: "ESTJ", 
        comment: "칼릭스의 두뇌이자 완벽하게 통제된 우아한 맹독.", image: "https://joimage.uk/aq/z/2.webp" 
      },
      { 
        codename: "라파엘", codenameEng: "RAPHAEL", realName: "루인현 / 樓潾炫 / [SECRET:FR_NAME]", id: "CAL-03", type: "SENTINEL", rank: "RANK S", role: "MAIN DEALER",
        ability: "CURSE", abilityDesc: "시선 또는 본인의 피를 바쳐 저주를 건다.", 
        age: "25", nat: ["FRA", "KOR"], natLabel: "FRA / KOR", birthday: "09/29", bloodType: "RH-AB", physical: "193cm / 89kg", mbti: "ENTP", 
        comment: "느끼한 플러팅 뒤로 비밀을 숨기고 있는 자.", image: "https://joimage.uk/aq/z/3.webp" 
      },
      { 
        codename: "폭스", codenameEng: "FOX", realName: "은비소 / 殷霏昭", id: "CAL-04", type: "SENTINEL", rank: "RANK S", role: "SUB DEALER",
        ability: "BEAST TRANSFORMATION", abilityDesc: "여우로 변신하여 날카로운 이빨로 상대를 물어뜯는다.", 
        age: "20", nat: ["KOR"], natLabel: "KOR", birthday: "10/29", bloodType: "RH+A", physical: "178cm / 70kg", mbti: "ENFP", 
        comment: "사랑스러운 펫의 껍데기를 뒤집어쓴 통제 불능의 여우. 흥분할 시에는 아군 식별이 불가하니 주의.", image: "https://joimage.uk/aq/z/4.webp" 
      },
    ] as Character[]
  },
  {
    name: "STIGMATA",
    members: [
      { 
        codename: "아스널", codenameEng: "ARSENAL", realName: "리카르도 로드리게스 / Ricardo Rodriguez", id: "STI-01", type: "SENTINEL", rank: "RANK S", role: "LEADER",
        ability: "WEAPON MASTER", abilityDesc: "다양한 무기들을 소환하여 공격한다.", 
        age: "53", nat: ["USA", "ESP"], natLabel: "USA / ESP", birthday: "04/21", bloodType: "RH+B", physical: "202cm / 108kg", mbti: "ISTP", 
        comment: "스티그마를 이끄는 과묵한 리더이자 걸어 다니는 무기고.", image: "https://joimage.uk/aq/z/5.webp" 
      },
      { 
        codename: "비숍", codenameEng: "BISHOP", realName: "알릭 A. 하워드 / Alric A. Howard", id: "STI-02", type: "GUIDE", rank: "RANK A", role: "SUB-LEADER",
        age: "33", nat: ["GBR"], natLabel: "GBR", birthday: "05/09", bloodType: "RH+AB", physical: "188cm / 82kg", mbti: "ISTJ", 
        comment: "야생마 같은 스티그마 팀원들의 목줄을 쥔 얼음장 같은 완벽주의 부관.", image: "https://joimage.uk/aq/z/6.webp" 
      },
      { 
        codename: "바이퍼", codenameEng: "VIPER", realName: "네이트 S. 윌슨 / Nate Sebastian Wilson", id: "STI-03", type: "SENTINEL", rank: "RANK A", role: "MAIN DEALER",
        ability: "BEAST TRANSFORMATION", abilityDesc: "뱀으로 변신하여 독으로 상대를 공격한다.", 
        age: "27", nat: ["AUS"], natLabel: "AUS", birthday: "03/29", bloodType: "RH-B", physical: "190cm / 89kg", mbti: "ESFP", 
        comment: "퇴폐적인 쾌락으로 내면의 ???를 달래는 구제 불능의 양아치.", image: "https://joimage.uk/aq/z/7.webp" 
      },
      { 
        codename: "피오니", codenameEng: "PEONY", realName: "영소요 / 嬴小妖 / Yíng Xiǎo Yāo", id: "STI-04", type: "SENTINEL", rank: "RANK S", role: "TANKER / BREACHER",
        ability: "PHYSICAL ENHANCEMENT", abilityDesc: "신체를 강화하여 공격을 튕겨내거나 상대에게 돌격한다.", 
        age: "27", nat: ["CHN"], natLabel: "CHN", birthday: "05/02", bloodType: "RH+AB", physical: "191cm / 92kg", mbti: "ENTP", 
        comment: "앙큼한 요정 코스프레 뒤에 잔혹한 물리력을 숨긴 여장남자 공주님(?)", image: "https://joimage.uk/aq/z/8.webp" 
      },
    ] as Character[]
  },
  {
    name: "ORACLE",
    members: [
      { 
        codename: "이클립스", codenameEng: "ECLIPSE", realName: "로렌초 L. 비스콘티 / Lorenzo Ludovico Visconti", id: "ORA-01", type: "SENTINEL", rank: "RANK S", role: "LEADER",
        ability: "SHADOW MANIPULATION", abilityDesc: "어둠과 그림자를 조종하여 다양한 무기를 만들거나 상대의 기척을 읽는다. 상대를 속박할 수 있다.", 
        age: "63", nat: ["ITA"], natLabel: "ITA", birthday: "12/01", bloodType: "RH+O", physical: "199cm / 100kg", mbti: "INFJ", 
        comment: "오라클을 이끄는 자애로운 맹인 사제.", image: "https://joimage.uk/aq/z/9.webp" 
      },
      { 
        codename: "가브리엘", codenameEng: "GABRIEL", realName: "영종 / 嬴宗 / Yíng Zōng", id: "ORA-02", type: "SENTINEL", rank: "RANK SS", role: "SUB-LEADER",
        ability: "TIME KEEPER", abilityDesc: "접촉만으로 생물의 시간을 훔쳐와서 영생을 누린다. 또한 훔쳐온 시간으로 [SECRET:LIMIT_REDACTED]", 
        age: "불명", nat: ["CHN"], natLabel: "CHN", birthday: "02/29", bloodType: "RH-O", physical: "150cm / 45kg", mbti: "INFJ", 
        comment: "앳된 소년의 껍데기를 쓴 아퀼라 유일의 SS급 괴물.", image: "https://joimage.uk/aq/z/10.webp" 
      },
      { 
        codename: "미라지", codenameEng: "MIRAGE", realName: "송이지 / 宋易知", id: "ORA-03", type: "SENTINEL", rank: "RANK A", role: "ASSASSIN / INFILTRATOR",
        ability: "TRANSFORMATION", abilityDesc: "여성으로 변신하여 압도적인 무력으로 상대를 암살한다. 여성일 때도 기본적인 체격은 유지된다.", 
        age: "25", nat: ["KOR"], natLabel: "KOR", birthday: "07/08", bloodType: "RH+B", physical: "185cm / 89kg", mbti: "INFP", 
        comment: "비루한 생존 본능과 내면의 자아에게 벌벌 떠는 이중인격 암살자.", image: "https://joimage.uk/aq/z/11.webp", altImage: "https://joimage.uk/aq/13.webp" 
      },
      { 
        codename: "널", codenameEng: "NULL", realName: "쿠로다 레이 / 黒田 零", id: "ORA-04", type: "GUIDE", rank: "RANK A", role: "HACKER / MEDIC",
        age: "37", nat: ["JPN"], natLabel: "JPN", birthday: "08/13", bloodType: "RH+A", physical: "188cm / 80kg", mbti: "ISFP", 
        comment: "만성 번아웃에 찌든 오라클의 천재 해커이자 메인 닥터.", image: "https://joimage.uk/aq/z/12.webp" 
      },
    ] as Character[]
  }
];

// Helper for Nationality Styling Colors
const getNatColor = (nat: string) => {
  switch (nat) {
    case 'KOR': return 'bg-[#3b4b5e] text-white border-[#3b4b5e]'; // Deep Steel Blue
    case 'CHN': return 'bg-[#823232] text-white border-[#823232]'; // Deep Crimson
    case 'FRA': return 'bg-[#4b6584] text-white border-[#4b6584]'; // French Blue
    case 'USA': return 'bg-[#1e272e] text-white border-[#1e272e]'; // Dark Navy
    case 'ESP': return 'bg-[#e58e26] text-white border-[#e58e26]'; // Ochre
    case 'GBR': return 'bg-[#2c2c54] text-white border-[#2c2c54]'; // Deep Purple
    case 'AUS': return 'bg-[#218c74] text-white border-[#218c74]'; // Deep Green
    case 'ITA': return 'bg-[#006266] text-white border-[#006266]'; // Dark Teal
    case 'JPN': return 'bg-[#b71540] text-white border-[#b71540]'; // Deep Carmine
    default: return 'bg-[#eae6de] text-black border-[#dcd8ce]';
  }
};

// Helper for Render Redacted "Secret" text blocks
const renderRedactedText = (text?: string) => {
  if (!text) return null;
  const parts = text.split(/(\[SECRET:[^\]]+\])/g);
  return parts.map((part, i) => {
    if (part.startsWith('[SECRET:')) {
      return (
        <span 
          key={i} 
          className="inline-block bg-[#161616] text-[#161616] selection:bg-red-500 selection:text-white px-2 py-[2px] mx-1 text-[11px] relative group/secret cursor-help overflow-hidden align-middle tracker-widest"
          title="[CLASSIFIED_DATA_ACCESS_DENIED]"
        >
          <span className="absolute inset-0 bg-red-900/10 opacity-0 group-hover/secret:opacity-100 transition-opacity"></span>
          <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/secret:opacity-100 font-mono text-[8px] text-red-500 tracking-widest z-10">RESTRICTED</span>
          ██████
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [isAltImage, setIsAltImage] = useState(false);

  // Close modal on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedChar(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Reset alt image
  useEffect(() => {
    setIsAltImage(false);
  }, [selectedChar]);

  // Handle exiting intro and autoplaying BGM
  const handleSplashClick = () => {
    setShowSplash(false);
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn("Autoplay blocked by browser policy:", err);
      });
    }
  };

  // Dedicated Audio toggle
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(err => console.log(err));
      }
    }
  };

  // Vanilla JS style smooth scroll mechanism
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const VisualizerBar = ({ delay }: { delay: number }) => (
    <motion.div
      animate={isPlaying ? { height: ['15%', '100%', '30%', '80%', '15%'] } : { height: '15%' }}
      transition={{ duration: 1.2, repeat: Infinity, delay, ease: 'easeInOut' }}
      className="w-[2px] bg-neutral-400 rounded-full"
    />
  );

  const Cursor = () => {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    useEffect(() => {
      const onMouseMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
      window.addEventListener('mousemove', onMouseMove);
      return () => window.removeEventListener('mousemove', onMouseMove);
    }, []);
    return (
      <div 
        className="fixed top-0 left-0 pointer-events-none z-[10000]"
        style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
      >
        <Crosshair size={26} strokeWidth={0.8} className="text-black/80 -translate-x-1/2 -translate-y-1/2" />
      </div>
    );
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Cursor />
      
      {/* Texture Overlay */}
      <div className="noise-overlay"></div>

      {/* 1. Splash Screen & Intro Animation */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
            onClick={handleSplashClick}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-white cursor-pointer"
          >
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2.5, delay: 0.5, ease: 'easeOut' }}
              className="text-lg md:text-2xl text-black tracking-[0.25em] text-center px-6 leading-loose"
            >
              신께서 빚어낸 완벽한 피조물들이여, 일어나라.
            </motion.p>
            <span className="absolute bottom-12 font-mono text-[10px] text-neutral-300 tracking-widest animate-pulse">
              [CLICK_TO_INITIALIZE_ARCHIVE]
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Modal / Dossier View */}
      <AnimatePresence>
        {selectedChar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-[#fdfcfb]/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setSelectedChar(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#fdfcfb] border border-[#dcd8ce] max-w-3xl w-full shadow-2xl relative flex flex-col md:flex-row overflow-hidden cursor-default max-h-[90vh]"
            >
              {/* Left Image Arch in Modal */}
              <div 
                className={`w-full md:w-[40%] bg-[#f4f2ee] p-4 md:p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-[#dcd8ce] relative shrink-0 ${selectedChar.altImage ? 'cursor-pointer' : ''}`}
                onClick={() => {
                  if (selectedChar.altImage) setIsAltImage(!isAltImage);
                }}
              >
                <div className="w-32 sm:w-48 md:w-full aspect-[2/3] rounded-t-full overflow-hidden border border-[#dcd8ce] shadow-inner relative z-10 transition-transform hover:scale-[1.02] duration-300">
                  <img src={isAltImage && selectedChar.altImage ? selectedChar.altImage : selectedChar.image} alt={selectedChar.codename} className="w-full h-full object-cover mix-blend-multiply opacity-90 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'1.5\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.03\'/%3E%3C/svg%3E')] mix-blend-overlay"></div>
                </div>
              </div>

              {/* Right Profile Data */}
              <div className="w-full md:w-[60%] p-6 md:p-8 flex flex-col relative z-20 flex-1 overflow-y-auto custom-scrollbar">
                <button 
                  onClick={() => setSelectedChar(null)} 
                  className="absolute top-4 right-4 md:top-6 md:right-6 font-mono text-neutral-400 hover:text-black transition-colors text-[10px] uppercase tracking-widest border border-transparent hover:border-black/10 px-2 py-1"
                >
                  [CLOSE]
                </button>
                
                <div className="font-mono text-[10px] text-neutral-400 mb-4 border-b border-[#dcd8ce] pb-2 uppercase text-left">
                  DB_ENTRY: {selectedChar.id}
                </div>
                
                <div className="mb-6">
                  <h3 className="text-3xl md:text-4xl font-bold tracking-[0.2em] mb-2">{selectedChar.codenameEng}</h3>
                  <p className="font-serif text-neutral-500 text-sm tracking-widest">{renderRedactedText(selectedChar.realName)}</p>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-8 items-center">
                  <span className={`px-2 py-0.5 text-[10px] font-mono tracking-widest border ${selectedChar.type === 'SENTINEL' ? 'bg-[#121212] text-[#fdfcfb] border-[#121212]' : 'bg-[#f4f2ee] text-[#121212] border-[#dcd8ce]'}`}>
                    {selectedChar.type}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-mono text-neutral-600 border border-[#dcd8ce] bg-transparent tracking-widest uppercase">
                    {selectedChar.rank}
                  </span>
                  {selectedChar.nat.map(n => (
                    <span key={n} className={`px-2 py-0.5 text-[10px] font-mono tracking-widest border ${getNatColor(n)}`}>
                      {n}
                    </span>
                  ))}
                </div>

                <div className="space-y-3 font-mono text-[11px] leading-relaxed text-[#555] mt-auto">
                  
                  {/* Abilities for Sentinel */}
                  {selectedChar.ability && (
                    <div className="border border-black/10 p-3 bg-black/5 mb-4">
                      <div className="flex justify-between border-b border-black/10 pb-1 mb-2">
                        <span className="text-neutral-500">ABILITY</span>
                        <span className="font-bold text-black">{selectedChar.ability}</span>
                      </div>
                      <p className="font-serif text-neutral-700 break-keep leading-relaxed tracking-wide">
                        {renderRedactedText(selectedChar.abilityDesc)}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                    <div className="flex justify-between border-b border-black/5 pb-1">
                      <span className="text-neutral-400">ROLE</span>
                      <span className="text-black uppercase">{selectedChar.role}</span>
                    </div>
                    <div className="flex justify-between border-b border-black/5 pb-1">
                      <span className="text-neutral-400">AGE</span>
                      <span className="text-black">{selectedChar.age}</span>
                    </div>
                    <div className="flex justify-between border-b border-black/5 pb-1">
                      <span className="text-neutral-400">BIRTH</span>
                      <span className="text-black">{selectedChar.birthday}</span>
                    </div>
                    <div className="flex justify-between border-b border-black/5 pb-1">
                      <span className="text-neutral-400">BLOOD</span>
                      <span className="text-black">{selectedChar.bloodType}</span>
                    </div>
                    <div className="flex justify-between border-b border-black/5 pb-1 md:col-span-2">
                      <span className="text-neutral-400">PHYSICAL</span>
                      <span className="text-black uppercase">{selectedChar.physical}</span>
                    </div>
                    <div className="flex justify-between border-b border-black/5 pb-1 md:col-span-2">
                      <span className="text-neutral-400">MBTI</span>
                      <span className="text-black uppercase">{selectedChar.mbti}</span>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-4 border-t border-black/10 relative">
                    <div className="absolute -top-2 left-0 bg-[#fdfcfb] px-2 font-mono text-[9px] text-neutral-400">OVERSEER_EVALUATION</div>
                    <p className="font-['Nanum_Pen_Script',cursive] text-2xl text-neutral-800 leading-relaxed tracking-wide pt-2 italic">
                      "{selectedChar.comment}"
                    </p>
                  </div>

                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className={`transition-opacity duration-[1500ms] ${showSplash ? 'opacity-0 h-screen overflow-hidden' : 'opacity-100'}`}>
        
        {/* Navigation Bar */}
        <nav className="fixed top-0 left-0 w-full bg-[#fdfcfb]/80 backdrop-blur-md border-b border-black/5 z-40">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div 
              className="cursor-pointer" 
              onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
            >
              <img src="https://joimage.uk/aq/logo.webp" alt="AQUILA" className="h-[28px] md:h-[34px] w-auto mix-blend-multiply opacity-90 hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="hidden md:flex gap-10 font-mono text-[11px] tracking-[0.2em] font-medium text-neutral-400">
              <button onClick={() => scrollToSection('history')} className="hover:text-black transition-colors">HISTORY_LOG</button>
              <button onClick={() => scrollToSection('characters')} className="hover:text-black transition-colors">OPERATIVE_DB</button>
              <button onClick={() => scrollToSection('facilities')} className="hover:text-black transition-colors">FACILITY_MAP</button>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="pt-40 pb-32 max-w-6xl mx-auto px-6 lg:px-12 relative">
          
          {/* Section 1: History (Timeline Layout) */}
          <section id="history" className="min-h-[70vh] mb-48 relative">
            
            {/* Title Area */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="flex items-center gap-6 mb-20 relative border-b border-black/5 pb-8"
            >
              {/* Star graphic */}
              <div className="relative shrink-0">
                <Sun size={36} strokeWidth={1} className="text-neutral-800 animate-[spin_60s_linear_infinite]" />
              </div>
              <div className="flex-grow">
                <h2 className="text-4xl md:text-5xl font-bold tracking-[0.3em] mt-1">역사</h2>
                <span className="font-mono text-[10px] text-neutral-500 tracking-widest block mt-4 bg-neutral-100/50 inline-block px-2 py-1 uppercase">
                  [ROOT_NODE] ARCHIVE_OVERVIEW
                </span>
              </div>
            </motion.div>

            {/* Vertical Scroll-Reveal Timeline */}
            <div className="relative max-w-4xl mx-auto md:px-8 mt-10">
              
              {/* Central Line */}
              <div className="absolute top-0 bottom-0 left-[16px] md:left-[48px] w-[1px] bg-gradient-to-b from-transparent via-black/20 to-transparent"></div>

              {[
                { id: 'DEC-001', title: 'GENESIS', text: '태초에 빛을 머금은 형 가니메데와 어둠을 잉태한 아우 웨스터룬드가 있었으니. 오만한 웨스터룬드가 혀끝으로 거짓과 절망을 토해내어 대지를 병들게 하매, 인간들은 분노한 돌팔매로 그 죄악을 처단하였다.' },
                { id: 'DEC-002', title: 'INVASION', text: '그러나 죽어가는 이단의 악의가 공간을 찢어 파멸의 문(GATE)을 열었고, 심연의 형상(UNKNOWN)들이 쏟아져 내려와 세상은 이내 참혹한 핏빛으로 물들었다.' },
                { id: 'DEC-003', title: 'SACRIFICE', text: '멸망의 기로에서, 지극히 자애로운 가니메데께서는 스스로 고귀한 옥체를 찢어 피와 살을 대지에 흩뿌리셨다.' },
                { id: 'DEC-004', title: 'INHERITANCE', text: '그 파괴의 힘을 물려받은 자들은 심판의 검(SENTINEL)이 되었고, 포용의 은총을 품은 자들은 구원의 성배(GUIDE)가 되어 질서를 수호하니,' },
                { id: 'DEC-005', title: 'AQUILA', text: '이곳 아퀼라(AQUILA)에 깃든 우리 모두는 참된 신께서 빚어낸 가장 완벽한 기적이라.' }
              ].map((log, idx) => (
                <div key={log.id} className="relative min-h-[75vh] flex flex-col justify-center pl-10 md:pl-24 w-full">
                  <motion.div
                    initial={{ opacity: 0, x: 80 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "0px 0px -25% 0px" }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="relative w-full"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute -left-[28px] md:-left-[52px] top-[4px] md:top-[6px] w-[9px] h-[9px] rounded-full bg-white border border-black/40 z-10 shadow-[0_0_0_4px_#fdfcfb]"></div>
                    
                    {/* Meta Label */}
                    <div className="font-mono text-[10px] text-neutral-400 mb-4 border-b border-black/5 pb-1 inline-block">
                      [{log.id}] // {log.title}
                    </div>
                    
                    {/* Content Element */}
                    <p className="text-base md:text-xl md:leading-[2.2] leading-relaxed text-neutral-700 break-keep mr-4">
                      {log.text}
                    </p>
                  </motion.div>
                </div>
              ))}

            </div>
          </section>

          {/* Section 2: Characters (특수 정예팀) */}
          <section id="characters" className="min-h-screen pt-20 mb-48">
            <div className="flex flex-col items-center justify-center mb-32 relative">
              <Crosshair size={24} strokeWidth={1} className="text-neutral-300 absolute -top-12 z-0 animate-[spin_20s_linear_infinite]" />
              <div className="bg-[#fdfcfb] px-6 z-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-[0.3em]">특수 정예팀</h2>
                <div className="font-mono text-[10px] tracking-widest text-[#a39f98] bg-[#f8f6f0] px-3 py-1 border border-[#e6ddcf]">
                  DB_QUERY: ELITE_TEAMS // STATUS: CLASSIFIED
                </div>
              </div>
              <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-black/10 to-transparent top-1/2 z-0"></div>
            </div>
            
            {/* Team Iterator */}
            {TEAMS.map((team, tIdx) => (
              <div key={team.name} className="mb-32">
                <div className="flex items-center gap-4 mb-16 px-4 md:px-0">
                  <h3 className="text-2xl font-serif tracking-[0.4em] font-bold pb-2 uppercase text-neutral-800">{team.name}</h3>
                  <div className="h-[1px] flex-grow bg-black/10"></div>
                  <span className="font-mono text-[9px] text-neutral-400">TEAM_REF: {tIdx + 1}</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 px-4 md:px-0">
                  {team.members.map((char, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                      className="group flex flex-col items-center sm:items-start cursor-pointer transition-transform hover:-translate-y-2"
                      onClick={() => setSelectedChar(char)}
                    >
                      {/* Portrait Arch */}
                      <div className="w-full max-w-[260px] aspect-[2/3] rounded-t-full bg-[#f4f2ee] border-[0.5px] border-[#dcd8ce] relative overflow-hidden flex flex-col items-center justify-center shadow-inner mb-6 transition-all duration-700 hover:border-black/30 hover:shadow-lg">
                        
                        {/* Decorative background elements before image loads/shows */}
                        <div className="absolute top-8 w-1/3 h-[1px] bg-[#d0cac0] z-0"></div>
                        <div className="absolute top-6 bottom-6 left-1/2 w-[1px] bg-[#d0cac0] -translate-x-1/2 opacity-30 z-0"></div>
                        
                        <img 
                          src={char.image} 
                          alt={char.codename} 
                          className="absolute inset-0 w-full h-full object-cover grayscale mix-blend-multiply opacity-80 group-hover:grayscale-0 group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-500 z-10"
                        />
                        
                        {/* Data grain overlay */}
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'1.5\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E')] z-20 pointer-events-none"></div>
                      </div>
                      
                      {/* Quick Data */}
                      <div className="w-full text-center sm:text-left relative pl-1">
                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                          <h4 className="text-xl font-bold tracking-[0.2em]">{char.codename}</h4>
                          <span className="font-mono text-[9px] text-[#a39f98] hidden lg:block">ID: {char.id}</span>
                        </div>
                        
                        <div className="mb-4 space-y-2 mt-2">
                          <div className="flex items-center justify-center sm:justify-start gap-2">
                            {/* Sentinel / Guide Mini Badge */}
                            <span className={`px-1.5 py-[1px] text-[8px] font-mono tracking-widest border ${char.type === 'SENTINEL' ? 'bg-[#121212] text-white border-transparent' : 'bg-[#eae6de] text-black border-[#dcd8ce]'}`}>
                              {char.type}
                            </span>
                            <span className="font-mono text-[9px] text-[#888]">/ {char.rank}</span>
                          </div>
                          <p className="font-mono text-[10px] text-neutral-500 tracking-wider">POS: {char.role}</p>
                        </div>

                        <div className="border-t border-black/5 pt-2 relative w-full flex justify-center sm:justify-start">
                          <Plus size={8} className="absolute -top-1 -left-1 text-neutral-300 hidden sm:block" />
                          <span className="text-[10px] font-mono text-neutral-400 group-hover:text-black transition-colors uppercase tracking-widest mt-1">
                            Click to Expand
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* Section 3: Facilities */}
          <section id="facilities" className="min-h-[80vh] pt-20">
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-[0.3em]">U.D.F AQUILA</h2>
              <div className="flex items-center gap-4">
               <div className="h-[1px] bg-black/10 flex-grow"></div>
               <span className="font-mono text-[10px] tracking-widest text-neutral-400">ARCHITECTURAL_BLUEPRINT</span>
              </div>
            </div>
            
            {/* Blueprint Grid Enclosure */}
            <div className="blueprint-bg border-[0.5px] border-[#dcd8ce] p-6 md:p-12 relative shadow-sm">
              
              {/* Corner tech marks */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-black/30"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-black/30"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-black/30"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-black/30"></div>

              <div className="font-mono text-[10px] text-neutral-500 mb-10 pb-4 border-b border-black/5 flex justify-between">
                <span>[DOC_TYPE: SCHEMATIC]</span>
                <span>AUTH_LEVEL: OMEGA</span>
              </div>

              <div className="space-y-6">
                {[
                  { 
                    floor: '1F\n—\n3F', levelT: 'LEVEL: GRND', purpose: 'LOBBY / PUBLIC', name: '성문 (The Gate)', 
                    descItems: [
                      '1F 화이트 노드 - 거대한 가니메데 상이 서 있는 로비. 신분 확인 및 보안 검색대.',
                      '2F 민원 및 접견실 - 대외적인 행정 업무와 외부 인사 접대 구역.',
                      '3F 전시관 및 강당 - 아퀼라의 역사를 홍보하는 홀.'
                    ]
                  },
                  { 
                    floor: '4F\n—\n9F', levelT: 'LEVEL: UP_01', purpose: 'ADMINISTRATION', name: '법전 (The Code)', 
                    descItems: [
                      '4F~6F 통합 행정국 - 보급, 예산, 인사 관리 사무실.',
                      '7F~9F 전략 기획실 - 국내외 언노운 발생 동향 분석 및 작전 수립.'
                    ]
                  },
                  { 
                    floor: '10F\n—\n15F', levelT: 'LEVEL: UP_02', purpose: 'WELFARE / LIVING', name: '요람 (The Cradle)', 
                    descItems: [
                      '10F 정예팀 전용 숙소 - 1인 1실의 최고급 주거 공간. 칼릭스, 스티그마, 오라클이 거주.',
                      '11F 넥타르 - 영양학적으로 완벽하게 계산된 식단을 제공하는 중앙 식당.',
                      '12F~13F 메디컬 센터 및 정화조 - 가이딩 시설 및 심리 치료실.',
                      '14F~15F 휴게 센터 - 실내 정원, 도서관, 그리고 은밀한 고해성사 구역.'
                    ]
                  },
                  { 
                    floor: '16F\n—\n30F', levelT: 'LEVEL: UP_03', purpose: 'TRAINING / LAB', name: '시련 (The Trial)', 
                    descItems: [
                      '16F~20F 가상 시뮬레이션실 (V.R) - 언노운과의 전투를 재현하는 훈련장.',
                      '21F~25F 실전 훈련장 - 대인 전투, 사격장, 이능력 폭주 제어 훈련장.',
                      '26F~30F 후천적 각성 센터 - 님버스 출신 아이들이 "육성"되는 교육 및 실험실.'
                    ]
                  },
                  { 
                    floor: '31F\n—\n40F', levelT: 'LEVEL: UP_04', purpose: 'MONITORING / INTEL', name: '감시 (The Eye)', 
                    descItems: [
                      '31F~35F 통합 관제실 - 전 세계 게이트 수치 실시간 모니터링.',
                      '36F~40F 제4국 (정보국) - 반란군 "프로메테우스" 추적 및 첩보 수집. 암호 해독반.'
                    ]
                  },
                  { 
                    floor: '41F\n—\n45F', levelT: 'LEVEL: UP_05', purpose: 'ARMORY / R&D', name: '성궤 (The Ark)', 
                    descItems: [
                      '41F~42F 무기 개발 연구소 - 센티넬 전용 이능력 강화 무기 제작.',
                      '43F~45F 중앙 병기고 - SS급 언노운 대응용 중화기 및 특수 제어구 보관.'
                    ]
                  },
                  { 
                    floor: '46F\n—\n50F', levelT: 'LEVEL: APEX', purpose: 'COMMAND', name: '지성소 (The Sanctum)', 
                    descItems: [
                      '[SECRET:CLASSIFIED_ACCESS_DENIED] // 사령부'
                    ],
                    locked: true
                  },
                  { 
                    floor: 'B1\n—\nB5', levelT: 'LEVEL: SUB', purpose: 'LOGISTICS / PRISON', name: '심연 (The Abyss)', 
                    descItems: [
                      'B1~B3 지하 주차장 및 물류 기지 - 의전 차량 및 장갑차 대기소.',
                      'B4~B5 격리 수용소 - 포획된 언노운 연구 및 "이단"으로 규정된 수감자 구금 구역.'
                    ]
                  }
                ].map((fac, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0 }}
                    className={`group border border-transparent ${fac.locked ? 'bg-black/90 hover:bg-black p-6 overflow-hidden relative' : 'hover:border-[#dcd8ce] bg-white/40 hover:bg-white/80 p-6'} flex flex-col md:flex-row transition duration-500 cursor-crosshair justify-between gap-6 md:gap-12 backdrop-blur-sm`}
                  >
                    {/* Left Meta Data */}
                    <div className="md:w-32 shrink-0 flex flex-col justify-between">
                      <div className={`text-2xl md:text-3xl font-bold tracking-widest whitespace-pre-line ${fac.locked ? 'text-red-900 group-hover:text-red-700' : 'text-neutral-300 group-hover:text-black'} transition-colors mb-4 md:mb-0`}>
                        {fac.floor}
                      </div>
                      <div className="flex flex-col gap-1 hidden md:flex opacity-50 group-hover:opacity-100 transition-opacity">
                        <span className={`font-mono text-[9px] ${fac.locked ? 'text-red-500' : 'text-[#a39f98]'}`}>[{fac.levelT}]</span>
                        <span className={`font-mono text-[9px] ${fac.locked ? 'text-red-500' : 'text-[#222222]'}`}>PURP: {fac.purpose}</span>
                      </div>
                    </div>
                    
                    {/* Description Area */}
                    <div className="flex-grow">
                      <h3 className={`text-xl font-bold mb-3 tracking-[0.2em] ${fac.locked ? 'text-red-600' : ''}`}>{fac.name}</h3>
                      <div className={`leading-loose text-sm md:text-base font-serif space-y-2 pb-2 ${fac.locked ? 'text-red-500' : 'text-neutral-600'}`}>
                        {fac.descItems.map((item, i) => (
                          <div key={i} className={`pb-1 ${fac.locked ? '' : 'border-b border-black/5'} break-keep`}>
                            {fac.locked ? renderRedactedText(item) : item}
                          </div>
                        ))}
                      </div>
                      {/* Mobile metadata view */}
                      <div className={`flex gap-4 mt-6 md:hidden font-mono text-[9px] pt-3 ${fac.locked ? 'border-t border-red-900/30 text-red-700' : 'text-[#a39f98] border-t border-black/5'}`}>
                        <span>[{fac.levelT}]</span>
                        <span>{fac.purpose}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

        </main>
      </div>

      {/* BGM Controller with Visualizer */}
      <div className={`fixed bottom-8 right-8 z-50 transition-opacity duration-1000 ${showSplash ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex items-center gap-4 bg-white/70 backdrop-blur-md px-4 py-2 border border-[#dcd8ce] shadow-sm">
          
          {/* Data Visualizer (Audio Wave) */}
          <div className="flex items-end gap-[3px] h-4 w-6">
            <VisualizerBar delay={0} />
            <VisualizerBar delay={0.2} />
            <VisualizerBar delay={0.4} />
            <VisualizerBar delay={0.1} />
          </div>

          <div className="w-[1px] h-6 bg-[#dcd8ce]"></div>

          {/* Toggle Button */}
          <button
            onClick={toggleAudio}
            className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-black transition-all"
            aria-label="Toggle Audio Background Music"
          >
            {isPlaying ? (
              <Pause size={14} strokeWidth={1.5} />
            ) : (
              <Play size={14} strokeWidth={1.5} className="ml-0.5" />
            )}
          </button>
        </div>

        {/* 
          [BGM_PATH] - Replace the src below playing your custom BGM.
          Example: src="https://joimage.uk/aq/bgm.mp3"
        */}
        <audio id="bgmAudio" ref={audioRef} loop src="https://joimage.uk/aq/bgm.mp3"></audio>
      </div>
    </div>
  );
}
