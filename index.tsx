import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';

// --- Types ---
interface SurgicalCode { id: string; code: string; name_ch: string; name_en: string; }
interface SelfPaidItem { id: string; category: string; code: string; name_ch: string; name_en: string; }
interface PhoneDirectoryItem { id: string; category: string; name: string; extension: string; badge_id?: string; }
type View = 'portal' | 'surgical' | 'selfPaid' | 'phoneDirectory';

// --- Data ---
const SURGICAL_CODES: SurgicalCode[] = [
    { id: '1', code: '70006B', name_ch: '肌肉或深部組織腫瘤切除術及異物取出術 / 移除Port-A', name_en: 'Excision of muscle or deep tissue tumor (Remove Port-A)' },
    { id: '2', code: '71215C', name_ch: '二氧化碳雷射手術', name_en: 'CO2 laser operation' },
    { id: '3', code: '71899E', name_ch: '下腹動脈結紮後分離(用於產後大出血)', name_en: 'Hypogastric artery ligation (PPH)' },
    { id: '4', code: '71882E', name_ch: '子宮動脈結紮與分離', name_en: 'Uterine artery ligation' },
    { id: '5', code: '73551F', name_ch: '骨盆腔淋巴腺切除術', name_en: 'Pelvic lymphadenectomy' },
    { id: '6', code: '75024C', name_ch: '後腹腔淋巴結摘除術', name_en: 'Retroperitoneal LN dissection' },
    { id: '7', code: '73202E', name_ch: '闌尾切除術', name_en: 'Appendectomy' },
    { id: '8', code: '73204C', name_ch: '腹腔鏡闌尾切除術', name_en: 'Laparoscopic appendectomy' },
    { id: '9', code: '78221E', name_ch: '剖腹產術，一般，無妊娠併發症', name_en: 'Cesarean section (Normal)' },
    { id: '10', code: '78230C', name_ch: '剖腹產術，複雜，有妊娠併發症', name_en: 'Cesarean section (Complicated)' },
    { id: '11', code: '77701C', name_ch: '陰道產', name_en: 'Vaginal delivery' },
    { id: '12', code: '43453F', name_ch: '診斷性子宮鏡', name_en: 'Diagnostic hysteroscopy' },
    { id: '13', code: '40617E', name_ch: '人工血管置入手術', name_en: 'Port-A set up' },
    { id: '14', code: '77612D', name_ch: '腹腔鏡全子宮切除術', name_en: 'Laparoscopy hysterectomy' },
    { id: '15', code: '77600I', name_ch: '腹腔鏡子宮肌瘤切除術', name_en: 'Laparoscopy myomectomy' },
    { id: '16', code: '77830J', name_ch: '前哨淋巴結 / 近紅外線內視鏡輔助微創手術', name_en: 'Sentinel LN / ICG' },
];

const SELF_PAID_ITEMS: SelfPaidItem[] = [
    { id: 's1', category: '手術器械', code: '97123', name_ch: '雙極雷聲刀 (雷神刀)', name_en: 'Thunderbeat' },
    { id: 's2', category: '手術器械', code: '97127', name_ch: '利嘉修爾馬里蘭鉗口 (Ligasure)', name_en: 'Ligasure Maryland' },
    { id: 's3', category: '止血', code: '97244', name_ch: '可吸收性止血粉', name_en: 'Surgicel powder' },
    { id: 's4', category: '防沾黏', code: '99585', name_ch: '亞諾貝爾凝膠 (防沾黏)', name_en: 'Hyalobarrier' },
    { id: 's5', category: '防沾黏', code: '99905', name_ch: '適福生化吸收膜 (糖果紙)', name_en: 'Seprafilm' },
    { id: 's6', category: '傷口敷料', code: '93109', name_ch: '愛惜康得美棒接合網片 (Mesh)', name_en: 'Dermabond + mesh' },
    { id: 's7', category: '縫線', code: '93107', name_ch: '魚骨線 (免打結縫線)', name_en: 'Stratafix symmetrical' },
    { id: 's8', category: '病理', code: '46141', name_ch: '慧智 HRD 基因檢測', name_en: 'HRD Testing' },
];

