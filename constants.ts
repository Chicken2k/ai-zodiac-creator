import { Zodiac, ToneType, DurationType } from "./types";

export const ZODIACS: { id: Zodiac; label: string; image: string }[] = [
  { id: "Tý", label: "Tuổi Tý", image: "https://picsum.photos/seed/rat/200" },
  { id: "Sửu", label: "Tuổi Sửu", image: "https://picsum.photos/seed/ox/200" },
  {
    id: "Dần",
    label: "Tuổi Dần",
    image: "https://picsum.photos/seed/tiger/200",
  },
  { id: "Mão", label: "Tuổi Mão", image: "https://picsum.photos/seed/cat/200" },
  {
    id: "Thìn",
    label: "Tuổi Thìn",
    image: "https://picsum.photos/seed/dragon/200",
  },
  { id: "Tỵ", label: "Tuổi Tỵ", image: "https://picsum.photos/seed/snake/200" },
  {
    id: "Ngọ",
    label: "Tuổi Ngọ",
    image: "https://picsum.photos/seed/horse/200",
  },
  {
    id: "Mùi",
    label: "Tuổi Mùi",
    image: "https://picsum.photos/seed/goat/200",
  },
  {
    id: "Thân",
    label: "Tuổi Thân",
    image: "https://picsum.photos/seed/monkey/200",
  },
  {
    id: "Dậu",
    label: "Tuổi Dậu",
    image: "https://picsum.photos/seed/rooster/200",
  },
  {
    id: "Tuất",
    label: "Tuổi Tuất",
    image: "https://picsum.photos/seed/dog/200",
  },
  { id: "Hợi", label: "Tuổi Hợi", image: "https://picsum.photos/seed/pig/200" },
];

export const TONES: ToneType[] = [
  "Thấu Hiểu",
  "Cảnh Báo",
  "Động Viên",
  "Hào Hùng",
];

export const DURATIONS: DurationType[] = [
  "1 phút",
  "1.5 phút",
  "2 phút",
  "3 phút",
];

// Danh sách gợi ý sản phẩm (để điền nhanh)
export const PRODUCT_SUGGESTIONS = [
  "Không bán hàng",
  "Vòng Chu Sa",
  "Trầm Hương Tự Nhiên",
  "Tỳ Hưu Giữ Lộc",
  "Lá Bồ Đề Mạ Vàng",
];

interface ZodiacTemplateProfile {
  ally1: Zodiac;
  ally2: Zodiac;
  rival1: Zodiac;
  rival2: Zodiac;
  rival3: Zodiac;
  trait: string;
  pain: string;
  love: string;
  money: string;
  signal: string;
  caution: string;
  commentCta: string;
}

