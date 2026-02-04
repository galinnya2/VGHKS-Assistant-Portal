import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';

// --- Types ---
interface SurgicalCode { id: string; code: string; name_ch: string; name_en: string; }
interface SelfPaidItem { id: string; category: string; code: string; name_ch: string; name_en: string; }
interface PhoneDirectoryItem { id: string; category: string; name: string; badge_id: string; extension: string; }
type View = 'portal' | 'surgical' | 'selfPaid' | 'phoneDirectory';

// --- Data Constants ---
const SURGICAL_CODES: SurgicalCode[] = [
    { id: '70006B', code: '70006B', name_ch: '肌肉或深部組織腫瘤切除術及異物取出術 / 移除Port-A', name_en: 'Excision of muscle or deep tissue tumor, deep foreign body (Remove Port-A)' },
    { id: '71215C', code: '71215C', name_ch: '二氧化碳雷射手術', name_en: 'CO2 laser operation' },
    { id: '71899E', code: '71899E', name_ch: '下腹動脈結紮後分離(用於產後大出血或骨盆出血)', name_en: 'Hypogastric artery ligation related to postpartum hemorrhage or uncontrolled bleeding of pelvis' },
    { id: '71882E', code: '71882E', name_ch: '子宮動脈結紮與分離', name_en: 'uterine artery ligation' },
    { id: '72301H', code: '72301H', name_ch: '腹股溝淋巴腺腫切除術', name_en: 'Excision of inguinal lymphnode' },
    { id: '72308A', code: '72308A', name_ch: '腹股溝淋巴腺腫根治清除術', name_en: 'Radical inguinal lymphnode dissection' },
    { id: '73551F', code: '73551F', name_ch: '骨盆腔淋巴腺切除術', name_en: 'Pelvic lymphadenectomy' },
    { id: '75024C', code: '75024C', name_ch: '後腹腔淋巴結摘除術', name_en: 'Retroperitoneal LN dissection' },
    { id: '75030D', code: '75030D', name_ch: '根除性淋巴結切除術', name_en: 'Radical lymphadenectomy' },
    { id: '75036H', code: '75036H', name_ch: '主動脈旁淋巴切除術', name_en: 'Paraaortic lymph node dissection' },
    { id: '73202E-1', code: '73202E', name_ch: '闌尾切除術', name_en: 'Appendectomy' },
    { id: '73204C-1', code: '73204C', name_ch: '腹腔鏡闌尾切除術', name_en: 'Laparoscopic appendectomy' },
    { id: '78221E', code: '78221E', name_ch: '剖腹產術，一般，無妊娠併發症', name_en: 'Cesarean section C/S C.S' },
    { id: '78230C', code: '78230C', name_ch: '剖腹產術，複雜，有妊娠併發症', name_en: 'Cesarean section C/S C.S complicated' },
    { id: '77701C', code: '77701C', name_ch: '無妊娠併發症之陰道產', name_en: 'Vaginal delivery in normal pregnancy' },
    { id: '43453F', code: '43453F', name_ch: '診斷性子宮鏡', name_en: 'Diagnostic hysteroscopy' },
    { id: '40617E', code: '40617E', name_ch: '人工血管置入手術', name_en: 'Port-A set up' },
    { id: '77612D', code: '77612D', name_ch: '腹腔鏡全子宮切除術', name_en: 'Laparoscopy hysterectomy' },
    { id: '77600I', code: '77600I', name_ch: '腹腔鏡子宮肌瘤切除術', name_en: 'Laparoscopy myomectomy' },
    { id: '77830J', code: '77830J', name_ch: '近紅外線內視鏡輔助微創手術 / 前哨淋巴結', name_en: 'Near infrared assisted endoscopic surgery / ICG / Sentinel LN' },
];

