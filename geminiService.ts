
import { GoogleGenAI } from "@google/genai";
import { ContentRequest } from "./types";
import { SYSTEM_PROMPT } from "./constants";

export const generateZodiacContent = async (request: ContentRequest): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  // Kiểm tra nếu người dùng không nhập sản phẩm hoặc nhập "Không bán hàng"
  const isNoProduct = !request.product || request.product.trim() === '' || request.product.toLowerCase() === 'không bán hàng';

  const productInstruction = isNoProduct
    ? "Về phần giải pháp: Chỉ đưa ra lời khuyên về tâm linh, Tu Tâm, Tích Đức. KHÔNG bán bất kỳ sản phẩm nào."
    : `Về phần giải pháp: Hãy khéo léo nhắc đến "${request.product}" như một vật phẩm trợ mệnh, giữ vía, giúp tâm an. Cuối cùng kêu gọi thỉnh vật phẩm này ở giỏ hàng/phần trưng bày.`;

  // Chỉ tập trung vào Template mẫu, bỏ qua các logic kiểm tra độ dài phức tạp trước đó.
  // Luôn coi input (request.focus) là Template cần tuân thủ tuyệt đối.

  const mainContextInstruction = `
      NỘI DUNG TEMPLATE / CÂU MỞ ĐẦU (BẮT BUỘC TUÂN THỦ 100%): "${request.focus}"
      
      NHIỆM VỤ TUYỆT ĐỐI (SAI SẼ BỊ PHẠT):
      1. Kịch bản PHẢI BẮT ĐẦU bằng chính xác nội dung Template ở trên. 
      2. KHÔNG ĐƯỢC thay đổi dù chỉ 1 từ. KHÔNG ĐƯỢC thêm từ dẫn nhập (như "Dạ...", "Thưa...").
      3. KHÔNG ĐƯỢC để nội dung này trong ngoặc kép.
      4. SAU ĐÓ mới xuống dòng và triển khai nội dung chi tiết.
         - Nội dung triển khai phải bám sát ý tưởng của Template.
         - Văn phong phải liền mạch với câu mở đầu.
  `;

  const userPrompt = `
    VIẾT KỊCH BẢN VIDEO NGẮN CHO: TUỔI ${request.zodiac.toUpperCase()}
    
    THÔNG TIN ĐẦU VÀO:
    - Tông giọng: ${request.tone}
    - Độ dài mong muốn: ${request.duration} (đọc chậm rãi).
    - Sản phẩm: ${isNoProduct ? 'Không bán hàng' : request.product}

    ${mainContextInstruction}

    CHỈ DẪN SẢN PHẨM:
    ${productInstruction}
    
    YÊU CẦU ĐẦU RA:
    - Chỉ trả về nội dung kịch bản lời thoại.
    - DÒNG 1: CHÍNH XÁC NỘI DUNG TEMPLATE ĐÃ CUNG CẤP.
    - Không dùng các tiêu đề (Intro, Body, Outro).
    - Ngắt đoạn hợp lý để dễ đọc.
  `;

  try {
    // Sử dụng gemini-3-flash-preview thay vì pro để ổn định hơn với gói Free
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.8,
        topP: 0.95,
      },
    });

    return response.text || "Thầy đang tịnh tâm chưa luận giải được. Con hãy thử lại sau nhé.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (JSON.stringify(error).includes("429")) {
        return "Thiên cơ bất khả lộ quá nhiều lần. Vui lòng đợi một chút rồi thử lại (Lỗi quá tải hệ thống miễn phí).";
    }
    throw new Error("Lỗi kết nối với thiên cơ. Vui lòng thử lại!");
  }
};
