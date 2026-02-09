
import { Zodiac, ToneType } from './types';

export const ZODIACS: { id: Zodiac; label: string; image: string }[] = [
  { id: 'Tý', label: 'Tuổi Tý', image: 'https://picsum.photos/seed/rat/200' },
  { id: 'Sửu', label: 'Tuổi Sửu', image: 'https://picsum.photos/seed/ox/200' },
  { id: 'Dần', label: 'Tuổi Dần', image: 'https://picsum.photos/seed/tiger/200' },
  { id: 'Mão', label: 'Tuổi Mão', image: 'https://picsum.photos/seed/cat/200' },
  { id: 'Thìn', label: 'Tuổi Thìn', image: 'https://picsum.photos/seed/dragon/200' },
  { id: 'Tỵ', label: 'Tuổi Tỵ', image: 'https://picsum.photos/seed/snake/200' },
  { id: 'Ngọ', label: 'Tuổi Ngọ', image: 'https://picsum.photos/seed/horse/200' },
  { id: 'Mùi', label: 'Tuổi Mùi', image: 'https://picsum.photos/seed/goat/200' },
  { id: 'Thân', label: 'Tuổi Thân', image: 'https://picsum.photos/seed/monkey/200' },
  { id: 'Dậu', label: 'Tuổi Dậu', image: 'https://picsum.photos/seed/rooster/200' },
  { id: 'Tuất', label: 'Tuổi Tuất', image: 'https://picsum.photos/seed/dog/200' },
  { id: 'Hợi', label: 'Tuổi Hợi', image: 'https://picsum.photos/seed/pig/200' },
];

export const TONES: ToneType[] = ['Thấu Hiểu', 'Cảnh Báo', 'Động Viên', 'Hào Hùng'];

export const MYSTICAL_TOPICS = [
  "Cái nết lo toan, vun vén, tự làm khổ mình vì lo cho người khác quá nhiều",
  "Nỗi khổ khi mạnh mẽ bên ngoài nhưng cô độc bên trong, không ai thấu hiểu",
  "Sướng trước khổ sau hay khổ trước sướng sau: Quy luật bù trừ của nhân thế",
  "Sự vất vả gánh vác gia đình, làm ra mười lo cho người hết chín, không dám hưởng thụ",
  "Tại sao lòng tốt của con thường bị lợi dụng, sống hết mình nhưng nhận lại sự thờ ơ",
  "Vận trình năm 2026: Vận tiền xoay mạnh, những cảnh báo quan trọng để giữ lại phúc đức",
  "Lý do làm lụng vất vả cả đời mà tiền bạc vẫn thất thoát, 'tiền vào cửa trước ra cửa sau'",
  "Sự thay đổi vận mệnh khi tâm an, bớt cả nể và bắt đầu biết yêu thương bản thân mình"
];

export const SYSTEM_PROMPT = `Bạn là một chuyên gia phong thủy, một người thầy (xưng "Thầy", gọi người đọc là "con"). 
NHIỆM VỤ: Viết kịch bản AUDIO dài khoảng 2 phút (khoảng 350-450 từ) về tử vi và nhân tâm (khổ, sướng, vận hạn).

PHONG CÁCH BẮT BUỘC:
1. GỢI Ý NHẠC NỀN: Bắt đầu bài viết bằng một dòng gợi ý nhạc nền trong ngoặc đơn, ví dụ: "(Nhạc nền: Tiếng đàn tranh hoặc sáo trúc trầm buồn, da diết, tạo cảm giác tĩnh lặng và suy tư)".
2. NGÔN NGỮ TÂM TÌNH: Văn phong nói, thong thả, thấm thía. Dùng từ mộc mạc: "vun vén", "chịu thương chịu khó", "lo đủ thứ", "nuốt vào lòng", "cày cuốc", "gánh vác như con tằm nhả tơ", "nước mắt chảy ngược".
3. CẤU TRÚC KỊCH BẢN (DÀI 2 PHÚT):
   - Mở đầu: Nói về bản tính "cái nết" và những nỗi vất vả thầm kín của con giáp đó. 
   - Giữa bài: Kêu gọi tương tác: "Nếu con là tuổi [Con giáp] đang nghe tới đây, thả nhẹ một cái tim và bình luận 'con tuổi [Con giáp]' để thầy biết con đang nghe nhé."
   - Nội dung chính: Phân tích sâu về sự "Khổ" (hy sinh, vất vả) và "Sướng" (phúc đức, hậu vận).
   - Kết bài: Dự báo năm 2026 và lời dặn tâm huyết về việc giữ tâm an.
4. KHÔNG quảng cáo sản phẩm, không gạch đầu dòng. Kịch bản phải liên tục, giàu cảm xúc.`;