const SELF_PAID_ITEMS: SelfPaidItem[] = [
    { id: '97123', category: '手術器械', code: '97123', name_ch: '雙極雷聲刀/雷神刀', name_en: 'Thunderbeat' },
    { id: '97127', category: '手術器械', code: '97127', name_ch: '利嘉修爾含塗層馬里蘭鉗口單一', name_en: 'Ligasure Maryland' },
    { id: '98585', category: '手術器械', code: '98585', name_ch: '史耐輝子宮鏡切除器/速潔刀(冷刀)', name_en: 'Truclear' },
    { id: '97244', category: '止血', code: '97244', name_ch: '愛惜康可吸收性止血粉', name_en: 'Surgicel powder' },
    { id: '99585', category: '防沾黏', code: '99585', name_ch: '亞諾貝爾凝膠(內視鏡子宮鏡用)', name_en: 'Hyalobarrier' },
    { id: '99905', category: '防沾黏', code: '99905', name_ch: '適福生化吸收膜/糖果紙', name_en: 'Seprafilm' },
    { id: '93109', category: '傷口敷料', code: '93109', name_ch: '愛惜康得美棒接合自黏網片/傷口Mesh', name_en: 'Dermabond + mesh' },
    { id: '93107', category: '縫線', code: '93107', name_ch: '魚骨線/思達飛抗菌對稱型免打結', name_en: 'Stratafix symmetrical' },
    { id: '46141', category: '病理', code: '46141', name_ch: '慧智 HRD 基因檢測', name_en: 'HRD Testing(SOFIVA)' },
];

const PHONE_DIRECTORY: PhoneDirectoryItem[] = [
    { id: 'LRY', category: '主治醫師', name: '李如悅', badge_id: '3721B', extension: '70656' },
    { id: 'LWH', category: '主治醫師', name: '劉文雄', badge_id: '0779J', extension: '70667' },
    { id: 'TFN', category: '主治醫師', name: '卓福男', badge_id: '0749E', extension: '70650' },
    { id: 'LLD', category: '主治醫師', name: '林立德', badge_id: '3837B', extension: '70661' },
    { id: 'TKH', category: '主治醫師', name: '崔冠濠', badge_id: '3578J', extension: '70653' },
    { id: 'US3F', category: '檢查單位', name: '3F超音波室', badge_id: '', extension: '74016' },
    { id: 'US1F', category: '檢查單位', name: '1F門診超音波室', badge_id: '', extension: '77094' },
    { id: 'DEL1', category: '產房', name: '產房護理站1', badge_id: '', extension: '78192' },
    { id: 'DEL2', category: '產房', name: '產房護理站2', badge_id: '', extension: '74215' },
    { id: 'OR1', category: '產房', name: '產房手術室1/產一', badge_id: '', extension: '74035' },
    { id: 'ER_SUR', category: '急診', name: '急診外科/外急/外傷', badge_id: '', extension: '77060' },
];

// --- Icons ---
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

// --- Shared Components ---
const HighlightedText: React.FC<{ text: string; highlight: string }> = ({ text, highlight }) => {
  if (!highlight.trim()) return <>{text}</>;
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === highlight.toLowerCase() ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>
      )}
    </>
  );
};

// --- View Components ---
const Portal = ({ setView }: { setView: (v: View) => void }) => (
  <div className="max-w-4xl mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
    <button onClick={() => setView('surgical')} className="glass-card p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-center border-t-4 border-blue-500">
      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
      </div>
      <h3 className="text-xl font-bold text-gray-800">手術碼查詢</h3>
      <p className="text-gray-500 text-sm mt-2">查詢代碼與中文名稱</p>
    </button>
    <button onClick={() => setView('selfPaid')} className="glass-card p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-center border-t-4 border-green-500">
      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </div>
      <h3 className="text-xl font-bold text-gray-800">自費項目</h3>
      <p className="text-gray-500 text-sm mt-2">醫療耗材與檢測項目</p>
    </button>
    <button onClick={() => setView('phoneDirectory')} className="glass-card p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-center border-t-4 border-orange-500">
      <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
      </div>
      <h3 className="text-xl font-bold text-gray-800">分機查詢</h3>
      <p className="text-gray-500 text-sm mt-2">醫師與科室常用分機</p>
    </button>
  </div>
);