const PHONE_DIRECTORY: PhoneDirectoryItem[] = [
    { id: 'p1', category: '主治醫師', name: '李如悅', extension: '70656', badge_id: '3721B' },
    { id: 'p2', category: '主治醫師', name: '劉文雄', extension: '70667', badge_id: '0779J' },
    { id: 'p3', category: '主治醫師', name: '林立德', extension: '70661', badge_id: '3837B' },
    { id: 'p4', category: '檢查單位', name: '3F超音波室', extension: '74016' },
    { id: 'p5', category: '檢查單位', name: '1F門診超音波室', extension: '77094' },
    { id: 'p6', category: '產房', name: '產房護理站', extension: '78192' },
    { id: 'p7', category: '產房', name: '產房手術室 (產一)', extension: '74035' },
    { id: 'p8', category: '急診', name: '急診外科 (外急)', extension: '77060' },
    { id: 'p9', category: '住院醫師', name: '宋潔', extension: '70478', badge_id: 'H056E' },
];

// --- Helper ---
const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// --- Components ---
const HighlightedText: React.FC<{ text: string; highlight: string }> = ({ text, highlight }) => {
  const safeText = String(text || '');
  if (!highlight.trim()) return <span>{safeText}</span>;
  
  try {
    const escaped = escapeRegExp(highlight.trim());
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = safeText.split(regex);
    
    return (
      <span>
        {parts.map((part, i) => (
          part.toLowerCase() === highlight.trim().toLowerCase() 
            ? <mark key={i}>{part}</mark> 
            : <span key={i}>{part}</span>
        ))}
      </span>
    );
  } catch (e) {
    return <span>{safeText}</span>;
  }
};

