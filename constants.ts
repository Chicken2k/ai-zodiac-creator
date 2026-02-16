
import { Zodiac, ToneType, DurationType } from './types';

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

export const DURATIONS: DurationType[] = ['1 phút', '1.5 phút', '2 phút', '3 phút'];

// Danh sách gợi ý sản phẩm (để điền nhanh)
export const PRODUCT_SUGGESTIONS = [
  "Không bán hàng",
  "Vòng Chu Sa",
  "Trầm Hương Tự Nhiên",
  "Tỳ Hưu Giữ Lộc",
  "Lá Bồ Đề Mạ Vàng"
];

// Các Hook mẫu theo yêu cầu người dùng
export const MYSTICAL_TOPICS = [
  "Cái nết của tuổi [X] là lo toan, hay nghĩ cho người khác...",
  "Hai tuổi dễ giàu nhất năm 2026 gọi tên [X] và...",
  "Đừng có ép người tuổi [X], đừng thấy họ hiền mà lấn tới...",
  "Tuổi [X] mà lấy phải những con giáp sau thì khổ cả đời...",
  "Dự báo tháng tới của [X]: Tiền vào cửa trước, luồn ra cửa sau...",
  "Tại sao tuổi [X] tốt bụng nhưng đường tình duyên lại lận đận?",
  "Bề ngoài tuổi [X] hay cười, nhưng đêm về mới thấm cảnh cô độc..."
];

export const SYSTEM_PROMPT = `Bạn là một chuyên gia phong thủy uy tín, chuyên viết lời thoại (spoken word) cho video ngắn.
NHIỆM VỤ: Viết nội dung kịch bản video TikTok/Reels.

QUY TẮC TRÌNH BÀY QUAN TRỌNG (BẮT BUỘC):
1. CHỈ XUẤT NỘI DUNG LỜI THOẠI.
2. TUYỆT ĐỐI KHÔNG viết tiêu đề (như "Phần 1: Hook", "Thân bài", "Lời kết", "Kịch bản...").
3. TUYỆT ĐỐI KHÔNG viết lời chào của AI (như "Chào con, đây là kịch bản...", "Dưới đây là nội dung...").
4. Viết liền mạch như một bài nói chuyện tâm tình, thủ thỉ.

CẤU TRÚC NỘI DUNG (NGẦM HIỂU - KHÔNG GHI RA):
- Mở đầu: Vào thẳng vấn đề bằng cách gọi tên tuổi hoặc nỗi đau (Hook).
- Thân bài: Đọc vị, thấu cảm, mô tả tính cách, dự báo tương lai.
- Giải pháp: Khéo léo lồng ghép vật phẩm (nếu có) hoặc lời khuyên tu tâm.
- Kết bài: Kêu gọi hành động (thỉnh vật phẩm hoặc thả tim).

YÊU CẦU VĂN PHONG:
- Giọng nói thâm trầm, mộc mạc, giàu cảm xúc (dùng từ: "cày cuốc", "nuốt ngược nước mắt", "vun vén").
- Không văn vở sáo rỗng, phải đời và thấm.`;