export const ZODIAC_TEMPLATE_PROFILES: Record<Zodiac, ZodiacTemplateProfile> = {
  Tý: {
    ally1: "Thìn",
    ally2: "Thân",
    rival1: "Ngọ",
    rival2: "Mùi",
    rival3: "Dậu",
    trait: "lanh trí, phản xạ nhanh và rất biết tính đường dài",
    pain: "làm nhiều nhưng dễ hao vì ôm việc và lo cho người khác trước",
    love: "thương sâu nhưng khi thấy không được tôn trọng thì rút rất gọn",
    money: "tiền có cửa vào đều, chỉ cần giữ nhịp và tránh quyết định vội",
    signal: "quý nhân cũ quay lại, việc dang dở có dấu hiệu thông",
    caution: "đừng kể hết kế hoạch cho người ngoài kẻo tán lộc",
    commentCta: "comment “con tuổi Tý” để thầy xem vận chi tiết cho con",
  },
  Sửu: {
    ally1: "Tỵ",
    ally2: "Dậu",
    rival1: "Mùi",
    rival2: "Thìn",
    rival3: "Tuất",
    trait: "chịu thương chịu khó, làm chắc và cực kỳ có trách nhiệm",
    pain: "hay tự gánh hết nên thân mệt mà tâm cũng nặng",
    love: "đã chọn ai là muốn đi đường dài, ít nói nhưng làm thật",
    money: "tiền đến từ công sức bền bỉ, hợp tích lũy chắc hơn ăn nhanh",
    signal: "đường công việc ổn dần, cơ hội tăng thu nhập rõ hơn trước",
    caution: "tránh ôm trách nhiệm không thuộc phần mình",
    commentCta: "comment “con tuổi Sửu” để thầy chỉ điểm giữ lộc",
  },
  Dần: {
    ally1: "Ngọ",
    ally2: "Tuất",
    rival1: "Thân",
    rival2: "Tỵ",
    rival3: "Hợi",
    trait: "mạnh mẽ, dám gánh và không ngại đi đường khó",
    pain: "thương thật quá nên dễ tổn thương khi gặp sai duyên",
    love: "yêu hết lòng nhưng cần người đủ vững để đi cùng lâu dài",
    money: "hợp bứt phá khi dám tập trung một hướng thay vì ôm nhiều việc",
    signal: "vận bật lên khi con quyết dứt các mối kéo năng lượng",
    caution: "đừng nóng giận mà chốt quyết định tài chính",
    commentCta: "comment “con tuổi Dần” để thầy gỡ phần duyên cho con",
  },
  Mão: {
    ally1: "Hợi",
    ally2: "Mùi",
    rival1: "Dậu",
    rival2: "Tý",
    rival3: "Ngọ",
    trait: "tinh tế, sống tình cảm và biết giữ hòa khí",
    pain: "dễ nhẫn nhịn quá mức nên bị dồn phần thiệt về mình",
    love: "cần cảm giác an toàn và sự thấu hiểu ổn định lâu dài",
    money: "tiền tăng chậm nhưng chắc nếu con giữ kỷ luật chi tiêu",
    signal: "việc tưởng chậm bắt đầu có tiến triển rõ ràng hơn",
    caution: "đừng để cảm xúc kéo con vào quyết định thiếu tỉnh táo",
    commentCta: "comment “con tuổi Mão” để thầy xem kỹ đường nhà cửa",
  },
  Thìn: {
    ally1: "Tý",
    ally2: "Thân",
    rival1: "Tuất",
    rival2: "Sửu",
    rival3: "Mùi",
    trait: "trầm nhưng rất bản lĩnh, nhìn xa và giữ cục diện tốt",
    pain: "thường bị ép gánh việc vì ai cũng mặc định con chịu được",
    love: "chân thành nhưng cần sự tôn trọng ranh giới rõ ràng",
    money: "hợp làm lớn nếu con biết giữ nhịp và không tản lực",
    signal: "đầu óc sáng hơn, dễ gặp người hỗ trợ đúng lúc",
    caution: "đừng im lặng quá lâu trước những chuyện bất công",
    commentCta: "comment “con tuổi Thìn” để thầy xem điểm bứt vận",
  },
  Tỵ: {
    ally1: "Sửu",
    ally2: "Dậu",
    rival1: "Hợi",
    rival2: "Dần",
    rival3: "Thân",
    trait: "sắc sảo, sâu sắc và rất giỏi quan sát",
    pain: "nghĩ nhiều trong đầu nên dễ tự tạo áp lực",
    love: "đã thương là giữ, điềm nhưng rất nghiêm túc chuyện lâu dài",
    money: "hợp tích lũy và ra quyết định tài chính theo kế hoạch",
    signal: "có cửa gặp quý nhân công việc và mở thêm nguồn thu",
    caution: "tránh đa nghi quá mức khiến mất cơ hội đẹp",
    commentCta: "comment “con tuổi Tỵ” để thầy soi kỹ vận tiền",
  },
  Ngọ: {
    ally1: "Dần",
    ally2: "Tuất",
    rival1: "Tý",
    rival2: "Sửu",
    rival3: "Mão",
    trait: "nhiệt huyết, bản lĩnh và thích tự do bứt phá",
    pain: "dễ hao lực vì nóng ruột và ôm quá nhiều cảm xúc",
    love: "yêu hết mình, không hợp mối quan hệ nửa vời",
    money: "tiền đến nhanh khi con giữ được kỷ luật và sự kiên nhẫn",
    signal: "vận đi xa, mở việc mới và có lộc bất ngờ",
    caution: "đừng ký vội khi tâm đang nóng",
    commentCta: "comment “con tuổi Ngọ” để thầy chốt nhịp mở vận",
  },
  Mùi: {
    ally1: "Mão",
    ally2: "Hợi",
    rival1: "Sửu",
    rival2: "Tý",
    rival3: "Tuất",
    trait: "nhẹ nhàng, giàu tình cảm và sống rất vì gia đình",
    pain: "hay cả nể nên cho đi quá nhiều mà quên giữ mình",
    love: "cần người ấm áp, biết lắng nghe và trân trọng cảm xúc",
    money: "hợp kiểu gom chậm mà chắc, càng ổn tâm càng giữ được lộc",
    signal: "tiền có dấu hiệu đỡ thất thoát, dễ dư dần theo tháng",
    caution: "đừng gánh thay chuyện mà người khác phải tự chịu",
    commentCta: "comment “con tuổi Mùi” để thầy chỉ điểm giữ vía",
  },
  Thân: {
    ally1: "Tý",
    ally2: "Thìn",
    rival1: "Dần",
    rival2: "Hợi",
    rival3: "Tỵ",
    trait: "nhanh trí, tháo vát và xoay tình huống rất tốt",
    pain: "vì quá giỏi xoay xở nên ai cũng đẩy việc về cho con",
    love: "thích người đồng điệu và nói chuyện thẳng thắn",
    money: "hợp kiếm tiền đa nguồn nhưng cần điểm dừng để giữ lộc",
    signal: "cơ hội công việc đến nhanh, đặc biệt qua người quen cũ",
    caution: "tránh ôm quá nhiều kế hoạch cùng lúc",
    commentCta: "comment “con tuổi Thân” để thầy xem nhịp tài lộc",
  },
  Dậu: {
    ally1: "Sửu",
    ally2: "Tỵ",
    rival1: "Mão",
    rival2: "Tý",
    rival3: "Ngọ",
    trait: "kỹ lưỡng, cầu toàn và rất biết vun vén",
    pain: "làm nhiều mà ít được ghi nhận nên dễ tủi thân",
    love: "yêu nghiêm túc, cần sự rõ ràng và nhất quán",
    money: "hợp giữ tiền và tạo nền tài chính ổn định",
    signal: "vận công việc rõ ràng hơn, dễ có khoản thưởng/khoản thêm",
    caution: "đừng soi quá kỹ khiến mối quan hệ bị căng",
    commentCta: "comment “con tuổi Dậu” để thầy xem điểm tụ tài",
  },
  Tuất: {
    ally1: "Dần",
    ally2: "Ngọ",
    rival1: "Thìn",
    rival2: "Sửu",
    rival3: "Mùi",
    trait: "thẳng tính, trọng nghĩa và rất biết bảo vệ người mình thương",
    pain: "thấy bất công là đứng ra nên dễ mệt vì gánh thay người khác",
    love: "sống bền, cần sự tin cậy hơn lời nói hoa mỹ",
    money: "hợp làm bền và tích đều, tránh đầu tư theo cảm xúc",
    signal: "có dấu hiệu gỡ được khoản nợ hoặc áp lực cũ",
    caution: "đừng cả nể chuyện vay mượn khi chưa rõ ràng",
    commentCta: "comment “con tuổi Tuất” để thầy luận đúng phần cần gỡ",
  },
  Hợi: {
    ally1: "Mão",
    ally2: "Mùi",
    rival1: "Tỵ",
    rival2: "Dần",
    rival3: "Thân",
    trait: "hiền lành, tình cảm và có lòng bao dung lớn",
    pain: "thường nhẫn quá lâu nên tự dồn mình vào mệt mỏi",
    love: "đã thương là thương sâu, cần người biết che chở và đồng hành",
    money: "có phúc tài nhưng phải giữ nhịp chi tiêu để tránh hao",
    signal: "vận nhà cửa và gia đình có dấu hiệu sáng lên",
    caution: "đừng im lặng mãi trước điều làm con tổn thương",
    commentCta: "comment “con tuổi Hợi” để thầy xem kỹ đường duyên tài",
  },
};

