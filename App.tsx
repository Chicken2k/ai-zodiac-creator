
import React, { useState, useEffect, useCallback } from 'react';
import { ZODIACS, TONES, MYSTICAL_TOPICS } from './constants';
import { Zodiac, ToneType } from './types';
import { generateZodiacContent } from './geminiService';
import { 
  ClipboardDocumentIcon, 
  ArrowPathIcon, 
  SparklesIcon,
  TrashIcon,
  StarIcon,
  MusicalNoteIcon,
  BoltIcon,
  ClockIcon,
  XMarkIcon,
  SpeakerWaveIcon,
  CheckCircleIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

interface QueueItem {
  id: string;
  zodiac: Zodiac;
  tone: ToneType;
  focus: string;
  content: string;
  status: 'pending' | 'completed' | 'error';
  timestamp: number;
}

const App: React.FC = () => {
  const [selectedZodiac, setSelectedZodiac] = useState<Zodiac>('Sửu');
  const [selectedTone, setSelectedTone] = useState<ToneType>('Thấu Hiểu');
  const [focus, setFocus] = useState<string>(MYSTICAL_TOPICS[0]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('zodiac_queue_v5');
    if (saved) {
      const parsedQueue = JSON.parse(saved);
      setQueue(parsedQueue);
      if (parsedQueue.length > 0) {
        setActiveItemId(parsedQueue[0].id);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('zodiac_queue_v5', JSON.stringify(queue));
  }, [queue]);

  const addToQueue = useCallback(async (zodiac: Zodiac, tone: ToneType, topic: string) => {
    const newItem: QueueItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      zodiac,
      tone,
      focus: topic,
      content: '',
      status: 'pending',
      timestamp: Date.now(),
    };

    setQueue(prev => [newItem, ...prev]);
    setActiveItemId(newItem.id);

    try {
      const content = await generateZodiacContent({ zodiac, tone, focus: topic });
      setQueue(prev => prev.map(item => 
        item.id === newItem.id 
          ? { ...item, content, status: 'completed' } 
          : item
      ));
    } catch (error: any) {
      setQueue(prev => prev.map(item => 
        item.id === newItem.id 
          ? { ...item, status: 'error', content: 'Lỗi kết nối thiên cơ. Con vui lòng thử lại sau.' } 
          : item
      ));
    }
  }, []);

  const handleGenerate = () => addToQueue(selectedZodiac, selectedTone, focus);

  const handleRandomAndGenerate = () => {
    const randomZodiac = ZODIACS[Math.floor(Math.random() * ZODIACS.length)].id;
    const randomTopic = MYSTICAL_TOPICS[Math.floor(Math.random() * MYSTICAL_TOPICS.length)];
    const randomTone = TONES[Math.floor(Math.random() * TONES.length)];
    
    // Update controls to reflect random choice
    setSelectedZodiac(randomZodiac);
    setFocus(randomTopic);
    setSelectedTone(randomTone);
    
    addToQueue(randomZodiac, randomTone, randomTopic);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const removeItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setQueue(prev => {
      const newQueue = prev.filter(item => item.id !== id);
      if (activeItemId === id && newQueue.length > 0) {
        setActiveItemId(newQueue[0].id);
      } else if (newQueue.length === 0) {
        setActiveItemId(null);
      }
      return newQueue;
    });
  };

  const clearAll = () => {
    if (confirm('Con muốn xóa sạch lịch sử hàng đợi không?')) {
      setQueue([]);
      setActiveItemId(null);
    }
  };

  const activeItem = queue.find(item => item.id === activeItemId);

  return (
    <div className="h-screen flex flex-col bg-[#f3f4f6] text-slate-700 font-sans text-[12px] overflow-hidden">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-2 shrink-0 z-30 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-red-800 rounded">
            <SparklesIcon className="w-3.5 h-3.5 text-white" />
          </div>
          <h1 className="font-serif font-bold text-red-900 text-sm tracking-tight">THẦY PHÁN AI</h1>
        </div>
        <div className="flex gap-2">
           <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-full text-slate-500 font-bold hidden sm:inline-block">
             {queue.length} bản ghi
           </span>
        </div>
      </header>

      {/* 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* COL 1: List (History/Queue) - Left Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <ClockIcon className="w-3 h-3" />
              Lịch sử tạo
            </h2>
            {queue.length > 0 && (
              <button 
                onClick={clearAll}
                className="text-slate-400 hover:text-red-600 transition-colors"
                title="Xóa tất cả"
              >
                <TrashIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {queue.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-slate-300 p-4 text-center">
                <ClockIcon className="w-8 h-8 mb-2 opacity-20" />
                <p className="italic text-[10px]">Chưa có nội dung nào.</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {queue.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => setActiveItemId(item.id)}
                    className={`group relative p-3 border-b border-slate-50 cursor-pointer transition-all hover:bg-slate-50 ${
                      activeItemId === item.id 
                        ? 'bg-red-50/60 border-l-[3px] border-l-red-800' 
                        : 'border-l-[3px] border-l-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-1.5">
                         {item.status === 'pending' && <ArrowPathIcon className="w-3 h-3 text-amber-500 animate-spin" />}
                         {item.status === 'completed' && <CheckCircleIcon className="w-3 h-3 text-green-500" />}
                         {item.status === 'error' && <XMarkIcon className="w-3 h-3 text-red-500" />}
                         <span className={`text-[11px] font-bold ${activeItemId === item.id ? 'text-red-900' : 'text-slate-700'}`}>
                           Tuổi {item.zodiac}
                         </span>
                      </div>
                      <span className="text-[9px] text-slate-400">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                      {item.focus}
                    </p>
                    <button 
                      onClick={(e) => removeItem(item.id, e)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-300 hover:text-red-500 hover:bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all z-10"
                    >
                      <XMarkIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* COL 2: Main Content (Detail View) - Center */}
        <main className="flex-1 bg-[#f8f9fb] relative flex flex-col min-w-0">
          {activeItem ? (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10">
              <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px] flex flex-col">
                {/* Detail Header */}
                <div className="bg-slate-50/50 border-b border-slate-100 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="bg-red-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
                      Tuổi {activeItem.zodiac}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium px-2 py-1 border border-slate-200 rounded bg-white">
                      Giọng {activeItem.tone}
                    </span>
                  </div>
                  {activeItem.status === 'completed' && (
                    <button 
                      onClick={() => copyToClipboard(activeItem.content, activeItem.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all shadow-sm ${
                        copiedId === activeItem.id 
                        ? 'bg-green-600 text-white' 
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-red-800'
                      }`}
                    >
                      {copiedId === activeItem.id ? (
                        <>Đã sao chép</>
                      ) : (
                        <>
                          <ClipboardDocumentIcon className="w-3.5 h-3.5" />
                          Sao chép
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Detail Body */}
                <div className="p-8 flex-1">
                  {activeItem.status === 'pending' ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-4">
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-slate-100 border-t-red-800 rounded-full animate-spin"></div>
                        <SparklesIcon className="w-6 h-6 text-red-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="font-serif text-lg text-slate-700 italic">Thầy đang chấm bút...</h3>
                        <p className="text-slate-400 text-xs max-w-xs mx-auto">
                          Đang soạn thảo kịch bản cho tuổi {activeItem.zodiac} với chủ đề "{activeItem.focus.substring(0, 30)}..."
                        </p>
                      </div>
                    </div>
                  ) : activeItem.status === 'error' ? (
                    <div className="h-full flex flex-col items-center justify-center text-red-500 space-y-2">
                      <XMarkIcon className="w-10 h-10" />
                      <p className="font-medium">{activeItem.content}</p>
                    </div>
                  ) : (
                    <div className="prose prose-slate max-w-none">
                       <div className="font-serif text-[14px] leading-[2] text-slate-700 whitespace-pre-wrap selection:bg-red-100">
                         {activeItem.content}
                       </div>
                    </div>
                  )}
                </div>

                {/* Detail Footer */}
                <div className="bg-slate-50 border-t border-slate-100 p-3 flex justify-between items-center text-[10px] text-slate-400">
                   <div className="flex items-center gap-2">
                     <SpeakerWaveIcon className="w-3.5 h-3.5" />
                     <span>Audio script tối ưu ~2 phút</span>
                   </div>
                   {activeItem.status === 'completed' && (
                     <span>{activeItem.content.split(/\s+/).length} từ</span>
                   )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 p-8">
              <MusicalNoteIcon className="w-16 h-16 mb-4 opacity-10" />
              <h3 className="text-lg font-serif font-bold text-slate-400 mb-2">Chưa chọn nội dung</h3>
              <p className="text-[11px] max-w-xs text-center">
                Chọn một mục từ danh sách bên trái để xem chi tiết, hoặc tạo mới từ bảng điều khiển bên phải.
              </p>
            </div>
          )}
        </main>

        {/* COL 3: Controls - Right Sidebar */}
        <aside className="w-80 bg-white border-l border-slate-200 shrink-0 flex flex-col z-20 shadow-[-4px_0_20px_rgba(0,0,0,0.02)]">
          <div className="p-5 flex-1 overflow-y-auto">
            <div className="space-y-6">
              {/* Zodiac Selector */}
              <div>
                <span className="flex items-center gap-2 font-black text-slate-400 text-[9px] uppercase tracking-[0.2em] mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-800"></span>
                  1. Chọn tuổi
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {ZODIACS.map(z => (
                    <button
                      key={z.id}
                      onClick={() => setSelectedZodiac(z.id)}
                      className={`py-2 rounded-lg text-[11px] border transition-all font-bold shadow-sm hover:shadow-md ${
                        selectedZodiac === z.id 
                          ? 'bg-red-800 text-white border-red-800 ring-2 ring-red-100 scale-105 z-10' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-red-300 hover:bg-red-50/50'
                      }`}
                    >
                      {z.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone Selector */}
              <div>
                <span className="flex items-center gap-2 font-black text-slate-400 text-[9px] uppercase tracking-[0.2em] mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
                  2. Tông giọng
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {TONES.map(t => (
                    <button
                      key={t}
                      onClick={() => setSelectedTone(t)}
                      className={`px-3 py-2 text-[11px] rounded-lg border font-bold transition-all ${
                        selectedTone === t 
                          ? 'bg-slate-800 text-white border-slate-800 shadow-md' 
                          : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic Input */}
              <div>
                <span className="flex items-center gap-2 font-black text-slate-400 text-[9px] uppercase tracking-[0.2em] mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  3. Chủ đề
                </span>
                <div className="relative">
                  <textarea
                    value={focus}
                    onChange={e => setFocus(e.target.value)}
                    className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] outline-none focus:ring-2 focus:ring-red-100 focus:border-red-200 focus:bg-white transition-all resize-none leading-relaxed placeholder:text-slate-300 shadow-inner"
                    placeholder="Nhập yêu cầu chi tiết của con..."
                  />
                  <div className="absolute bottom-2 right-2 pointer-events-none">
                     <SparklesIcon className="w-4 h-4 text-amber-500/50" />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 space-y-3">
                <button
                  onClick={handleGenerate}
                  className="w-full py-3.5 bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-black text-white rounded-xl font-black text-xs flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] shadow-lg shadow-red-900/20 group"
                >
                  <StarIcon className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                  TẠO CONTENT
                </button>
                
                <button
                  onClick={handleRandomAndGenerate}
                  className="w-full py-3 bg-white hover:bg-amber-50 text-amber-700 border-2 border-amber-100 hover:border-amber-200 rounded-xl font-bold text-[11px] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <BoltIcon className="w-4 h-4" />
                  Ngẫu nhiên & Tạo ngay
                </button>
              </div>
            </div>

            <div className="mt-8 p-4 bg-slate-50/80 rounded-xl border border-dashed border-slate-200 text-[10px] leading-relaxed text-slate-400 italic">
              * Mẹo: Chọn "Ngẫu nhiên & Tạo ngay" để Thầy tự gieo quẻ cho một con giáp bất kỳ.
            </div>
          </div>
        </aside>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};

export default App;