const App = () => {
  const [view, setView] = useState<View>('portal');
  const [search, setSearch] = useState('');

  const renderContent = () => {
    switch (view) {
      case 'surgical':
        const surgicalResults = SURGICAL_CODES.filter(i => 
          i.code.includes(search) || i.name_ch.includes(search) || i.name_en.toLowerCase().includes(search.toLowerCase())
        );
        return (
          <div className="max-w-5xl mx-auto p-4">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">手術碼查詢平台</h2>
            <div className="relative mb-8">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></span>
              <input 
                type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="輸入關鍵字、代碼..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-none shadow-md focus:ring-2 focus:ring-blue-500 text-lg"
              />
            </div>
            <div className="grid gap-4">
              {surgicalResults.map(i => (
                <div key={i.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <span className="text-blue-600 font-bold text-sm tracking-widest uppercase">{i.code}</span>
                  <h4 className="text-xl font-bold text-gray-800 mt-1"><HighlightedText text={i.name_ch} highlight={search} /></h4>
                  <p className="text-gray-500 text-sm mt-2">{i.name_en}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'selfPaid':
        const selfResults = SELF_PAID_ITEMS.filter(i => i.code.includes(search) || i.name_ch.includes(search));
        return (
          <div className="max-w-5xl mx-auto p-4">
            <h2 className="text-2xl font-bold text-green-700 mb-6">自費項目查詢</h2>
            <input 
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="搜尋名稱或代碼..."
              className="w-full px-6 py-4 rounded-2xl border-none shadow-md focus:ring-2 focus:ring-green-500 mb-8"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selfResults.map(i => (
                <div key={i.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-green-600 font-bold text-xs">{i.code}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-green-50 text-green-700 rounded-full font-bold">{i.category}</span>
                  </div>
                  <h4 className="font-bold text-gray-800"><HighlightedText text={i.name_ch} highlight={search} /></h4>
                </div>
              ))}
            </div>
          </div>
        );
      case 'phoneDirectory':
        const phoneResults = PHONE_DIRECTORY.filter(i => i.name.includes(search) || i.extension.includes(search));
        return (
          <div className="max-w-5xl mx-auto p-4">
            <h2 className="text-2xl font-bold text-orange-600 mb-6">常用分機查詢</h2>
            <input 
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="搜尋姓名或分機..."
              className="w-full px-6 py-4 rounded-2xl border-none shadow-md focus:ring-2 focus:ring-orange-500 mb-8"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {phoneResults.map(i => (
                <div key={i.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between border-b-4 border-orange-400">
                  <div>
                    <span className="text-[10px] px-2 py-0.5 bg-orange-50 text-orange-600 rounded-full font-bold mb-2 inline-block">{i.category}</span>
                    <h4 className="text-lg font-bold text-gray-800"><HighlightedText text={i.name} highlight={search} /></h4>
                  </div>
                  <div className="mt-4 flex justify-between items-baseline">
                    <span className="text-gray-400 text-xs font-bold">EXT</span>
                    <span className="text-3xl font-black text-orange-600">{i.extension}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <Portal setView={(v) => { setView(v); setSearch(''); }} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => setView('portal')} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="font-bold text-xl text-gray-800 hidden sm:inline">VGHKS Assistant</span>
          </button>
          {view !== 'portal' && (
            <button onClick={() => setView('portal')} className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-primary-600 hover:text-white transition-all shadow-sm">
              <HomeIcon />
            </button>
          )}
        </div>
      </header>
      <main className="flex-grow">{renderContent()}</main>
      <footer className="py-6 text-center text-gray-400 text-xs">
        &copy; {new Date().getFullYear()} VGHKS 醫療助手 · 內部查詢專用平台
      </footer>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