// Các Hook mẫu theo yêu cầu người dùng (hỗ trợ token động)
export const MYSTICAL_TOPICS = [
  "Cái nết của [TUOI] là [TRAIT], nhưng cũng vì vậy nên [PAIN].",
  "[YEAR] gọi tên [TUOI]: [SIGNAL]. Nhưng nhớ [CAUTION].",
  "Đừng ép [TUOI], họ hiền nhưng giới hạn rõ ràng và rất bản lĩnh.",
  "[TUOI] đi với [RIVAL_1], [RIVAL_2], [RIVAL_3] dễ sinh cảnh khắc khẩu nếu không biết nhường.",
  "[TUOI] đi với [ALLY_1] hoặc [ALLY_2] thì đường duyên, đường việc dễ thông.",
  "Đường tiền của [TUOI]: [MONEY]. Nếu có duyên thì giữ bên mình [Product].",
  "Vì sao [TUOI] hay lận đận tình cảm? Vì [LOVE].",
  "Bề ngoài [TUOI] cười nói bình thản, bên trong lại [PAIN].",
  "[TUOI] nghe kỹ: [SIGNAL]. Đừng quên [CAUTION].",
  "Ai là [TUOI] thì [COMMENT_CTA].",
  "[TUOI] mà biết giữ tâm, giữ vía với [Product], vận tiền sẽ đứng vững hơn.",
  "Năm [YEAR], [TUOI] hợp giai đoạn tái cấu trúc: bớt ôm việc, tăng giữ lộc.",
  "[TUOI] nên tránh va chạm với [RIVAL_1] khi đang nóng lòng chuyện tiền bạc.",
  "[TUOI] có quý nhân thuộc nhóm [ALLY_1] - [ALLY_2], nhớ giữ quan hệ cũ.",
  "Bài học lớn của [TUOI] là biết từ chối đúng lúc để không hao vía, hao tài.",
];

export const applyTemplateVariables = (
  template: string,
  zodiac: Zodiac,
  product: string,
): string => {
  const profile = ZODIAC_TEMPLATE_PROFILES[zodiac];
  const normalizedProduct = product?.trim() || "Vòng Chu Sa";
  const replacements: Record<string, string> = {
    X: zodiac,
    ZODIAC: zodiac,
    TUOI: `tuổi ${zodiac}`,
    YEAR: new Date().getFullYear().toString(),
    Product: normalizedProduct,
    PRODUCT: normalizedProduct,
    ALLY_1: profile.ally1,
    ALLY_2: profile.ally2,
    RIVAL_1: profile.rival1,
    RIVAL_2: profile.rival2,
    RIVAL_3: profile.rival3,
    TRAIT: profile.trait,
    PAIN: profile.pain,
    LOVE: profile.love,
    MONEY: profile.money,
    SIGNAL: profile.signal,
    CAUTION: profile.caution,
    COMMENT_CTA: profile.commentCta,
  };

  return Object.entries(replacements).reduce((filled, [token, value]) => {
    const regex = new RegExp(`\\[${token}\\]`, "g");
    return filled.replace(regex, value);
  }, template);
};

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
