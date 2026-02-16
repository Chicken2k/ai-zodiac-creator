
export type Zodiac = 
  | 'Tý' | 'Sửu' | 'Dần' | 'Mão' | 'Thìn' | 'Tỵ' 
  | 'Ngọ' | 'Mùi' | 'Thân' | 'Dậu' | 'Tuất' | 'Hợi';

export type ToneType = 'Thấu Hiểu' | 'Cảnh Báo' | 'Động Viên' | 'Hào Hùng';

export type DurationType = '1 phút' | '1.5 phút' | '2 phút' | '3 phút';

// Đổi thành string để nhập thoải mái
export type ProductType = string; 

export interface ContentRequest {
  zodiac: Zodiac;
  tone: ToneType;
  duration: DurationType;
  focus: string;
  product: string;
  year?: string;
}

export interface HistoryItem {
  id: string;
  zodiac: Zodiac;
  content: string;
  timestamp: number;
}
