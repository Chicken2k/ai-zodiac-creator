
export type Zodiac = 
  | 'Tý' | 'Sửu' | 'Dần' | 'Mão' | 'Thìn' | 'Tỵ' 
  | 'Ngọ' | 'Mùi' | 'Thân' | 'Dậu' | 'Tuất' | 'Hợi';

export type ToneType = 'Thấu Hiểu' | 'Cảnh Báo' | 'Động Viên' | 'Hào Hùng';

export interface ContentRequest {
  zodiac: Zodiac;
  tone: ToneType;
  focus: string;
  year?: string;
}

export interface HistoryItem {
  id: string;
  zodiac: Zodiac;
  content: string;
  timestamp: number;
}
