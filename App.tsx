
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ZODIACS, TONES, MYSTICAL_TOPICS, PRODUCT_SUGGESTIONS, DURATIONS } from './constants';
import { Zodiac, ToneType, ProductType, DurationType } from './types';
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
  StopCircleIcon,
  ShoppingBagIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  DocumentTextIcon,
  SwatchIcon
} from '@heroicons/react/24/outline';

interface QueueItem {
  id: string;
  zodiac: Zodiac;
  tone: ToneType;
  duration: DurationType;
  product: ProductType;
  focus: string;
  content: string;
  status: 'pending' | 'completed' | 'error';
  timestamp: number;
}

const App: React.FC = () => {
  const [selectedZodiac, setSelectedZodiac] = useState<Zodiac>('Sửu');
  const [selectedTone, setSelectedTone] = useState<ToneType>('Thấu Hiểu');
  const [selectedDuration, setSelectedDuration] = useState<DurationType>('1.5 phút');
  const [productInput, setProductInput] = useState<string>('Vòng Chu Sa');
  const [focus, setFocus] = useState<string>('');
  
  // State mới: Tùy chọn dùng random template
  const [useRandomTemplate, setUseRandomTemplate] = useState<boolean>(false);
  
  const [queue, setQueue] = useState<QueueItem[]>([]);
  // Thêm state để kiểm soát trạng thái xử lý tuần tự
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // State quản lý danh sách chủ đề (Template)
  const [currentTopics, setCurrentTopics] = useState<string[]>(MYSTICAL_TOPICS);

  // Ref
  const abortControllers = useRef<Record<string, AbortController>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load danh sách Template từ LocalStorage khi khởi động
  useEffect(() => {
    const savedTopics = localStorage.getItem('zodiac_custom_topics');
    if (savedTopics) {
      try {
        const parsed = JSON.parse(savedTopics);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCurrentTopics(parsed);
        }
      } catch (e) {
        console.error("Lỗi đọc template cũ", e);
      }
    }
  }, []);

  // Tự động điền chủ đề mặc định đầu tiên nếu chưa có
  useEffect(() => {
    if (!focus && currentTopics.length > 0) {
        fillTopicWithZodiac(currentTopics[0], 'Sửu', 'Vòng Chu Sa');
    }
  }, [currentTopics]);

  // Load Queue từ LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('zodiac_queue_v7');
    if (saved) {
      const parsedQueue = JSON.parse(saved);
      // Khi load lại trang, reset các trạng thái 'pending' cũ thành 'error' để tránh treo
      const cleanedQueue = parsedQueue.map((item: QueueItem) => 
        item.status === 'pending' ? { ...item, status: 'error', content: 'Đã bị hủy do tải lại trang.' } : item
      );
      setQueue(cleanedQueue);
      if (cleanedQueue.length > 0) {
        setActiveItemId(cleanedQueue[0].id);
      }
    }
  }, []);

  // Save Queue vào LocalStorage
  useEffect(() => {
    localStorage.setItem('zodiac_queue_v7', JSON.stringify(queue));
  }, [queue]);

  // --- TRÌNH XỬ LÝ HÀNG ĐỢI TUẦN TỰ (QUEUE PROCESSOR) ---
  useEffect(() => {
    // Nếu đang xử lý một item khác, thì bỏ qua
    if (isProcessing) return;

    // Tìm item tiếp theo đang ở trạng thái 'pending'
    // Lưu ý: queue được sắp xếp Mới nhất -> Cũ nhất.
    // Lấy item đầu tiên tìm thấy (tức là item mới nhất vừa được add) để xử lý ngay cho user thấy phản hồi.
    const nextItem = queue.find(item => item.status === 'pending');

    if (nextItem) {
      processQueueItem(nextItem);
    }
  }, [queue, isProcessing]);

  const processQueueItem = async (item: QueueItem) => {
    setIsProcessing(true);
    
    // Tạo Controller hủy mới cho request này
    const controller = new AbortController();
    abortControllers.current[item.id] = controller;

    try {
      // Gọi API
      const content = await generateZodiacContent({ 
        zodiac: item.zodiac, 
        tone: item.tone, 
        duration: item.duration, 
        product: item.product, 
        focus: item.focus 
      });
      
      // Nếu chưa bị hủy bởi người dùng
      if (!controller.signal.aborted) {
        setQueue(prev => prev.map(qItem => 
          qItem.id === item.id 
            ? { ...qItem, content, status: 'completed' } 
            : qItem
        ));
      }
    } catch (error: any) {
      if (!controller.signal.aborted) {
        setQueue(prev => prev.map(qItem => 
          qItem.id === item.id 
            ? { ...qItem, status: 'error', content: typeof error === 'string' ? error : 'Lỗi kết nối thiên cơ hoặc đã dừng.' } 
            : qItem
        ));
      }
    } finally {
      // Dọn dẹp và đánh dấu đã xử lý xong để useEffect kích hoạt item tiếp theo
      delete abortControllers.current[item.id];
      setIsProcessing(false);
    }
  };

  const fillTopicWithZodiac = (topicTemplate: string, zodiac: string, product: string) => {
    let filledTopic = topicTemplate.replace(/\[X\]/g, zodiac);
    filledTopic = filledTopic.replace(/\[Product\]/g, product);
    setFocus(filledTopic);
    return filledTopic;
  };

  const handleZodiacChange = (zodiac: Zodiac) => {
    setSelectedZodiac(zodiac);
  };

  // Chỉ thêm vào hàng đợi, không gọi API ngay
  const addToQueue = useCallback((zodiac: Zodiac, tone: ToneType, duration: DurationType, product: string, topic: string) => {
    const newItem: QueueItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      zodiac,
      tone,
      duration,
      product,
      focus: topic, // Đây chính là câu Hook/Topic cụ thể
      content: '',
      status: 'pending',
      timestamp: Date.now(),
    };

    setQueue(prev => [newItem, ...prev]);
    setActiveItemId(newItem.id);
  }, []);

  const stopGeneration = (id: string) => {
    // Abort request đang chạy
    const controller = abortControllers.current[id];
    if (controller) {
      controller.abort();
      delete abortControllers.current[id];
    }
    
    // Cập nhật trạng thái ngay lập tức
    setQueue(prev => prev.map(item => 
      item.id === id 
        ? { ...item, status: 'error', content: 'Đã dừng quá trình luận giải theo ý con.' } 
        : item
    ));
  };

  // Logic tạo kịch bản đã cập nhật
  const handleGenerate = () => {
    let finalTopic = focus;

    // Nếu người dùng chọn "Dùng ngẫu nhiên mẫu"
    if (useRandomTemplate && currentTopics.length > 0) {
        // Chọn ngẫu nhiên 1 template từ danh sách
        const randomTemplate = currentTopics[Math.floor(Math.random() * currentTopics.length)];
        // Điền dữ liệu vào template và cập nhật UI
        finalTopic = fillTopicWithZodiac(randomTemplate, selectedZodiac, productInput);
    }

    addToQueue(selectedZodiac, selectedTone, selectedDuration, productInput, finalTopic);
  };

  const handleRandomAndGenerate = () => {
    const randomZodiac = ZODIACS[Math.floor(Math.random() * ZODIACS.length)].id;
    const randomTopicTemplate = currentTopics[Math.floor(Math.random() * currentTopics.length)];
    const currentProduct = productInput; 
    
    let filledTopic = randomTopicTemplate.replace(/\[X\]/g, randomZodiac);
    filledTopic = filledTopic.replace(/\[Product\]/g, currentProduct);

    setSelectedZodiac(randomZodiac);
    setFocus(filledTopic);
    
    addToQueue(randomZodiac, selectedTone, selectedDuration, currentProduct, filledTopic);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const removeItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (abortControllers.current[id]) {
      abortControllers.current[id].abort();
      delete abortControllers.current[id];
    }
    const newQueue = queue.filter(item => item.id !== id);
    setQueue(newQueue);
    if (activeItemId === id) {
      setActiveItemId(newQueue.length > 0 ? newQueue[0].id : null);
    }
  };

  const clearAll = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (window.confirm('Con muốn xóa sạch lịch sử hàng đợi không?')) {
      Object.values(abortControllers.current).forEach((controller: AbortController) => controller.abort());
      abortControllers.current = {};
      setQueue([]);
      setActiveItemId(null);
      localStorage.setItem('zodiac_queue_v7', JSON.stringify([]));
    }
  };

  // --- TÍNH NĂNG TEMPLATE ---
  const handleDownloadTemplate = () => {
    const sampleData = [
      "Câu hook mẫu số 1 cho tuổi [X]...",
      "Câu hook mẫu số 2 về tình duyên tuổi [X]...",
      "Sự thật về tính cách tuổi [X]..."
    ];
    const blob = new Blob([JSON.stringify(sampleData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Mau_Kich_Ban_12_Con_Giap.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportTemplate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result;
        if (typeof result === 'string') {
          const parsed = JSON.parse(result);
          if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
            setCurrentTopics(parsed);
            localStorage.setItem('zodiac_custom_topics', JSON.stringify(parsed));
            alert(`Đã nhập thành công ${parsed.length} kịch bản mẫu mới!`);
            if (fileInputRef.current) fileInputRef.current.value = '';
            // Tự động bật chế độ random khi import file mới
            setUseRandomTemplate(true);
          } else {
            alert('File không đúng định dạng. Vui lòng tải file mẫu để xem cấu trúc chuẩn.');
          }
        }
      } catch (error) {
        console.error(error);
        alert('Lỗi đọc file. Vui lòng đảm bảo là file JSON hợp lệ.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetTemplate = () => {
    if (confirm('Khôi phục về danh sách mẫu câu mặc định?')) {
      setCurrentTopics(MYSTICAL_TOPICS);
      localStorage.removeItem('zodiac_custom_topics');
      setUseRandomTemplate(false);
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
        
        {/* COL 1: List (History/Queue) */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <ClockIcon className="w-3 h-3" />
              Lịch sử / Hàng đợi
            </h2>
            {queue.length > 0 && (
              <button 
                type="button"
                onClick={clearAll}
                className="text-slate-400 hover:text-red-600 transition-colors p-1.5 rounded-full hover:bg-red-50"
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
                    onClick={() => {
                      setActiveItemId(item.id);
                      setSelectedZodiac(item.zodiac);
                      setSelectedTone(item.tone);
                      setSelectedDuration(item.duration || '1.5 phút'); 
                      setProductInput(item.product);
                      setFocus(item.focus);
                    }}
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
                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed pr-4 mb-1">
                      {item.focus.length > 60 ? item.focus.substring(0, 60) + "..." : item.focus}
                    </p>
                    {item.product && item.product !== 'Không bán hàng' && (
                       <span className="inline-block text-[9px] px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded truncate max-w-full">
                         {item.product}
                       </span>
                    )}
                    <button 
                      onClick={(e) => removeItem(item.id, e)}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white rounded-full shadow-sm transition-all z-10 ${
                        activeItemId === item.id 
                          ? 'text-red-400 opacity-100' 
                          : 'text-slate-300 opacity-0 group-hover:opacity-100 hover:text-red-500'
                      }`}
                      title="Xóa"
                    >
                      <XMarkIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* COL 2: Main Content (Detail View) */}
        <main className="flex-1 bg-[#f8f9fb] relative flex flex-col min-w-0">
          {activeItem ? (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10">
              <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px] flex flex-col">
                {/* Detail Header */}
                <div className="bg-slate-50/50 border-b border-slate-100 p-4 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-red-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
                        Tuổi {activeItem.zodiac}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium px-2 py-1 border border-slate-200 rounded bg-white">
                        Giọng {activeItem.tone}
                      </span>
                      {activeItem.duration && (
                        <span className="text-[10px] text-slate-400 font-medium px-2 py-1 border border-slate-200 rounded bg-white">
                          {activeItem.duration}
                        </span>
                      )}
                    </div>
                    {activeItem.product && activeItem.product !== 'Không bán hàng' && (
                      <div className="flex items-center gap-1 text-[10px] text-amber-700 font-medium">
                        <ShoppingBagIcon className="w-3 h-3" />
                        Sản phẩm: {activeItem.product}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {activeItem.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        {isProcessing && queue.find(i => i.status === 'pending')?.id === activeItem.id ? (
                           <span className="text-[10px] text-amber-600 font-bold animate-pulse">Đang viết...</span>
                        ) : (
                           <span className="text-[10px] text-slate-400 italic">Đang chờ lượt...</span>
                        )}
                        <button 
                          onClick={() => stopGeneration(activeItem.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-white border border-red-200 text-red-600 hover:bg-red-50 transition-all shadow-sm"
                        >
                          <StopCircleIcon className="w-3.5 h-3.5" />
                          Hủy
                        </button>
                      </div>
                    )}
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
                </div>

                {/* Detail Body */}
                <div className="p-8 flex-1">
                  {activeItem.status === 'pending' ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-6">
                      <div className="relative">
                        {isProcessing && queue.find(i => i.status === 'pending')?.id === activeItem.id ? (
                          <>
                             <div className="w-16 h-16 border-4 border-slate-100 border-t-red-800 rounded-full animate-spin"></div>
                             <SparklesIcon className="w-6 h-6 text-red-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                          </>
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                             <ClockIcon className="w-8 h-8 text-slate-300" />
                          </div>
                        )}
                      </div>
                      <div className="text-center space-y-2">
                        {isProcessing && queue.find(i => i.status === 'pending')?.id === activeItem.id ? (
                          <>
                            <h3 className="font-serif text-lg text-slate-700 italic">Thầy đang chấm bút...</h3>
                            <p className="text-slate-400 text-xs max-w-xs mx-auto">
                              Đang luận giải cho tuổi {activeItem.zodiac} với chủ đề:<br/>
                              <span className="font-semibold text-slate-600">"{activeItem.focus.length > 50 ? activeItem.focus.substring(0,50) + '...' : activeItem.focus}"</span>
                            </p>
                          </>
                        ) : (
                          <>
                             <h3 className="font-serif text-lg text-slate-500">Đang xếp hàng chờ...</h3>
                             <p className="text-slate-400 text-xs max-w-xs mx-auto">
                               Hệ thống đang xử lý các yêu cầu trước đó. Vui lòng đợi trong giây lát.
                             </p>
                          </>
                        )}
                      </div>
                    </div>
                  ) : activeItem.status === 'error' ? (
                    <div className="h-full flex flex-col items-center justify-center text-red-500 space-y-2">
                      <XMarkIcon className="w-10 h-10" />
                      <p className="font-medium text-center px-4">{activeItem.content}</p>
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
                     <span>Audio script tối ưu Video Ngắn</span>
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
              {/* Template Management */}
              <div className="bg-slate-50 p-3 rounded-xl border border-dashed border-slate-300">
                 <div className="flex justify-between items-center mb-2">
                   <span className="flex items-center gap-2 font-black text-slate-400 text-[9px] uppercase tracking-[0.2em]">
                      <DocumentTextIcon className="w-3 h-3" />
                      File Kịch Bản Mẫu
                    </span>
                    {currentTopics.length !== MYSTICAL_TOPICS.length && (
                      <button onClick={handleResetTemplate} className="text-[9px] text-red-500 hover:underline">
                        Reset
                      </button>
                    )}
                 </div>
                 
                 <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={handleDownloadTemplate}
                      className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white border border-slate-200 rounded-lg text-[10px] text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all font-medium"
                    >
                      <ArrowDownTrayIcon className="w-3.5 h-3.5" />
                      Tải mẫu
                    </button>
                    
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white border border-slate-200 rounded-lg text-[10px] text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all font-medium"
                    >
                      <ArrowUpTrayIcon className="w-3.5 h-3.5" />
                      Nhập file
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleImportTemplate}
                      className="hidden" 
                      accept=".json"
                    />
                 </div>
                 <div className="mt-1.5 text-[9px] text-slate-400 text-center italic">
                   Đang dùng: {currentTopics.length} kịch bản
                 </div>
              </div>

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
                      onClick={() => handleZodiacChange(z.id)}
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

              {/* Duration Selector */}
              <div>
                <span className="flex items-center gap-2 font-black text-slate-400 text-[9px] uppercase tracking-[0.2em] mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  3. Thời lượng
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {DURATIONS.map(d => (
                    <button
                      key={d}
                      onClick={() => setSelectedDuration(d)}
                      className={`px-2 py-2 text-[11px] rounded-lg border font-bold transition-all ${
                        selectedDuration === d 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                          : 'bg-white text-slate-500 border-slate-200 hover:bg-blue-50 hover:border-blue-200'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic Input with Hooks */}
              <div>
                <span className="flex items-center gap-2 font-black text-slate-400 text-[9px] uppercase tracking-[0.2em] mb-3 mt-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  4. Nội dung mẫu / Kịch bản
                </span>
                
                {/* Hook suggestions from currentTopics */}
                <div className="mb-2 flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
                   {currentTopics.map((topic, index) => (
                     <button
                        key={index}
                        onClick={() => {
                          fillTopicWithZodiac(topic, selectedZodiac, productInput);
                          setUseRandomTemplate(false); // Khi user chọn thủ công thì tắt chế độ random
                        }}
                        className="shrink-0 max-w-[180px] bg-amber-50 text-amber-800 text-[9px] px-2 py-1.5 rounded-md border border-amber-100 hover:bg-amber-100 hover:border-amber-200 truncate transition-colors text-left"
                        title={topic}
                     >
                       {topic.length > 50 ? topic.substring(0, 50) + "..." : topic.replace('[X]', selectedZodiac)}
                     </button>
                   ))}
                </div>

                <div className="relative">
                  <textarea
                    value={focus}
                    onChange={e => {
                      setFocus(e.target.value);
                      setUseRandomTemplate(false); // Nếu user tự sửa thì tắt random
                    }}
                    readOnly={useRandomTemplate}
                    className={`w-full h-48 p-3 border rounded-xl text-[11px] outline-none transition-all leading-relaxed placeholder:text-slate-300 shadow-inner custom-scrollbar ${
                      useRandomTemplate 
                        ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-default' 
                        : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-red-100 focus:border-red-200 focus:bg-white'
                    }`}
                    placeholder="Nhập kịch bản mẫu hoặc yêu cầu chi tiết..."
                  />
                  {useRandomTemplate && (
                     <div className="absolute top-2 right-2 flex gap-1 items-center pointer-events-none">
                       <span className="bg-red-100 text-red-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-red-200">
                         Tự động chọn
                       </span>
                     </div>
                  )}
                  <div className="absolute bottom-2 right-2 pointer-events-none">
                     <SparklesIcon className="w-4 h-4 text-amber-500/50" />
                  </div>
                </div>
              </div>

              {/* Product Input */}
              <div>
                <span className="flex items-center gap-2 font-black text-slate-400 text-[9px] uppercase tracking-[0.2em] mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  5. Vật phẩm (Nhập tên)
                </span>
                
                <input
                  type="text"
                  value={productInput}
                  onChange={(e) => setProductInput(e.target.value)}
                  placeholder="Ví dụ: Vòng tay trầm hương..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-200 transition-all shadow-inner font-medium text-emerald-800"
                />

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {PRODUCT_SUGGESTIONS.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => setProductInput(p)}
                      className={`text-[9px] px-2 py-1 rounded border transition-colors ${
                        productInput === p 
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-800' 
                          : 'bg-white border-slate-200 text-slate-500 hover:border-emerald-200 hover:text-emerald-700'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 space-y-3 pb-6">
                
                {/* Checkbox Random Template */}
                <div className="flex items-center gap-2 px-1">
                  <input 
                    type="checkbox" 
                    id="chkRandom"
                    checked={useRandomTemplate}
                    onChange={(e) => setUseRandomTemplate(e.target.checked)}
                    className="w-3.5 h-3.5 text-red-800 rounded border-slate-300 focus:ring-red-800 cursor-pointer"
                  />
                  <label htmlFor="chkRandom" className="text-[10px] font-bold text-slate-600 cursor-pointer select-none">
                    Dùng ngẫu nhiên mẫu từ danh sách
                  </label>
                </div>

                <button
                  onClick={handleGenerate}
                  className="w-full py-3.5 bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-black text-white rounded-xl font-black text-xs flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] shadow-lg shadow-red-900/20 group"
                >
                  <StarIcon className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                  TẠO KỊCH BẢN
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
          </div>
        </aside>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        
        /* Hide scrollbar for horizontal scroll area but keep functionality */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default App;