const App = () => {
  const [view, setView] = useState<View>('portal');
  const [search, setSearch] = useState('');

  const filteredSurgical = useMemo(() => {
    if (!search.trim()) return [];
    return SURGICAL_CODES.filter(i => 
      i.code.includes(search) || 
      i.name_ch.includes(search) || 
      i.name_en.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const filteredSelfPaid = useMemo(() => {
    if (!search.trim()) return SELF_PAID_ITEMS;
    return SELF_PAID_ITEMS.filter(i => i.code.includes(search) || i.name_ch.includes(search));
  }, [search]);

  const filteredPhone = useMemo(() => {
    if (!search.trim()) return PHONE_DIRECTORY;
    return PHONE_DIRECTORY.filter(i => i.name.includes(search) || i.extension.includes(search));
  }, [search]);

  const renderContent = () => {
    if (view === 'portal') {
      return (
        <div className="max-w-4xl mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <button onClick={() => { setView('surgical'); setSearch(''); }} className="glass-card p-8 rounded-3xl shadow-sm hover:shadow-md transition-all border-l-8 border-blue-500 text-center flex flex-col items-center">
            <div className="text-blue-600 mb-4 bg-blue-50 p-4 rounded-full">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800">手術碼查詢</h3>
            <p className="text-gray-500 text-sm mt-2">高榮內部手術對應代碼</p>
          </button>
          
          <button onClick={() => { setView('selfPaid'); setSearch(''); }} className="glass-card p-8 rounded-3xl shadow-sm hover:shadow-md transition-all border-l-8 border-green-500 text-center flex flex-col items-center">
            <div className="text-green-600 mb-4 bg-green-50 p-4 rounded-full">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800">自費項目</h3>
            <p className="text-gray-500 text-sm mt-2">醫療耗材與自費檢測</p>
          </button>
          
          <button onClick={() => { setView('phoneDirectory'); setSearch(''); }} className="glass-card p-8 rounded-3xl shadow-sm hover:shadow-md transition-all border-l-8 border-orange-500 text-center flex flex-col items-center">
            <div className="text-orange-600 mb-4 bg-orange-50 p-4 rounded-full">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800">分機查詢</h3>
            <p className="text-gray-500 text-sm mt-2">產房、醫師、科室分機</p>
          </button>
        </div>
      );
    }

    return (
      <div className="max-w-5xl mx-auto p-4">
        <div className="mb-8">
          <div className="relative">
            <input 
              type="text" 
              autoFocus
              value={search} 
              onChange={e => setSearch(e.target.value)}
              placeholder={view === 'phoneDirectory' ? "搜尋姓名或分機..." : "搜尋關鍵字、代碼..."}
              className="w-full pl-12 pr-6 py-4 rounded-2xl border-none shadow-lg focus:ring-2 focus:ring-primary-500 text-lg"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {view === 'surgical' && filteredSurgical.map(i => (
            <div key={i.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-t-4 border-blue-500">
              <span className="text-blue-600 font-bold text-sm tracking-widest uppercase">{i.code}</span>
              <h4 className="text-lg font-bold text-gray-800 mt-1"><HighlightedText text={i.name_ch} highlight={search} /></h4>
              <p className="text-gray-400 text-xs mt-2 italic leading-tight">{i.name_en}</p>
            </div>
          ))}

          {view === 'selfPaid' && filteredSelfPaid.map(i => (
            <div key={i.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-t-4 border-green-500">
              <div className="flex justify-between items-start mb-2">
                <span className="text-green-600 font-bold text-sm">{i.code}</span>
                <span className="text-[10px] px-2 py-0.5 bg-green-50 text-green-700 rounded-full font-bold uppercase">{i.category}</span>
              </div>
              <h4 className="font-bold text-gray-800"><HighlightedText text={i.name_ch} highlight={search} /></h4>
              <p className="text-gray-400 text-xs mt-1 italic">{i.name_en}</p>
            </div>
          ))}

          {view === 'phoneDirectory' && filteredPhone.map(i => (
            <div key={i.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between border-t-4 border-orange-500">
              <div className="mb-4">
                <span className="text-[10px] px-2 py-0.5 bg-orange-50 text-orange-600 rounded-full font-bold uppercase mb-2 inline-block">{i.category}</span>
                <h4 className="text-xl font-bold text-gray-800"><HighlightedText text={i.name} highlight={search} /></h4>
                {i.badge_id && <p className="text-gray-400 text-xs mt-1 uppercase tracking-wider">ID: {i.badge_id}</p>}
              </div>
              <div className="flex justify-between items-baseline pt-4 border-t border-gray-50">
                <span className="text-gray-400 text-xs font-bold tracking-tighter uppercase">Extension</span>
                <span className="text-3xl font-black text-orange-600 tracking-tighter">{i.extension}</span>
              </div>
            </div>
          ))}
        </div>

        {search.trim() && (
          (view === 'surgical' && filteredSurgical.length === 0) ||
          (view === 'selfPaid' && filteredSelfPaid.length === 0) ||
          (view === 'phoneDirectory' && filteredPhone.length === 0)
        ) && (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 mt-8">
            <p className="text-gray-400 font-medium">查無相關結果，請更換關鍵字搜尋</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => { setView('portal'); setSearch(''); }} className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-md group-hover:rotate-6 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="font-bold text-xl text-gray-800 tracking-tight hidden xs:block">VGHKS助理</span>
          </button>
          
          <div className="flex items-center gap-1 sm:gap-4">
            {view !== 'portal' && (
              <button onClick={() => { setView('portal'); setSearch(''); }} className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                首頁
              </button>
            )}
            <nav className="flex items-center gap-1">
              <button onClick={() => { setView('surgical'); setSearch(''); }} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'surgical' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}>手術碼</button>
              <button onClick={() => { setView('selfPaid'); setSearch(''); }} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'selfPaid' ? 'bg-green-50 text-green-600' : 'text-gray-500 hover:bg-gray-100'}`}>自費</button>
              <button onClick={() => { setView('phoneDirectory'); setSearch(''); }} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'phoneDirectory' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-100'}`}>分機</button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {renderContent()}
      </main>

      <footer className="py-8 bg-white border-t border-gray-100 text-center">
        <p className="text-gray-400 text-xs tracking-widest uppercase font-bold">VGHKS Assistant Platform &copy; 2024</p>
        <p className="text-gray-300 text-[10px] mt-1">高雄榮民總醫院 · 內部資訊助手</p>
      </footer>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
